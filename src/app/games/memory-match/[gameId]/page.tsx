"use client";

import { Card } from "@/components/games/memory-match/card";
import { GameError } from "@/components/games/memory-match/error";
import { FinalScores } from "@/components/games/memory-match/final-scores";
import { WaitingScreen } from "@/components/games/memory-match/waiting-screen";
import { Gamer, MemoryMatchGameRoom, Player } from "@/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";

export default function MemoryMatchPage() {
	const params = useParams();
	const gameId = params.gameId as string;

	const [gameRoom, setGameRoom] = useState<MemoryMatchGameRoom | null>(null);
	const [isWon, setIsWon] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [gamer, setGamer] = useState<Gamer | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isMyTurn, setIsMyTurn] = useState(false);

	// Fetch current user
	useEffect(() => {
		async function fetchUser() {
			try {
				const {
					uid,
					username,
				}: {
					uid: string;
					username: string;
				} = await fetch("/api/me", { method: "GET" }).then((res) => res.json());

				setGamer({ id: uid, ign: username });
			} catch (err) {
				console.error("Failed to fetch user info:", err);
				setError("Failed to fetch user info");
			}
		}

		fetchUser();
	}, []);

	// Join or fetch game state
	useEffect(() => {
		if (!gamer) return;

		async function joinOrFetchGame() {
			try {
				// Try to join the game via POST
				let joinResponse = await fetch("/api/games/memory-match/join-game", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ gameId }),
				});

				// If POST fails, try GET as fallback
				if (!joinResponse.ok) {
					console.warn("POST join-game failed, trying GET fallback");
					joinResponse = await fetch(`/api/games/memory-match/join-game?gameId=${gameId}`, {
						method: "GET",
					});
				}

				if (!joinResponse.ok) {
					throw new Error("Failed to join game");
				}

				const { game }: { game: MemoryMatchGameRoom } = await joinResponse.json();

				if (!game) {
					throw new Error("No game data received");
				}

				setGameRoom(game);
				setIsMyTurn(game.currentTurn === gamer?.id);

				if (game.status === "completed") {
					setIsWon(true);
				}
			} catch (err) {
				console.error("Error joining or fetching game:", err);
				setError("Failed to join game. Game may not exist or is full.");
			}
		}

		joinOrFetchGame();
	}, [gamer, gameId]);

	const handleCardClick = (id: number) => {
		if (!gamer || !gameRoom) return;

		// Check if it's player's turn
		if (gameRoom.currentTurn !== gamer.id) {
			setError("It's not your turn!");
			setTimeout(() => setError(null), 2000);
			return;
		}

		// Check if game is in progress
		if (gameRoom.status !== "in-progress") {
			setError("Game is not in progress");
			setTimeout(() => setError(null), 2000);
			return;
		}

		// Check if card can be flipped
		const card = gameRoom.cards[id];
		if (card.isFlipped || card.isMatched || isProcessing) {
			return;
		}

		fetch("/api/games/memory-match/move", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				gameId,
				cardId: id,
				userId: gamer.id,
			}),
		}).catch((err) => {
			console.error("Failed to make move:", err);
			setError("Failed to make move");
			setTimeout(() => setError(null), 2000);
		});
	};

	// Handle Pusher events
	useEffect(() => {
		console.log("[Pusher] Initializing for game:", gameId);

		const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
			cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
			forceTLS: true,
		});

		const channel = pusherClient.subscribe(`memory-match-${gameId}`);

		channel.bind("pusher:subscription_succeeded", () => {
			console.log("[Pusher] Successfully subscribed to channel:", `memory-match-${gameId}`);
		});

		channel.bind("pusher:subscription_error", (error: any) => {
			console.error("[Pusher] Subscription error:", error);
		});

		// Player joined event
		channel.bind("player-joined", (data: { player: Player; game: MemoryMatchGameRoom }) => {
			console.log("[Pusher] Player joined:", data);
			setGameRoom(data.game);
		});

		// Game started event
		channel.bind("game-started", (data: { game: MemoryMatchGameRoom }) => {
			console.log("[Pusher] Game started:", data);
			setGameRoom(data.game);
		});

		// Card flipped event - update immediately
		channel.bind("card-flipped", (data: { cardId: number; userId: string; game: MemoryMatchGameRoom }) => {
			console.log("[Pusher] Card flipped:", data.cardId, "by user:", data.userId);

			const allFlilppedCards = data.game.cards.filter((c) => c.isFlipped);
			console.log("[Pusher] Total flipped cards now:", allFlilppedCards);

			// Update game state
			setGameRoom(data.game);
		});

		// Match result event - handle after both cards are flipped
		channel.bind(
			"match-result",
			async (data: {
				matchFound: boolean;
				shouldSwitchTurn: boolean;
				game: MemoryMatchGameRoom;
				firstCardId: number;
				secondCardId: number;
			}) => {
				console.log("[Pusher] Match result:", {
					matchFound: data.matchFound,
					firstCard: data.firstCardId,
					secondCard: data.secondCardId,
				});

				const { game, matchFound } = data;

				// setGameRoom(game);

				setIsMyTurn(game.currentTurn === gamer?.id);
				setIsProcessing(true);

				if (matchFound) {
					// Match found - cards stay flipped and matched
					setTimeout(() => {
						setIsProcessing(false);

						// Check if game is complete
						if (game.status === "completed") {
							setIsWon(true);
						}
					}, 500);
				} else {
					// No match - flip cards back after delay
					setTimeout(() => {
						setGameRoom((prevGame) => {
							if (!prevGame) return prevGame;
							const updatedCards = [...prevGame.cards];
							updatedCards[data.firstCardId].isFlipped = false;
							updatedCards[data.secondCardId].isFlipped = false;
							return { ...prevGame, cards: updatedCards, currentTurn: game.currentTurn };
						});
						setIsProcessing(false);
					}, 1000);
				}
			},
		);

		return () => {
			pusherClient.unsubscribe(`memory-match-${gameId}`);
			pusherClient.disconnect();
		};
	}, [gameId, gamer]);

	// Waiting for the game to load
	if (!gameRoom) {
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

	if (gameRoom.status === "waiting") {
		return <WaitingScreen gameRoom={gameRoom} />;
	}

	// main game screen
	// render if gameRoom is loaded and status is in-progress or completed
	return (
		<div className='min-h-screen bg-linear-to-br from-purple-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-950 py-8 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-2xl mx-auto'>
				<div className='text-center mb-4'>
					<h1 className='text-3xl font-extrabold text-slate-900 dark:text-white'>Memory Match</h1>
					<p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>Match the pairs of words!</p>
				</div>

				{/* Game Status Bar */}


				<GameError message={error} />

				<div className='grid grid-cols-4 gap-2 sm:gap-4'>
					{gameRoom.cards.map((card) => (
						<Card
							isMyTurn={isMyTurn}
							isProcessing={isProcessing}
							key={card.id}
							card={card}
							handleCardClick={handleCardClick}
						/>
					))}
				</div>

				{isWon && (
					<div className='mt-8 text-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-2 border-green-500 animate-in fade-in zoom-in duration-300'>
						<h2 className='text-2xl font-bold text-slate-900 dark:text-white mb-2'>Game Complete! </h2>
						<p className='text-sm text-slate-600 dark:text-slate-400 mb-4'>Total moves: {gameRoom.moves}</p>

						<FinalScores
							players={gameRoom.players}
							gamer={gamer!}
						/>

						<Link
							href='/games/memory-match/new-game'
							className='inline-block px-8 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg'
						>
							Play Again
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
