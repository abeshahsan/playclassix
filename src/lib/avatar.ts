/**
 * Returns a random avatar number (1-10)
 */
export function getRandomAvatarNumber(): number {
	return Math.floor(Math.random() * 10) + 1;
}

/**
 * Returns the avatar path for a given avatar number
 */
export function getAvatarPath(avatarNumber: number): string {
	return `/assets/avatars/avatar-${avatarNumber}.svg`;
}

/**
 * Returns a random avatar path from the available avatars
 * Avatars are numbered 1-10
 */
export function getRandomAvatar(): string {
	return getAvatarPath(getRandomAvatarNumber());
}

/**
 * Returns all available avatar paths
 */
export function getAllAvatars(): string[] {
	return Array.from({ length: 10 }, (_, i) => getAvatarPath(i + 1));
}
