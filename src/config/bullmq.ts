import { Queue } from "bullmq";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const IORedis = require("ioredis");

const redisConnection = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
});

export { redisConnection };

export function createQueue(name: string, options?: any) {
  return new Queue(name, {
    connection: redisConnection,
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: false,
    },
    ...options,
  });
}