import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, ExternalLink, Calendar, User, Coins, Hash, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import CopyToClipboard from 'react-copy-to-clipboard';
import { getTokenInfo, type TokenInfo } from '@/lib/tokenService';
import { getNetworkConfig } from '@/lib/config';
import { normalizeImageUrl, PLACEHOLDER_IMG } from '@/lib/media';

const TokenDetailsPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { address } = useParams<{ address: string }>();
  const [token, setToken] = useState<TokenInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (address) loadTokenInfo(address);
  }, [address]);

  const loadTokenInfo = async (tokenAddress: string) => {
    setIsLoading(true);
    try {
      const tokenInfo = await getTokenInfo(tokenAddress);
      setToken(tokenInfo);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to load token information',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Token address not provided</p>
            <Button onClick={() => navigate('/launch')}>Back to Token Launcher</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate('/launch')} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Token Launcher
          </Button>
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Token not found</p>
            <Button onClick={() => navigate('/launch')}>Back to Token Launcher</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatTimestamp = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate('/launch')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Token Launcher
          </Button>
          <Button variant="outline" size="icon" onClick={() => loadTokenInfo(address)}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Token Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <img
                    src={normalizeImageUrl(token.metadataURI)}
                    alt={token.name}
                    className="w-16 h-16 rounded-lg object-cover"
                    referrerPolicy="no-referrer"
                    onError={e => {
                      e.currentTarget.src = PLACEHOLDER_IMG;
                    }}
                  />
                  <div>
                    <CardTitle className="text-3xl">{token.name}</CardTitle>
                    <p className="text-muted-foreground text-lg">{token.symbol}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground break-all">{token.metadataURI}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Coins className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Supply</p>
                      <p className="font-semibold">{parseInt(token.totalSupply).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Hash className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Decimals</p>
                      <p className="font-semibold">{token.decimals}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Creator</p>
                      <p className="font-semibold">{formatAddress(token.creator)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Launch Date</p>
                      <p className="font-semibold">{formatTimestamp(token.launchTimestamp)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Contract Address</h3>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-3 py-2 rounded-md">{token.tokenAddress}</code>
                    <CopyToClipboard
                      text={token.tokenAddress}
                      onCopy={() =>
                        toast({ title: 'Copied!', description: 'Contract address copied to clipboard' })
                      }
                    >
                      <Button variant="outline" size="icon">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </CopyToClipboard>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        window.open(`${getNetworkConfig().explorerUrl}/address/${token.tokenAddress}`, '_blank')
                      }
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Token Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg">
                  Add to Wallet
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={() =>
                    window.open(`${getNetworkConfig().explorerUrl}/address/${token.tokenAddress}`, '_blank')
                  }
                >
                  View on Explorer
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  Share Token
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  Export as JSON
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Token Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Holders</span>
                  <span className="font-semibold">Loading...</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Transactions</span>
                  <span className="font-semibold">Loading...</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Market Cap</span>
                  <span className="font-semibold">Loading...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetailsPage;
