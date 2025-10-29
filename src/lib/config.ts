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

// General NetworkConfig type that allows any chainId
export type NetworkConfig = {
  chainId: number;
  name: string;
  ticker: string;
  atomicUnit: string;
  decimals: number;
  rpcUrl: string;
  explorerUrl: string;
};

export const CELO_ALFAJORES_CONFIG: NetworkConfig = {
  chainId: CHAIN_IDS.celoAlfajores,
  name: 'Celo Alfajores',
  ticker: 'CELO',
  atomicUnit: 'wei',
  decimals: 18,
  rpcUrl: RPC_URLS[CHAIN_IDS.celoAlfajores],
  explorerUrl: BLOCK_EXPLORERS[CHAIN_IDS.celoAlfajores],
};

export const CELO_MAINNET_CONFIG: NetworkConfig = {
  chainId: CHAIN_IDS.celoMainnet,
  name: 'Celo Mainnet',
  ticker: 'CELO',
  atomicUnit: 'wei',
  decimals: 18,
  rpcUrl: RPC_URLS[CHAIN_IDS.celoMainnet],
  explorerUrl: BLOCK_EXPLORERS[CHAIN_IDS.celoMainnet],
};

export const getNetworkConfig = (isMainnet: boolean): NetworkConfig => 
  isMainnet ? CELO_MAINNET_CONFIG : CELO_ALFAJORES_CONFIG;

export const FACTORY_DEPLOY_BLOCK = 0;

/**
 * ===== Token Launcher Factory (address + ABI your app needs) =====
 * ⚠️ Ensure this address is the SAME factory you used to launch tokens.
 */
export const TOKEN_LAUNCHER_CONTRACT = {
  celoMainnet: {
    address: '0xD276D24B6789882cD5921fda488E5fBf88f6d5e3',  // Mainnet contract address
    abi: [ // Mainnet ABI
      {
        inputs: [{ internalType: 'uint256', name: '_launchFee', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'FeesWithdrawn',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: false, internalType: 'uint256', name: 'oldFee', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'newFee', type: 'uint256' },
        ],
        name: 'LaunchFeeUpdated',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'tokenAddress', type: 'address' },
          { indexed: true, internalType: 'address', name: 'creator', type: 'address' },
        ],
        name: 'TokenLaunched',
        type: 'event',
      },
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
      // Other ABI elements...
    ] as const,
  },
  
  celoAlfajores: {
    address: '0x4F567CF2FA9Ce940f486457a290bEF2A5528ee18',  // Testnet contract address
    abi: [ // Testnet ABI
      {
        inputs: [{ internalType: 'uint256', name: '_launchFee', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'FeesWithdrawn',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: false, internalType: 'uint256', name: 'oldFee', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'newFee', type: 'uint256' },
        ],
        name: 'LaunchFeeUpdated',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'tokenAddress', type: 'address' },
          { indexed: true, internalType: 'address', name: 'creator', type: 'address' },
        ],
        name: 'TokenLaunched',
        type: 'event',
      },
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
      // Other ABI elements...
    ] as const,
  },
};

export const getFactoryContract = (isMainnet: boolean) => 
  isMainnet ? TOKEN_LAUNCHER_CONTRACT.celoMainnet : TOKEN_LAUNCHER_CONTRACT.celoAlfajores;
