"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewGamePage() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		async function createGame() {
			try {
				const response = await fetch("/api/games/memory-match/new-game", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
				});

				if (!response.ok) {
					throw new Error("Failed to create a new game.");
				}

				const data = await response.json();

				if (isMounted && data.gameId) {
					router.push(`/games/memory-match/${data.gameId}`);
				} else if (isMounted) {
					throw new Error("Game ID was not returned from the server.");
				}
			} catch (err: any) {
				if (isMounted) {
					setError(err.message || "An unexpected error occurred.");
				}
			}
		}

		createGame();

		return () => {
			isMounted = false;
		};
	}, [router]);

	return (
		<main className='flex items-center justify-center h-screen w-full bg-gray-50'>
			<div className='w-full max-w-md p-8 bg-white rounded-xl shadow-lg mx-auto text-center'>
				{!error ?
					<div className='flex flex-col items-center gap-6'>
						<div className='relative h-16 w-16'>
							<div className='absolute inset-0 rounded-full border-4 border-gray-100'></div>
							<div className='absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin'></div>
						</div>
						<div className='space-y-2'>
							<h1 className='text-2xl font-bold text-gray-900 leading-tight'>
								Creating a new game for you
							</h1>
							<p className='text-gray-500'>Please wait while we set everything up...</p>
						</div>
					</div>
				:	<div className='flex flex-col items-center gap-4'>
						<div className='h-12 w-12 text-red-500 flex items-center justify-center rounded-full bg-red-50'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={2}
								stroke='currentColor'
								className='w-6 h-6'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z'
								/>
							</svg>
						</div>
						<h1 className='text-xl font-bold text-gray-900'>Something went wrong</h1>
						<p className='text-gray-600'>{error}</p>
						<button
							onClick={() => window.location.reload()}
							className='mt-2 rounded-lg bg-blue-600 py-2.5 px-6 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm'
						>
							Try Again
						</button>
					</div>
				}
			</div>
		</main>
	);
}
