import { MemoryMatchPlayer, Gamer } from "@/types";

const MEDAL_ICONS = [
	"/assets/ui/medals/medal-gold-64.png",
	"/assets/ui/medals/medal-silver-64.png",
	"/assets/ui/medals/medal-bronze-64.png",
] as const;

export function FinalScores({ players, gamer }: { players: MemoryMatchPlayer[]; gamer: Gamer }) {
	return (
		<div className='mb-4 space-y-2'>
			{players
				.sort((a, b) => b.score - a.score)
				.map((player, index) => {
					const isMe = gamer.id === player.id;
					const isWinner = index === 0;
					const medalSrc = MEDAL_ICONS[index];

					return (
						<div
							key={player.id}
							className={`p-3 rounded-lg ${
								isWinner
									? "bg-[var(--warning-muted)] border-2 border-[var(--warning)]/50"
									: "bg-[var(--bg-tertiary)] border border-[var(--surface-border)]"
							}`}
						>
							<div className='flex justify-between items-center'>
								<span className='font-semibold text-[var(--text-primary)] inline-flex items-center gap-2'>
									{medalSrc && (
										/* eslint-disable-next-line @next/next/no-img-element */
										<img src={medalSrc} alt={`#${index + 1}`} className='w-6 h-6' />
									)}
									{player.username} {isMe && "(You)"}
								</span>
								<span className='font-bold text-lg text-[var(--brand-text)]'>
									{player.score} {player.score === 1 ? "match" : "matches"}
								</span>
							</div>
						</div>
					);
				})}
		</div>
	);
}
