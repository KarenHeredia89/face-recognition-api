import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

const connectRedis = async () => {
  if (!redisClient.isReady) {
    await redisClient.connect();
    console.log("Redis connected!");
  }
};

connectRedis();

export default redisClient;
