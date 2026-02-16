export interface GameRegistryEntry {
	id: string;
	name: string;
	description: string;
	slug: string;
	icon: string; // URL or path to the icon image
	ogImage?: string; // social preview image
	iscomPleted?: boolean; // for devs purposes
}

export const GameRegistry: Record<string, GameRegistryEntry> = {
	ticTacToe: {
		id: "ticTacToe",
		name: "Tic Tac Toe",
		description: "A classic two-player game where players take turns marking Xs and Os on a 3x3 grid.",
		slug: "tic-tac-toe",
		icon: "/assets/ui/game-icon-96.png",
	},
	snake: {
		id: "snake",
		name: "Snake",
		description: "Control a growing snake to eat food while avoiding collisions with walls and itself.",
		slug: "snake",
		icon: "/assets/ui/game-icon-96.png",
	},
	memoryMatch: {
		id: "memoryMatch",
		name: "Memory Match",
		description: "Flip cards to find matching pairs in this memory challenge game.",
		slug: "memory-match",
		icon: "/assets/logos/logo-icon-only-128.png",
		ogImage: "/assets/social/og-image-1200x630.png",
		iscomPleted: true,
	},
};

export const getAllGames = (): GameRegistryEntry[] => {
	return Object.values(GameRegistry);
};
