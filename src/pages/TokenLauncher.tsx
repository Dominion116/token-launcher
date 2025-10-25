import React, { useState, useEffect } from 'react';
                  </div>
                ) : filteredTokens.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No tokens found. Be the first to launch one!</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredTokens.map((token) => (
                      <Card key={token.tokenAddress} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleTokenClick(token)}>
                        <div className="flex items-start gap-4">
                          <img
                            src={token.metadataURI}
                            alt={token.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/100';
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
                                onCopy={() => toast({ title: "Copied!", description: "Contract address copied to clipboard" })}
                              >
                                <Button variant="outline" size="sm" className="h-7 text-xs">
                                  <Copy className="h-3 w-3 mr-1" />
                                  {formatAddress(token.tokenAddress)}
                                </Button>
                              </CopyToClipboard>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`${getNetworkConfig().explorerUrl}/address/${token.tokenAddress}`, '_blank');
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
