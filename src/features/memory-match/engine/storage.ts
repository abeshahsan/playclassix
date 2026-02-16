import { MemoryMatchGameRoom, PlayerStats } from "@/features/memory-match/types";
import { GameStorage, PlayerStatsStorage } from "@/shared/types";
import { redisInstance } from "@/db/redis";
import {
	MEMORY_MATCH_GAME_KEY_PREFIX,
	MEMORY_MATCH_STATS_KEY_PREFIX,
	MEMORY_MATCH_GAME_TTL,
	MEMORY_MATCH_STATS_TTL,
	MEMORY_MATCH_CLEANUP_INTERVAL,
} from "./constants";
import { memoryMatchEngine } from "./index";

function getGameKey(gameId: string): string {
	return `${MEMORY_MATCH_GAME_KEY_PREFIX}${gameId}`;
}

function getStatsKey(player1Id: string, player2Id: string): string {
	const [p1, p2] = [player1Id, player2Id].sort();
	return `${MEMORY_MATCH_STATS_KEY_PREFIX}${p1}:${p2}`;
}

async function save(game: MemoryMatchGameRoom): Promise<void> {
	const key = getGameKey(game.gameId);
	await redisInstance.set(key, JSON.stringify(game), MEMORY_MATCH_GAME_TTL);
	console.log("[Memory Match Storage] Game saved:", game.gameId);
}

async function get(gameId: string): Promise<MemoryMatchGameRoom | null> {
	const key = getGameKey(gameId);
	const data = await redisInstance.get(key);

	if (!data) {
		console.log("[Memory Match Storage] Game not found:", gameId);
		return null;
	}

	const game: MemoryMatchGameRoom = typeof data === "string" ? JSON.parse(data) : (data as MemoryMatchGameRoom);
	console.log("[Memory Match Storage] Game retrieved:", gameId);
	return game;
}

async function deleteGame(gameId: string): Promise<void> {
	const key = getGameKey(gameId);
	await redisInstance.del(key);
	console.log("[Memory Match Storage] Game deleted:", gameId);
}

async function getStats(player1Id: string, player2Id: string): Promise<PlayerStats> {
	const key = getStatsKey(player1Id, player2Id);
	const data = await redisInstance.get(key);

	const [sortedP1, sortedP2] = [player1Id, player2Id].sort();

	if (!data) {
		return {
			player1Id: sortedP1,
			player2Id: sortedP2,
			player1Stats: { wins: 0, losses: 0, draws: 0 },
			player2Stats: { wins: 0, losses: 0, draws: 0 },
			gamesPlayed: 0,
		};
	}

	return typeof data === "string" ? JSON.parse(data) : (data as PlayerStats);
}

async function updateStats(
	winnerId: string | null,
	player1Id: string,
	player2Id: string,
): Promise<void> {
	const key = getStatsKey(player1Id, player2Id);
	const stats = await getStats(player1Id, player2Id);

	stats.gamesPlayed++;

	if (winnerId === null) {
		stats.player1Stats.draws++;
		stats.player2Stats.draws++;
	} else {
		if (winnerId === stats.player1Id) {
			stats.player1Stats.wins++;
			stats.player2Stats.losses++;
		} else {
			stats.player2Stats.wins++;
			stats.player1Stats.losses++;
		}
	}

	await redisInstance.set(key, JSON.stringify(stats), MEMORY_MATCH_STATS_TTL);
	console.log("[Memory Match Storage] Stats updated:", key);
}

export async function cleanupExpiredMemoryMatchGames(): Promise<void> {
	let cursor = "0";
	do {
		const result = await redisInstance.scan(cursor, `${MEMORY_MATCH_GAME_KEY_PREFIX}*`, 100);
		const { keys, nextCursor } = result;
		cursor = nextCursor;

		for (const key of keys) {
			const data = await redisInstance.get(key);
			if (data) {
				const game = typeof data === "string" ? JSON.parse(data) : (data as MemoryMatchGameRoom);
				if (memoryMatchEngine.isGameExpired(game, MEMORY_MATCH_GAME_TTL)) {
					await redisInstance.del(key);
					console.log("[Memory Match Storage] Cleaned up expired game:", game.gameId);
				}
			}
		}
	} while (cursor !== "0");
}

setInterval(cleanupExpiredMemoryMatchGames, MEMORY_MATCH_CLEANUP_INTERVAL);

export const memoryMatchStorage: GameStorage<MemoryMatchGameRoom> = {
	save,
	get,
	delete: deleteGame,
};

export const memoryMatchStatsStorage: PlayerStatsStorage = {
	get: getStats,
	update: updateStats,
};
