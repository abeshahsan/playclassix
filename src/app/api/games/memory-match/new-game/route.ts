export async function POST() {
	const gameId = crypto.randomUUID();

	return new Response(JSON.stringify({ gameId }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}
