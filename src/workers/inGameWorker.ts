import axios from "axios";
import redis from "../config/redis.js";
import { Worker } from "bullmq";
import { redisConnection } from "../config/bullmq.js";
import { matchDetailQueue } from "../queues/matchDetailQueue.js";
import { OnGoingAPIResponse } from "../types/OnGoingAPIResponse.js";
import { HistoryAPIResponse } from "../types/HistoryAPIResponse.js";
import { addJitter } from "../util/util-functions.js";

const TTL_BASE = 60_000;
const FACEIT_OPEN_API = process.env.FACEIT_OPEN_API;

const REGION = process.env.REGION || "default";
const RATE_LIMIT_KEY = `faceit_ingame_rate_limit_${REGION}`;

const LIMIT = 45;
const WINDOW = 60;

async function checkRateLimit() {
  const now = Math.floor(Date.now() / 1000);

  await redis.zremrangebyscore(RATE_LIMIT_KEY, 0, now - WINDOW);

  const current = await redis.zcard(RATE_LIMIT_KEY);

  if (current >= LIMIT) {
    console.error(
            `[${REGION}] [LIMITER MANUAL - BLOQUEIO] Limite de ${LIMIT}/${WINDOW}s atingido! Jobs atuais: ${current}.`
        );
    return false;
  }

  await redis.zadd(RATE_LIMIT_KEY, { score: now, member: `${now}-${Math.random()}` });
  await redis.expire(RATE_LIMIT_KEY, WINDOW);
  return true;
}

async function waitForSlot() {
  while (true) {
    const ok = await checkRateLimit();
    if (ok) return;
    await new Promise(r => setTimeout(r, 500));
  }
}


export const getIngameWorker = new Worker<{ playerId: string }>(
    "getIngame",
    async job => {
        const { playerId } = job.data;
        const cacheKey = `player_ingame_status:${playerId}`;
        const activeMatchKey = `player_current_match:${playerId}`;

        try {
            const existingMatch = await redis.get(activeMatchKey);
            if (existingMatch) {
                console.warn(`[${REGION}] [WORKER - IN GAME] Ignorando Player ${playerId} (Já em Partida - ${existingMatch})`);
                return { playerId, skipped: true, matchId: existingMatch };
            }

            await waitForSlot();
            const response = await axios.get<OnGoingAPIResponse>(
                `https://www.faceit.com/api/match/v1/matches/groupByState?userId=${playerId}`
            );

            const data = response.data;
            const payload = data.payload;

            if (!payload || Object.keys(payload).length === 0 || payload?.SCHEDULED) {
                const response = await axios.get(
                    `${FACEIT_OPEN_API}/players/${playerId}/history`, {
                    headers: { Authorization: `Bearer ${process.env.FACEIT_BEARER_TOKEN}` },
                });
                const historyResponse = response.data as HistoryAPIResponse;
                const lastGameFinishedAt = historyResponse.items[0].finished_at;

                const timeLimitMinutes = 16;
                const timeLimitMs = timeLimitMinutes * 60 * 1000;

                const nowEpoch = Date.now();

                const playerEpoch = lastGameFinishedAt * 1000;
                const timeDifference = nowEpoch - playerEpoch;

                let TTL = 0;
                if (timeDifference <= timeLimitMs) {
                    TTL = addJitter(TTL_BASE, 30_000);
                } else {
                    TTL = addJitter(TTL_BASE * 30, 300_000);;
                }

                console.warn(`[${REGION}] [WORKER - IN GAME] Player ${playerId} não está em partida. Será buscado novamente em: ${TTL} segundos`)
                await redis.set(cacheKey, data, { px: TTL });

                return { playerId, inGame: false, foundMatches: 0 };
            }

            const match = Object.values(payload)
                .flatMap(matches => (Array.isArray(matches) ? matches : []))
                .find(m => m && m.id) as any;

            await redis.set(activeMatchKey, match.id, { px: 3_600_000 });

            await matchDetailQueue.add("trackMatch", { matchId: match.id, playerId });

            console.warn(`[${REGION}] [WORKER - IN GAME] Player ${playerId} está em partida ${match.id}`);

            return { playerId, inGame: true, matchId: match.id, foundMatches: 1 };
        } catch (error) {
            console.error(`[${REGION}] [WORKER - IN GAME - ERROR] Player ${playerId}`, error);
            throw error;
        }
    },
    { connection: redisConnection }
);

setInterval(() => { }, 1000 * 60 * 10);