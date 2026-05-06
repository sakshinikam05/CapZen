
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, X, TrendingUp } from "lucide-react";
import { InvestmentRound } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface InvestmentRoundsProps {
  investmentRounds: InvestmentRound[];
  setInvestmentRounds: (rounds: InvestmentRound[]) => void;
}

export const InvestmentRounds: React.FC<InvestmentRoundsProps> = ({ 
  investmentRounds, 
  setInvestmentRounds 
}) => {
  const [newRound, setNewRound] = useState<Omit<InvestmentRound, 'id'>>({
    name: '',
    type: 'seed',
    date: '',
    preMoney: 0,
    investment: 0,
    sharesIssued: 0,
    pricePerShare: 0,
    liquidationPreference: 1,
    liquidationType: 'non-participating',
    dividendRate: 0,
    antiDilution: 'weighted-average',
    proRataRights: true,
    boardSeats: 0
  });
  
  const { toast } = useToast();

  const calculatePricePerShare = () => {
    if (newRound.sharesIssued > 0) {
      const calculatedPrice = newRound.investment / newRound.sharesIssued;
      setNewRound({...newRound, pricePerShare: calculatedPrice});
    }
  };

  const calculateSharesIssued = () => {
    if (newRound.pricePerShare > 0) {
      const calculatedShares = Math.round(newRound.investment / newRound.pricePerShare);
      setNewRound({...newRound, sharesIssued: calculatedShares});
    }
  };

  const addRound = () => {
    if (!newRound.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a round name.",
        variant: "destructive"
      });
      return;
    }

    if (newRound.investment <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid investment amount.",
        variant: "destructive"
      });
      return;
    }

    if (newRound.preMoney < 0) {
      toast({
        title: "Validation Error",
        description: "Pre-money valuation cannot be negative.",
        variant: "destructive"
      });
      return;
    }

    if (newRound.sharesIssued <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter the number of shares issued.",
        variant: "destructive"
      });
      return;
    }

    // Auto-calculate price per share if not set
    let finalRound = { ...newRound };
    if (finalRound.pricePerShare === 0 && finalRound.sharesIssued > 0) {
      finalRound.pricePerShare = finalRound.investment / finalRound.sharesIssued;
    }

    const round: InvestmentRound = {
      ...finalRound,
      id: Date.now().toString()
    };

    setInvestmentRounds([...investmentRounds, round]);
    setNewRound({
      name: '',
      type: 'seed',
      date: '',
      preMoney: 0,
      investment: 0,
      sharesIssued: 0,
      pricePerShare: 0,
      liquidationPreference: 1,
      liquidationType: 'non-participating',
      dividendRate: 0,
      antiDilution: 'weighted-average',
      proRataRights: true,
      boardSeats: 0
    });

    toast({
      title: "Investment Round Added",
      description: `${round.name} has been added to your cap table.`,
    });
  };

  const removeRound = (id: string) => {
    const roundToRemove = investmentRounds.find(r => r.id === id);
    setInvestmentRounds(investmentRounds.filter(r => r.id !== id));
    toast({
      title: "Round Removed",
      description: `${roundToRemove?.name} has been removed.`,
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'seed': return 'bg-green-100 text-green-800';
      case 'series-a': return 'bg-blue-100 text-blue-800';
      case 'series-b': return 'bg-purple-100 text-purple-800';
      case 'series-c': return 'bg-orange-100 text-orange-800';
      case 'bridge': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalInvestment = investmentRounds.reduce((sum, round) => sum + round.investment, 0);
  const totalShares = investmentRounds.reduce((sum, round) => sum + round.sharesIssued, 0);

  return (
    <div className="space-y-6">
      {/* Add New Investment Round */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add Investment Round
          </CardTitle>
          <CardDescription>
            Add funding rounds with detailed terms, liquidation preferences, and investor rights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="round-name">Round Name *</Label>
              <Input
                id="round-name"
                placeholder="Series A"
                value={newRound.name}
                onChange={(e) => setNewRound({...newRound, name: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="round-type">Round Type *</Label>
              <Select
                value={newRound.type}
                onValueChange={(value: 'seed' | 'series-a' | 'series-b' | 'series-c' | 'bridge') => 
                  setNewRound({...newRound, type: value})
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seed">Seed</SelectItem>
                  <SelectItem value="series-a">Series A</SelectItem>
                  <SelectItem value="series-b">Series B</SelectItem>
                  <SelectItem value="series-c">Series C</SelectItem>
                  <SelectItem value="bridge">Bridge</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="round-date">Date</Label>
              <Input
                id="round-date"
                type="date"
                value={newRound.date}
                onChange={(e) => setNewRound({...newRound, date: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="board-seats">Board Seats</Label>
              <Input
                id="board-seats"
                type="number"
                min="0"
                placeholder="1"
                value={newRound.boardSeats || ''}
                onChange={(e) => setNewRound({...newRound, boardSeats: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pre-money">Pre-Money Valuation *</Label>
              <Input
                id="pre-money"
                type="number"
                min="0"
                placeholder="5000000"
                value={newRound.preMoney || ''}
                onChange={(e) => setNewRound({...newRound, preMoney: parseFloat(e.target.value) || 0})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="investment">Investment Amount *</Label>
              <Input
                id="investment"
                type="number"
                min="0"
                placeholder="2000000"
                value={newRound.investment || ''}
                onChange={(e) => setNewRound({...newRound, investment: parseFloat(e.target.value) || 0})}
                required
              />
            </div>
            
            <div className="space-y-2 bg-gray-50 p-3 rounded">
              <Label className="text-sm text-gray-600">Post-Money Valuation</Label>
              <p className="text-lg font-bold text-gray-900">
                ₹{(newRound.preMoney + newRound.investment).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shares-issued">Shares Issued *</Label>
              <div className="flex space-x-2">
                <Input
                  id="shares-issued"
                  type="number"
                  min="0"
                  placeholder="400000"
                  value={newRound.sharesIssued || ''}
                  onChange={(e) => setNewRound({...newRound, sharesIssued: parseInt(e.target.value) || 0})}
                  required
                />
                <Button type="button" variant="outline" onClick={calculateSharesIssued}>
                  Calc
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price-per-share">Price Per Share</Label>
              <div className="flex space-x-2">
                <Input
                  id="price-per-share"
                  type="number"
                  min="0"
                  step="0.0001"
                  placeholder="5.0000"
                  value={newRound.pricePerShare || ''}
                  onChange={(e) => setNewRound({...newRound, pricePerShare: parseFloat(e.target.value) || 0})}
                />
                <Button type="button" variant="outline" onClick={calculatePricePerShare}>
                  Calc
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="liquidation-pref">Liquidation Preference</Label>
              <Input
                id="liquidation-pref"
                type="number"
                min="1"
                step="0.1"
                placeholder="1"
                value={newRound.liquidationPreference || ''}
                onChange={(e) => setNewRound({...newRound, liquidationPreference: parseFloat(e.target.value) || 1})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="liquidation-type">Liquidation Type</Label>
              <Select
                value={newRound.liquidationType}
                onValueChange={(value: 'participating' | 'non-participating') => 
                  setNewRound({...newRound, liquidationType: value})
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="non-participating">Non-Participating</SelectItem>
                  <SelectItem value="participating">Participating</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dividend-rate">Dividend Rate (%)</Label>
              <Input
                id="dividend-rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="8"
                value={newRound.dividendRate || ''}
                onChange={(e) => setNewRound({...newRound, dividendRate: parseFloat(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="anti-dilution">Anti-Dilution</Label>
              <Select
                value={newRound.antiDilution}
                onValueChange={(value: 'weighted-average' | 'full-ratchet' | 'none') => 
                  setNewRound({...newRound, antiDilution: value})
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weighted-average">Weighted Average</SelectItem>
                  <SelectItem value="full-ratchet">Full Ratchet</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pro-rata">Pro-Rata Rights</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Switch
                  id="pro-rata"
                  checked={newRound.proRataRights}
                  onCheckedChange={(checked) => setNewRound({...newRound, proRataRights: checked})}
                />
                <span className="text-sm">{newRound.proRataRights ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
          
          <Button onClick={addRound} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Investment Round
          </Button>
        </CardContent>
      </Card>

      {/* Investment Rounds List */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Investment Rounds ({investmentRounds.length})
          </CardTitle>
          <CardDescription>
            Total funding raised: ₹{totalInvestment.toLocaleString('en-IN')} • Total shares issued: {totalShares.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {investmentRounds.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No investment rounds added yet.</p>
              <p className="text-sm">Add your first funding round above to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Round</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Investment</TableHead>
                    <TableHead className="text-right">Pre-Money</TableHead>
                    <TableHead className="text-right">Post-Money</TableHead>
                    <TableHead className="text-right">Price/Share</TableHead>
                    <TableHead>Liquidation</TableHead>
                    <TableHead>Rights</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investmentRounds.map((round) => {
                    const postMoney = round.preMoney + round.investment;
                    
                    return (
                      <TableRow key={round.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{round.name}</TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(round.type)}>
                            {round.type.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {round.date ? new Date(round.date).toLocaleDateString() : 'Not set'}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{round.investment.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell className="text-right">
                          ₹{round.preMoney.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{postMoney.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell className="text-right">
                          ₹{round.pricePerShare.toFixed(4)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{round.liquidationPreference}x {round.liquidationType}</p>
                            {round.dividendRate > 0 && (
                              <p className="text-gray-500">{round.dividendRate}% dividend</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm space-y-1">
                            <p>{round.antiDilution}</p>
                            <p>{round.proRataRights ? 'Pro-rata: Yes' : 'Pro-rata: No'}</p>
                            {round.boardSeats > 0 && (
                              <p className="text-gray-500">{round.boardSeats} board seats</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeRound(round.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
