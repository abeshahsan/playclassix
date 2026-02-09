import { FiAlertCircle } from "react-icons/fi";

export function LoadingGame({ error }: { error: string | null }) {
	return (
		<div className='relative min-h-screen flex items-center justify-center overflow-hidden'>
			{/* Background image */}
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src='/assets/splash/loading-bg-1920x1080.png'
				alt=''
				className='absolute inset-0 h-full w-full object-cover -z-10'
				aria-hidden='true'
			/>

			<div className='bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-700/50 text-center'>
				{error ?
					<div className='flex flex-col items-center gap-3'>
						<div className='h-12 w-12 flex items-center justify-center rounded-full bg-red-500/10'>
							<FiAlertCircle className='w-6 h-6 text-red-400' />
						</div>
						<p className='text-lg font-semibold text-red-400'>{error}</p>
					</div>
				:	<div className='flex flex-col items-center gap-4'>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src='/assets/logos/logo-icon-only-128.png'
							alt='Memory Match'
							className='w-16 h-16 rounded-xl'
						/>
						<div className='h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin'></div>
						<p className='text-lg font-semibold text-slate-300'>Loading game...</p>
					</div>
				}
			</div>
		</div>
	);
}
