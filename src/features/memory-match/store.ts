import { MemoryMatchCard, MemoryMatchGameRoom } from "@/features/memory-match/types";
import { create } from "zustand";

interface MemoryMatchGameState {
	gameRoom: MemoryMatchGameRoom | null;
	isMyTurn: boolean;
	isProcessing: boolean;
	isWon: boolean;
	error: string | null;

	setGameRoom: (gameRoom: MemoryMatchGameRoom | null) => void;
	setIsMyTurn: (isMyTurn: boolean) => void;
	setIsProcessing: (isProcessing: boolean) => void;
	setIsWon: (isWon: boolean) => void;
	setError: (error: string | null) => void;
	resetGame: () => void;

	optimisticFlipCard: (cardId: number) => void;
	rollbackOptimisticFlip: (previousState: MemoryMatchGameRoom) => void;

	cards: MemoryMatchCard[] | null;
	updateCards: (updatedCards: MemoryMatchCard[]) => void;
}

export const useMemoryMatchGameStore = create<MemoryMatchGameState>((set) => ({
	gameRoom: null,
	isMyTurn: false,
	isProcessing: false,
	isWon: false,
	error: null,

	setGameRoom: (gameRoom) => set({ gameRoom, cards: gameRoom?.cards ?? null }),
	setIsMyTurn: (isMyTurn) => set({ isMyTurn }),
	setIsProcessing: (isProcessing) => set({ isProcessing }),
	setIsWon: (isWon) => set({ isWon }),
	setError: (error) => set({ error }),
	resetGame: () =>
		set({
			gameRoom: null,
			isMyTurn: false,
			isProcessing: false,
			isWon: false,
			error: null,
			cards: null,
		}),

	optimisticFlipCard: (cardId) =>
		set((state) => {
			if (!state.gameRoom) return state;
			
			const newCards = [...state.gameRoom.cards];
			newCards[cardId] = { ...newCards[cardId], isFlipped: true };
			
			return {
				gameRoom: { ...state.gameRoom, cards: newCards },
				cards: newCards,
			};
		}),

	rollbackOptimisticFlip: (previousState) =>
		set({
			gameRoom: previousState,
			cards: previousState.cards,
			isProcessing: false,
		}),

	cards: null,
	updateCards: (updatedCards) => set({ cards: updatedCards }),
}));
