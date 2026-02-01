"use client";

import { use, useEffect, useRef } from "react";
import Pusher from "pusher-js";
import { getAnonUserId } from "@/src/utils/getUserID";

type Props = {
	params: Promise<{
		roomId: string;
	}>;
};

export default function RoomPage({ params }: Props) {
	const { roomId } = use(params);
	const pusherRef = useRef<Pusher | null>(null);

	useEffect(() => {
		console.log("Joining room:", roomId);

		const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
			cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
		});

		const channel = pusher.subscribe(`room-${roomId}`);

		channel.bind("message", (data: any) => {
			console.log("📩 New message:", data);
		});

		pusherRef.current = pusher;

		return () => {
			channel.unbind_all();
			channel.unsubscribe();
			pusher.disconnect();
		};
	}, [roomId]);

	const sendMessage = async () => {
		const anonUserId = getAnonUserId(); // or use getAnonUserId() if needed
		await fetch("/api/message", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				roomId,
				message: "Hello from " + anonUserId,
				senderId: anonUserId,
			}),
		});
	};

	return (
		<main className='p-6'>
			<h1 className='text-xl font-bold'>Room</h1>
			<p className='mb-4 text-sm text-gray-500'>{roomId}</p>

			<button
				onClick={sendMessage}
				className='px-4 py-2 bg-blue-600 text-white rounded'
			>
				Send Test Message
			</button>
		</main>
	);
}
