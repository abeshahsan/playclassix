export interface BaseRedis {
	set(key: string, value: string, ttlSeconds?: number): Promise<void>;
	get(key: string): Promise<string | null>;
	del(key: string): Promise<void>;
	expire(key: string, ttlSeconds: number): Promise<void>;
	scan(cursor: string, pattern: string, count: number): Promise<{ keys: string[]; nextCursor: string }>;
}
