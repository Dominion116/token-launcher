// src/lib/tokenService.ts
import { ethers } from 'ethers';
import {
  getNetworkConfig,
  TOKEN_LAUNCHER_CONTRACT,
  FACTORY_DEPLOY_BLOCK,
} from './config';

// One provider per configured chain
export const providers: Record<number, ethers.providers.JsonRpcProvider> = {};
const cfg = getNetworkConfig();
providers[cfg.chainId] = new ethers.providers.JsonRpcProvider(cfg.rpcUrl);

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
 * Primary path: iterate the on-chain array (if present).
 * Fallback: scan TokenLaunched events and call getTokenInfo(token) for each.
 */
export async function getAllLaunchedTokens(): Promise<TokenInfo[]> {
  const provider = providers[getNetworkConfig().chainId];
  if (!provider) {
    console.error('[tokens] provider not initialized for chain', getNetworkConfig().chainId);
    return [];
  }

  const factory = new ethers.Contract(
    TOKEN_LAUNCHER_CONTRACT.address,
    TOKEN_LAUNCHER_CONTRACT.abi,
    provider
  );

  // 1) Try array + count
  try {
    const totalBn: ethers.BigNumber = await factory.getTotalLaunchedTokens();
    const total = totalBn.toNumber();
    console.info('[tokens] getTotalLaunchedTokens =>', total);

    if (total > 0) {
      const results: TokenInfo[] = [];
      for (let i = 0; i < total; i++) {
        try {
          const t = await factory.launchedTokens(i);
          results.push({
            tokenAddress: t.tokenAddress,
            creator: t.creator,
            name: t.name,
            symbol: t.symbol,
            totalSupply: t.totalSupply.toString(),
            decimals: Number(t.decimals),
            metadataURI: t.metadataURI,
            launchTimestamp: Number(t.launchTimestamp.toString()) * 1000,
          });
        } catch (err) {
          console.warn(`[tokens] launchedTokens(${i}) failed`, err);
        }
      }
      if (results.length) {
        results.sort((a, b) => b.launchTimestamp - a.launchTimestamp);
        return results;
      }
    }
  } catch (err) {
    console.info('[tokens] Array path unavailable, falling back to event scan:', err?.toString?.() ?? err);
  }

  // 2) Fallback: scan TokenLaunched events
  try {
    const iface = new ethers.utils.Interface(TOKEN_LAUNCHER_CONTRACT.abi as any);
    const topic = iface.getEventTopic('TokenLaunched');

    const logs = await provider.getLogs({
      address: TOKEN_LAUNCHER_CONTRACT.address,
      fromBlock: FACTORY_DEPLOY_BLOCK ?? 0,
      toBlock: 'latest',
      topics: [topic],
    });

    console.info('[tokens] event scan logs found:', logs.length, 'fromBlock:', FACTORY_DEPLOY_BLOCK);

    const tokenAddrs = Array.from(
      new Set(
        logs.map((log) => {
          const parsed = iface.parseLog(log);
          return (parsed.args.tokenAddress as string).toLowerCase();
        })
      )
    );

    const out: TokenInfo[] = [];
    for (const addr of tokenAddrs) {
      const ti = await getTokenInfo(addr);
      if (ti) out.push(ti);
    }

    out.sort((a, b) => b.launchTimestamp - a.launchTimestamp);
    return out;
  } catch (err) {
    console.error('[tokens] event scan failed:', err);
    return [];
  }
}

export async function getTokenInfo(tokenAddress: string): Promise<TokenInfo | null> {
  try {
    const provider = providers[getNetworkConfig().chainId];
    if (!provider) throw new Error('Provider not initialized');

    const factory = new ethers.Contract(
      TOKEN_LAUNCHER_CONTRACT.address,
      TOKEN_LAUNCHER_CONTRACT.abi,
      provider
    );

    const info = await factory.getTokenInfo(tokenAddress);
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
    console.error('[tokens] getTokenInfo failed:', err);
    return null;
  }
}

// ---- helpers (unchanged) ----
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
      return (Math.floor(num * Math.pow(10, precision)) / Math.pow(10, precision)).toFixed(precision);
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
    const current = getNetworkConfig();
    const target = chainId || current.chainId;
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

// Tiny debug helper (you can run window.debugFetchTokens() in the console)
;(window as any).debugFetchTokens = async () => {
  const list = await getAllLaunchedTokens();
  console.log('debugFetchTokens =>', list);
  return list;
};
