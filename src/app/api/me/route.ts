import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAvatarPath } from "@/shared/utils/avatar";

export async function GET() {
	const userCookies = await cookies();

	const uid = userCookies.get("uid")?.value;
	const username = userCookies.get("username")?.value;
	const avatarNumber = userCookies.get("avatarNumber")?.value;
	const avatar = avatarNumber ? getAvatarPath(parseInt(avatarNumber)) : "/assets/avatars/avatar-1.svg";

	return NextResponse.json({ uid, username, avatar });
}
