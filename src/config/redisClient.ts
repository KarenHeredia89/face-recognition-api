import { createClient } from "redis";

const redisClient = createClient({
  // url: process.env.REDIS_URL_DEV,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_URL,
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
  },
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
