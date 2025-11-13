"use client";

import { useStacks } from "@/hooks/use-stacks";
import { useWalletConnect } from "@/contexts/WalletConnectContext";
import { abbreviateAddress } from "@/lib/stx-utils";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const { userData, connectWallet, disconnectWallet } = useStacks();
  const { isConnected, address, connectWalletConnect, disconnectWalletConnect } = useWalletConnect();
  const [showWalletMenu, setShowWalletMenu] = useState(false);

  const handleWalletConnectClick = async () => {
    try {
      await connectWalletConnect("stacks:2147483648");
      setShowWalletMenu(false);
    } catch (error) {
      console.error("Failed to connect WalletConnect:", error);
    }
  };

  const handleStacksConnectClick = () => {
    connectWallet();
    setShowWalletMenu(false);
  };

  const handleDisconnect = async () => {
    if (isConnected) {
      await disconnectWalletConnect();
    }
    if (userData) {
      disconnectWallet();
    }
  };

  const displayAddress = userData 
    ? abbreviateAddress(userData.profile.stxAddress.testnet)
    : address 
    ? abbreviateAddress(address)
    : null;

  return (
    <nav className="flex w-full items-center justify-between gap-4 p-4 h-16 border-b border-gray-500">
      <Link href="/" className="text-2xl font-bold">
        TicTacToe 🎲
      </Link>

      <div className="flex items-center gap-8">
        <Link href="/" className="text-gray-300 hover:text-gray-50">
          Home
        </Link>
        <Link href="/create" className="text-gray-300 hover:text-gray-50">
          Create Game
        </Link>
        <Link href="/spectate" className="text-gray-300 hover:text-gray-50">
          Spectate
        </Link>
      </div>

      <div className="flex items-center gap-2 relative">
        {displayAddress ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">
              {isConnected ? "WalletConnect" : "Stacks Connect"}
            </span>
            <button
              type="button"
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {displayAddress}
            </button>
            <button
              type="button"
              onClick={handleDisconnect}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => setShowWalletMenu(!showWalletMenu)}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Connect Wallet
            </button>
            {showWalletMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <button
                    onClick={handleStacksConnectClick}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                  >
                    Stacks Connect
                  </button>
                  <button
                    onClick={handleWalletConnectClick}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                  >
                    WalletConnect
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
