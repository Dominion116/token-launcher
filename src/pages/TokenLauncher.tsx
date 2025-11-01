import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllLaunchedTokens, type TokenInfo } from '@/lib/tokenService';
import { useToast } from '@/hooks/use-toast';

const TokenLauncher: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [launchedTokens, setLaunchedTokens] = useState<TokenInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch tokens when the component mounts
  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    setIsLoading(true);
    try {
      const tokens = await getAllLaunchedTokens(); // Fetch tokens from the blockchain
      setLaunchedTokens(tokens);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load tokens from blockchain',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Formatting and filtering tokens based on search and sort options
  const filteredTokens = launchedTokens
    .filter(
      token =>
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') return b.launchTimestamp - a.launchTimestamp;
      if (sortBy === 'oldest') return a.launchTimestamp - b.launchTimestamp;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="min-h-screen bg-background">
      {/* Tokens List */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div>Loading tokens...</div>
        ) : filteredTokens.length === 0 ? (
          <div>No tokens found on this network</div>
        ) : (
          <div>
            {filteredTokens.map(token => (
              <div key={token.tokenAddress}>
                <p>{token.name} ({token.symbol})</p>
                <p>Creator: {token.creator}</p>
                <p>Total Supply: {token.totalSupply}</p>
                {/* More token details */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenLauncher;
