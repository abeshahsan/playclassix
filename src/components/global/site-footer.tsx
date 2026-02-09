import Link from "next/link";

export function SiteFooter() {
	const year = new Date().getFullYear();

	return (
		<footer className="border-t border-[var(--surface-border)] bg-[var(--bg-secondary)]">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
					{/* Logo + tagline */}
					<div className="flex items-center gap-2">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src="/assets/logos/logo-icon-only-64.png"
							alt="PlayClassix"
							className="w-6 h-6 rounded"
						/>
						<span className="text-sm font-semibold text-[var(--text-primary)]">
							Play<span className="text-[var(--brand-text)]">Classix</span>
						</span>
					</div>

					{/* Links */}
					<nav className="flex items-center gap-6">
						<Link
							href="/games"
							className="text-xs font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
						>
							Games
						</Link>
					</nav>

					{/* Copyright */}
					<p className="text-xs text-[var(--text-tertiary)]">
						&copy; {year} PlayClassix. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
