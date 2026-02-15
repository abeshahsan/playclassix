import { fetchGamer } from "@/client-api";
import { useQuery } from "@tanstack/react-query";

export function useGamer() {
	return useQuery({
		queryKey: ["gamer"],
		queryFn: async ({ signal }) => fetchGamer({ signal }),
	});
}
