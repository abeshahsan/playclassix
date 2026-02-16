import { Gamer } from "@/shared/types";
import { MemoryMatchPlayer } from "@/features/memory-match/types";
import { memo } from "react";

function ScoreBoardPlayersComponent({
players,
gamer,
currentTurn,
}: {
players: MemoryMatchPlayer[];
gamer: Gamer | null;
currentTurn: string;
}) {
return (
<div className='grid grid-cols-2 gap-2 sm:gap-3'>
{players.map((player) => {
const isCurrent = currentTurn === player.id;
const isMe = gamer?.id === player.id;

return (
<div
key={player.id}
className={`p-2.5 sm:p-3 rounded-lg transition-all ${
isCurrent
? "bg-brand-muted border-2 border-(--brand)/50 shadow-lg"
: "bg-bg-tertiary border-2 border-transparent"
}`}
>
<div className='flex items-center gap-2'>
{/* eslint-disable-next-line @next/next/no-img-element */}
<img 
src={player.avatar} 
alt={player.username}
className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${
isCurrent ? "border-brand" : "border-surface-border"
}`}
/>
<div className='flex-1 min-w-0'>
<div className='flex items-center justify-between gap-1'>
<p
className={`font-semibold text-xs sm:text-sm truncate ${
isCurrent ? "text-brand-text" : "text-text-secondary"
}`}
>
{player.username} {isMe && "(You)"}
</p>
{isCurrent && (
<div className='flex items-center gap-1 shrink-0'>
<div className='h-2 w-2 bg-success rounded-full animate-pulse'></div>
<span className='text-xs font-semibold text-success hidden sm:inline'>Turn</span>
</div>
)}
</div>
<p className='text-xs text-text-tertiary'>Score: {player.score}</p>
</div>
</div>
</div>
);
})}
</div>
);
}
export const ScoreBoardPlayers = memo(ScoreBoardPlayersComponent);
