// src/lib/walletService.ts
import { ethers } from 'ethers';
import { getNetworkConfig } from '@/lib/config';
import { getCeloBalance } from '@/lib/tokenService';

declare global {
  interface Window { ethereum?: any }
}

const getEthereum = () => {
  let eth = window.ethereum;
  if (eth?.providers?.length) {
    const mm = eth.providers.find((p: any) => p.isMetaMask);
    if (mm) eth = mm;
  }
  return eth ?? null;
};

const getCurrentNetworkConfig = () => {
  const config = getNetworkConfig();
  return {
    chainIdHex: `0x${config.chainId.toString(16)}`,
    chainName: config.name,
    ticker: config.ticker,
  };
};

export interface WalletState {
  account: string;
  currentNetwork: string;
  isConnecting: boolean;
  balance: string;
  isLoadingBalance: boolean;
}

export interface WalletCallbacks {
  onWalletChange?: (address: string) => void;
  onToast?: (title: string, description: string) => void;
}

export class WalletService {
  private state: WalletState = {
    account: '',
    currentNetwork: '',
    isConnecting: false,
    balance: '',
    isLoadingBalance: false,
  };
  private callbacks: WalletCallbacks = {};
  private stateUpdateCallback?: (state: WalletState) => void;

  private onAccountsChanged = (accounts: string[]) => {
    const addr = accounts?.[0] ?? '';
    this.updateState({ account: addr });
    this.callbacks.onWalletChange?.(addr);
    if (addr) this.fetchBalance(addr);
    else this.updateState({ currentNetwork: '', balance: '' });
  };
  private onChainChanged = () => {
    this.checkNetwork();
    if (this.state.account) this.fetchBalance(this.state.account);
  };

  constructor(callbacks?: WalletCallbacks) {
    this.callbacks = callbacks || {};
    this.initialize();
  }

  private updateState(updates: Partial<WalletState>) {
    this.state = { ...this.state, ...updates };
    this.stateUpdateCallback?.(this.state);
  }

  onStateUpdate(callback: (state: WalletState) => void) {
    this.stateUpdateCallback = callback;
    callback(this.state);
  }

  async fetchBalance(address: string) {
    if (!address) return;
    this.updateState({ isLoadingBalance: true });
    try {
      const { chainIdHex } = getCurrentNetworkConfig();
      const balance = await getCeloBalance(address, parseInt(chainIdHex, 16));
      this.updateState({ balance: parseFloat(balance).toFixed(4), isLoadingBalance: false });
    } catch {
      this.updateState({ balance: '0.0000', isLoadingBalance: false });
    }
  }

  async checkNetwork() {
    const ethereum = getEthereum();
    if (!ethereum?.request) return;
    try {
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      const { chainIdHex, chainName } = getCurrentNetworkConfig();
      const isCurrent = String(chainId).toLowerCase() === chainIdHex.toLowerCase();
      this.updateState({ currentNetwork: isCurrent ? chainName : 'Other Network' });
    } catch {
      this.updateState({ currentNetwork: 'Unknown' });
    }
  }

  private showToast(title: string, description: string) {
    this.callbacks.onToast?.(title, description);
  }

  async connectWallet() {
    const ethereum = getEthereum();
    if (!ethereum) { this.showToast('Error', 'Please install MetaMask!'); return; }

    this.updateState({ isConnecting: true });
    try {
      await this.checkNetwork();
      const provider = new ethers.providers.Web3Provider(ethereum, 'any'); // <-- important
      await provider.send('eth_requestAccounts', []);
      const address = await provider.getSigner().getAddress();

      this.updateState({ account: address });
      this.callbacks.onWalletChange?.(address);
      await this.fetchBalance(address);

      localStorage.removeItem('wallet_disconnect_requested');
      this.showToast('Success', 'Wallet connected successfully!');
    } catch (error: any) {
      this.showToast('Error', error?.message || 'Failed to connect wallet');
    } finally {
      this.updateState({ isConnecting: false });
    }
  }

  async disconnectWallet() {
    try {
      const ethereum = getEthereum();
      await ethereum?.request?.({
        method: 'wallet_revokePermissions',
        params: [{ eth_accounts: {} }],
      }).catch(() => { });
    } catch (error) {
      console.log('Failed to revoke permissions:', error);
    }

    localStorage.setItem('wallet_disconnect_requested', 'true');
    this.updateState({ account: '', currentNetwork: '', balance: '' });
    this.callbacks.onWalletChange?.('');
    this.showToast('Success', 'Wallet disconnected successfully!');
  }

  formatAddress(address: string) {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  }

  private initialize() {
    const ethereum = getEthereum();
    if (!ethereum) return;

    const checkExistingConnection = async () => {
      try {
        const wasDisconnected = localStorage.getItem('wallet_disconnect_requested');
        if (wasDisconnected === 'true') return;

        const accounts = (await ethereum.request?.({ method: 'eth_accounts' })) || [];
        if (accounts.length > 0) {
          this.updateState({ account: accounts[0] });
          this.callbacks.onWalletChange?.(accounts[0]);
          await this.checkNetwork();
          setTimeout(() => this.fetchBalance(accounts[0]), 100);
        }
      } catch (error) {
        console.log('Failed to check existing connection:', error);
      }
    };

    try { ethereum.on?.('accountsChanged', this.onAccountsChanged); } catch { }
    try { ethereum.on?.('chainChanged', this.onChainChanged); } catch { }

    checkExistingConnection();
  }

  async switchToCurrentNetwork() {
    const ethereum = getEthereum();
    if (!ethereum?.request) {
      this.showToast('Error', 'No wallet provider found');
      return;
    }

    const cfg = getNetworkConfig();
    const chainIdHex = '0x' + cfg.chainId.toString(16);

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
    } catch (e: any) {
      if (e?.code === 4902) {
        // Chain not added — add it
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: chainIdHex,
            chainName: cfg.name,
            nativeCurrency: { name: cfg.ticker, symbol: cfg.ticker, decimals: cfg.decimals },
            rpcUrls: [cfg.rpcUrl],
            blockExplorerUrls: [cfg.explorerUrl],
          }],
        });
      } else {
        this.showToast('Error', e?.message || 'Failed to switch network');
        return;
      }
    }
    await this.checkNetwork();
  }

  destroy() {
    const ethereum = getEthereum();
    try { ethereum?.removeListener?.('accountsChanged', this.onAccountsChanged); } catch { }
    try { ethereum?.removeListener?.('chainChanged', this.onChainChanged); } catch { }
  }
}

