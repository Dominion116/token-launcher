import React, { useState, useEffect } from 'react';
                    <code className="bg-muted px-3 py-2 rounded-md">{token.tokenAddress}</code>
                    <CopyToClipboard
                      text={token.tokenAddress}
                      onCopy={() => toast({ title: "Copied!", description: "Contract address copied to clipboard" })}
                    >
                      <Button variant="outline" size="icon">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </CopyToClipboard>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => window.open(`${getNetworkConfig().explorerUrl}/address/${token.tokenAddress}`, '_blank')}
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
                  onClick={() => window.open(`${getNetworkConfig().explorerUrl}/address/${token.tokenAddress}`, '_blank')}
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
