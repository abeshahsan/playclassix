"use client";

import { sendMessage } from "@/src/actions/message.action";
import { pusherClient } from "@/src/app/pusher";
import { useEffect, useState } from "react";

type Message = {
	text: string;
	sender: "user1" | "user2";
};

export default function Home() {
	const [messages, setMessages] = useState<Message[]>([]);

	function handleSendMessage(messageText: string) {
		sendMessage(messageText, "user1");
	}

	useEffect(() => {
		const channel = pusherClient.subscribe("mini-game-chat");

		channel.bind("new-message", (data: Message) => {
			setMessages((prevMessages) => [...prevMessages, data]);
		});

		return () => {
			pusherClient.unsubscribe("mini-game-chat");
		};
	}, []);

	return (
		<>
			<div className='container  flex justify-center flex-col items-center min-h-screen'>
				<div className='mt-10 w-full max-w-md bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col h-112.5 overflow-hidden'>
					<header className='bg-blue-600 p-4 flex justify-between items-baseline'>
						<div className='text-white font-bold '> Mini Game Chat </div>
						<button
							title='Clear all messages'
							className='text-white cursor-pointer text-2xl font-bold hover:text-red-300'
							onClick={() => setMessages([])}
						>
							&times;
						</button>
					</header>
					<div className='flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50'>
						{messages.map((msg, index) => (
							<div
								key={index}
								className={`flex justify-${msg.sender === "user1" ? "end" : "start"}`}
							>
								<div
									className={`${
										msg.sender === "user1" ? "bg-blue-600 text-white" : "bg-white text-black"
									} border rounded-2xl px-4 py-2 text-sm shadow-sm max-w-[80%]`}
								>
									{msg.text}
								</div>
							</div>
						))}
					</div>
					<form
						className='p-3 border-t bg-white flex gap-2'
						onSubmit={(e) => {
							handleSendMessage((e.target as any)[0].value);
							e.preventDefault();
							(e.target as any)[0].value = "";
						}}
					>
						<input
							type='text'
							placeholder='Type a message...'
							className='flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
						<button className='bg-blue-600 text-white rounded-full p-2 h-10 w-10 flex items-center justify-center hover:bg-blue-700'>
							<svg
								className='w-5 h-5 rotate-90'
								fill='currentColor'
								viewBox='0 0 20 20'
							>
								<path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z' />
							</svg>
						</button>
					</form>
				</div>
			</div>
		</>
	);
}

