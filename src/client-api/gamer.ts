import { Gamer } from "@/types/games/memory-match";

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
