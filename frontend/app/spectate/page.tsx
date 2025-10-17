import { GameBoard } from "@/components/game-board";
import { getAllGames } from "@/lib/contract";
import { abbreviateAddress, explorerAddress, formatStx } from "@/lib/stx-utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SpectatePage() {
  const games = await getAllGames();

  return (
    <section className="flex flex-col items-center py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold">Spectate Games</h1>
        <span className="text-sm text-gray-500">
          Watch any match unfold without connecting a wallet
        </span>
      </div>

      <div className="grid gap-8 w-full max-w-5xl">
        {games.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-gray-500 mb-4">No games found yet.</p>
            <Link
              href="/create"
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create New Game
            </Link>
          </div>
        ) : (
          games.map((game) => {
            const playerTwo = game["player-two"];
            const isJoinable = playerTwo === null;
            const isOver = game.winner !== null;
            const nextTurn = game["is-player-one-turn"] ? "X" : "O";

            return (
              <div
                key={game.id}
                className="border border-gray-700 rounded-lg bg-gray-900 p-6 flex flex-col gap-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">Game #{game.id}</h2>
                    <div className="text-sm text-gray-400">
                      Bet: {formatStx(game["bet-amount"])} STX
                    </div>
                  </div>

                  <div className="text-sm px-3 py-1 rounded-full bg-gray-800 border border-gray-600">
                    {isOver
                      ? "Completed"
                      : isJoinable
                      ? "Waiting for opponent"
                      : `Next turn: ${nextTurn}`}
                  </div>
                </div>

                <GameBoard
                  board={game.board}
                  cellClassName="size-16 text-4xl"
                />

                <div className="grid gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Player One:</span>
                    <Link
                      href={explorerAddress(game["player-one"])}
                      target="_blank"
                      className="hover:underline"
                    >
                      {abbreviateAddress(game["player-one"])}
                    </Link>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Player Two:</span>
                    {playerTwo ? (
                      <Link
                        href={explorerAddress(playerTwo)}
                        target="_blank"
                        className="hover:underline"
                      >
                        {abbreviateAddress(playerTwo)}
                      </Link>
                    ) : (
                      <span className="text-gray-300">Not joined</span>
                    )}
                  </div>

                  {game.winner && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Winner:</span>
                      <Link
                        href={explorerAddress(game.winner)}
                        target="_blank"
                        className="hover:underline"
                      >
                        {abbreviateAddress(game.winner)}
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  href={`/game/${game.id}`}
                  className="self-start text-sm text-blue-400 hover:underline"
                >
                  View full game details
                </Link>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
