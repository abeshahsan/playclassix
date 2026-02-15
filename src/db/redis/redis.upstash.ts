import { BaseRedis } from "@/db/redis/redis.base";
import { Redis as UpstashRedis } from "@upstash/redis";

export class UpstashRedisImpl implements BaseRedis {
	private client: UpstashRedis;
	constructor(client: UpstashRedis) {
		this.client = client;
	}

	async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
		if (ttlSeconds) {
			await this.client.set(key, value, {
				ex: ttlSeconds,
			});
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
		const result = await this.client.scan(cursor, {
			match: pattern,
			count: count,
		});
		return {
			keys: result[1] as string[],
			nextCursor: result[0] as string,
		};
	}
}
