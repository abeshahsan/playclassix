import { MemoryMatchCard, MemoryMatchGameRoom, MemoryMatchGameDifficulty } from "@/types";
import { create } from "zustand";

interface MemoryMatchGameState {
	// Game room state
	gameRoom: MemoryMatchGameRoom | null;
	isMyTurn: boolean;
	isProcessing: boolean;
	isWon: boolean;
	error: string | null;

	// Game room actions
	setGameRoom: (gameRoom: MemoryMatchGameRoom | null) => void;
	setIsMyTurn: (isMyTurn: boolean) => void;
	setIsProcessing: (isProcessing: boolean) => void;
	setIsWon: (isWon: boolean) => void;
	setError: (error: string | null) => void;
	resetGame: () => void;

	// Optimistic update actions
	optimisticFlipCard: (cardId: number) => void;
	rollbackOptimisticFlip: (previousState: MemoryMatchGameRoom) => void;

	// Card-level helpers (kept from original)
	cards: MemoryMatchCard[] | null;
	updateCards: (updatedCards: MemoryMatchCard[]) => void;
	sendMove: (cardId: number, gameId: string, userId: string, signal?: AbortSignal) => Promise<boolean>;
	
	// Game creation
	createNewGame: (difficulty: MemoryMatchGameDifficulty) => Promise<string>;
}

export const useMemoryMatchGameStore = create<MemoryMatchGameState>((set) => ({
	// Game room state
	gameRoom: null,
	isMyTurn: false,
	isProcessing: false,
	isWon: false,
	error: null,

	// Game room actions
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

	// Optimistic update actions
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

	// Card-level helpers (kept from original)
	cards: null,
	updateCards: (updatedCards) => set({ cards: updatedCards }),
	sendMove: async (cardId, gameId, userId, signal?: AbortSignal) => {
		try {
			const response = await fetch("/api/games/memory-match/move", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ cardId, gameId, userId }),
				signal,
			});
			
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
				throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
			}
			
			return true;
		} catch (e: any) {
			if (e.name === 'AbortError') return false;
			console.error("Error in sendMove:", e);
			set({ error: e.message || "Failed to make move" });
			setTimeout(() => set({ error: null }), 3000);
			return false;
		}
	},
	
	// Game creation
	createNewGame: async (difficulty) => {
		try {
			const response = await fetch("/api/games/memory-match/new-game", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ difficulty }),
			});

			if (!response.ok) {
				throw new Error("Failed to create a new game.");
			}

			const data = await response.json();

			if (!data.gameId) {
				throw new Error("Game ID was not returned from the server.");
			}

			return data.gameId;
		} catch (err: any) {
			throw new Error(err.message || "An unexpected error occurred.");
		}
	},
}));
