import { PropsWithChildren } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { queryClient, wagmiAdapter } from '@/lib/appkit'

export default function AppKitProvider({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
