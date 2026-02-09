import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "New Memory Match Game",
	description: "Creating a new Memory Match game. Share the link with a friend to play together!",
};

export default function NewGameLayout({ children }: { children: React.ReactNode }) {
	return children;
}
