import { pusher } from "@/shared/utils/pusher";
import { memoryMatchStorage, memoryMatchStatsStorage } from "@/features/memory-match/engine/storage";
import { memoryMatchEngine } from "@/features/memory-match/engine";

export async function POST(request: Request) {
	const { gameId, cardId, userId } = await request.json();

	const game = await memoryMatchStorage.get(gameId);

	if (!game) {
		return Response.json({ error: "Game not found" }, { status: 404 });
	}

	const result = memoryMatchEngine.processMove(game, { cardId, userId }, userId);

	if (!result.success) {
		const errorMessages: Record<string, string> = {
			game_not_in_progress: "Game is not in progress",
			not_your_turn: "Not your turn",
			invalid_card: "Invalid move",
		};
		return Response.json(
			{ error: errorMessages[result.error.type] || "Unknown error" },
			{ status: result.error.type === "not_your_turn" ? 403 : 400 }
		);
	}

	const updatedGame = result.game;
	const metadata = result.metadata as {
		needsMatchEvaluation: boolean;
		flippedCardIds?: number[];
		matchFound?: boolean;
		winner?: string | null;
	} | undefined;

	if (metadata?.needsMatchEvaluation && metadata.flippedCardIds) {
		const [first, second] = metadata.flippedCardIds;

		const intermediateGame = { ...updatedGame, cards: [...updatedGame.cards] };
		if (!metadata.matchFound) {
			intermediateGame.cards[first] = { ...intermediateGame.cards[first], isFlipped: true };
			intermediateGame.cards[second] = { ...intermediateGame.cards[second], isFlipped: true };
		}

		await pusher.trigger(`memory-match-${gameId}`, "card-flipped", {
			cardId,
			userId,
			game: intermediateGame,
		});

		if (metadata.matchFound && metadata.winner !== undefined && updatedGame.players.length === 2) {
			const [p1, p2] = updatedGame.players;
			await memoryMatchStatsStorage.update(metadata.winner, p1.id, p2.id);
		}

		await pusher.trigger(`memory-match-${gameId}`, "match-result", {
			matchFound: metadata.matchFound,
			game: updatedGame,
			firstCardId: first,
			secondCardId: second,
		});
	} else {
		await pusher.trigger(`memory-match-${gameId}`, "card-flipped", {
			cardId,
			userId,
			game: updatedGame,
		});
	}

	await memoryMatchStorage.save(updatedGame);

	return Response.json({ success: true, game: updatedGame });
}
