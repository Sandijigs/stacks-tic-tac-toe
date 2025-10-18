import { GamesList } from "@/components/games-list";
import { getAllGames } from "@/lib/contract";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const games = await getAllGames();
  const activeGamesCount = games.filter(
    (game) => game.winner === null && game["player-two"] !== null
  ).length;

  return (
    <section className="flex flex-col items-center py-20">
      <div className="text-center mb-20">
        <h1 className="text-4xl font-bold">Tic Tac Toe 🎲</h1>
        <span className="text-sm text-gray-500">
          Play 1v1 Tic Tac Toe on the Stacks blockchain
        </span>

        {activeGamesCount > 0 && (
          <div className="mt-6 p-4 bg-gray-800 border border-gray-600 rounded-lg inline-block">
            <p className="text-sm text-gray-300 mb-3">
              🔴 {activeGamesCount} {activeGamesCount === 1 ? "game" : "games"}{" "}
              in progress
            </p>
            <Link
              href="/spectate"
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Watch Live Games
            </Link>
          </div>
        )}
      </div>

      <GamesList games={games} />
    </section>
  );
}
