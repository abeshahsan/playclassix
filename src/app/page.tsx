"use client";

import Link from "next/link";

export default function Home() {
	return (
		<main className='flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-8 bg-[var(--bg-primary)]'>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src='/assets/logos/logo-full-color-256.png'
				alt='PlayClassix'
				width={128}
				height={128}
				className='rounded-2xl'
			/>
			<h1 className='text-4xl font-extrabold text-[var(--text-primary)] tracking-tight'>
				Play<span className='text-[var(--brand-text)]'>Classix</span>
			</h1>
			<p className='max-w-md text-center text-[var(--text-secondary)]'>
				Classic online games for everyone — play with friends in your browser.
			</p>
			<Link
				href='/games'
				className='inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-8 py-3.5 text-base font-semibold text-[var(--text-inverse)] hover:bg-[var(--brand-hover)] transition-colors active:scale-95'
				style={{ boxShadow: "var(--shadow-brand)" }}
			>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img src='/assets/ui/btn-play-32.png' alt='' className='w-5 h-5' />
				Browse Games
			</Link>
		</main>
	);
}
