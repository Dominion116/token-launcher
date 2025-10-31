import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { QueryClient } from '@tanstack/react-query'
import { networks } from './chains'

export const queryClient = new QueryClient()


export const projectId = '4741971fec7010fbb715c5a93b6043b0'


export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks,
})

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata: {
    name: 'TokenLauncher',
    description: 'Token Launcher Dapp',
    url: 'token-launcher-tawny.vercel.app',
    icons: ['http://localhost:5173/icon.png'],
  },

  // optional features
  features: { analytics: true },
})
