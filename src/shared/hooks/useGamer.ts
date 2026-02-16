import { useQuery } from "@tanstack/react-query";
import { Gamer } from "@/shared/types";

export type FetchGamerOptions = {
	signal?: AbortSignal;
};

export async function fetchGamer({ signal }: FetchGamerOptions): Promise<Gamer | null> {
	try {
		const response = await fetch("/api/me", { signal });
		if (!response.ok) {
		}
		const data = await response.json();
		return {
			id: data.uid,
			ign: data.username,
			avatar: data.avatar || "/assets/avatars/avatar-1.svg",
		};
	} catch (e: any) {
		if (e.name === "AbortError") return null;
		console.log("Error fetching user:", e);
		return null;
	}
}

export function useGamer() {
	return useQuery({
		queryKey: ["gamer"],
		queryFn: async ({ signal }) => fetchGamer({ signal }),
	});
}
