import axios from "axios";
import redis from "../config/redis.js";
import { Worker } from "bullmq";
import { redisConnection } from "../config/bullmq.js";
import { matchDetailQueue } from "../queues/matchDetailQueue.js";
import { FaceitMatch } from "../types/FaceitMatchAPIResponse.js";

const REGION = process.env.REGION || "default";
const FACEIT_OPEN_API = process.env.FACEIT_OPEN_API;

export const matchDetailWorker = new Worker(
  "matchDetail",
  async job => {
    const { matchId, playerId } = job.data;
    const url = `${FACEIT_OPEN_API}/matches/${matchId}`;
    const activeMatchKey = `player_current_match:${playerId}`;

    try {
      const response = await axios.get<FaceitMatch>(url, {
        headers: { Authorization: `Bearer ${process.env.FACEIT_BEARER_TOKEN}` },
      });

      const match = response.data;
      await redis.set(`match_status:${playerId}`, match, { px: 30_000 });

      if (match.status == "FINISHED" || match.status == "CANCELLED" || match.status == "SCHEDULED") {
        if (playerId) {
          await redis.del(activeMatchKey);
          console.warn(`[${REGION}] [WORKER - MATCH DETAIL] Partida de Player ${playerId} Finalizada. Liberado`);
        }
      } else {
        await matchDetailQueue.add("trackMatch", { matchId, playerId }, { delay: 30_000 });
      }

      return { matchId, status: match.status };
    } catch (error) {
      console.error(`[${REGION}] [WORKER - MATCH DETAIL - ERROR] Match ${matchId}`, error);
      throw error;
    }
  },
  { connection: redisConnection }
);

setInterval(() => {}, 1000 * 60 * 10);