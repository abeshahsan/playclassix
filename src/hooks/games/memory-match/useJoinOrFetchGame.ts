import { useGamerStore } from "@/store/gamer";
import { useMemoryMatchGameStore } from "@/store/games/memory-match";
import { MemoryMatchGameRoom } from "@/types";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export function useJoinOrFetchGame() {
	const params = useParams();
	const gameId = params.gameId as string;
	const gamer = useGamerStore((s) => s.gamer);
	const { setGameRoom, setIsMyTurn, setIsWon, setError } = useMemoryMatchGameStore();

	useEffect(() => {
		if (!gamer) return;

		let isMounted = true;
		const abortController = new AbortController();

		async function joinOrFetchGame() {
			try {
				// Try to join the game via POST
				let joinResponse = await fetch("/api/games/memory-match/join-game", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ gameId }),
					signal: abortController.signal,
				});

				// If POST fails, try GET as fallback
				if (!joinResponse.ok) {
					console.warn("POST join-game failed, trying GET fallback");
					joinResponse = await fetch(`/api/games/memory-match/join-game?gameId=${gameId}`, {
						method: "GET",
						signal: abortController.signal,
					});
				}

				if (!joinResponse.ok) {
					throw new Error("Failed to join game");
				}

				const { game }: { game: MemoryMatchGameRoom } = await joinResponse.json();

				if (!isMounted) return;

				if (!game) {
					throw new Error("No game data received");
				}

				setGameRoom(game);
				setIsMyTurn(game.currentTurn === gamer?.id);

				if (game.status === "completed") {
					setIsWon(true);
				}
			} catch (err: any) {
				if (err.name === 'AbortError') return;
				if (!isMounted) return;
				console.error("Error joining or fetching game:", err);
				setError("Failed to join game. Game may not exist or is full.");
			}
		}

		joinOrFetchGame();

		return () => {
			isMounted = false;
			abortController.abort();
		};
	}, [gamer, gameId, setGameRoom, setIsMyTurn, setIsWon, setError]);
}
