import { ethers } from 'ethers';
import {
  getNetworkConfig,
  TOKEN_LAUNCHER_CONTRACT,
  FACTORY_DEPLOY_BLOCK,
} from './config';

// One provider per configured chain
export const providers: Record<number, ethers.providers.JsonRpcProvider> = {};
const cfg = getNetworkConfig(true); // Ensure it's fetching the correct network configuration
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

export async function getAllLaunchedTokens(): Promise<TokenInfo[]> {
  const provider = providers[getNetworkConfig(true).chainId];
  if (!provider) {
    console.error('[tokens] provider not initialized for chain', getNetworkConfig(true).chainId);
    return [];
  }
  const networkConfig = getNetworkConfig(true);
  const factory = new ethers.Contract(
    TOKEN_LAUNCHER_CONTRACT[networkConfig.name as 'celoMainnet' | 'celoAlfajores'].address,
    TOKEN_LAUNCHER_CONTRACT[networkConfig.name as 'celoMainnet' | 'celoAlfajores'].abi,
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
      address: TOKEN_LAUNCHER_CONTRACT[networkConfig.name as 'celoMainnet' | 'celoAlfajores'].address,
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
    const provider = providers[getNetworkConfig(true).chainId];
    if (!provider) throw new Error('Provider not initialized');

    const networkConfig = getNetworkConfig(true);
    const factory = new ethers.Contract(
      TOKEN_LAUNCHER_CONTRACT[networkConfig.name as 'celoMainnet' | 'celoAlfajores'].address,
      TOKEN_LAUNCHER_CONTRACT[networkConfig.name as 'celoMainnet' | 'celoAlfajores'].abi,
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
