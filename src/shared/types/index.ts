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

export interface GameEngine<
	TGame extends BaseGame,
	TCreateParams extends GameCreateParams,
	TMoveParams,
> {
	createGame(params: TCreateParams): TGame;
	
	canJoinGame(game: TGame, playerId: string): boolean;
	
	addPlayerToGame(
		game: TGame,
		playerId: string,
		playerUsername: string,
		playerAvatar: string
	): TGame;
	
	processMove(
		game: TGame,
		move: TMoveParams,
		playerId: string
	): MoveResult<TGame>;
	
	isGameExpired(game: TGame, ttlSeconds: number): boolean;
}

export interface GameStorage<TGame extends BaseGame> {
	save(game: TGame): Promise<void>;
	
	get(gameId: string): Promise<TGame | null>;
	
	delete(gameId: string): Promise<void>;
}

export interface PlayerStatsStorage {
	get(player1Id: string, player2Id: string): Promise<import("@/shared/types").PlayerStats>;
	
	update(winnerId: string | null, player1Id: string, player2Id: string): Promise<void>;
}

export interface Gamer {
	id: string;
	ign: string;
	avatar: string;
}
