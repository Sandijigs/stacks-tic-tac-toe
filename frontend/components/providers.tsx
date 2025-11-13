"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";

const WalletConnectProvider = dynamic(
  () => import("@/contexts/WalletConnectContext").then((mod) => ({ default: mod.WalletConnectProvider })),
  { ssr: false }
);

export function Providers({ children }: { children: ReactNode }) {
  return <WalletConnectProvider>{children}</WalletConnectProvider>;
}
