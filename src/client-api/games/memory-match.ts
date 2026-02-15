import { MemoryMatchGameRoom, MemoryMatchGameDifficulty, PlayerStats } from "@/types";

export async function joinGame(gameId: string, signal?: AbortSignal): Promise<MemoryMatchGameRoom> {
	const response = await fetch("/api/games/memory-match/join-game", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ gameId }),
		signal,
	});

	if (!response.ok) {
		throw new Error("Failed to join game");
	}

	const { game } = await response.json();
	
	if (!game) {
		throw new Error("No game data received");
	}

	return game;
}

export async function createGame(difficulty: MemoryMatchGameDifficulty, signal?: AbortSignal): Promise<string> {
	const response = await fetch("/api/games/memory-match/new-game", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ difficulty }),
		signal,
	});

	if (!response.ok) {
		throw new Error("Failed to create a new game");
	}

	const data = await response.json();

	if (!data.gameId) {
		throw new Error("Game ID was not returned from the server");
	}

	return data.gameId;
}

export async function sendMove(
	cardId: number, 
	gameId: string, 
	userId: string, 
	signal?: AbortSignal
): Promise<void> {
	const response = await fetch("/api/games/memory-match/move", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ cardId, gameId, userId }),
		signal,
	});
	
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
		throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
	}
}

export async function fetchPlayerStats(
	player1Id: string, 
	player2Id: string, 
	signal?: AbortSignal
): Promise<PlayerStats> {
	const response = await fetch(
		`/api/games/memory-match/player-stats?player1Id=${player1Id}&player2Id=${player2Id}`,
		{ signal }
	);
	
	if (!response.ok) {
		throw new Error("Failed to fetch player stats");
	}

	const data = await response.json();
	return data.stats;
}
