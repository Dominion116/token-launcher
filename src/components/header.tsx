// src/components/header.tsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CheckCircle, AlertCircle, Moon, Sun, Menu, X, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/components/ui/use-mobile'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useAccount, useBalance, useChainId, useDisconnect, useSwitchChain } from 'wagmi'
import { networks } from '@/lib/chains'
import { useToast } from '@/hooks/use-toast'

const Header: React.FC<{ darkMode: boolean; toggleDarkMode: () => void }> = ({
  darkMode,
  toggleDarkMode,
}) => {
  const { toast } = useToast()
  const location = useLocation()
  const isMobile = useIsMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const isLandingPage = location.pathname === '/'

  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { data: balanceData, isLoading: isLoadingBalance } = useBalance({
    address,
    chainId,
  })
  const { disconnect } = useDisconnect()
  const { chains, switchChain, isPending: switching } = useSwitchChain()

  const formatAddress = (addr?: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''

  const current = networks.find(n => n.id === chainId)
  const onOtherNetwork = !!(isConnected && current == null)

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
            <a href="#features" className="text-foreground/70 hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-foreground/70 hover:text-foreground transition-colors">How It Works</a>
            <a href="#stats" className="text-foreground/70 hover:text-foreground transition-colors">Stats</a>
          </nav>
        )}

        {/* Right controls */}
        <div className="flex items-center space-x-4">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(v => !v)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}

          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="hidden sm:flex">
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Wallet button from AppKit */}
          {!isConnected ? (
            <appkit-button />
          ) : (
            <div className="flex items-center space-x-3">
              {/* Balance + Network pill (desktop) */}
              <div className="hidden md:flex items-center space-x-2 bg-muted px-3 py-2 rounded-lg">
                <span className="text-sm font-medium">
                  {isLoadingBalance ? 'Loading...' : `${balanceData?.formatted ?? '0'} ${balanceData?.symbol ?? 'CELO'}`}
                </span>

                {onOtherNetwork ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs px-2 inline-flex items-center gap-1 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                    title="Wrong network"
                    disabled
                  >
                    <AlertCircle size={12} />
                    Other Network
                  </Button>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    <CheckCircle size={12} />
                    {current?.name ?? 'Unknown'}
                  </span>
                )}
              </div>

              {/* Address (desktop) */}
              <div className="hidden md:flex items-center space-x-2 bg-muted px-3 py-2 rounded-lg">
                <span className="text-sm">{formatAddress(address)}</span>
                <CopyToClipboard
                  text={address ?? ''}
                  onCopy={() => toast({ title: 'Copied!', description: 'Address copied to clipboard' })}
                >
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Copy className="h-3 w-3" />
                  </Button>
                </CopyToClipboard>
              </div>

              {/* Quick network switcher: Mainnet / Alfajores */}
              <div className="hidden md:flex items-center space-x-2">
                {chains
                  .filter(c => c.id === 42220 || c.id === 44787)
                  .map(c => (
                    <Button
                      key={c.id}
                      variant={c.id === chainId ? 'secondary' : 'outline'}
                      size="sm"
                      disabled={switching}
                      onClick={() => switchChain({ chainId: c.id })}
                    >
                      {c.name}
                    </Button>
                  ))}
              </div>

              <Button variant="destructive" onClick={() => disconnect()} className="hidden md:flex">
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
                <a href="#features" className="block py-2 text-foreground/70 hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>Features</a>
                <a href="#how-it-works" className="block py-2 text-foreground/70 hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
                <a href="#stats" className="block py-2 text-foreground/70 hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>Stats</a>
              </nav>
            )}

            {isConnected && (
              <>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">Balance:</span>
                  <span>{isLoadingBalance ? 'Loading...' : `${balanceData?.formatted ?? '0'} ${balanceData?.symbol ?? 'CELO'}`}</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">Network:</span>
                  <span className="text-sm">{current?.name ?? 'Unknown'}</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">Switch:</span>
                  <div className="flex gap-2">
                    {chains.filter(c => c.id === 42220 || c.id === 44787).map(c => (
                      <Button key={c.id} size="sm" variant={c.id === chainId ? 'secondary' : 'outline'} onClick={() => { switchChain({ chainId: c.id }); setMobileMenuOpen(false) }}>
                        {c.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button variant="destructive" onClick={() => { disconnect(); setMobileMenuOpen(false) }} className="w-full">
                  Disconnect Wallet
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
