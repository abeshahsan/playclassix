import { Gamer, MemoryMatchPlayer } from "@/types";

export function ScoreBoardPlayers({
	players,
	gamer,
	currentTurn,
}: {
	players: MemoryMatchPlayer[];
	gamer: Gamer | null;
	currentTurn: string;
}) {
	return (
		<div className='grid grid-cols-2 gap-3'>
			{players.map((player) => {
				const isCurrent = currentTurn === player.id;
				const isMe = gamer?.id === player.id;

				return (
					<div
						key={player.id}
						className={`p-3 rounded-lg transition-all ${
							isCurrent
								? "bg-brand-muted border-2 border-(--brand)/50 shadow-lg"
								: "bg-bg-tertiary border-2 border-transparent"
						}`}
					>
						<div className='flex items-center justify-between'>
							<div>
								<p
									className={`font-semibold text-sm ${
										isCurrent ? "text-brand-text" : "text-text-secondary"
									}`}
								>
									{player.username} {isMe && "(You)"}
								</p>
								<p className='text-xs text-text-tertiary'>Score: {player.score}</p>
							</div>
							{isCurrent && (
								<div className='flex items-center gap-1'>
									<div className='h-2 w-2 bg-success rounded-full animate-pulse'></div>
									<span className='text-xs font-semibold text-success'>Turn</span>
								</div>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
