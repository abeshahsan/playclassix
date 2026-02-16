"use client";

import { fetchGamer } from "@/shared/hooks/useGamer";
import {
	Card,
	GameCompleteModal,
	GameError,
	GameStatusBar,
	LoadingGame,
	WaitingScreen,
} from "@/features/memory-match/components";
import { useCardClickHandler, useJoinOrFetchGame, useSetUpPusherClient } from "@/features/memory-match/hooks";
import { useMemoryMatchGameStore } from "@/features/memory-match/store";
import { MemoryMatchCard } from "@/features/memory-match/types";
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

	// Dynamic styling based on number of cards
	const cardCount = gameRoom.cards.length;
	const getLayoutClasses = () => {
		if (cardCount <= 16) {
			// Easy: 16 cards (4x4)
			return {
				container: "max-w-xl",
				grid: "gap-2 sm:gap-3",
				padding: "py-4",
			};
		} else if (cardCount <= 24) {
			// Medium: 24 cards (4x6)
			return {
				container: "max-w-md",
				grid: "gap-1.5 sm:gap-2",
				padding: "py-3",
			};
		} else {
			// Hard: 32 cards (4x8)
			return {
				container: "max-w-sm",
				grid: "gap-1 sm:gap-1.5",
				padding: "py-2",
			};
		}
	};

	const layout = getLayoutClasses();

	return (
		<div
			className={`min-h-screen bg-bg-primary ${layout.padding} px-3 sm:px-4`}
			style={{
				backgroundImage: "url(/assets/ui/game-bg-tile-400.png)",
				backgroundSize: "400px 400px",
				backgroundRepeat: "repeat",
			}}
		>
			<div className={`${layout.container} mx-auto`}>
				{/* Header */}
				<div className='flex items-center justify-between mb-3 sm:mb-4'>
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
					className={`grid grid-cols-4 ${layout.grid}`}
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
