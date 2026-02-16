import { useGamer } from "@/features/memory-match/hooks/useGamer";
import { useMemoryMatchGameStore } from "@/features/memory-match/store";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useJoinGame } from "./useGameQueries";

export function useJoinOrFetchGame() {
	const params = useParams();
	const gameId = params.gameId as string;
	const gamer = useGamer().data;

	const { setGameRoom, setIsMyTurn, setIsWon, setError } = useMemoryMatchGameStore();

	const { data: game, error: gameError, isError } = useJoinGame(gameId, !!gamer);

	useEffect(() => {
		if (!gamer || !game) return;

		setGameRoom(game);
		setIsMyTurn(game.currentTurn === gamer.id);

		if (game.status === "completed") {
			setIsWon(true);
		}
	}, [gamer, game, setGameRoom, setIsMyTurn, setIsWon]);

	useEffect(() => {
		if (isError && gameError) {
			setError("Failed to join game. Game may not exist or is full.");
		}
	}, [isError, gameError, setError]);
}
