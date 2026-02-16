import { GameEngine, MoveResult } from "@/shared/types";
import {
    MemoryMatchCard,
    MemoryMatchCreateParams,
    MemoryMatchGameDifficulty,
    MemoryMatchGameRoom,
    MemoryMatchMoveError,
    MemoryMatchMoveParams,
    MemoryMatchPlayer
} from "@/features/memory-match/types";
import { MEMORY_MATCH_CARD_SLUGS, MEMORY_MATCH_DIFFICULTY_CARD_COUNT, MEMORY_MATCH_MAX_PLAYERS } from "./constants";

function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

function pickRandomSlugs(count: number): string[] {
	return shuffleArray(MEMORY_MATCH_CARD_SLUGS).slice(0, count);
}

export function generateMemoryMatchCards(difficulty: MemoryMatchGameDifficulty): MemoryMatchCard[] {
	const pairCount = MEMORY_MATCH_DIFFICULTY_CARD_COUNT[difficulty];
	const chosenSlugs = pickRandomSlugs(pairCount);
	const pairedSlugs = [...chosenSlugs, ...chosenSlugs];
	const shuffledSlugs = shuffleArray(pairedSlugs);

	return shuffledSlugs.map((slug, index) => ({
		id: index,
		word: slug,
		image: `/assets/cards/card-${slug}-200x280.webp`,
		isFlipped: false,
		isMatched: false,
	}));
}

function createGame(params: MemoryMatchCreateParams): MemoryMatchGameRoom {
	const cards = generateMemoryMatchCards(params.difficulty);
	const host: MemoryMatchPlayer = {
		id: params.hostId,
		username: params.hostUsername,
		score: 0,
		avatar: params.hostAvatar,
	};

	return {
		cards,
		difficulty: params.difficulty,
		gameId: params.gameId,
		players: [host],
		currentTurn: params.hostId,
		status: "waiting",
		moves: 0,
		hostId: params.hostId,
		createdAt: Date.now(),
	};
}

function canJoinGame(game: MemoryMatchGameRoom, playerId: string): boolean {
	if (game.players.some((p) => p.id === playerId)) {
		return true;
	}

	return game.players.length < MEMORY_MATCH_MAX_PLAYERS;
}

function addPlayerToGame(
	game: MemoryMatchGameRoom,
	playerId: string,
	playerUsername: string,
	playerAvatar: string,
): MemoryMatchGameRoom {
	if (game.players.some((p) => p.id === playerId)) {
		return game;
	}

	const newPlayer: MemoryMatchPlayer = { id: playerId, username: playerUsername, score: 0, avatar: playerAvatar };
	const updatedPlayers = [...game.players, newPlayer];
	const shouldStart = updatedPlayers.length === MEMORY_MATCH_MAX_PLAYERS;

	return {
		...game,
		players: updatedPlayers,
		status: shouldStart ? "in-progress" : game.status,
	};
}

function isGameExpired(game: MemoryMatchGameRoom, ttlSeconds: number): boolean {
	const expirationTime = game.createdAt + ttlSeconds * 1000;
	return Date.now() > expirationTime;
}

function validateMove(game: MemoryMatchGameRoom, cardId: number, userId: string): MemoryMatchMoveError | null {
	if (game.status !== "in-progress") {
		return { type: "game_not_in_progress" };
	}

	if (game.currentTurn !== userId) {
		return { type: "not_your_turn" };
	}

	const card = game.cards[cardId];
	if (!card || card.isFlipped || card.isMatched) {
		return { type: "invalid_card" };
	}

	return null;
}

function processMove(
	game: MemoryMatchGameRoom,
	move: MemoryMatchMoveParams,
	playerId: string,
): MoveResult<MemoryMatchGameRoom> {
	const validationError = validateMove(game, move.cardId, playerId);
	if (validationError) {
		return { success: false, error: validationError };
	}

	const updatedGame = { ...game, cards: [...game.cards] };
	updatedGame.cards[move.cardId] = { ...updatedGame.cards[move.cardId], isFlipped: true };

	const flippedCardIds = updatedGame.cards
		.map((c, index) => (c.isFlipped && !c.isMatched ? index : -1))
		.filter((id) => id !== -1);

	if (flippedCardIds.length < 2) {
		return {
			success: true,
			game: updatedGame,
			metadata: {
				needsMatchEvaluation: false,
			},
		};
	}

	updatedGame.moves++;
	const [first, second] = flippedCardIds;
	const matchFound = updatedGame.cards[first].word === updatedGame.cards[second].word;

	if (matchFound) {
		updatedGame.cards[first] = { ...updatedGame.cards[first], isMatched: true };
		updatedGame.cards[second] = { ...updatedGame.cards[second], isMatched: true };

		const updatedPlayers = [...updatedGame.players];
		const playerIndex = updatedPlayers.findIndex((p) => p.id === playerId);
		if (playerIndex !== -1) {
			updatedPlayers[playerIndex] = {
				...updatedPlayers[playerIndex],
				score: updatedPlayers[playerIndex].score + 1,
			};
		}
		updatedGame.players = updatedPlayers;

		const allMatched = updatedGame.cards.every((c) => c.isMatched);
		if (allMatched) {
			updatedGame.status = "completed";
		}

		let winner: string | null | undefined;
		if (allMatched && updatedGame.players.length === 2) {
			const [p1, p2] = updatedGame.players;
			winner =
				p1.score > p2.score ? p1.id
				: p2.score > p1.score ? p2.id
				: null;
		}

		return {
			success: true,
			game: updatedGame,
			metadata: {
				needsMatchEvaluation: true,
				flippedCardIds,
				matchFound: true,
				winner,
			},
		};
	}

	updatedGame.cards[first] = { ...updatedGame.cards[first], isFlipped: false };
	updatedGame.cards[second] = { ...updatedGame.cards[second], isFlipped: false };

	const currentIdx = updatedGame.players.findIndex((p) => p.id === updatedGame.currentTurn);
	const nextIdx = (currentIdx + 1) % updatedGame.players.length;
	updatedGame.currentTurn = updatedGame.players[nextIdx].id;

	return {
		success: true,
		game: updatedGame,
		metadata: {
			needsMatchEvaluation: true,
			flippedCardIds,
			matchFound: false,
		},
	};
}

export const memoryMatchEngine: GameEngine<MemoryMatchGameRoom, MemoryMatchCreateParams, MemoryMatchMoveParams> = {
	createGame,
	canJoinGame,
	addPlayerToGame,
	processMove,
	isGameExpired,
};
