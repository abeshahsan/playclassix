import { NextResponse } from "next/server";
import { pusher } from "@/src/lib/pusher";

export async function POST(req: Request) {
	const { roomId, message, senderID } = await req.json();

	if (!roomId || !message) {
		return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
	}

	await pusher.trigger(`room-${roomId}`, "message", {
		message,
		timestamp: Date.now(),
		senderID,
	});

	return NextResponse.json({ success: true });
}
