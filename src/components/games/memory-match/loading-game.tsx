export function LoadingGame({ error }: { error: string | null }) {
	return (
		<div className='min-h-screen bg-linear-to-br from-purple-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-950 flex items-center justify-center'>
			<div className='bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl'>
				<div className='animate-pulse text-center'>
					<div className='h-12 w-12 mx-auto mb-4 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin'></div>
					<p className='text-lg font-semibold text-slate-700 dark:text-slate-300'>
						{error || "Loading game..."}
					</p>
				</div>
			</div>
		</div>
	);
}
