import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export async function GET() {
	const userCookies = await cookies();

	const uid = userCookies.get("uid")?.value;
	const username = userCookies.get("username")?.value;

	return NextResponse.json({ uid, username });
}
