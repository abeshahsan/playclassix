import { BaseRedis } from "@/db/redis/redis.base";
import { Redis } from "ioredis";

export class IORedisImpl implements BaseRedis {
	private client: Redis;
	constructor(client: Redis) {
		this.client = client;
	}

	async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
		if (ttlSeconds) {
			await this.client.set(key, value, "EX", ttlSeconds);
		} else {
			await this.client.set(key, value);
		}
	}

	async get(key: string): Promise<string | null> {
		return await this.client.get(key);
	}

	async del(key: string): Promise<void> {
		await this.client.del(key);
	}

	async expire(key: string, ttlSeconds: number): Promise<void> {
		await this.client.expire(key, ttlSeconds);
	}

	async scan(cursor: string, pattern: string, count: number): Promise<{ keys: string[]; nextCursor: string }> {
		const result = await this.client.scan(cursor, "MATCH", pattern, "COUNT", count);
		return {
			keys: result[1] as string[],
			nextCursor: result[0] as string,
		};
	}
}
