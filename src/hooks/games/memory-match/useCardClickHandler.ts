import { useGamer } from "@/hooks/games/memory-match/useGamer";
import { useMemoryMatchGameStore } from "@/store/games/memory-match";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { useSendMove } from "./useGameMutations";

export function useCardClickHandler() {
	const params = useParams();
	const gameId = params.gameId as string;

	const gamer = useGamer().data;

	const { gameRoom, isProcessing, setError, setIsProcessing, optimisticFlipCard, rollbackOptimisticFlip } =
		useMemoryMatchGameStore();

	const sendMoveMutation = useSendMove();

	const handleCardClick = useCallback(
		async (id: number) => {
			if (!gamer || !gameRoom) return;

			if (isProcessing) {
				return;
			}

			if (gameRoom.currentTurn !== gamer.id) {
				setError("It's not your turn!");
				setTimeout(() => setError(null), 2000);
				return;
			}

			if (gameRoom.status !== "in-progress") {
				setError("Game is not in progress");
				setTimeout(() => setError(null), 2000);
				return;
			}

			const card = gameRoom.cards[id];
			if (card.isFlipped || card.isMatched) {
				return;
			}

			const previousState = { ...gameRoom };

			setIsProcessing(true);

			optimisticFlipCard(id);

			try {
				await sendMoveMutation.mutateAsync({ cardId: id, gameId, userId: gamer.id });
			} catch {
				rollbackOptimisticFlip(previousState);
				setError("Failed to make move. Please try again.");
				setTimeout(() => setError(null), 3000);
			}

			setTimeout(() => setIsProcessing(false), 500);
		},
		[
			gamer,
			gameRoom,
			isProcessing,
			setError,
			setIsProcessing,
			sendMoveMutation,
			optimisticFlipCard,
			rollbackOptimisticFlip,
			gameId,
		],
	);

	return handleCardClick;
}
