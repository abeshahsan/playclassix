import { Redis as UpstashRedis } from "@upstash/redis";

const  redis = UpstashRedis.fromEnv();
// if (process.env.NODE_ENV === "production") {
// } else {
// 	redis = new LocalRredis();
// }

export { redis as redisInstance };

