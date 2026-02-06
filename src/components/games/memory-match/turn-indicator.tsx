type Props = {
	isMyTurn: boolean;
	isWon: boolean;
};

export function TurnIndicator({ isMyTurn, isWon }: Props) {
	return (
		<>
			{isMyTurn && !isWon && (
				<div className='mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-center'>
					<p className='text-sm font-bold text-green-700 dark:text-green-400'>🎯 It&apos;s your turn!</p>
				</div>
			)}

			{!isMyTurn && !isWon && (
				<div className='mt-3 p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-center'>
					<p className='text-sm font-medium text-slate-600 dark:text-slate-400'>Waiting for opponent...</p>
				</div>
			)}
		</>
	);
}
