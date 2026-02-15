"use client";

import { GameCreationError, GameCreationLoading, NewGameForm } from "@/components/games/memory-match";
import { useMemoryMatchGameStore } from "@/store/games/memory-match";
import { MemoryMatchGameDifficulty } from "@/types/games/memory-match";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCreateGame } from "@/hooks/games/memory-match/useGameMutations";

export default function NewGamePage() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [difficulty, setDifficulty] = useState<MemoryMatchGameDifficulty>("medium");
	const { resetGame } = useMemoryMatchGameStore();
	const createGameMutation = useCreateGame();

	useEffect(() => {
		resetGame();
	}, [resetGame]);

	async function handleCreateGame() {
		setError(null);

		try {
			const gameId = await createGameMutation.mutateAsync(difficulty);
			router.push(`/games/memory-match/${gameId}`);
		} catch (err: any) {
			setError(err.message || "An unexpected error occurred.");
		}
	}

	return (
		<main className='flex items-center justify-center min-h-screen bg-bg-primary'>
			<div
				className='w-full max-w-md p-8 bg-surface backdrop-blur-sm rounded-2xl border border-surface-border mx-4 text-center'
				style={{ boxShadow: "var(--shadow-xl)" }}
			>
				{!createGameMutation.isPending && !error ?
					<NewGameForm
						difficulty={difficulty}
						onDifficultyChange={setDifficulty}
						onStartGame={handleCreateGame}
					/>
				: createGameMutation.isPending ?
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
