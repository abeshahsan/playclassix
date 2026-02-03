"use client";

import { Card } from "@/src/app/games/types";
import { Gamer } from "@/src/types";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";

export default function MemoryMatchPage() {
	const [cards, setCards] = useState<Card[]>([]);
	const [flippedCards, setFlippedCards] = useState<number[]>([]);
	const [moves, setMoves] = useState(0);
	const [isWon, setIsWon] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [gamer, setGamer] = useState<Gamer | null>(null);

	const getFreshCards = useCallback(() => {
		fetch("/api/games/memory-match/generate-cards", { method: "POST" })
			.then((res) => res.json())
			.then((data) => {
				setCards(data.cards);
			});
	}, []);

	const stateRef = useRef({ cards, flippedCards, isProcessing, isWon });
	useEffect(() => {
		stateRef.current = { cards, flippedCards, isProcessing, isWon };
	});

	useEffect(() => {
		async function fetchUser() {
			const {
				uid,
				username,
			}: {
				uid: string;
				username: string;
			} = await fetch("/api/me", { method: "GET" }).then((res) => res.json());

			setGamer({ id: uid, ign: username });
		}

		fetchUser();
	}, []);

	const initializeGame = useCallback(() => {
		getFreshCards();
		setFlippedCards([]);
		setMoves(0);
		setIsWon(false);
		setIsProcessing(false);
	}, [getFreshCards]);

	useEffect(() => {
		(() => {
			initializeGame();
		})();
	}, [initializeGame]);

	const handleCardClick = (id: number) => {
		fetch("/api/games/memory-match/move", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				gameId: "local-game",
				cardId: id,
				userId: gamer?.id,
			}),
		});
	};

	const checkMatch = useCallback((flipped: number[]) => {
		setIsProcessing(true);
		const [first, second] = flipped;
		const currentCards = stateRef.current.cards;

		if (currentCards[first].word === currentCards[second].word) {
			setTimeout(() => {
				setCards((prev) => {
					const newCards = [...prev];
					newCards[first].isMatched = true;
					newCards[second].isMatched = true;
					if (newCards.every((card) => card.isMatched)) {
						setIsWon(true);
					}
					return newCards;
				});
				setFlippedCards([]);
				setIsProcessing(false);
			}, 500);
		} else {
			setTimeout(() => {
				setCards((prev) => {
					const newCards = [...prev];
					newCards[first].isFlipped = false;
					newCards[second].isFlipped = false;
					return newCards;
				});
				setFlippedCards([]);
				setIsProcessing(false);
			}, 1000);
		}
	}, []);

	useEffect(() => {
		const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
			cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
			forceTLS: true,
		});

		const channel = pusherClient.subscribe("memory-match-local-game");
		channel.bind("player-move", (data: { cardId: number; userId: string }) => {
			const { cards: currentCards, flippedCards: currentFlipped, isProcessing, isWon } = stateRef.current;

			if (isProcessing || isWon) return;
			if (currentCards[data.cardId].isFlipped || currentCards[data.cardId].isMatched) return;
			if (currentFlipped.length === 2) return;

			setCards((prev) => {
				const newCards = [...prev];
				newCards[data.cardId].isFlipped = true;
				return newCards;
			});

			const newFlipped = [...currentFlipped, data.cardId];
			setFlippedCards(newFlipped);
			if (newFlipped.length === 2) {
				setMoves((m) => m + 1);
				checkMatch(newFlipped);
			}
		});

		return () => {
			pusherClient.unsubscribe("memory-match-local-game");
			pusherClient.disconnect();
		};
	}, [checkMatch]);

	return (
		<div className='min-h-screen bg-linear-to-br from-purple-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-950 py-8 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-2xl mx-auto'>
				<div className='flex justify-between items-center mb-6'>
					<Link
						href='/games'
						className='flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500'
					>
						<svg
							className='mr-2 h-4 w-4'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M15 19l-7-7 7-7'
							/>
						</svg>
						Back to Games
					</Link>
					<div className='flex gap-4 items-center'>
						<span className='text-lg font-bold text-slate-700 dark:text-slate-300'>Moves: {moves}</span>
						<button
							onClick={initializeGame}
							className='px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 transition-colors shadow-md'
						>
							Reset Game
						</button>
					</div>
				</div>

				<div className='text-center mb-6'>
					<h1 className='text-3xl font-extrabold text-slate-900 dark:text-white'>Memory Match</h1>
					<p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>Match the pairs of words!</p>
				</div>

				<div className='grid grid-cols-4 gap-2 sm:gap-4'>
					{cards.map((card) => (
						<div
							key={card.id}
							onClick={() => handleCardClick(card.id)}
							className={`
								relative aspect-square cursor-pointer transition-all duration-500 transform-3d
								${card.isFlipped || card.isMatched ? "rotate-y-180" : ""}
							`}
						>
							{/* Card Front (Hidden) */}
							<div className='absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-md border-2 border-indigo-100 dark:border-slate-700 flex items-center justify-center backface-hidden'>
								<span className='text-2xl font-bold text-indigo-200 dark:text-slate-700'>?</span>
							</div>

							{/* Card Back (Word) */}
							<div
								className={`
								absolute inset-0 rounded-lg shadow-lg flex items-center justify-center p-2 backface-hidden rotate-y-180
								${card.isMatched ? "bg-green-100 dark:bg-green-900/30 border-green-500 shadow-green-100/50" : "bg-white dark:bg-slate-700 border-indigo-400"}
								border-2
							`}
							>
								<span
									className={`
									font-bold text-center wrap-break-word
									${card.isMatched ? "text-green-700 dark:text-green-400" : "text-slate-900 dark:text-white"}
									${card.word.length > 8 ? "text-xs italic" : "text-sm sm:text-base"}
								`}
								>
									{card.word}
								</span>
							</div>
						</div>
					))}
				</div>

				{isWon && (
					<div className='mt-8 text-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-2 border-green-500 animate-in fade-in zoom-in duration-300'>
						<h2 className='text-2xl font-bold text-slate-900 dark:text-white mb-2'>Congratulations! 🎉</h2>
						<p className='text-sm text-slate-600 dark:text-slate-400 mb-4'>
							You completed the game in {moves} moves!
						</p>
						<button
							onClick={initializeGame}
							className='px-8 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg'
						>
							Play Again
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
