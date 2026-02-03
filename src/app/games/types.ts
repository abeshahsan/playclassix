export interface GameState {
	turn: string; // user ID of the current turn
	status: "waiting" | "in-progress" | "completed" | null;
	result: "win" | "lose" | "draw" | "quit" | null;
}

export interface Card {
	id: number;
	word: string;
	isFlipped: boolean;
	isMatched: boolean;
}

export interface MemoryMatchGameState extends GameState {
	cards: Card[];
	moves: number;
}
