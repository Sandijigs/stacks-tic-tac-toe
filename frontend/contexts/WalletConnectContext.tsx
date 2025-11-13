"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Client from "@walletconnect/sign-client";
import type { SignClient } from "@walletconnect/sign-client/dist/types/client";
import type { SessionTypes } from "@walletconnect/types";
import QRCodeModal from "@walletconnect/qrcode-modal";

const chains = [
  "stacks:1",
  "stacks:2147483648",
  "bip122:000000000019d6689c085ae165831e93",
  "bip122:000000000933ea01ad0ee984209779ba",
];

interface WalletConnectContextType {
  client: SignClient | undefined;
  session: SessionTypes.Struct | undefined;
  chain: string | undefined;
  address: string | undefined;
  connectWalletConnect: (selectedChain: string) => Promise<void>;
  disconnectWalletConnect: () => Promise<void>;
  isConnected: boolean;
}

const WalletConnectContext = createContext<WalletConnectContextType>({
  client: undefined,
  session: undefined,
  chain: undefined,
  address: undefined,
  connectWalletConnect: async () => {},
  disconnectWalletConnect: async () => {},
  isConnected: false,
});

export const useWalletConnect = () => useContext(WalletConnectContext);

export function WalletConnectProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<SignClient | undefined>(undefined);
  const [session, setSession] = useState<SessionTypes.Struct | undefined>(undefined);
  const [chain, setChain] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);

  useEffect(() => {
    const initClient = async () => {
      try {
        const c = await Client.init({
          logger: "error",
          relayUrl: "wss://relay.walletconnect.com",
          projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
          metadata: {
            name: "Tic Tac Toe",
            description: "Stacks Tic Tac Toe Game with WalletConnect",
            url: "https://your-app-url.com/",
            icons: ["https://cryptologos.cc/logos/stacks-stx-logo.png"],
          },
        });
        setClient(c);

        const savedSession = localStorage.getItem("wc_session");
        const savedChain = localStorage.getItem("wc_chain");
        if (savedSession && savedChain) {
          const parsedSession = JSON.parse(savedSession);
          setSession(parsedSession);
          setChain(savedChain);
          extractAddress(parsedSession, savedChain);
        }
      } catch (error) {
        console.error("Failed to initialize WalletConnect client:", error);
      }
    };

    if (!client) {
      initClient();
    }
  }, [client]);

  const extractAddress = (sess: SessionTypes.Struct, chainId: string) => {
    try {
      if (chainId.includes("stacks")) {
        const addr = sess.namespaces.stacks?.accounts[0]?.split(":")[2];
        setAddress(addr);
      } else if (chainId.includes("bip122")) {
        const addr = sess.namespaces.bip122?.accounts[0]?.split(":")[2];
        setAddress(addr);
      }
    } catch (error) {
      console.error("Failed to extract address:", error);
    }
  };

  const connectWalletConnect = async (selectedChain: string) => {
    if (!client) {
      throw new Error("WalletConnect client not initialized");
    }

    try {
      setChain(undefined);
      setAddress(undefined);

      const connectParams = selectedChain.includes("stacks")
        ? {
            pairingTopic: undefined,
            requiredNamespaces: {
              stacks: {
                methods: [
                  "stacks_signMessage",
                  "stacks_stxTransfer",
                  "stacks_contractCall",
                  "stacks_contractDeploy",
                ],
                chains: [selectedChain],
                events: [],
              },
            },
          }
        : {
            pairingTopic: undefined,
            requiredNamespaces: {
              bip122: {
                methods: ["bitcoin_btcTransfer"],
                chains: [selectedChain],
                events: [],
              },
            },
          };

      const { uri, approval } = await client.connect(connectParams);

      if (uri) {
        QRCodeModal.open(uri, () => {
          console.log("QR Code Modal closed");
        });
      }

      const newSession = await approval();
      setSession(newSession);
      setChain(selectedChain);
      extractAddress(newSession, selectedChain);

      localStorage.setItem("wc_session", JSON.stringify(newSession));
      localStorage.setItem("wc_chain", selectedChain);

      QRCodeModal.close();
    } catch (error) {
      console.error("Failed to connect WalletConnect:", error);
      QRCodeModal.close();
      throw error;
    }
  };

  const disconnectWalletConnect = async () => {
    if (client && session) {
      try {
        await client.disconnect({
          topic: session.topic,
          reason: {
            code: 6000,
            message: "User disconnected",
          },
        });
      } catch (error) {
        console.error("Failed to disconnect WalletConnect:", error);
      }
    }

    setSession(undefined);
    setChain(undefined);
    setAddress(undefined);
    localStorage.removeItem("wc_session");
    localStorage.removeItem("wc_chain");
  };

  return (
    <WalletConnectContext.Provider
      value={{
        client,
        session,
        chain,
        address,
        connectWalletConnect,
        disconnectWalletConnect,
        isConnected: !!session,
      }}
    >
      {children}
    </WalletConnectContext.Provider>
  );
}
