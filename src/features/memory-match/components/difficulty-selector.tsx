import { memo } from "react";
import { MemoryMatchGameDifficulty } from "@/features/memory-match/types";

interface DifficultySelectorProps {
	difficulty: MemoryMatchGameDifficulty;
	onDifficultyChange: (difficulty: MemoryMatchGameDifficulty) => void;
	disabled?: boolean;
}

function DifficultySelectorComponent({ difficulty, onDifficultyChange, disabled = false }: DifficultySelectorProps) {
	const difficulties: MemoryMatchGameDifficulty[] = ["easy", "medium", "hard"];

	return (
		<div className='w-full space-y-3'>
			{difficulties.map((level) => (
				<button
					key={level}
					onClick={() => onDifficultyChange(level)}
					disabled={disabled}
					className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
						difficulty === level
							? "bg-brand text-text-inverse border-2 border-brand"
							: "bg-surface-secondary text-text-primary border-2 border-surface-border hover:border-brand-muted"
					} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
					style={difficulty === level ? { boxShadow: "var(--shadow-brand)" } : {}}
				>
					{level.charAt(0).toUpperCase() + level.slice(1)}
				</button>
			))}
		</div>
	);
}

export const DifficultySelector = memo(DifficultySelectorComponent);
