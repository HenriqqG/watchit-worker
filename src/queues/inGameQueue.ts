import { createQueue } from "../config/bullmq.js";

export const getIngameQueue = createQueue("getIngame", {
  limiter: {
    max: 40,
    duration: 60_000,
  },
});