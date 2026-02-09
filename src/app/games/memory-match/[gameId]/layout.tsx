import type { Metadata } from "next";

export async function generateMetadata({ 
	params 
}: { 
	params: Promise<{ gameId: string }> 
}): Promise<Metadata> {
	const { gameId } = await params;

	return {
		title: "Memory Match Game",
		description: `Join Memory Match game ${gameId}. Play real-time multiplayer with friends!`,
	};
}

export default function GameLayout({ children }: { children: React.ReactNode }) {
	return children;
}
