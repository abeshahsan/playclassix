import { ScoreBoardPlayers } from "@/components/games/memory-match/score-board-players";
import { TurnIndicator } from "@/components/games/memory-match/turn-indicator";
import { Gamer, MemoryMatchGameRoom } from "@/types";
import { useParams } from "next/navigation";

export function GameStatusBar({
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
		<>
			<div className='bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 mb-6'>
				<div className='flex justify-between items-center mb-3'>
					<div className='text-sm'>
						<span className='font-semibold text-slate-700 dark:text-slate-300'>Moves: </span>
						<span className='text-lg font-bold text-indigo-600 dark:text-indigo-400'>{gameRoom.moves}</span>
					</div>
					<div className='text-sm'>
						<span className='font-semibold text-slate-700 dark:text-slate-300'>Game ID: </span>
						<span className='text-xs font-mono text-slate-500 dark:text-slate-400'>
							{gameId.slice(0, 8)}...
						</span>
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
		</>
	);
}
