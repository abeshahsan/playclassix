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
				<div className='bg-[var(--surface)] backdrop-blur-sm p-8 rounded-2xl border border-[var(--surface-border)] text-center' style={{ boxShadow: 'var(--shadow-xl)' }}>
					{/* Game logo */}
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src='/assets/logos/logo-icon-only-128.png'
						alt='Memory Match'
						className='w-16 h-16 mx-auto mb-4 rounded-xl'
					/>

					<h1 className='text-2xl font-bold text-[var(--text-primary)] mb-2'>Waiting for Player 2</h1>

					{/* Bouncing dots */}
					<div className='flex items-center justify-center gap-1.5 mb-6'>
						<div
							className='h-2 w-2 bg-[var(--brand)] rounded-full animate-bounce'
							style={{ animationDelay: "0ms" }}
						></div>
						<div
							className='h-2 w-2 bg-[var(--brand)] rounded-full animate-bounce'
							style={{ animationDelay: "150ms" }}
						></div>
						<div
							className='h-2 w-2 bg-[var(--brand)] rounded-full animate-bounce'
							style={{ animationDelay: "300ms" }}
						></div>
					</div>

					<p className='text-[var(--text-secondary)] mb-6'>Share the game link with a friend to start playing!</p>

					{/* Link display */}
					<div className='bg-[var(--bg-tertiary)] p-3 rounded-lg mb-4 border border-[var(--surface-border)]'>
						<code className='text-sm text-[var(--brand-text)] break-all'>
							{typeof window !== "undefined" ? window.location.href : ""}
						</code>
					</div>

					{/* Copy button */}
					<button
						onClick={handleClipboardCopy}
						className='inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand)] text-[var(--text-inverse)] rounded-xl font-semibold hover:bg-[var(--brand-hover)] transition-all active:scale-95'
						style={{ boxShadow: 'var(--shadow-brand)' }}
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
					<div className='mt-8 pt-6 border-t border-[var(--surface-border)]'>
						<div className='flex items-center justify-center gap-2 mb-4'>
							<FiUsers className='w-4 h-4 text-[var(--text-secondary)]' />
							<h3 className='text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider'>Players</h3>
						</div>
						<div className='space-y-2'>
							{gameRoom.players.map((player, index) => (
								<div
									key={player.id}
									className='flex items-center justify-between bg-[var(--bg-tertiary)] p-3 rounded-lg border border-[var(--surface-border)]'
								>
									<span className='font-medium text-[var(--text-primary)]'>
										{player.username} {player.id === gameRoom.hostId && "(Host)"}
									</span>
									<span className='text-xs text-[var(--text-tertiary)]'>Player {index + 1}</span>
								</div>
							))}
							{/* Empty slot for Player 2 */}
							{gameRoom.players.length < 2 && (
								<div className='flex items-center justify-center bg-[var(--bg-secondary)] p-3 rounded-lg border border-dashed border-[var(--surface-border)]'>
									<span className='text-sm text-[var(--text-tertiary)] italic'>Waiting for opponent...</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
