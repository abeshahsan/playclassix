export interface MemoryMatchPlayer {
	id: string;
	username: string;
	score: number;
	avatar: string;
}

export interface MemoryMatchCard {
	id: number;
	word: string; // slug used for match comparison (e.g. "apple")
	image: string; // URL to the card face image
	isFlipped: boolean;
	isMatched: boolean;
}

export type MemoryMatchGameDifficulty = "easy" | "medium" | "hard";

export interface MemoryMatchGameRoom {
	difficulty: MemoryMatchGameDifficulty;
	gameId: string;
	cards: Array<MemoryMatchCard>;
	players: MemoryMatchPlayer[];
	currentTurn: string; // player ID
	status: "waiting" | "in-progress" | "completed";
	moves: number;
	hostId: string;
	createdAt: number;
}

export interface IndividualPlayerStats {
	wins: number;
	losses: number;
	draws: number;
}

export interface PlayerStats {
	player1Id: string;
	player2Id: string;
	player1Stats: IndividualPlayerStats;
	player2Stats: IndividualPlayerStats;
	gamesPlayed: number;
}

export interface PlayerMatchup {
	player1Id: string;
	player2Id: string;
}
