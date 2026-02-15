import { memo } from "react";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";

interface GameCreationErrorProps {
	error: string;
	onRetry: () => void;
}

function GameCreationErrorComponent({ error, onRetry }: GameCreationErrorProps) {
	return (
		<div className='flex flex-col items-center gap-4'>
			<div className='h-12 w-12 flex items-center justify-center rounded-full bg-danger-muted'>
				<FiAlertCircle className='w-6 h-6 text-danger' />
			</div>
			<h1 className='text-xl font-bold text-text-primary'>Something went wrong</h1>
			<p className='text-text-secondary'>{error}</p>
			<button
				onClick={onRetry}
				className='mt-2 inline-flex items-center gap-2 rounded-xl bg-brand py-2.5 px-6 text-sm font-semibold text-text-inverse hover:bg-brand-hover transition-colors'
				style={{ boxShadow: "var(--shadow-brand)" }}
			>
				<FiRefreshCw className='w-4 h-4' />
				Try Again
			</button>
		</div>
	);
}

export const GameCreationError = memo(GameCreationErrorComponent);
