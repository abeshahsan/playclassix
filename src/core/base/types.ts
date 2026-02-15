export interface BasePlayer {
	id: string;
	username: string;
	score: number;
	avatar: string;
}

export interface BaseGame {
	gameId: string;
	hostId: string;
	players: BasePlayer[];
	status: "waiting" | "in-progress" | "completed";
	createdAt: number;
}

export interface GameCreateParams {
	gameId: string;
	hostId: string;
	hostUsername: string;
	hostAvatar: string;
}

export type MoveError = { type: string; message?: string };

export type MoveResult<TGame extends BaseGame> = 
	| { success: false; error: MoveError }
	| { success: true; game: TGame; metadata?: Record<string, unknown> };

export interface PlayerStats {
	player1Id: string;
	player2Id: string;
	player1Stats: IndividualPlayerStats;
	player2Stats: IndividualPlayerStats;
	gamesPlayed: number;
}

export interface IndividualPlayerStats {
	wins: number;
	losses: number;
	draws: number;
}
