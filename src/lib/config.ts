import { ethers } from 'ethers';

export const CHAIN_IDS = {
  celoMainnet: 42220,
  celoAlfajores: 44787, // Alfajores Testnet
};

export const RPC_URLS = {
  [CHAIN_IDS.celoMainnet]: 'https://forno.celo.org',
  [CHAIN_IDS.celoAlfajores]: 'https://alfajores-forno.celo-testnet.org',
};

export const BLOCK_EXPLORERS = {
  [CHAIN_IDS.celoMainnet]: 'https://explorer.celo.org',
  [CHAIN_IDS.celoAlfajores]: 'https://alfajores.celoscan.io',
};

export const CELO_ALFAJORES_CONFIG = {
    chainId: 44787,
    name: 'Celo Alfajores',
    ticker: 'CELO',
    atomicUnit: 'wei',
    decimals: 18,
    rpcUrl: 'https://alfajores-forno.celo-testnet.org',
    explorerUrl: 'https://alfajores.celoscan.io'ß
  }
  
  export const TOKEN_LAUNCHER_CONTRACT = {
    address: '0x4F567CF2FA9Ce940f486457a290bEF2A5528ee18',
    abi: [{"inputs":[{"internalType":"uint256","name":"_launchFee","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ReentrancyGuardReentrantCall","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"FeesWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"oldFee","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newFee","type":"uint256"}],"name":"LaunchFeeUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":true,"internalType":"address","name":"creator","type":"address"}],"name":"TokenLaunched","type":"event"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"}],"name":"getTokenInfo","outputs":[{"components":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"creator","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint256","name":"totalSupply","type":"uint256"},{"internalType":"uint8","name":"decimals","type":"uint8"},{"internalType":"string","name":"metadataURI","type":"string"},{"internalType":"uint256","name":"launchTimestamp","type":"uint256"}],"internalType":"struct TokenLauncherFactory.TokenInfo","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"creator","type":"address"}],"name":"getTokensByCreator","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTotalLaunchedTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"launchFee","outputs":[{"internalType":"uint256","name":"","type":"极256"}],
  }
  
  export type NetworkConfig = typeof CELO_ALFAJORES_CONFIG
  
  export const getNetworkConfig = (): NetworkConfig => {
    return CELO_ALFAJORES_CONFIG
  }