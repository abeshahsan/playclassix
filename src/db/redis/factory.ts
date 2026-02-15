import { IORedisImpl } from "./redis.ioredis";
import { Redis as IORedis } from "ioredis";
import { UpstashRedisImpl } from "./redis.upstash";
import { Redis as UpstashRedis } from "@upstash/redis";

let redisInstance: IORedisImpl | UpstashRedisImpl;

export function initializeRedis() {
	redisInstance = createRedisClient();
	console.log("[Redis] Redis client initialized");
}

export function createRedisClient() {
	if (process.env.NODE_ENV === "development") {
		const client = new IORedis();
		const ioRedisInstance = new IORedisImpl(client);
		return ioRedisInstance;
	} else
		 {
		const client = UpstashRedis.fromEnv();
		const upstashRedisInstance = new UpstashRedisImpl(client);
		return upstashRedisInstance;
	}
}

initializeRedis();

export { redisInstance };
