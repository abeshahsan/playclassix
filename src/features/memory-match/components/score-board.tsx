import { ScoreBoardPlayers } from "@/features/memory-match/components/score-board-players";
import { TurnIndicator } from "@/features/memory-match/components/turn-indicator";
import { MemoryMatchGameRoom } from "@/features/memory-match/types";
import { Gamer } from "@/shared/types";
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

	// Compact mode for larger card counts
	const cardCount = gameRoom.cards.length;
	const isCompact = cardCount > 16;
	const padding = isCompact ? "p-3" : "p-4";
	const marginBottom = isCompact ? "mb-3" : "mb-4 sm:mb-6";
	const innerSpacing = isCompact ? "mb-2" : "mb-3";

	return (
		<div
			className={`bg-surface backdrop-blur-sm rounded-xl border border-surface-border ${padding} ${marginBottom}`}
			style={{ boxShadow: "var(--shadow-md)" }}
		>
			<div className={`flex justify-between items-center ${innerSpacing}`}>
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
