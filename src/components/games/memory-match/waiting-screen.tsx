import { MemoryMatchGameRoom } from "@/types";
import { useState } from "react";
import { FiCheck, FiCopy, FiUsers } from "react-icons/fi";

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
		<div className='relative min-h-screen py-8 px-4 overflow-hidden'>
			{/* Background */}
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src='/assets/splash/loading-bg-1920x1080.png'
				alt=''
				className='absolute inset-0 h-full w-full object-cover -z-10'
				aria-hidden='true'
			/>

			<div className='max-w-lg mx-auto'>
				<div className='bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-700/50 text-center'>
					{/* Game logo */}
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src='/assets/logos/logo-icon-only-128.png'
						alt='Memory Match'
						className='w-16 h-16 mx-auto mb-4 rounded-xl'
					/>

					<h1 className='text-2xl font-bold text-white mb-2'>Waiting for Player 2</h1>

					{/* Bouncing dots */}
					<div className='flex items-center justify-center gap-1.5 mb-6'>
						<div
							className='h-2 w-2 bg-indigo-500 rounded-full animate-bounce'
							style={{ animationDelay: "0ms" }}
						></div>
						<div
							className='h-2 w-2 bg-indigo-500 rounded-full animate-bounce'
							style={{ animationDelay: "150ms" }}
						></div>
						<div
							className='h-2 w-2 bg-indigo-500 rounded-full animate-bounce'
							style={{ animationDelay: "300ms" }}
						></div>
					</div>

					<p className='text-slate-400 mb-6'>Share the game link with a friend to start playing!</p>

					{/* Link display */}
					<div className='bg-slate-900/50 p-3 rounded-lg mb-4 border border-slate-700/50'>
						<code className='text-sm text-indigo-300 break-all'>
							{typeof window !== "undefined" ? window.location.href : ""}
						</code>
					</div>

					{/* Copy button */}
					<button
						onClick={handleClipboardCopy}
						className='inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-95'
					>
						{isCopied ?
							<>
								<FiCheck className='w-4 h-4' />
								Copied!
							</>
						:	<>
								<FiCopy className='w-4 h-4' />
								Copy Link
							</>
						}
					</button>

					{/* Players section */}
					<div className='mt-8 pt-6 border-t border-slate-700/50'>
						<div className='flex items-center justify-center gap-2 mb-4'>
							<FiUsers className='w-4 h-4 text-slate-400' />
							<h3 className='text-sm font-semibold text-slate-300 uppercase tracking-wider'>Players</h3>
						</div>
						<div className='space-y-2'>
							{gameRoom.players.map((player, index) => (
								<div
									key={player.id}
									className='flex items-center justify-between bg-slate-900/50 p-3 rounded-lg border border-slate-700/30'
								>
									<span className='font-medium text-slate-300'>
										{player.username} {player.id === gameRoom.hostId && "(Host)"}
									</span>
									<span className='text-xs text-slate-500'>Player {index + 1}</span>
								</div>
							))}
							{/* Empty slot for Player 2 */}
							{gameRoom.players.length < 2 && (
								<div className='flex items-center justify-center bg-slate-900/30 p-3 rounded-lg border border-dashed border-slate-600/50'>
									<span className='text-sm text-slate-500 italic'>Waiting for opponent...</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
