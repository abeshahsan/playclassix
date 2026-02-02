"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function setUsernameAction(username: string) {
	const cookieStore = await cookies();
	cookieStore.set("username", username, { path: "/" });
	redirect("/");
}
