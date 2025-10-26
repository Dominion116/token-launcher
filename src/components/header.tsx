// src/components/header.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wallet, Copy, CheckCircle, AlertCircle, Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import CopyToClipboard from 'react-copy-to-clipboard';
import { WalletService, type WalletState } from '@/lib/walletService';
import { getNetworkConfig } from '@/lib/config';
import { useIsMobile } from '@/components/ui/use-mobile';

interface HeaderProps {
  walletService: WalletService | null;
  walletState: WalletState;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({
  walletService,
  walletState,
  onConnectWallet,
  onDisconnectWallet,
  darkMode,
  toggleDarkMode,
}) => {
  const { toast } = useToast();
  const { account, currentNetwork, balance, isLoadingBalance } = walletState;
  const currentConfig = getNetworkConfig();
  const isMobile = useIsMobile();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isLandingPage = location.pathname === '/';

  const formatAddress = (address: string) => {
    if (!address) return '';
    return walletService?.formatAddress(address) ?? `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">T</span>
          </div>
          <span className="font-bold text-xl">TokenLaunch</span>
        </Link>

        {/* Desktop nav (only on landing) */}
        {isLandingPage && !isMobile && (
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-foreground/70 hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-foreground/70 hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#stats" className="text-foreground/70 hover:text-foreground transition-colors">
              Stats
            </a>
          </nav>
        )}

        {/* Right controls */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu toggle */}
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen((v) => !v)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}

          {/* Theme */}
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="hidden sm:flex">
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Wallet */}
          {!account ? (
            <Button onClick={onConnectWallet} className="gap-2">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Connect Wallet</span>
            </Button>
          ) : (
            <div className="flex items-center space-x-3">
              {/* Balance + Network pill (desktop) */}
              <div className="hidden md:flex items-center space-x-2 bg-muted px-3 py-2 rounded-lg">
                <span className="text-sm font-medium">
                  {isLoadingBalance ? 'Loading...' : `${balance} CELO`}
                </span>

                {currentNetwork === currentConfig.name ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    <CheckCircle size={12} />
                    {currentNetwork}
                  </span>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs px-2 inline-flex items-center gap-1 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                    onClick={() => walletService?.switchToCurrentNetwork()}
                    title={`Switch to ${currentConfig.name}`}
                  >
                    <AlertCircle size={12} />
                    Other Network — Switch
                  </Button>
                )}
              </div>

              {/* Address (desktop) */}
              <div className="hidden md:flex items-center space-x-2 bg-muted px-3 py-2 rounded-lg">
                <span className="text-sm">{formatAddress(account)}</span>
                <CopyToClipboard
                  text={account}
                  onCopy={() => toast({ title: 'Copied!', description: 'Address copied to clipboard' })}
                >
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Copy className="h-3 w-3" />
                  </Button>
                </CopyToClipboard>
              </div>

              <Button variant="destructive" onClick={onDisconnectWallet} className="hidden md:flex">
                Disconnect
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && isMobile && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {isLandingPage && (
              <nav className="space-y-2">
                <a
                  href="#features"
                  className="block py-2 text-foreground/70 hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="block py-2 text-foreground/70 hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How It Works
                </a>
                <a
                  href="#stats"
                  className="block py-2 text-foreground/70 hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Stats
                </a>
              </nav>
            )}

            {account && (
              <>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">Balance:</span>
                  <span>{isLoadingBalance ? 'Loading...' : `${balance} CELO`}</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">Network:</span>
                  {currentNetwork === currentConfig.name ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      <CheckCircle size={12} />
                      {currentNetwork}
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        walletService?.switchToCurrentNetwork();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Switch to {currentConfig.name}
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">Address:</span>
                  <span className="text-sm">{formatAddress(account)}</span>
                </div>

                <CopyToClipboard
                  text={account}
                  onCopy={() => {
                    toast({ title: 'Copied!', description: 'Address copied to clipboard' });
                    setMobileMenuOpen(false);
                  }}
                >
                  <Button variant="outline" className="w-full">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Address
                  </Button>
                </CopyToClipboard>

                <Button variant="destructive" onClick={onDisconnectWallet} className="w-full">
                  Disconnect Wallet
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
