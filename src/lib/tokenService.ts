import { ethers } from 'ethers';
import { getNetworkConfig, TOKEN_LAUNCHER_CONTRACT } from './config';

export const providers: { [chainId: number]: ethers.providers.JsonRpcProvider } = {};
const currentConfig = getNetworkConfig();
providers[currentConfig.chainId] = new ethers.providers.JsonRpcProvider(currentConfig.rpcUrl);

export interface TokenInfo {
    tokenAddress: string;
    creator: string;
    name: string;
    symbol: string;
    totalSupply: string;
    decimals: number;
    metadataURI: string;
    launchTimestamp: number;
}


export async function getAllLaunchedTokens(): Promise<TokenInfo[]> {
    try {
        const provider = providers[getNetworkConfig().chainId];
        if (!provider) throw new Error('Provider not initialized');

        const contract = new ethers.Contract(
            TOKEN_LAUNCHER_CONTRACT.address,
            TOKEN_LAUNCHER_CONTRACT.abi,
            provider
        );

        const totalTokens = await contract.getTotalLaunchedTokens();
        const tokens: TokenInfo[] = [];

        for (let i = 0; i < totalTokens.toNumber(); i++) {
            try {
                const tokenInfo = await contract.launchedTokens(i);
                tokens.push({
                    tokenAddress: tokenInfo.tokenAddress,
                    creator: tokenInfo.creator,
                    name: tokenInfo.name,
                    symbol: tokenInfo.symbol,
                    totalSupply: tokenInfo.totalSupply.toString(),
                    decimals: tokenInfo.decimals,
                    metadataURI: tokenInfo.metadataURI,
                    launchTimestamp: tokenInfo.launchTimestamp.toNumber() * 1000
                });
            } catch (error) {
                console.error(`Error fetching token at index ${i}:`, error);
            }
        }

        return tokens.sort((a, b) => b.launchTimestamp - a.launchTimestamp);
    } catch (error) {
        console.error('Error fetching launched tokens:', error);
        return [];
    }
}

export async function getTokenInfo(tokenAddress: string): Promise<TokenInfo | null> {
    try {
        const provider = providers[getNetworkConfig().chainId];
        if (!provider) throw new Error('Provider not initialized');

        const contract = new ethers.Contract(
            TOKEN_LAUNCHER_CONTRACT.address,
            TOKEN_LAUNCHER_CONTRACT.abi,
            provider
        );

        const tokenInfo = await contract.getTokenInfo(tokenAddress);


        return {
            tokenAddress: tokenInfo.tokenAddress,
            creator: tokenInfo.creator,
            name: tokenInfo.name,
            symbol: tokenInfo.symbol,
            totalSupply: tokenInfo.totalSupply.toString(),
            decimals: tokenInfo.decimals,
            metadataURI: tokenInfo.metadataURI,
            launchTimestamp: tokenInfo.launchTimestamp.toNumber() * 1000
        };
    } catch (error) {
        console.error('Error fetching token info:', error);
        return null;
    }
}

export function formatTokenAmount(amount: string | number, precision: number = 18): string {
    if (
        typeof amount !== 'number' && typeof amount !== 'string'
    ) {
        return '0';
    }
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (Number.isNaN(num)) {
        return '0';
    }
    try {
        const amountStr = num.toString();
        if (amountStr.indexOf('.') === -1) {
            return amountStr;
        }
        const decimals = amountStr.split('.')?.[1]?.length || 0;
        if (decimals > precision) {
            if (precision === undefined || Number.isNaN(precision)) {
                return (Math.floor(num * Math.pow(10, 18)) / Math.pow(10, 18))
                    .toFixed(18)
                    .replace(/\.?0+$/, '');
            }
            return (
                Math.floor(num * Math.pow(10, precision)) / Math.pow(10, precision)
            ).toFixed(precision);
        }
        return amountStr;
    } catch (err) {
        return '0';
    }
} export const scientificToDecimal = (num: string | number): string => {
    const numStr = typeof num === 'number' ? num.toString() : num;
    if (!/e/i.test(numStr)) {
        return numStr;
    }
    const [base, exponent] = numStr.split(/e/i);
    if (exponent) {
        const e = parseInt(exponent, 10);
        if (e < 0) {
            return '0.' + '0'.repeat(Math.abs(e) - 1) + base.replace('.', '');
        }
    }
    return numStr;
};

export const getCeloBalance = async (walletAddress: string, chainId?: number): Promise<string> => {
    try {
        const currentConfig = getNetworkConfig();
        const targetChainId = chainId || currentConfig.chainId;

        const provider = providers[targetChainId];
        if (!provider) {
            return '0';
        }

        if (!isValidAddress(walletAddress)) {
            return '0';
        } const balance = await provider.getBalance(walletAddress);
        return ethers.utils.formatEther(balance);
    } catch (error) {
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
    getTokenInfo
};