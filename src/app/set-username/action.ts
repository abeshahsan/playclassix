"use server";
import { cookies } from "next/headers";
import { getRandomAvatarNumber } from "@/shared/utils/avatar";

export async function setUsernameAction(username: string) {
	const cookieStore = await cookies();
	// Only assign avatar if not already set
	let avatarNumber = cookieStore.get("avatarNumber")?.value;
	if (!avatarNumber) {
		avatarNumber = getRandomAvatarNumber().toString();
		cookieStore.set("avatarNumber", avatarNumber, { path: "/" });
	}
	cookieStore.set("username", username, { path: "/" });
}
