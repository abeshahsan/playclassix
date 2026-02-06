export interface Player {
	id: string;
	username: string;
	score: number;
}

export interface Card {
	id: number;
	word: string;
	isFlipped: boolean;
	isMatched: boolean;
}

export interface MemoryMatchGameRoom {
	gameId: string;
	cards: Array<Card>;
	players: Player[];
	currentTurn: string; // player ID
	status: "waiting" | "in-progress" | "completed";
	moves: number;
	hostId: string;
	createdAt: number;
}