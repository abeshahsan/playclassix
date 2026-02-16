import { FiTarget } from "react-icons/fi";
import { memo } from "react";

type Props = {
	isMyTurn: boolean;
	isWon: boolean;
};

function TurnIndicatorComponent({ isMyTurn, isWon }: Props) {
	return (
		<>
			{isMyTurn && !isWon && (
				<div className='mt-2 sm:mt-3 p-1.5 sm:p-2 bg-success-muted border border-(--success)/20 rounded-lg text-center'>
					<p className='text-xs sm:text-sm font-bold text-success inline-flex items-center gap-1.5'>
						<FiTarget className='w-3 h-3 sm:w-4 sm:h-4' />
						It&apos;s your turn!
					</p>
				</div>
			)}

			{!isMyTurn && !isWon && (
				<div className='mt-2 sm:mt-3 p-1.5 sm:p-2 bg-bg-tertiary rounded-lg text-center'>
					<p className='text-xs sm:text-sm font-medium text-text-secondary'>Waiting for opponent...</p>
				</div>
			)}
		</>
	);
}

export const TurnIndicator = memo(TurnIndicatorComponent);
