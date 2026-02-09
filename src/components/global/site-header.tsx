"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
	const pathname = usePathname();
	const isHome = pathname === "/" || pathname === "/games";

	return (
		<header className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md">
			<div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Logo — full on desktop, icon-only on mobile */}
				<Link href="/games" className="flex items-center gap-2.5">
					{/* Icon-only (always visible, acts as mobile logo) */}
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src="/assets/logos/logo-icon-only-128.png"
						alt="PlayClassix"
						width={32}
						height={32}
						className="rounded-lg"
					/>
					{/* Full logo text — hidden on small screens */}
					<span className="hidden sm:inline-block text-lg font-bold tracking-tight text-white">
						Play<span className="text-indigo-400">Classix</span>
					</span>
				</Link>

				{/* Nav links */}
				<nav className="flex items-center gap-4">
					<Link
						href="/games"
						className={`text-sm font-medium transition-colors ${
							isHome
								? "text-white"
								: "text-slate-400 hover:text-white"
						}`}
					>
						Games
					</Link>
				</nav>
			</div>
		</header>
	);
}
