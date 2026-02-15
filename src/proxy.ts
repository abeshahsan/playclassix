import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";

export default function proxy(req: NextRequest) {
	const uid = req.cookies.get("uid")?.value;
	const username = req.cookies.get("username")?.value;

	if (!username && req.nextUrl.pathname !== "/set-username") {
		const url = req.nextUrl.clone();
		url.pathname = "/set-username";
		url.searchParams.set("redirect", req.nextUrl.pathname);

		const res = NextResponse.redirect(url);

		if (!uid) {
			res.cookies.set("uid", crypto.randomUUID(), {
				httpOnly: true,
				path: "/",
			});
		}

		return res;
	}

	const res = NextResponse.next();

	if (!uid) {
		res.cookies.set("uid", crypto.randomUUID(), {
			httpOnly: true,
			path: "/",
		});
	}

	return res;
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|manifest.json).*)"],
};
