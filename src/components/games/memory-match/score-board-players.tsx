import { Gamer, MemoryMatchPlayer } from "@/types";
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
<div className='flex items-center gap-2'>
{/* eslint-disable-next-line @next/next/no-img-element */}
<img 
src={player.avatar} 
alt={player.username}
className={`w-10 h-10 rounded-full border-2 ${
isCurrent ? "border-brand" : "border-surface-border"
}`}
/>
<div className='flex-1'>
<div className='flex items-center justify-between'>
<p
className={`font-semibold text-sm ${
isCurrent ? "text-brand-text" : "text-text-secondary"
}`}
>
{player.username} {isMe && "(You)"}
</p>
{isCurrent && (
<div className='flex items-center gap-1'>
<div className='h-2 w-2 bg-success rounded-full animate-pulse'></div>
<span className='text-xs font-semibold text-success'>Turn</span>
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