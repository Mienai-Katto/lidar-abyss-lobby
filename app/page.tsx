import { LobbyManager } from "@/components/ux/lobby/lobby-manager";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Game Lobby</h1>
        <LobbyManager />
      </div>
    </main>
  );
}
