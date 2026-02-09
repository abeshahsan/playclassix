import { MemoryMatchCard as CardType } from "@/types";

type CardProps = {
	card: CardType;
	isMyTurn: boolean;
	isProcessing: boolean;
	handleCardClick: (cardId: number) => void;
};

export function Card({ card, isMyTurn, isProcessing, handleCardClick }: CardProps) {
	const canInteract = isMyTurn && !isProcessing && !card.isFlipped && !card.isMatched;

	return (
		<div
			key={card.id}
			onClick={() => handleCardClick(card.id)}
			className={`relative aspect-square cursor-pointer transition-all duration-500 transform-3d ${card.isFlipped || card.isMatched ? "rotate-y-180" : ""} ${canInteract ? "hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/10" : ""} ${!isMyTurn || isProcessing ? "pointer-events-none" : ""}`}
		>
			{/* Card Face-down (back design) */}
			<div className='absolute inset-0 rounded-xl shadow-md overflow-hidden backface-hidden hover:border-indigo-500/30 transition-colors'>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src="/assets/cards/card-back-200x280.webp"
					alt="Card"
					className="h-full w-full object-cover rounded-xl"
					draggable={false}
				/>
			</div>

			{/* Card Face-up (word) */}
			<div
				className={`absolute inset-0 rounded-xl shadow-lg flex items-center justify-center p-2 backface-hidden rotate-y-180 ${card.isMatched ? "bg-green-500/10 border-green-500/50 shadow-green-500/10" : "bg-slate-700 border-indigo-400/50"} border-2`}
			>
				<span
					className={`font-bold text-center wrap-break-word ${card.isMatched ? "text-green-400" : "text-white"} ${card.word.length > 8 ? "text-xs italic" : "text-sm sm:text-base"}`}
				>
					{card.word}
				</span>

				{/* Matched overlay */}
				{card.isMatched && (
					<img
						src="/assets/cards/card-matched-overlay-200x280.png"
						alt="Matched"
						className="absolute inset-0 h-full w-full rounded-xl pointer-events-none"
						draggable={false}
					/>
				)}
			</div>
		</div>
	);
}
