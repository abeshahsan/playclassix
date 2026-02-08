import { useMemoryMatchGameStore } from "@/store/games/memory-match";
import { MemoryMatchCard } from "@/types";
import Pusher from "pusher-js";
import { useEffect, useRef, useState } from "react";

type PusherClient = {
	pusherClient: Pusher | null;
	pusherChannel: string;
};

export function useSetUpPusherClient() {
	const [pusherClient, setPusherClient] = useState<Pusher | null>(null);
	const [pusherChannel, setPusherChannel] = useState("12345678910");

	const cardStore = useMemoryMatchGameStore();

	const pusherRef = useRef<PusherClient>({
		pusherClient,
		pusherChannel,
	});

	useEffect(() => {
		pusherRef.current = {
			pusherClient,
			pusherChannel,
		};
	});

	useEffect(() => {
		function initializePusher() {
			const client = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
				cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
			});
			pusherRef.current.pusherClient = client;
			setPusherClient(pusherRef.current.pusherClient);
			const channel = client.subscribe(pusherRef.current.pusherChannel);
			channel.bind("card-flipped", (data: any) => {
				cardStore.updateCards(data.updatedCards as MemoryMatchCard[]);

				if (!data.didFoundMatch && data.resetFlippedCards) {
					setTimeout(() => {
						cardStore.updateCards(
							data.updatedCards.map((card: MemoryMatchCard) =>
								!card.isMatched ? { ...card, isFlipped: false } : card,
							),
						);
					}, 1500);
				}
			});
		}

		initializePusher();
		return () => {
			if (pusherRef.current.pusherClient) {
				pusherRef.current.pusherClient.unsubscribe(pusherRef.current.pusherChannel);
				pusherRef.current.pusherClient.disconnect();
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return {
		pusherClient,
		pusherChannel,
		setPusherChannel,
	};
}
