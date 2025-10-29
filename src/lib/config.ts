// src/lib/config.ts

export const CHAIN_IDS = {
  celoMainnet: 42220,
  celoAlfajores: 44787, // Alfajores Testnet
} as const;

export const RPC_URLS: Record<number, string> = {
  [CHAIN_IDS.celoMainnet]: 'https://forno.celo.org',
  [CHAIN_IDS.celoAlfajores]: 'https://alfajores-forno.celo-testnet.org',
};

export const BLOCK_EXPLORERS: Record<number, string> = {
  [CHAIN_IDS.celoMainnet]: 'https://explorer.celo.org',
  [CHAIN_IDS.celoAlfajores]: 'https://alfajores.celoscan.io',
};

export const CELO_ALFAJORES_CONFIG = {
  chainId: CHAIN_IDS.celoAlfajores,
  name: 'Celo Alfajores',
  ticker: 'CELO',
  atomicUnit: 'wei',
  decimals: 18,
  rpcUrl: RPC_URLS[CHAIN_IDS.celoAlfajores],
  explorerUrl: BLOCK_EXPLORERS[CHAIN_IDS.celoAlfajores],
};

export const CELO_MAINNET_CONFIG = {
  chainId: CHAIN_IDS.celoMainnet,
  name: 'Celo Mainnet',
  ticker: 'CELO',
  atomicUnit: 'wei',
  decimals: 18,
  rpcUrl: RPC_URLS[CHAIN_IDS.celoAlfajores],
  explorerUrl: BLOCK_EXPLORERS[CHAIN_IDS.celoMainnet],
}

export type NetworkConfig = typeof CELO_ALFAJORES_CONFIG;
export const getNetworkConfig = (): NetworkConfig => CELO_ALFAJORES_CONFIG;
 
/**
 * ✅ Set this to the block your factory was deployed at.
 *    0 works but scans a lot of history. If you know the deploy block, put it here.
 */
export const FACTORY_DEPLOY_BLOCK = 0;

/**
 * ===== Token Launcher Factory (address + ABI your app needs) =====
 * ⚠️ Ensure this address is the SAME factory you used to launch tokens.
 */
export const TOKEN_LAUNCHER_CONTRACT = {
  address: '0x4F567CF2FA9Ce940f486457a290bEF2A5528ee18',
  abi: [
    // constructor
    {
      inputs: [{ internalType: 'uint256', name: '_launchFee', type: 'uint256' }],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    // events
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'address', name: 'tokenAddress', type: 'address' },
        { indexed: true, internalType: 'address', name: 'creator', type: 'address' },
      ],
      name: 'TokenLaunched',
      type: 'event',
    },

    // --- views used by the app ---

    // Optional array getter (many factories expose this)
    {
      inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      name: 'launchedTokens',
      outputs: [
        { internalType: 'address', name: 'tokenAddress', type: 'address' },
        { internalType: 'address', name: 'creator', type: 'address' },
        { internalType: 'string', name: 'name', type: 'string' },
        { internalType: 'string', name: 'symbol', type: 'string' },
        { internalType: 'uint256', name: 'totalSupply', type: 'uint256' },
        { internalType: 'uint8', name: 'decimals', type: 'uint8' },
        { internalType: 'string', name: 'metadataURI', type: 'string' },
        { internalType: 'uint256', name: 'launchTimestamp', type: 'uint256' },
      ],
      stateMutability: 'view',
      type: 'function',
    },

    // Count of launched tokens
    {
      inputs: [],
      name: 'getTotalLaunchedTokens',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },

    // Single-token info by address
    {
      inputs: [{ internalType: 'address', name: 'tokenAddress', type: 'address' }],
      name: 'getTokenInfo',
      outputs: [
        {
          components: [
            { internalType: 'address', name: 'tokenAddress', type: 'address' },
            { internalType: 'address', name: 'creator', type: 'address' },
            { internalType: 'string', name: 'name', type: 'string' },
            { internalType: 'string', name: 'symbol', type: 'string' },
            { internalType: 'uint256', name: 'totalSupply', type: 'uint256' },
            { internalType: 'uint8', name: 'decimals', type: 'uint8' },
            { internalType: 'string', name: 'metadataURI', type: 'string' },
            { internalType: 'uint256', name: 'launchTimestamp', type: 'uint256' },
          ],
          internalType: 'struct TokenLauncherFactory.TokenInfo',
          name: '',
          type: 'tuple',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },

    // misc used elsewhere
    {
      inputs: [{ internalType: 'address', name: 'creator', type: 'address' }],
      name: 'getTokensByCreator',
      outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'launchFee',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
  ] as const,
};
