import { MemoryMatchGameRoom } from "@/types";
import { useState } from "react";

export function WaitingScreen({ gameRoom }: { gameRoom: MemoryMatchGameRoom }) {
	const [isCopied, setIsCopied] = useState(false);

	function handleClipboardCopy() {
		if (typeof window !== "undefined") {
			navigator.clipboard.writeText(window.location.href);
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), 2000);
		}
	}

	return (
		<>
			<div className='min-h-screen bg-linear-to-br from-purple-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-950 py-8 px-4'>
				<div className='max-w-2xl mx-auto'>
					<div className='bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl text-center'>
						<h1 className='text-3xl font-extrabold text-slate-900 dark:text-white mb-4'>
							Waiting for Player 2
						</h1>
						<div className='flex items-center justify-center gap-2 mb-6'>
							<div
								className='h-3 w-3 bg-indigo-600 rounded-full animate-bounce'
								style={{ animationDelay: "0ms" }}
							></div>
							<div
								className='h-3 w-3 bg-indigo-600 rounded-full animate-bounce'
								style={{ animationDelay: "150ms" }}
							></div>
							<div
								className='h-3 w-3 bg-indigo-600 rounded-full animate-bounce'
								style={{ animationDelay: "300ms" }}
							></div>
						</div>
						<p className='text-slate-600 dark:text-slate-400 mb-6'>
							Share this game link with a friend to start playing!
						</p>
						<div className='bg-slate-100 dark:bg-slate-700 p-4 rounded-lg mb-6'>
							<code className='text-sm text-slate-800 dark:text-slate-200 break-all'>
								{typeof window !== "undefined" ? window.location.href : ""}
							</code>
						</div>
						<button
							onClick={handleClipboardCopy}
							className='px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 transition-colors shadow-md'
						>
							{isCopied ? "Copied!" : "Copy Link"}
						</button>

						<div className='mt-8 pt-8 border-t border-slate-200 dark:border-slate-700'>
							<h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-4'>Players</h3>
							<div className='space-y-2'>
								{gameRoom.players.map((player, index) => (
									<div
										key={player.id}
										className='flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg'
									>
										<span className='font-medium text-slate-700 dark:text-slate-300'>
											{player.username} {player.id === gameRoom.hostId && "(Host)"}
										</span>
										<span className='text-sm text-slate-500 dark:text-slate-400'>
											Player {index + 1}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
