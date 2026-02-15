"use client";

import { GameCreationError, GameCreationLoading, NewGameForm } from "@/components/games/memory-match";
import { useMemoryMatchGameStore } from "@/store/games/memory-match";
import { MemoryMatchGameDifficulty } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewGamePage() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [difficulty, setDifficulty] = useState<MemoryMatchGameDifficulty>("medium");
	const [isCreatingGame, setIsCreatingGame] = useState(false);
	const { resetGame, createNewGame } = useMemoryMatchGameStore();

	useEffect(() => {
		// Reset any existing game state when starting a new game
		resetGame();
	}, [resetGame]);

	async function handleCreateGame() {
		setIsCreatingGame(true);
		setError(null);

		try {
			const gameId = await createNewGame(difficulty);
			router.push(`/games/memory-match/${gameId}`);
		} catch (err: any) {
			setError(err.message || "An unexpected error occurred.");
			setIsCreatingGame(false);
		}
	}

	return (
		<main className='flex items-center justify-center min-h-screen bg-bg-primary'>
			<div
				className='w-full max-w-md p-8 bg-surface backdrop-blur-sm rounded-2xl border border-surface-border mx-4 text-center'
				style={{ boxShadow: "var(--shadow-xl)" }}
			>
				{!isCreatingGame && !error ?
					<NewGameForm
						difficulty={difficulty}
						onDifficultyChange={setDifficulty}
						onStartGame={handleCreateGame}
					/>
				: isCreatingGame ?
					<GameCreationLoading />
				:	<GameCreationError
						error={error!}
						onRetry={handleCreateGame}
					/>
				}
			</div>
		</main>
	);
}
