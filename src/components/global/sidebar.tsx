"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAllGames } from "@/core/game.registry";
import { FiGrid, FiHome } from "react-icons/fi";
import { useGamerStore } from "@/store/gamer";
import { useEffect } from "react";

const navItems = [
	{ href: "/", label: "Home", icon: FiHome },
	{ href: "/games", label: "All Games", icon: FiGrid },
];

export function Sidebar() {
	const pathname = usePathname();
	const games = getAllGames();
	const { gamer, fetchGamer } = useGamerStore();

	useEffect(() => {
		if (!gamer) {
			fetchGamer();
		}
	}, [gamer, fetchGamer]);

	return (
		<aside className="hidden lg:flex lg:w-60 flex-col fixed top-14 bottom-0 left-0 z-40 border-r border-sidebar-border bg-sidebar-bg overflow-y-auto">
			{/* User Profile Section */}
			{gamer && (
				<div className="p-4 border-b border-sidebar-border">
					<div className="flex items-center gap-3">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img 
							src={gamer.avatar} 
							alt={gamer.ign}
							className="w-12 h-12 rounded-full border-2 border-surface-border"
						/>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-semibold text-text-primary truncate">
								{gamer.ign}
							</p>
							<p className="text-xs text-text-tertiary">
								Player
							</p>
						</div>
					</div>
				</div>
			)}

			<nav className="flex-1 px-3 py-4 space-y-1">
				{navItems.map((item) => {
					const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
					return (
						<Link
							key={item.href}
							href={item.href}
							className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
								isActive
									? "bg-sidebar-active text-sidebar-text-active"
									: "text-sidebar-text hover:bg-sidebar-hover hover:text-text-primary"
							}`}
						>
							<item.icon className="w-4 h-4 shrink-0" />
							{item.label}
						</Link>
					);
				})}

				{/* Game list */}
				<div className="pt-4 mt-4 border-t border-sidebar-border">
					<p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
						Games
					</p>
					{games.map((game) => {
						const gameHref = `/games/${game.slug}/new-game`;
						const isActive = pathname.includes(`/games/${game.slug}`);
						return (
							<Link
								key={game.id}
								href={game.iscomPleted ? gameHref : "#"}
								className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
									isActive
										? "bg-sidebar-active text-sidebar-text-active"
										: game.iscomPleted
										? "text-sidebar-text hover:bg-sidebar-hover hover:text-text-primary"
										: "text-text-tertiary cursor-not-allowed"
								}`}
							>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={game.icon}
									alt=""
									className="w-5 h-5 rounded shrink-0"
								/>
								<span className="truncate">{game.name}</span>
								{!game.iscomPleted && (
									<span className="ml-auto text-[10px] font-semibold uppercase text-text-tertiary bg-bg-tertiary px-1.5 py-0.5 rounded">
										Soon
									</span>
								)}
							</Link>
						);
					})}
				</div>
			</nav>
		</aside>
	);
}
