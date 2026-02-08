"use client";

import { useSetUpPusherClient } from "@/hooks/games/memory-match";
import { useGamerStore } from "@/store/gamer";
import { useMemoryMatchGameStore } from "@/store/games/memory-match";
import { MemoryMatchCard } from "@/types";
import { useEffect } from "react";

export default function MemoryMatchMainPage() {
	const cardStore = useMemoryMatchGameStore();

	const gamerStore = useGamerStore();

	useEffect(() => {
		gamerStore.fetchGamer();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useSetUpPusherClient();

	const handleCardClicked = (cardId: number) => {
		if (!gamerStore.gamer) {
			console.log("No gamer found. Cannot send move.");
			return;
		}

		cardStore.sendMove(cardId, "12345678910", gamerStore.gamer.id);
	};

	return (
		<div className='grid grid-cols-2 gap-4 cursor-pointer'>
			{gamerStore.gamer && (
				<div className='mb-4 text-center text-lg font-bold'>Welcome, {gamerStore.gamer.ign}!</div>
			)}{" "}
			<br />
			{cardStore.cards ?
				cardStore.cards.map((card: MemoryMatchCard) => (
					<div
						key={card.id}
						className={`flex items-center justify-center h-24 border rounded ${card.isFlipped || card.isMatched ? "bg-green-200" : "bg-gray-200"} hover:scale-101 transition-transform active:scale-100
						`}
						onClick={() => handleCardClicked(card.id)}
					>
						{card.isFlipped || card.isMatched ? card.word : "?"}
					</div>
				))
			:	<div>Loading cards...</div>}
		</div>
	);
}
