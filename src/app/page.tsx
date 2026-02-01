"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const createRoom = () => {
    const roomId = crypto.randomUUID(); // LONG UUID
    router.push(`/room/${roomId}`);
  };

  return (
    <main className="flex h-screen items-center justify-center">
      <button
        onClick={createRoom}
        className="px-6 py-3 bg-black text-white rounded"
      >
        Create Room
      </button>
    </main>
  );
}
