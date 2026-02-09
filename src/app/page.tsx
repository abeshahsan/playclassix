"use client";

import Link from "next/link";

export default function Home() {
	return (
		<main className='flex min-h-screen flex-col items-center justify-center gap-8 bg-linear-to-br from-slate-900 to-indigo-950'>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src='/assets/logos/logo-full-color-256.png'
				alt='PlayClassix'
				width={128}
				height={128}
				className='rounded-2xl'
			/>
			<h1 className='text-4xl font-extrabold text-white tracking-tight'>
				Play<span className='text-indigo-400'>Classix</span>
			</h1>
			<p className='max-w-md text-center text-slate-400'>
				Classic online games for everyone — play with friends in your browser.
			</p>
			<Link
				href='/games'
				className='inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-colors active:scale-95'
			>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img src='/assets/ui/btn-play-32.png' alt='' className='w-5 h-5' />
				Browse Games
			</Link>
		</main>
	);
}
