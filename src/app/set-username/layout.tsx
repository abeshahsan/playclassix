import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Set Username",
	description: "Choose your username to start playing games on PlayClassix.",
};

export default function SetUsernameLayout({ children }: { children: React.ReactNode }) {
	return children;
}
