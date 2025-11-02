import { createQueue } from "../config/bullmq.js";

export const matchDetailQueue = createQueue("matchDetail", {
  limiter: {
    max: 1000,
    duration: 60_000,
  },
});