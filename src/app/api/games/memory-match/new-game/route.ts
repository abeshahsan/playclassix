import { createGame } from "@/lib/game-store";
import { generateCards } from "../../memory-match/generate-cards/route";
import { cookies } from "next/headers";
import { getAvatarPath } from "@/lib/avatar";

export async function POST() {
	const gameId = crypto.randomUUID();
	
	// Get host user info from cookies
	const cookieStore = await cookies();
	const userId = cookieStore.get("uid")?.value || crypto.randomUUID();
	const username = cookieStore.get("username")?.value || "Player";
	const avatarNumber = cookieStore.get("avatarNumber")?.value;
	const avatar = avatarNumber ? getAvatarPath(parseInt(avatarNumber)) : "/assets/avatars/avatar-1.svg";
	
	// Generate cards for this game
	const cards = generateCards();
	
	// Create game in store
	const game = await createGame(gameId, userId, username, avatar, cards);

	return new Response(JSON.stringify({ gameId, game }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}
