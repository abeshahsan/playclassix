import { FiTarget } from "react-icons/fi";

type Props = {
	isMyTurn: boolean;
	isWon: boolean;
};

export function TurnIndicator({ isMyTurn, isWon }: Props) {
	return (
		<>
			{isMyTurn && !isWon && (
				<div className='mt-3 p-2 bg-[var(--success-muted)] border border-[var(--success)]/20 rounded-lg text-center'>
					<p className='text-sm font-bold text-[var(--success)] inline-flex items-center gap-1.5'>
						<FiTarget className='w-4 h-4' />
						It&apos;s your turn!
					</p>
				</div>
			)}

			{!isMyTurn && !isWon && (
				<div className='mt-3 p-2 bg-[var(--bg-tertiary)] rounded-lg text-center'>
					<p className='text-sm font-medium text-[var(--text-secondary)]'>Waiting for opponent...</p>
				</div>
			)}
		</>
	);
}
