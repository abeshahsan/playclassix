import { useQuery } from "@tanstack/react-query";
import { joinGame, fetchPlayerStats } from "@/features/memory-match/api-client";

export function useJoinGame(gameId: string, enabled: boolean = true) {
	return useQuery({
		queryKey: ["game", gameId],
		queryFn: ({ signal }) => joinGame(gameId, signal),
		enabled,
		retry: false,
	});
}

export function usePlayerStats(player1Id: string, player2Id: string, enabled: boolean = true) {
	return useQuery({
		queryKey: ["playerStats", player1Id, player2Id],
		queryFn: ({ signal }) => fetchPlayerStats(player1Id, player2Id, signal),
		enabled,
		staleTime: 30000,
	});
}
