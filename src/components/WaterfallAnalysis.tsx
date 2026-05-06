
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, X, TrendingUp, Calculator } from "lucide-react";
import { WaterfallScenario, Shareholder, InvestmentRound } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface WaterfallAnalysisProps {
  scenarios: WaterfallScenario[];
  setScenarios: (scenarios: WaterfallScenario[]) => void;
  shareholders: Shareholder[];
  investmentRounds: InvestmentRound[];
}

export const WaterfallAnalysis: React.FC<WaterfallAnalysisProps> = ({ 
  scenarios, 
  setScenarios,
  shareholders,
  investmentRounds
}) => {
  const [newScenario, setNewScenario] = useState<Omit<WaterfallScenario, 'id' | 'results'>>({
    name: '',
    exitValue: 0,
    type: 'acquisition'
  });
  
  const { toast } = useToast();

  const calculateWaterfall = (exitValue: number) => {
    const results: { shareholderId: string; payout: number; multiple: number; }[] = [];
    let remainingValue = exitValue;

    // Sort investment rounds by seniority (later rounds first for liquidation preference)
    const sortedRounds = [...investmentRounds].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Calculate liquidation preferences
    const liquidationPayouts = new Map<string, number>();
    
    for (const round of sortedRounds) {
      const roundShareholders = shareholders.filter(sh => sh.preferredShares > 0);
      const totalRoundShares = roundShareholders.reduce((sum, sh) => sum + sh.preferredShares, 0);
      
      if (totalRoundShares > 0) {
        const liquidationAmount = round.sharesIssued * round.pricePerShare * round.liquidationPreference;
        const availableForRound = Math.min(liquidationAmount, remainingValue);
        
        roundShareholders.forEach(shareholder => {
          const shareholderPortion = (shareholder.preferredShares / totalRoundShares) * availableForRound;
          liquidationPayouts.set(shareholder.id, 
            (liquidationPayouts.get(shareholder.id) || 0) + shareholderPortion
          );
        });
        
        remainingValue -= availableForRound;
      }
    }

    // Calculate common stock payouts from remaining value
    const totalShares = shareholders.reduce((sum, sh) => sum + sh.commonShares + sh.preferredShares, 0);
    
    shareholders.forEach(shareholder => {
      const liquidationPayout = liquidationPayouts.get(shareholder.id) || 0;
      const shareholderShares = shareholder.commonShares + shareholder.preferredShares;
      const commonPayout = remainingValue > 0 ? 
        (shareholderShares / totalShares) * remainingValue : 0;
      
      const totalPayout = liquidationPayout + commonPayout;
      const originalInvestment = calculateOriginalInvestment(shareholder);
      const multiple = originalInvestment > 0 ? totalPayout / originalInvestment : 0;
      
      results.push({
        shareholderId: shareholder.id,
        payout: totalPayout,
        multiple
      });
    });

    return results;
  };

  const calculateOriginalInvestment = (shareholder: Shareholder) => {
    // This is a simplified calculation - in reality you'd track actual investment amounts
    const averageRoundPrice = investmentRounds.length > 0 
      ? investmentRounds.reduce((sum, round) => sum + round.pricePerShare, 0) / investmentRounds.length
      : 1;
    
    return (shareholder.commonShares + shareholder.preferredShares) * averageRoundPrice;
  };

  const addScenario = () => {
    if (!newScenario.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a scenario name.",
        variant: "destructive"
      });
      return;
    }

    if (newScenario.exitValue <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid exit value.",
        variant: "destructive"
      });
      return;
    }

    const results = calculateWaterfall(newScenario.exitValue);
    
    const scenario: WaterfallScenario = {
      ...newScenario,
      id: Date.now().toString(),
      results
    };

    setScenarios([...scenarios, scenario]);
    setNewScenario({
      name: '',
      exitValue: 0,
      type: 'acquisition'
    });

    toast({
      title: "Scenario Added",
      description: `${scenario.name} waterfall analysis has been created.`,
    });
  };

  const removeScenario = (id: string) => {
    const scenarioToRemove = scenarios.find(s => s.id === id);
    setScenarios(scenarios.filter(s => s.id !== id));
    toast({
      title: "Scenario Removed",
      description: `${scenarioToRemove?.name} has been removed.`,
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'acquisition': return 'bg-green-100 text-green-800';
      case 'ipo': return 'bg-blue-100 text-blue-800';
      case 'liquidation': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Scenario */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add Exit Scenario
          </CardTitle>
          <CardDescription>
            Model different exit scenarios to analyze potential returns for each stakeholder
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scenario-name">Scenario Name *</Label>
              <Input
                id="scenario-name"
                placeholder="$50M Acquisition"
                value={newScenario.name}
                onChange={(e) => setNewScenario({...newScenario, name: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exit-value">Exit Value *</Label>
              <Input
                id="exit-value"
                type="number"
                min="0"
                placeholder="50000000"
                value={newScenario.exitValue || ''}
                onChange={(e) => setNewScenario({...newScenario, exitValue: parseFloat(e.target.value) || 0})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scenario-type">Exit Type *</Label>
              <Select
                value={newScenario.type}
                onValueChange={(value: 'acquisition' | 'ipo' | 'liquidation') => 
                  setNewScenario({...newScenario, type: value})
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acquisition">Acquisition</SelectItem>
                  <SelectItem value="ipo">IPO</SelectItem>
                  <SelectItem value="liquidation">Liquidation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={addScenario} className="w-full md:w-auto">
            <Calculator className="w-4 h-4 mr-2" />
            Calculate Waterfall
          </Button>
        </CardContent>
      </Card>

      {/* Scenarios List */}
      <div className="space-y-6">
        {scenarios.map((scenario) => (
          <Card key={scenario.id} className="animate-fade-in">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    {scenario.name}
                  </CardTitle>
                  <CardDescription>
                    Exit Value: ₹{scenario.exitValue.toLocaleString('en-IN')} • Type: {scenario.type}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getTypeColor(scenario.type)}>
                    {scenario.type.toUpperCase()}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeScenario(scenario.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shareholder</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Shares</TableHead>
                      <TableHead className="text-right">Payout</TableHead>
                      <TableHead className="text-right">Multiple</TableHead>
                      <TableHead className="text-right">% of Exit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scenario.results
                      .sort((a, b) => b.payout - a.payout)
                      .map((result) => {
                        const shareholder = shareholders.find(sh => sh.id === result.shareholderId);
                        if (!shareholder) return null;
                        
                        const shareholderShares = shareholder.commonShares + shareholder.preferredShares;
                        const exitPercentage = (result.payout / scenario.exitValue) * 100;
                        
                        return (
                          <TableRow key={result.shareholderId} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{shareholder.name}</TableCell>
                            <TableCell>
                              <Badge className={
                                shareholder.type === 'founder' ? 'bg-blue-100 text-blue-800' :
                                shareholder.type === 'investor' ? 'bg-green-100 text-green-800' :
                                shareholder.type === 'employee' ? 'bg-purple-100 text-purple-800' :
                                'bg-orange-100 text-orange-800'
                              }>
                                {shareholder.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">{shareholderShares.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-medium">
                              ₹{result.payout.toLocaleString('en-IN')}
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={result.multiple >= 1 ? 'text-green-600' : 'text-red-600'}>
                                {result.multiple.toFixed(2)}x
                              </span>
                            </TableCell>
                            <TableCell className="text-right">{exitPercentage.toFixed(2)}%</TableCell>
                          </TableRow>
                        );
                      })}
                    
                    {/* Summary Row */}
                    <TableRow className="border-t-2 bg-gray-50 font-medium">
                      <TableCell className="font-bold">TOTAL</TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-right font-bold">
                        {shareholders.reduce((sum, sh) => sum + sh.commonShares + sh.preferredShares, 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        ₹{scenario.results.reduce((sum, r) => sum + r.payout, 0).toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {(scenario.results.reduce((sum, r) => sum + r.payout, 0) / scenario.exitValue * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right font-bold">100.00%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {scenarios.length === 0 && (
          <Card className="animate-fade-in">
            <CardContent className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Calculator className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium mb-2">No exit scenarios modeled yet</p>
              <p className="text-gray-400">Add an exit scenario above to analyze potential returns.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
