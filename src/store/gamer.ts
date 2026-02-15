import { Gamer } from "@/types";
import { create } from "zustand";

type GamerState = {
	gamer: Gamer | null;
	fetchGamer: () => Promise<void>;
};

let fetchAbortController: AbortController | null = null;

export const useGamerStore = create<GamerState>((set) => ({
	gamer: null,
	fetchGamer: async () => {
		// Cancel previous fetch if still pending
		if (fetchAbortController) {
			fetchAbortController.abort();
		}
		
		fetchAbortController = new AbortController();
		
		try {
			const response = await fetch("/api/me", {
				signal: fetchAbortController.signal,
			});
			if (!response.ok) {
				set({ gamer: null });
				return;
			}
			const data = await response.json();
			set({
				gamer: {
					id: data.uid,
					ign: data.username,
					avatar: data.avatar || "/assets/avatars/avatar-1.svg",
				},
			});
		} catch (e: any) {
			if (e.name === 'AbortError') return;
			console.log("Error fetching user:", e);
			set({ gamer: null });
		} finally {
			fetchAbortController = null;
		}
	},
}));
