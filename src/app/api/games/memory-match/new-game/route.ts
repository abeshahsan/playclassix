import { memoryMatchEngine } from "@/core/games/memory-match/engine";
import { memoryMatchStorage } from "@/core/games/memory-match/storage";
import { cookies } from "next/headers";
import { getAvatarPath } from "@/lib/avatar";
import { MemoryMatchGameDifficulty } from "@/types/games/memory-match";

export async function POST(request: Request) {
	const gameId = crypto.randomUUID();
	const { difficulty } = (await request.json()) as { difficulty: MemoryMatchGameDifficulty };

	const cookieStore = await cookies();
	const userId = cookieStore.get("uid")?.value || crypto.randomUUID();
	const username = cookieStore.get("username")?.value || "Player";
	const avatarNumber = cookieStore.get("avatarNumber")?.value;
	const avatar = avatarNumber ? getAvatarPath(parseInt(avatarNumber)) : "/assets/avatars/avatar-1.svg";

	const game = memoryMatchEngine.createGame({
		gameId,
		hostId: userId,
		hostUsername: username,
		hostAvatar: avatar,
		difficulty,
	});
	await memoryMatchStorage.save(game);

	return new Response(JSON.stringify({ gameId, game }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}
