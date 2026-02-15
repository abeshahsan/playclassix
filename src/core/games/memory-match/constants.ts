export const MEMORY_MATCH_GAME_KEY_PREFIX = "game:memory-match:";
export const MEMORY_MATCH_STATS_KEY_PREFIX = "player-stats:";
export const MEMORY_MATCH_GAME_TTL = 60 * 60 * 2;
export const MEMORY_MATCH_STATS_TTL = 60 * 60 * 8;

export const MEMORY_MATCH_CARD_SLUGS = [
	"apple",
	"balloon",
	"butterfly",
	"cat",
	"circus",
	"cupcake",
	"diamond",
	"dice",
	"fire",
	"flower",
	"fox",
	"lightning",
	"moon",
	"music",
	"octopus",
	"panda",
	"parrot",
	"pizza",
	"puzzle",
	"rainbow",
	"rocket",
	"star",
	"target",
	"unicorn",
];

export const MEMORY_MATCH_DIFFICULTY_CARD_COUNT = {
	easy: 8,
	medium: 12,
	hard: 16,
} as const;

export const MEMORY_MATCH_MAX_PLAYERS = 2;
export const MEMORY_MATCH_CLEANUP_INTERVAL = 30 * 60 * 1000;
