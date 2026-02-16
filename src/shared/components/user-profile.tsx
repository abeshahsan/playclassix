"use client";

import { fetchGamer } from "@/shared/hooks/useGamer";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";

function UserProfileComponent() {
	const { data: gamer } = useQuery({
		queryKey: ["gamer"],
		queryFn: async ({ signal }) => fetchGamer({ signal }),
	});

	if (!gamer) {
		return null;
	}

	return (
		<div className='flex items-center gap-2'>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={gamer.avatar}
				alt={gamer.ign}
				className='w-8 h-8 rounded-full border-2 border-surface-border'
			/>
			<span className='text-sm font-medium text-text-primary truncate max-w-30'>{gamer.ign}</span>
		</div>
	);
}

export const UserProfile = memo(UserProfileComponent);
