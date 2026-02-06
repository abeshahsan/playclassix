export function GameError({ message }: { message: string | null }) {
	return (
		message && (
			<div className='mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded-lg text-center'>
				<p className='text-sm font-semibold text-red-700 dark:text-red-400'>{message}</p>
			</div>
		)
	);
}
