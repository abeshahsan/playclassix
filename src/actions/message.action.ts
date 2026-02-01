"use server";

import { pusherServer } from "@/src/app/pusher";

export async function sendMessage(messageText: string, sender: "user1" | "user2") {
	const newMessage: { text: string; sender: "user1" | "user2" } = {
		text: messageText,
		sender: sender,
	};
	pusherServer.trigger("mini-game-chat", "new-message", newMessage);
}
