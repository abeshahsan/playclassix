import { ScoreBoardPlayers } from "@/components/games/memory-match/score-board-players";
import { TurnIndicator } from "@/components/games/memory-match/turn-indicator";
import { MemoryMatchGameRoom } from "@/types/games/memory-match";
import { Gamer } from "@/types";
import { useParams } from "next/navigation";
import { FiHash } from "react-icons/fi";
import { memo } from "react";

function GameStatusBarComponent({
	gameRoom,
	gamer,
	isMyTurn,
	isWon,
}: {
	gameRoom: MemoryMatchGameRoom;
	gamer: Gamer;
	isMyTurn: boolean;
	isWon: boolean;
}) {
	const params = useParams();
	const gameId = params.gameId as string;

	return (
		<div
			className='bg-surface backdrop-blur-sm rounded-xl border border-surface-border p-4 mb-6'
			style={{ boxShadow: "var(--shadow-md)" }}
		>
			<div className='flex justify-between items-center mb-3'>
				<div className='text-sm'>
					<span className='font-semibold text-text-secondary'>Moves: </span>
					<span className='text-lg font-bold text-brand-text'>{gameRoom.moves}</span>
				</div>
				<div className='text-sm inline-flex items-center gap-1'>
					<FiHash className='w-3 h-3 text-text-tertiary' />
					<span className='text-xs font-mono text-text-tertiary'>{gameId.slice(0, 8)}</span>
				</div>
			</div>

			<ScoreBoardPlayers
				players={gameRoom.players}
				gamer={gamer}
				currentTurn={gameRoom.currentTurn}
			/>

			<TurnIndicator
				isMyTurn={isMyTurn}
				isWon={isWon}
			/>
		</div>
	);
}

export const GameStatusBar = memo(GameStatusBarComponent);
