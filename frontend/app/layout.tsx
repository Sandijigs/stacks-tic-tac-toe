import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { WalletConnectProvider } from "@/contexts/WalletConnectContext";

export const metadata: Metadata = {
  title: "Tic Tac Toe",
  description: "Play Tic Tac Toe on Stacks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WalletConnectProvider>
          <Navbar />
          {children}
        </WalletConnectProvider>
      </body>
    </html>
  );
}
