import { BaseGame, BasePlayer, MoveResult } from "@/core/base";

export type MemoryMatchPlayer = BasePlayer;

export interface MemoryMatchCard {
	id: number;
	word: string;
	image: string;
	isFlipped: boolean;
	isMatched: boolean;
}

export type MemoryMatchGameDifficulty = "easy" | "medium" | "hard";

export interface MemoryMatchGameRoom extends BaseGame {
	difficulty: MemoryMatchGameDifficulty;
	cards: Array<MemoryMatchCard>;
	players: MemoryMatchPlayer[];
	currentTurn: string;
	moves: number;
}

export interface MemoryMatchCreateParams {
	gameId: string;
	hostId: string;
	hostUsername: string;
	hostAvatar: string;
	difficulty: MemoryMatchGameDifficulty;
}

export interface MemoryMatchMoveParams {
	cardId: number;
	userId: string;
}

export type MemoryMatchMoveError =
	| { type: "game_not_in_progress" }
	| { type: "not_your_turn" }
	| { type: "invalid_card" };

export type MemoryMatchMoveResult = MoveResult<MemoryMatchGameRoom> & {
	success: true;
	metadata?: {
		needsMatchEvaluation: boolean;
		flippedCardIds?: number[];
		matchFound?: boolean;
		winner?: string | null;
	};
};

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
