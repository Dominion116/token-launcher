import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { WalletService, type WalletState } from '@/lib/walletService';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import LandingPage from '@/pages/LandingPage';
import TokenLauncher from '@/pages/TokenLauncher';
import TokenDetailsPage from '@/pages/TokenDetailsPage';

const App = () => {
  const { toast } = useToast();
  const walletServiceRef = useRef<WalletService | null>(null);
  const [walletState, setWalletState] = useState<WalletState>({
    account: '',
    currentNetwork: '',
    isConnecting: false,
    balance: '',
    isLoadingBalance: false
  });
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const walletService = new WalletService({
      onToast: (title: string, description: string) => {
        toast({ title, description });
      }
    });

    walletService.onStateUpdate(setWalletState);
    walletServiceRef.current = walletService;

    // Check system preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);

    return () => {
      walletService.destroy();
    };
  }, [toast]);

  const connectWallet = () => {
    walletServiceRef.current?.connectWallet();
  };

  const disconnectWallet = () => {
    walletServiceRef.current?.disconnectWallet();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Routes>
        <Route path="/" element={
          <LandingPage
            walletService={walletServiceRef.current}
            walletState={walletState}
            onConnectWallet={connectWallet}
            onDisconnectWallet={disconnectWallet}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
        } />
        <Route path="/launch" element={
          <>
            <Header
              walletService={walletServiceRef.current}
              walletState={walletState}
              onConnectWallet={connectWallet}
              onDisconnectWallet={disconnectWallet}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
            <TokenLauncher />
          </>
        } />
        <Route path="/token/:id" element={
          <>
            <Header
              walletService={walletServiceRef.current}
              walletState={walletState}
              onConnectWallet={connectWallet}
              onDisconnectWallet={disconnectWallet}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
            <TokenDetailsPage />
          </>
        } />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;