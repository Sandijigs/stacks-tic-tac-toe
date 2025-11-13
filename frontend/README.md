# Stacks Tic-Tac-Toe

A decentralized Tic-Tac-Toe game built on the Stacks blockchain. This [Next.js](https://nextjs.org) project allows players to create games, place bets in STX, and compete against each other on-chain.

## Features

- **Create Games**: Start a new game with a custom bet amount in STX
- **Join Games**: Join any available game created by other players
- **Play On-Chain**: All game moves are recorded on the Stacks blockchain
- **Spectate Mode**: Watch any game in progress without connecting a wallet
- **Wallet Integration**: Connect your Stacks wallet via Stacks Connect or WalletConnect
- **WalletConnect Support**: Connect mobile wallets securely using WalletConnect protocol
- **Real-time Updates**: View active games, joinable games, and ended games

## Getting Started

### Prerequisites

Create a `.env.local` file in the frontend directory with your WalletConnect project ID:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

You can get a project ID by registering at [WalletConnect Cloud](https://cloud.walletconnect.com/).

### Run Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Next.js app router pages
  - `/page.tsx` - Home page with game lists
  - `/create/page.tsx` - Create new game page
  - `/game/[gameId]/page.tsx` - Individual game page
  - `/spectate/page.tsx` - Spectate mode to view all games
- `/components` - Reusable React components
  - `navbar.tsx` - Navigation bar with wallet connection
  - `game-board.tsx` - Tic-tac-toe board component
  - `games-list.tsx` - Display lists of games
  - `play-game.tsx` - Game play interface
- `/lib` - Utility functions and contract interactions
  - `contract.ts` - Stacks smart contract integration
  - `stx-utils.ts` - STX formatting and helper functions
- `/hooks` - Custom React hooks
  - `use-stacks.ts` - Stacks wallet integration hook

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
