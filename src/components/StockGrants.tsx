
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, X, Award } from "lucide-react";
import { StockGrant } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface StockGrantsProps {
  grants: StockGrant[];
  setGrants: (grants: StockGrant[]) => void;
}

export const StockGrants: React.FC<StockGrantsProps> = ({ 
  grants, 
  setGrants 
}) => {
  const [newGrant, setNewGrant] = useState<Omit<StockGrant, 'id'>>({
    holderName: '',
    type: 'stock-options',
    quantity: 0,
    strikePrice: 0,
    grantDate: '',
    vestingSchedule: '4 years, 1 year cliff',
    cliffPeriod: 12,
    vestedQuantity: 0,
    performanceMetrics: '',
    accelerationProvisions: 'single'
  });
  
  const { toast } = useToast();

  const addGrant = () => {
    if (!newGrant.holderName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter the holder name.",
        variant: "destructive"
      });
      return;
    }

    if (newGrant.quantity <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid grant quantity.",
        variant: "destructive"
      });
      return;
    }

    if (!newGrant.grantDate) {
      toast({
        title: "Validation Error",
        description: "Please enter the grant date.",
        variant: "destructive"
      });
      return;
    }

    const grant: StockGrant = {
      ...newGrant,
      id: Date.now().toString()
    };

    setGrants([...grants, grant]);
    setNewGrant({
      holderName: '',
      type: 'stock-options',
      quantity: 0,
      strikePrice: 0,
      grantDate: '',
      vestingSchedule: '4 years, 1 year cliff',
      cliffPeriod: 12,
      vestedQuantity: 0,
      performanceMetrics: '',
      accelerationProvisions: 'single'
    });

    toast({
      title: "Stock Grant Added",
      description: `${grant.type} grant for ${grant.holderName} has been added.`,
    });
  };

  const removeGrant = (id: string) => {
    const grantToRemove = grants.find(g => g.id === id);
    setGrants(grants.filter(g => g.id !== id));
    toast({
      title: "Grant Removed",
      description: `Grant for ${grantToRemove?.holderName} has been removed.`,
    });
  };

  const updateVestedQuantity = (id: string, vestedQuantity: number) => {
    setGrants(grants.map(grant => 
      grant.id === id ? { ...grant, vestedQuantity } : grant
    ));
  };

  const calculateVestingProgress = (grant: StockGrant) => {
    if (!grant.grantDate) return 0;
    
    const grantDate = new Date(grant.grantDate);
    const currentDate = new Date();
    const monthsElapsed = (currentDate.getFullYear() - grantDate.getFullYear()) * 12 + 
                         (currentDate.getMonth() - grantDate.getMonth());
    
    if (monthsElapsed < grant.cliffPeriod) return 0;
    
    const vestingPeriodMonths = 48; // 4 years
    const vestedPercentage = Math.min(monthsElapsed / vestingPeriodMonths, 1);
    return Math.round(vestedPercentage * 100);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'stock-options': return 'bg-blue-100 text-blue-800';
      case 'rsu': return 'bg-green-100 text-green-800';
      case 'restricted-stock': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccelerationColor = (type: string) => {
    switch (type) {
      case 'single': return 'bg-yellow-100 text-yellow-800';
      case 'double': return 'bg-red-100 text-red-800';
      case 'none': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalGranted = grants.reduce((sum, g) => sum + g.quantity, 0);
  const totalVested = grants.reduce((sum, g) => sum + g.vestedQuantity, 0);

  return (
    <div className="space-y-6">
      {/* Add New Stock Grant */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add Stock Grant
          </CardTitle>
          <CardDescription>
            Add stock options, RSUs, and restricted stock grants with vesting schedules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grant-holder">Holder Name *</Label>
              <Input
                id="grant-holder"
                placeholder="Employee Name"
                value={newGrant.holderName}
                onChange={(e) => setNewGrant({...newGrant, holderName: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="grant-type">Grant Type *</Label>
              <Select
                value={newGrant.type}
                onValueChange={(value: 'stock-options' | 'rsu' | 'restricted-stock') => 
                  setNewGrant({...newGrant, type: value})
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock-options">Stock Options</SelectItem>
                  <SelectItem value="rsu">RSU</SelectItem>
                  <SelectItem value="restricted-stock">Restricted Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="grant-quantity">Quantity *</Label>
              <Input
                id="grant-quantity"
                type="number"
                min="0"
                placeholder="10,000"
                value={newGrant.quantity || ''}
                onChange={(e) => setNewGrant({...newGrant, quantity: parseInt(e.target.value) || 0})}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {newGrant.type === 'stock-options' && (
              <div className="space-y-2">
                <Label htmlFor="strike-price">Strike Price *</Label>
                <Input
                  id="strike-price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="1.00"
                  value={newGrant.strikePrice || ''}
                  onChange={(e) => setNewGrant({...newGrant, strikePrice: parseFloat(e.target.value) || 0})}
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="grant-date">Grant Date *</Label>
              <Input
                id="grant-date"
                type="date"
                value={newGrant.grantDate}
                onChange={(e) => setNewGrant({...newGrant, grantDate: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cliff-period">Cliff Period (months)</Label>
              <Input
                id="cliff-period"
                type="number"
                min="0"
                placeholder="12"
                value={newGrant.cliffPeriod || ''}
                onChange={(e) => setNewGrant({...newGrant, cliffPeriod: parseInt(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="acceleration">Acceleration</Label>
              <Select
                value={newGrant.accelerationProvisions}
                onValueChange={(value: 'single' | 'double' | 'none') => 
                  setNewGrant({...newGrant, accelerationProvisions: value})
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Trigger</SelectItem>
                  <SelectItem value="double">Double Trigger</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vesting-schedule">Vesting Schedule</Label>
              <Input
                id="vesting-schedule"
                placeholder="4 years, 1 year cliff"
                value={newGrant.vestingSchedule}
                onChange={(e) => setNewGrant({...newGrant, vestingSchedule: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="performance-metrics">Performance Metrics (Optional)</Label>
              <Input
                id="performance-metrics"
                placeholder="Revenue targets, milestones, etc."
                value={newGrant.performanceMetrics}
                onChange={(e) => setNewGrant({...newGrant, performanceMetrics: e.target.value})}
              />
            </div>
          </div>
          
          <Button onClick={addGrant} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Stock Grant
          </Button>
        </CardContent>
      </Card>

      {/* Grants List */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Stock Grants ({grants.length})
          </CardTitle>
          <CardDescription>
            Total granted: {totalGranted.toLocaleString()} • Total vested: {totalVested.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {grants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No stock grants added yet.</p>
              <p className="text-sm">Add your first stock grant above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Holder</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Strike Price</TableHead>
                    <TableHead>Grant Date</TableHead>
                    <TableHead className="text-right">Vested</TableHead>
                    <TableHead>Vesting Progress</TableHead>
                    <TableHead>Acceleration</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grants.map((grant) => {
                    const vestingProgress = calculateVestingProgress(grant);
                    const automaticVested = Math.floor((grant.quantity * vestingProgress) / 100);
                    
                    return (
                      <TableRow key={grant.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <p className="font-medium">{grant.holderName}</p>
                            {grant.performanceMetrics && (
                              <p className="text-xs text-gray-500">{grant.performanceMetrics}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(grant.type)}>
                            {grant.type.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{grant.quantity.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          {grant.strikePrice ? `₹${grant.strikePrice.toLocaleString('en-IN')}` : 'N/A'}
                        </TableCell>
                        <TableCell>{new Date(grant.grantDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            min="0"
                            max={grant.quantity}
                            value={grant.vestedQuantity}
                            onChange={(e) => updateVestedQuantity(grant.id, parseInt(e.target.value) || 0)}
                            className="w-20 h-8 text-right"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Auto: {automaticVested.toLocaleString()}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="w-24">
                            <Progress value={vestingProgress} className="h-2" />
                            <p className="text-xs text-gray-600 mt-1">{vestingProgress}%</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getAccelerationColor(grant.accelerationProvisions)} variant="outline">
                            {grant.accelerationProvisions}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeGrant(grant.id)}
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
