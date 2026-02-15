import { memo } from "react";
import { FiPlay } from "react-icons/fi";
import { MemoryMatchGameDifficulty } from "@/types/games/memory-match";
import { DifficultySelector } from "./difficulty-selector";

interface NewGameFormProps {
	difficulty: MemoryMatchGameDifficulty;
	onDifficultyChange: (difficulty: MemoryMatchGameDifficulty) => void;
	onStartGame: () => void;
}

function NewGameFormComponent({ difficulty, onDifficultyChange, onStartGame }: NewGameFormProps) {
	return (
		<div className='flex flex-col items-center gap-6'>
			{/* Game icon */}
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src='/assets/logos/logo-icon-only-128.png'
				alt='Memory Match'
				className='w-20 h-20 rounded-xl'
			/>
			<div className='space-y-2'>
				<h1 className='text-2xl font-bold text-text-primary'>New Memory Match Game</h1>
				<p className='text-text-secondary'>Choose your difficulty level</p>
			</div>

			{/* Difficulty Selection */}
			<DifficultySelector
				difficulty={difficulty}
				onDifficultyChange={onDifficultyChange}
			/>

			{/* Start Game Button */}
			<button
				onClick={onStartGame}
				className='mt-4 inline-flex items-center gap-2 rounded-xl bg-success py-3 px-8 text-base font-bold text-text-inverse hover:bg-success-hover transition-colors'
				style={{ boxShadow: "var(--shadow-success)" }}
			>
				<FiPlay className='w-5 h-5' />
				Start Game
			</button>
		</div>
	);
}

export const NewGameForm = memo(NewGameFormComponent);
