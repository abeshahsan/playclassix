import { memoryMatchStorage } from "@/features/memory-match/engine/storage";
import { memoryMatchEngine } from "@/features/memory-match/engine";
import { pusher } from "@/shared/utils/pusher";
import { cookies } from "next/headers";
import { getAvatarPath } from "@/shared/utils/avatar";

export async function POST(request: Request) {
	const { gameId } = await request.json();

	const cookieStore = await cookies();
	const userId = cookieStore.get("uid")?.value || crypto.randomUUID();
	const username = cookieStore.get("username")?.value || "Player";
	const avatarNumber = cookieStore.get("avatarNumber")?.value;
	const avatar = avatarNumber ? getAvatarPath(parseInt(avatarNumber)) : "/assets/avatars/avatar-1.svg";

	const existingGame = await memoryMatchStorage.get(gameId);
	if (!existingGame || !memoryMatchEngine.canJoinGame(existingGame, userId)) {
		return new Response(JSON.stringify({ error: "Game not found or full" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	const game = memoryMatchEngine.addPlayerToGame(existingGame, userId, username, avatar);
	await memoryMatchStorage.save(game);

	// Notify all players in the room about the new player
	try {
		await pusher.trigger(`memory-match-${gameId}`, "player-joined", {
			player: { id: userId, username },
			game,
		});
	} catch (error) {
		console.error("Pusher trigger error:", error);
	}

	// If game just started (second player joined), notify everyone
	if (game.status === "in-progress" && game.players.length === 2) {
		await pusher.trigger(`memory-match-${gameId}`, "game-started", {
			game,
		});
	}

	return new Response(JSON.stringify({ success: true, game }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}
