import { fetchGamer } from "@/client-api/gamer";
import { useMemoryMatchGameStore } from "@/store/games/memory-match";
import { MemoryMatchGameRoom, MemoryMatchPlayer } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Pusher from "pusher-js";
import { useEffect } from "react";

export function useSetUpPusherClient() {
	const params = useParams();
	const gameId = params.gameId as string;
	const gamer = useQuery({
		queryKey: ["gamer"],
		queryFn: async ({ signal }) => fetchGamer({ signal }),
	}).data;
	const { setGameRoom, setIsMyTurn, setIsWon, setIsProcessing } = useMemoryMatchGameStore();

	useEffect(() => {
		if (!gamer) return;

		const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
			cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
			forceTLS: true,
		});

		const pusherChannel = pusherClient.subscribe(`memory-match-${gameId}`);

		// Player joined event
		pusherChannel.bind("player-joined", (data: { player: MemoryMatchPlayer; game: MemoryMatchGameRoom }) => {
			setGameRoom(data.game);
		});

		// Game started event
		pusherChannel.bind("game-started", (data: { game: MemoryMatchGameRoom }) => {
			setGameRoom(data.game);
			setIsMyTurn(data.game.currentTurn === gamer.id);
		});

		// Card flipped event - update game state immediately
		pusherChannel.bind("card-flipped", (data: { cardId: number; userId: string; game: MemoryMatchGameRoom }) => {
			setGameRoom(data.game);
			// Clear processing flag after first card flip
			setIsProcessing(false);
		});

		// Match result event - handle match/no-match with visual delay
		pusherChannel.bind(
			"match-result",
			(data: { matchFound: boolean; game: MemoryMatchGameRoom; firstCardId: number; secondCardId: number }) => {
				const { game, matchFound } = data;
				setIsProcessing(true);

				if (matchFound) {
					setTimeout(() => {
						setGameRoom(game);
						setIsMyTurn(game.currentTurn === gamer.id);
						setIsProcessing(false);

						if (game.status === "completed") {
							setIsWon(true);
						}
					}, 500);
				} else {
					setTimeout(() => {
						setGameRoom(game);
						setIsMyTurn(game.currentTurn === gamer.id);
						setIsProcessing(false);
					}, 1000);
				}
			},
		);

		return () => {
			pusherClient.unsubscribe(`memory-match-${gameId}`);
			pusherClient.disconnect();
		};
	}, [gameId, gamer, setGameRoom, setIsMyTurn, setIsProcessing, setIsWon]);
}
