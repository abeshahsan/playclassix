"use client";

import { MemoryMatchGameRoom, Gamer } from "@/types/games/memory-match";
import { memo } from "react";
import { FiAward, FiX, FiMinus, FiUsers } from "react-icons/fi";
import Link from "next/link";
import { usePlayerStats } from "@/hooks/games/memory-match/useGameQueries";

interface GameCompleteModalProps {
	gameRoom: MemoryMatchGameRoom;
	gamer: Gamer;
}

function GameCompleteModalComponent({ gameRoom, gamer }: GameCompleteModalProps) {
	const sortedPlayers = [...gameRoom.players].sort((a, b) => b.score - a.score);
	const winner = sortedPlayers[0].score > sortedPlayers[1]?.score ? sortedPlayers[0] : null;
	const isDraw = sortedPlayers[0].score === sortedPlayers[1]?.score;

	const [p1, p2] = gameRoom.players;
	const { data: stats, isLoading: loading } = usePlayerStats(
		p1?.id || "",
		p2?.id || "",
		gameRoom.players.length === 2
	);

	const getPlayerStats = (playerId: string) => {
		if (!stats) return null;
		if (playerId === stats.player1Id) return stats.player1Stats;
		if (playerId === stats.player2Id) return stats.player2Stats;
		return null;
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4'>
			<div className='bg-surface rounded-2xl border border-surface-border max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl'>
				<div className='p-6 space-y-6'>
					{/* Header */}
					<div className='text-center space-y-2'>
						<div className='flex justify-center mb-3'>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={
									isDraw ? "/assets/ui/medals/medal-bronze-64.png"
									: "/assets/ui/medals/medal-gold-64.png"
								}
								alt='Trophy'
								className='w-16 h-16'
							/>
						</div>
						<h2 className='text-3xl font-bold text-text-primary'>
							{isDraw ? "It's a Draw!" : `${winner?.username} Wins!`}
						</h2>
						<p className='text-text-secondary'>
							{isDraw ? 
								"Both players scored equally!"
							:	`Congratulations ${winner?.username}!`}
						</p>
					</div>

					{/* Final Scores */}
					<div className='space-y-2'>
						<h3 className='text-sm font-semibold text-text-secondary text-center mb-3'>
							Final Scores
						</h3>
						{sortedPlayers.map((player, index) => {
							const isMe = gamer.id === player.id;
							const isWinner = !isDraw && index === 0;

							return (
								<div
									key={player.id}
									className={`p-3 rounded-lg ${
										isWinner
											? "bg-warning-muted border-2 border-warning/50"
											: "bg-bg-tertiary border border-surface-border"
									}`}
								>
									<div className='flex items-center gap-3'>
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img 
											src={player.avatar} 
											alt={player.username}
											className='w-10 h-10 rounded-full border-2 border-surface-border'
										/>
										<div className='flex-1 flex justify-between items-center'>
											<span className='font-semibold text-text-primary inline-flex items-center gap-2'>
												{index === 0 && !isDraw && (
													/* eslint-disable-next-line @next/next/no-img-element */
													<img
														src='/assets/ui/medals/medal-gold-64.png'
														alt='#1'
														className='w-6 h-6'
													/>
												)}
												{index === 1 && !isDraw && (
													/* eslint-disable-next-line @next/next/no-img-element */
													<img
														src='/assets/ui/medals/medal-silver-64.png'
														alt='#2'
														className='w-6 h-6'
													/>
												)}
												{player.username} {isMe && "(You)"}
											</span>
											<span className='font-bold text-lg text-brand-text'>
												{player.score} {player.score === 1 ? "match" : "matches"}
											</span>
										</div>
									</div>
								</div>
							);
						})}
					</div>

					{/* Session Stats */}
					{!loading && stats && stats.gamesPlayed > 0 && (
						<div className='bg-bg-tertiary/50 backdrop-blur-sm rounded-xl p-4 border border-surface-border'>
							<div className='flex items-center justify-center gap-2 mb-4'>
								<FiUsers className='w-4 h-4 text-text-secondary' />
								<h3 className='text-sm font-semibold text-text-secondary'>
									Session Stats Together
								</h3>
							</div>

							{/* Stats for both players */}
							<div className='space-y-4'>
								{gameRoom.players.map((player) => {
									const playerStats = getPlayerStats(player.id);
									if (!playerStats) return null;

									return (
										<div key={player.id} className='space-y-2'>
											<div className='flex items-center gap-2'>
												{/* eslint-disable-next-line @next/next/no-img-element */}
												<img 
													src={player.avatar} 
													alt={player.username}
													className='w-6 h-6 rounded-full border border-surface-border'
												/>
												<p className='text-xs font-semibold text-text-primary'>
													{player.username} {player.id === gamer.id && "(You)"}
												</p>
											</div>
											<div className='flex justify-around gap-4'>
												<div className='text-center'>
													<div className='flex items-center justify-center gap-1 mb-1'>
														<FiAward className='w-3 h-3 text-success' />
														<span className='text-xl font-bold text-text-primary'>
															{playerStats.wins}
														</span>
													</div>
													<p className='text-xs text-text-secondary'>Wins</p>
												</div>
												<div className='text-center'>
													<div className='flex items-center justify-center gap-1 mb-1'>
														<FiX className='w-3 h-3 text-danger' />
														<span className='text-xl font-bold text-text-primary'>
															{playerStats.losses}
														</span>
													</div>
													<p className='text-xs text-text-secondary'>Losses</p>
												</div>
												<div className='text-center'>
													<div className='flex items-center justify-center gap-1 mb-1'>
														<FiMinus className='w-3 h-3 text-text-secondary' />
														<span className='text-xl font-bold text-text-primary'>
															{playerStats.draws}
														</span>
													</div>
													<p className='text-xs text-text-secondary'>Draws</p>
												</div>
											</div>
										</div>
									);
								})}
							</div>

							<p className='text-xs text-text-tertiary text-center mt-4'>
								{stats.gamesPlayed} {stats.gamesPlayed === 1 ? "game" : "games"} played together
							</p>
						</div>
					)}

					{/* Action Buttons */}
					<div className='space-y-2'>
						<Link
							href='/games/memory-match/new-game'
							className='w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand py-3 px-6 text-sm font-semibold text-text-inverse hover:bg-brand-hover transition-colors'
							style={{ boxShadow: "var(--shadow-brand)" }}
						>
							Play Again Together
						</Link>
						<Link
							href='/games'
							className='w-full inline-flex items-center justify-center gap-2 rounded-xl bg-surface-secondary py-3 px-6 text-sm font-semibold text-text-primary hover:bg-surface-secondary/80 transition-colors border border-surface-border'
						>
							Back to Games
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export const GameCompleteModal = memo(GameCompleteModalComponent);
