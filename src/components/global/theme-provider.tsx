"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
	theme: Theme;
	resolvedTheme: ResolvedTheme;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "playclassix-theme";

function getSystemTheme(): ResolvedTheme {
	if (typeof window === "undefined") return "dark";
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(theme: Theme): ResolvedTheme {
	return theme === "system" ? getSystemTheme() : theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = useState<Theme>("system");
	const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");
	const [mounted, setMounted] = useState(false);

	// On mount: read stored preference
	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
		const initial = stored && ["light", "dark", "system"].includes(stored) ? stored : "system";
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setThemeState(initial);
		setResolvedTheme(resolveTheme(initial));
		setMounted(true);
	}, []);

	// Apply .dark class to <html> whenever resolvedTheme changes
	useEffect(() => {
		if (!mounted) return;
		const root = document.documentElement;
		if (resolvedTheme === "dark") {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
	}, [resolvedTheme, mounted]);

	// Listen for system theme changes when in "system" mode
	useEffect(() => {
		if (!mounted || theme !== "system") return;
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const handler = () => setResolvedTheme(getSystemTheme());
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, [theme, mounted]);

	const setTheme = useCallback((newTheme: Theme) => {
		setThemeState(newTheme);
		setResolvedTheme(resolveTheme(newTheme));
		localStorage.setItem(STORAGE_KEY, newTheme);
	}, []);

	// Prevent flash: render children with a transparent wrapper until mounted
	// The initial HTML will inherit server styles; once mounted, theme kicks in
	return (
		<ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
			<div style={{ visibility: mounted ? "visible" : "hidden" }}>
				{children}
			</div>
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
	return ctx;
}
