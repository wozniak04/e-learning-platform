import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});
redisClient.on("error", (err) => console.error("Redis Client Error", err));

export const connectRedis = async () => {
  if (!redisClient.isReady) {
    try {
      await redisClient.connect();
      console.log("Redis: Połączono pomyślnie!");
    } catch (e) {
      console.error("Redis: NIE UDAŁO SIĘ POŁĄCZYĆ!", e);
    }
  }
};
