import { pusher } from "@/src/lib/pusher";

export async function POST(request: Request) {
	const { gameId, cardId, userId } = await request.json();

	pusher.trigger(`memory-match-${gameId}`, "player-move", {
		cardId,
		userId,
	});
	return new Response(JSON.stringify({ success: true }));
}
