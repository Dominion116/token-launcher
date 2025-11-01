import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { QueryClient } from '@tanstack/react-query'

// Initialize the query client for React Query
export const queryClient = new QueryClient()

// Define the project ID (make sure this is correct)
export const projectId = '4741971fec7010fbb715c5a93b6043b0'

// Define networks directly here
const celoMainnet = {
  id: 42220,
  name: 'Celo',
  nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://forno.celo.org'] },
    public:  { http: ['https://forno.celo.org'] },
  },
  blockExplorers: {
    default: { name: 'Celo Explorer', url: 'https://explorer.celo.org' },
  },
}

const celoAlfajores = {
  id: 44787,
  name: 'Celo Alfajores',
  nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://alfajores-forno.celo-testnet.org'] },
    public:  { http: ['https://alfajores-forno.celo-testnet.org'] },
  },
  blockExplorers: {
    default: { name: 'Celoscan', url: 'https://alfajores.celoscan.io' },
  },
  testnet: true,
}

// Define the networks array with the mainnet and testnet
export const networks = [celoMainnet, celoAlfajores]

// Set up the wagmi adapter with the project ID, networks, and SSR enabled
export const wagmiAdapter = new WagmiAdapter({
  ssr: true,  // Enable SSR if needed
  projectId,  // Your WalletConnect Project ID
  networks,   // The networks defined above
})

// Create the AppKit instance with all necessary configurations
createAppKit({
  adapters: [wagmiAdapter],  // List of adapters (only wagmiAdapter here)
  networks,  // List of supported networks
  projectId, // WalletConnect Project ID
  metadata: {
    name: 'TokenLauncher',
    description: 'Token Launcher Dapp',
    url: 'https://token-launcher-tawny.vercel.app',  // Ensure this is your live app URL
    icons: ['https://your-icon-url.com/icon.png'],  // Update with a valid icon URL
  },
  features: { 
    analytics: true,  // Optional: Enable analytics for the app
  },
})
