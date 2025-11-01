import type { Chain } from 'viem';

export const celoMainnet: Chain = {
  id: 42220,
  name: 'Celo',
  nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://forno.celo.org'] },
    public: { http: ['https://forno.celo.org'] },
  },
  blockExplorers: {
    default: { name: 'Celo Explorer', url: 'https://explorer.celo.org' },
  },
};

export const celoAlfajores: Chain = {
  id: 44787,
  name: 'Celo Alfajores',
  nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://alfajores-forno.celo-testnet.org'] },
    public: { http: ['https://alfajores-forno.celo-testnet.org'] },
  },
  blockExplorers: {
    default: { name: 'Celoscan', url: 'https://alfajores.celoscan.io' },
  },
  testnet: true,
};

// Defining an array of networks
export const networks = [celoMainnet, celoAlfajores];
