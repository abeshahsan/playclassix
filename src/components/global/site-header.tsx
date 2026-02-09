"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/global/theme-provider";
import { FiSun, FiMoon, FiMonitor, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

const themeOptions = [
	{ value: "light" as const, icon: FiSun, label: "Light" },
	{ value: "dark" as const, icon: FiMoon, label: "Dark" },
	{ value: "system" as const, icon: FiMonitor, label: "System" },
];

export function SiteHeader() {
	const pathname = usePathname();
	const { theme, setTheme } = useTheme();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const navLinks = [{ href: "/games", label: "Games" }];

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-[var(--header-bg)] border-[var(--header-border)] backdrop-blur-md">
			<div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-2.5">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src="/assets/logos/logo-icon-only-128.png"
						alt="PlayClassix"
						width={32}
						height={32}
						className="rounded-lg"
					/>
					<span className="hidden sm:inline-block text-lg font-bold tracking-tight text-[var(--text-primary)]">
						Play<span className="text-[var(--brand-text)]">Classix</span>
					</span>
				</Link>

				{/* Desktop nav */}
				<nav className="hidden sm:flex items-center gap-6">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={`text-sm font-medium transition-colors ${
								pathname === link.href || pathname.startsWith(link.href + "/")
									? "text-[var(--brand-text)]"
									: "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
							}`}
						>
							{link.label}
						</Link>
					))}
				</nav>

				{/* Right actions */}
				<div className="flex items-center gap-2">
					{/* Theme switcher */}
					<div className="flex items-center rounded-lg border border-[var(--surface-border)] bg-[var(--bg-secondary)] p-0.5">
						{themeOptions.map(({ value, icon: Icon, label }) => (
							<button
								key={value}
								onClick={() => setTheme(value)}
								title={label}
								className={`p-1.5 rounded-md transition-all ${
									theme === value
										? "bg-[var(--brand)] text-[var(--text-inverse)] shadow-sm"
										: "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
								}`}
							>
								<Icon className="w-3.5 h-3.5" />
							</button>
						))}
					</div>

					{/* Mobile menu button */}
					<button
						className="sm:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						{mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
					</button>
				</div>
			</div>

			{/* Mobile menu */}
			{mobileMenuOpen && (
				<div className="sm:hidden border-t border-[var(--surface-border)] bg-[var(--bg-elevated)]">
					<nav className="px-4 py-3 space-y-1">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setMobileMenuOpen(false)}
								className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
									pathname === link.href || pathname.startsWith(link.href + "/")
										? "bg-[var(--brand-muted)] text-[var(--brand-text)]"
										: "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
								}`}
							>
								{link.label}
							</Link>
						))}
					</nav>
				</div>
			)}
		</header>
	);
}
