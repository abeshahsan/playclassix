import { memo } from "react";

function GameCreationLoadingComponent() {
	return (
		<div className='flex flex-col items-center gap-6'>
			{/* Game icon */}
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src='/assets/logos/logo-icon-only-128.png'
				alt='Memory Match'
				className='w-20 h-20 rounded-xl'
			/>
			<div className='relative h-12 w-12'>
				<div className='absolute inset-0 rounded-full border-4 border-spinner-track'></div>
				<div className='absolute inset-0 rounded-full border-4 border-spinner border-t-transparent animate-spin'></div>
			</div>
			<div className='space-y-2'>
				<h1 className='text-2xl font-bold text-text-primary'>Setting up your game</h1>
				<p className='text-text-secondary'>Shuffling cards and preparing the board...</p>
			</div>
		</div>
	);
}

export const GameCreationLoading = memo(GameCreationLoadingComponent);
