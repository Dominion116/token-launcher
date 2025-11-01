import { PropsWithChildren } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { queryClient, wagmiAdapter } from '@/lib/appkit'

/**
 * AppKitProvider component to wrap your application with the necessary providers:
 * - WagmiProvider to handle wallet and blockchain connection
 * - QueryClientProvider for React Query client setup
 */
export default function AppKitProvider({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
