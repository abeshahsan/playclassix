import { BaseGame, GameCreateParams, MoveResult } from "./types";

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
	get(player1Id: string, player2Id: string): Promise<import("./types").PlayerStats>;
	
	update(winnerId: string | null, player1Id: string, player2Id: string): Promise<void>;
}
