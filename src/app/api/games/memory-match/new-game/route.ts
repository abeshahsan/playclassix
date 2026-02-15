import { createGame } from "@/lib/game-store";
import { cookies } from "next/headers";
import { getAvatarPath } from "@/lib/avatar";
import { MemoryMatchGameDifficulty } from "@/types";

export async function POST(request: Request) {
	const gameId = crypto.randomUUID();
	const { difficulty } = (await request.json()) as { difficulty: MemoryMatchGameDifficulty };

	// Get host user info from cookies
	const cookieStore = await cookies();
	const userId = cookieStore.get("uid")?.value || crypto.randomUUID();
	const username = cookieStore.get("username")?.value || "Player";
	const avatarNumber = cookieStore.get("avatarNumber")?.value;
	const avatar = avatarNumber ? getAvatarPath(parseInt(avatarNumber)) : "/assets/avatars/avatar-1.svg";

	// Create game in store
	const game = await createGame({
		gameId,
		hostId: userId,
		hostUsername: username,
		hostAvatar: avatar,
		difficulty: difficulty,
	});

	return new Response(JSON.stringify({ gameId, game }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}
