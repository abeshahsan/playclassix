import { pusher } from "@/lib/pusher";
import { MemoryMatchCard } from "@/types";

export async function POST(request: Request) {
	const { gameId: channelId, cardId, cards, userId } = await request.json();

	console.log("[Move API] Request received:", { channelId, cardId, cards, userId });

	const { updatedCards, resetFlippedCards, didFoundMatch } = chainCardUpdate(cards, cardId);

	pusher.trigger(channelId, "card-flipped", {
		updatedCards,
		cardId,
		userId,
		resetFlippedCards: resetFlippedCards,
		didFoundMatch,
	});

	return new Response(JSON.stringify({ success: true }), { status: 200 });
}

function uppdatecards(cards: MemoryMatchCard[], cardId: number) {
	return cards.map((card: MemoryMatchCard) => (card.id === cardId ? { ...card, isFlipped: true } : card));
}

function checkForMatch(updatedCards: MemoryMatchCard[]) {
	const flippedCards = updatedCards.filter((card: any) => card.isFlipped && !card.isMatched);
	let didFoundMatch = false,
		cardsWithMatchStatus = [...updatedCards];
	if (flippedCards.length === 2) {
		didFoundMatch = flippedCards[0].word === flippedCards[1].word;
		if (didFoundMatch) {
			cardsWithMatchStatus = updatedCards.map((card: MemoryMatchCard) =>
				card.isFlipped ? { ...card, isMatched: true, isFlipped: false } : card,
			);
		}
	}
	return { cardsWithMatchStatus, didFoundMatch };
}

function needsResetFlippedCards(updatedCards: MemoryMatchCard[]) {
	const flippedCards = updatedCards.filter((card: any) => card.isFlipped && !card.isMatched);
	return flippedCards.length === 2;
}

function chainCardUpdate(cards: MemoryMatchCard[], cardId: number) {
	const updatedCards = uppdatecards(cards, cardId);
	const { cardsWithMatchStatus, didFoundMatch } = checkForMatch(updatedCards);
	const resetFlippedCards = needsResetFlippedCards(cardsWithMatchStatus);
	return { updatedCards: cardsWithMatchStatus, resetFlippedCards, didFoundMatch };
}
