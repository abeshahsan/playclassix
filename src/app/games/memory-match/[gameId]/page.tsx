"use client";

import { fetchGamer } from "@/client-api/gamer";
import {
	Card,
	GameCompleteModal,
	GameError,
	GameStatusBar,
	LoadingGame,
	WaitingScreen,
} from "@/components/games/memory-match";
import { useCardClickHandler, useJoinOrFetchGame, useSetUpPusherClient } from "@/hooks/games/memory-match";
import { useMemoryMatchGameStore } from "@/store/games/memory-match";
import { MemoryMatchCard } from "@/types/games/memory-match";
import { useQuery } from "@tanstack/react-query";

export default function MemoryMatchMainPage() {
	const { gameRoom, isMyTurn, isProcessing, isWon, error } = useMemoryMatchGameStore();

	const { data: gamer } = useQuery({
		queryKey: ["gamer"],
		queryFn: async ({ signal }) => fetchGamer({ signal }),
	});

	useJoinOrFetchGame();
	useSetUpPusherClient();
	const handleCardClick = useCardClickHandler();

	if (!gameRoom) return <LoadingGame error={error} />;

	if (gameRoom.status === "waiting") return <WaitingScreen gameRoom={gameRoom} />;

	return (
		<div
			className='min-h-screen bg-bg-primary py-6 px-4 sm:px-6 lg:px-8'
			style={{
				backgroundImage: "url(/assets/ui/game-bg-tile-400.png)",
				backgroundSize: "400px 400px",
				backgroundRepeat: "repeat",
			}}
		>
			<div className='max-w-2xl mx-auto'>
				{/* Header */}
				<div className='flex items-center justify-between mb-6'>
					<div className='flex items-center gap-2'>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src='/assets/logos/logo-icon-only-64.png'
							alt=''
							className='w-7 h-7 rounded-md'
						/>
						<h1 className='text-xl font-bold text-text-primary'>Memory Match</h1>
					</div>
					<div className='w-16' />
				</div>

				<GameStatusBar
					gameRoom={gameRoom}
					gamer={gamer!}
					isMyTurn={isMyTurn}
					isWon={isWon}
				/>

				<GameError message={error} />

				{/* Card Grid */}
				<div
					className='grid grid-cols-4 gap-2 sm:gap-3'
					style={{ perspective: "1000px" }}
				>
					{gameRoom.cards.map((card: MemoryMatchCard) => (
						<Card
							key={card.id}
							card={card}
							isMyTurn={isMyTurn}
							isProcessing={isProcessing}
							handleCardClick={handleCardClick}
						/>
					))}
				</div>

				{/* Game Complete Modal */}
				{isWon && (
					<GameCompleteModal
						gameRoom={gameRoom}
						gamer={gamer!}
					/>
				)}
			</div>
		</div>
	);
}
