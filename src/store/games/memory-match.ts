import { MemoryMatchCard } from "@/types";
import { create } from "zustand";

const mockCards: MemoryMatchCard[] = [
	{
		id: 1,
		word: "Apple",
		isFlipped: false,
		isMatched: false,
	},
	{
		id: 2,
		word: "Banana",
		isFlipped: false,
		isMatched: false,
	},
	{
		id: 3,
		word: "Cherry",
		isFlipped: false,
		isMatched: false,
	},
	{
		id: 4,
		word: "Date",
		isFlipped: false,
		isMatched: false,
	},
	{
		id: 5,
		word: "Apple",
		isFlipped: false,
		isMatched: false,
	},
	{
		id: 6,
		word: "Banana",
		isFlipped: false,
		isMatched: false,
	},
	{
		id: 7,
		word: "Cherry",
		isFlipped: false,
		isMatched: false,
	},
	{
		id: 8,
		word: "Date",
		isFlipped: false,
		isMatched: false,
	},
];

interface MemoryMatchGameState {
	cards: MemoryMatchCard[] | null;
	sendMove: (cardId: number, gameId: string, userId: string) => Promise<void>;
	updateCards: (updatedCards: MemoryMatchCard[]) => void;
}

export const useMemoryMatchGameStore = create<MemoryMatchGameState>((set, get) => ({
	cards: mockCards,
	sendMove: async (cardId: number, gameId: string, userId: string) => {
		try {
			const response = await fetch("/api/games/memory-match/move", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ cardId, gameId, cards: get().cards, userId }),
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}`);
			}
		} catch (e) {
			console.log("Error in sendMove:", e);
		}
	},
	// updateRoom: (updatedRoom: MemoryMatchGameRoom) => set({ gameRoom: updatedRoom }),
	updateCards: (updatedCards: MemoryMatchCard[]) => set({ cards: updatedCards }),
}));
 