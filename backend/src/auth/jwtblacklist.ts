import { redisClient } from "../config/redis";

const BLACKLIST_PREFIX = "NoAcces:";

export const isTokenBlacklisted = async (jti: string): Promise<boolean> => {
  const result = await redisClient.get(`${BLACKLIST_PREFIX + jti}`);
  return result !== null;
};
export const blacklistToken = async (
  jti: string,
  exp: number
): Promise<void> => {
  const currentTime = Math.floor(Date.now() / 1000);
  const ttl = exp - currentTime;
  try {
    if (ttl > 0) {
      await redisClient.setEx(`${BLACKLIST_PREFIX + jti}`, ttl, "blacklisted");
      console.log(`Token with jti ${jti} blacklisted for ${ttl} seconds.`);
    } else {
      console.log(`[Blacklist] Token ${jti} już wygasł, pomijam dodawanie.`);
    }
  } catch (err) {
    console.error("Błąd podczas dodawania tokena do blacklisty:", err);
  }
};
