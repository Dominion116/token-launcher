// src/lib/tokenService.ts
import { ethers } from 'ethers';
import {
  getNetworkConfig,
  TOKEN_LAUNCHER_CONTRACT,
  FACTORY_DEPLOY_BLOCK,
} from './config';

// One provider per configured chain
export const providers: Record<number, ethers.providers.JsonRpcProvider> = {};
const currentCfg = getNetworkConfig();
providers[currentCfg.chainId] = new ethers.providers.JsonRpcProvider(currentCfg.rpcUrl);

// Types
export interface TokenInfo {
  tokenAddress: string;
  creator: string;
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: number;
  metadataURI: string;
  launchTimestamp: number; // ms
}

/**
 * Fetch all tokens launched by THIS factory.
 * We scan the TokenLaunched events and then call getTokenInfo() for each token.
 */
export async function getAllLaunchedTokens(): Promise<TokenInfo[]> {
  try {
    const cfg = getNetworkConfig();
    const provider = providers[cfg.chainId];
    if (!provider) throw new Error('Provider not initialized');

    // Interface & topic for TokenLaunched(address tokenAddress, address creator)
    const iface = new ethers.utils.Interface(TOKEN_LAUNCHER_CONTRACT.abi as any);
    const topic = iface.getEventTopic('TokenLaunched');

    const logs = await provider.getLogs({
      address: TOKEN_LAUNCHER_CONTRACT.address,
      fromBlock: FACTORY_DEPLOY_BLOCK ?? 0,
      toBlock: 'latest',
      topics: [topic],
    });

    if (!logs.length) return [];

    // Unique token addresses from logs
    const tokenAddrs = Array.from(
      new Set(
        logs.map((log) => {
          const parsed = iface.parseLog(log);
          return (parsed.args.tokenAddress as string).toLowerCase();
        })
      )
    );

    // Fetch token infos in small batches
    const out: TokenInfo[] = [];
    const BATCH = 5;
    for (let i = 0; i < tokenAddrs.length; i += BATCH) {
      const chunk = tokenAddrs.slice(i, i + BATCH);
      const infos = await Promise.all(
        chunk.map(async (addr) => {
          try {
            const info = await getTokenInfo(addr);
            return info;
          } catch (e) {
            console.error('getTokenInfo failed for', addr, e);
            return null;
          }
        })
      );
      for (const ti of infos) if (ti) out.push(ti);
    }

    // Newest first
    return out.sort((a, b) => b.launchTimestamp - a.launchTimestamp);
  } catch (err) {
    console.error('Error fetching launched tokens:', err);
    return [];
  }
}

/** Fetch a single token’s info via factory view */
export async function getTokenInfo(tokenAddress: string): Promise<TokenInfo | null> {
  try {
    const cfg = getNetworkConfig();
    const provider = providers[cfg.chainId];
    if (!provider) throw new Error('Provider not initialized');

    const contract = new ethers.Contract(
      TOKEN_LAUNCHER_CONTRACT.address,
      TOKEN_LAUNCHER_CONTRACT.abi,
      provider
    );

    const info = await contract.getTokenInfo(tokenAddress);
    return {
      tokenAddress: info.tokenAddress,
      creator: info.creator,
      name: info.name,
      symbol: info.symbol,
      totalSupply: info.totalSupply.toString(),
      decimals: Number(info.decimals),
      metadataURI: info.metadataURI,
      launchTimestamp: Number(info.launchTimestamp.toString()) * 1000,
    };
  } catch (err) {
    console.error('Error fetching token info:', err);
    return null;
  }
}

// ---- Helpers below (unchanged APIs) ----
export function formatTokenAmount(amount: string | number, precision = 18): string {
  if (typeof amount !== 'number' && typeof amount !== 'string') return '0';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (Number.isNaN(num)) return '0';
  try {
    const s = num.toString();
    if (!s.includes('.')) return s;
    const decimals = s.split('.')?.[1]?.length || 0;
    if (decimals > precision) {
      if (precision === undefined || Number.isNaN(precision)) {
        return (Math.floor(num * 1e18) / 1e18).toFixed(18).replace(/\.?0+$/, '');
      }
      return (Math.floor(num * Math.pow(10, precision)) / Math.pow(10, precision)).toFixed(
        precision
      );
    }
    return s;
  } catch {
    return '0';
  }
}

export const scientificToDecimal = (num: string | number): string => {
  const s = typeof num === 'number' ? num.toString() : num;
  if (!/e/i.test(s)) return s;
  const [base, exponent] = s.split(/e/i);
  if (exponent) {
    const e = parseInt(exponent, 10);
    if (e < 0) return '0.' + '0'.repeat(Math.abs(e) - 1) + base.replace('.', '');
  }
  return s;
};

export const getCeloBalance = async (walletAddress: string, chainId?: number): Promise<string> => {
  try {
    const cfg = getNetworkConfig();
    const target = chainId || cfg.chainId;
    const provider = providers[target];
    if (!provider) return '0';
    if (!isValidAddress(walletAddress)) return '0';
    const balance = await provider.getBalance(walletAddress);
    return ethers.utils.formatEther(balance);
  } catch {
    return '0';
  }
};

export const isValidAddress = (address: string): boolean => {
  try {
    return ethers.utils.isAddress(address);
  } catch {
    return false;
  }
};

export default {
  providers,
  isValidAddress,
  getCeloBalance,
  formatTokenAmount,
  scientificToDecimal,
  getAllLaunchedTokens,
  getTokenInfo,
};
