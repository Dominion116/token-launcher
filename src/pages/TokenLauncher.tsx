import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Copy, ExternalLink, Eye, EyeOff, Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import CopyToClipboard from 'react-copy-to-clipboard';
import { ethers } from 'ethers';
import { TOKEN_LAUNCHER_CONTRACT, getNetworkConfigByChainId } from '@/lib/config';
import { getAllLaunchedTokens, type TokenInfo } from '@/lib/tokenService';
import { normalizeImageUrl, PLACEHOLDER_IMG } from '@/lib/media';
import { useAccount } from 'wagmi';

const TokenLauncher: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { chain } = useAccount();
  const chainId = chain?.id;
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    imageUrl: '',
    supply: '',
    decimals: '18',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [launchedTokens, setLaunchedTokens] = useState<TokenInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fix: Reload tokens when chainId changes
  useEffect(() => {
    if (chainId) {
      loadTokens();
    }
  }, [chainId]);

  // Fix: Fetch launched tokens based on the current connected network
  const loadTokens = async () => {
    if (!chainId) return;
    
    setIsLoading(true);
    try {
      const tokens = await getAllLaunchedTokens(chainId); // Fix: Pass chainId
      setLaunchedTokens(tokens);
      console.log('[TokenLauncher] Loaded tokens:', tokens.length, 'for chainId:', chainId);
    } catch (error) {
      console.error('[TokenLauncher] Failed to load tokens:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tokens from blockchain',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle token deployment
  const handleDeploy = async () => {
    if (!window.ethereum) {
      toast({
        title: 'Error',
        description: 'Please install MetaMask to deploy tokens',
        variant: 'destructive',
      });
      return;
    }

    if (!chainId) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet',
        variant: 'destructive',
      });
      return;
    }

    setIsDeploying(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Fix: Get network config by chainId
      const networkConfig = getNetworkConfigByChainId(chainId);
      
      if (!networkConfig) {
        throw new Error('Unsupported network');
      }
      
      const contractConfig = TOKEN_LAUNCHER_CONTRACT[networkConfig.name];
      
      if (!contractConfig) {
        throw new Error('Contract not configured for this network');
      }
      
      const contract = new ethers.Contract(
        contractConfig.address,
        contractConfig.abi,
        signer
      );

      const launchFee = await contract.launchFee(); // Call it as a function

      const tx = await contract.launchToken(
        formData.name,
        formData.symbol.toUpperCase(),
        ethers.utils.parseUnits(formData.supply, formData.decimals),
        parseInt(formData.decimals),
        formData.imageUrl,
        { value: launchFee }
      );

      await tx.wait();
      await loadTokens(); // Reload tokens after deployment

      toast({
        title: 'Token Launched Successfully!',
        description: 'Your token has been deployed to the blockchain.',
      });

      // Reset form
      setFormData({
        name: '',
        symbol: '',
        description: '',
        imageUrl: '',
        supply: '',
        decimals: '18',
      });
      setAgreedToTerms(false);
    } catch (error: any) {
      console.error('[TokenLauncher] Deployment failed:', error);
      toast({
        title: 'Deployment Failed',
        description: error?.message || 'Failed to deploy token',
        variant: 'destructive',
      });
    } finally {
      setIsDeploying(false);
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  // Format address for display
  const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  // Filter tokens based on search term and sorting option
  const filteredTokens = launchedTokens
    .filter(
      token =>
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.metadataURI.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') return b.launchTimestamp - a.launchTimestamp;
      if (sortBy === 'oldest') return a.launchTimestamp - b.launchTimestamp;
      return a.name.localeCompare(b.name);
    });

  // Handle token click to navigate to the details page
  const handleTokenClick = (token: TokenInfo) => {
    navigate(`/token/${token.tokenAddress}`, { state: { token } });
  };

  // Fix: Get current network config
  const currentNetworkConfig = chainId ? getNetworkConfigByChainId(chainId) : null;
  const networkName = currentNetworkConfig?.name === 'celoMainnet' ? 'Celo Mainnet' : 'Celo Alfajores';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Token Creation Form */}
          <div className="lg:sticky lg:top-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-6 w-6" />
                  Create Your Token
                </CardTitle>
                <CardDescription>
                  Configure your token parameters and deploy to the blockchain
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Token Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="My Awesome Token"
                    maxLength={32}
                  />
                  <p className="text-sm text-muted-foreground">
                    {formData.name.length}/32 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symbol">Token Symbol</Label>
                  <Input
                    id="symbol"
                    name="symbol"
                    value={formData.symbol}
                    onChange={handleInputChange}
                    placeholder="MAT"
                    maxLength={10}
                  />
                  <p className="text-sm text-muted-foreground">
                    {formData.symbol.length}/10 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Token Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your token's purpose and vision..."
                    maxLength={500}
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">
                    {formData.description.length}/500 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Token Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/token-image.png"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowImagePreview(!showImagePreview)}
                    >
                      {showImagePreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {showImagePreview && formData.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={normalizeImageUrl(formData.imageUrl)}
                        alt="Token preview"
                        className="w-16 h-16 rounded-lg object-cover border"
                        referrerPolicy="no-referrer"
                        onError={e => {
                          e.currentTarget.src = PLACEHOLDER_IMG;
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supply">Total Supply</Label>
                  <Input
                    id="supply"
                    name="supply"
                    type="number"
                    value={formData.supply}
                    onChange={handleInputChange}
                    placeholder="1000000"
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="decimals">Decimals</Label>
                  <Input
                    id="decimals"
                    name="decimals"
                    type="number"
                    value={formData.decimals}
                    onChange={handleInputChange}
                    min="0"
                    max="18"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={e => setAgreedToTerms(e.target.checked)}
                    className="rounded border-border"
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree that I have read and understood the risks
                  </Label>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Estimated Gas Fee</span>
                    <span className="font-mono">~0.005 CELO</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Actual gas fees may vary based on network conditions
                  </p>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleDeploy}
                  disabled={
                    !agreedToTerms ||
                    isDeploying ||
                    !formData.name ||
                    !formData.symbol ||
                    !formData.description ||
                    !formData.imageUrl ||
                    !formData.supply
                  }
                >
                  {isDeploying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Rocket className="h-5 w-5 mr-2" />
                      Launch Token
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Launched Tokens Section */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Recently Launched Tokens</CardTitle>
                    <CardDescription>Tokens created on {networkName}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={loadTokens} disabled={isLoading}>
                      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search tokens..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10 w-full sm:w-48"
                      />
                    </div>
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="name">Name A-Z</option>
                    </select>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse flex items-start gap-4 p-4">
                        <div className="w-12 h-12 bg-muted rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-1/4"></div>
                          <div className="h-3 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredTokens.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No tokens found on this network. Be the first to launch one!</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredTokens.map(token => (
                      <Card
                        key={token.tokenAddress}
                        className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleTokenClick(token)}
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={normalizeImageUrl(token.metadataURI)}
                            alt={token.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            referrerPolicy="no-referrer"
                            onError={e => {
                              e.currentTarget.src = PLACEHOLDER_IMG;
                            }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{token.name}</h3>
                              <span className="text-muted-foreground text-sm">{token.symbol}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {token.metadataURI}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>By {formatAddress(token.creator)}</span>
                              <span>•</span>
                              <span>{formatTimestamp(token.launchTimestamp)}</span>
                              <span>•</span>
                              <span>Supply: {parseInt(token.totalSupply).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <CopyToClipboard
                                text={token.tokenAddress}
                                onCopy={() =>
                                  toast({
                                    title: 'Copied!',
                                    description: 'Contract address copied to clipboard',
                                  })
                                }
                              >
                                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={(e) => e.stopPropagation()}>
                                  <Copy className="h-3 w-3 mr-1" />
                                  {formatAddress(token.tokenAddress)}
                                </Button>
                              </CopyToClipboard>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={e => {
                                  e.stopPropagation();
                                  const explorerUrl = currentNetworkConfig?.explorerUrl || 'https://explorer.celo.org';
                                  window.open(
                                    `${explorerUrl}/address/${token.tokenAddress}`,
                                    '_blank'
                                  );
                                }}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Explorer
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenLauncher;