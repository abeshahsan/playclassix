import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Memory Match",
	description: "Test your memory in this classic card matching game. Find all matching pairs to win!",
};

export default function MemoryMatchLayout({ children }: { children: React.ReactNode }) {
	return children;
}
