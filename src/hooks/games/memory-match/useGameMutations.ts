import { useMutation } from "@tanstack/react-query";
import { createGame, sendMove } from "@/client-api/games/memory-match";
import { MemoryMatchGameDifficulty } from "@/types";

export function useCreateGame() {
	return useMutation({
		mutationFn: (difficulty: MemoryMatchGameDifficulty) => createGame(difficulty),
	});
}

export function useSendMove() {
	return useMutation({
		mutationFn: ({ cardId, gameId, userId }: { cardId: number; gameId: string; userId: string }) =>
			sendMove(cardId, gameId, userId),
	});
}
