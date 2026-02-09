import { Redis as UpstashRedis } from "@upstash/redis";
import { Redis as LocalRredis } from "ioredis";

let redis: UpstashRedis | LocalRredis;

if (process.env.NODE_ENV === "production") {
	redis = UpstashRedis.fromEnv();
} else {
	redis = new LocalRredis();
}

export { redis as redisInstance };
