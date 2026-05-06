import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Users } from "lucide-react";
import { Shareholder } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface ShareholderManagementProps {
  shareholders: Shareholder[];
  setShareholders: (shareholders: Shareholder[]) => void;
}

export const ShareholderManagement: React.FC<ShareholderManagementProps> = ({ 
  shareholders, 
  setShareholders 
}) => {
  const [newShareholder, setNewShareholder] = useState<Omit<Shareholder, 'id'>>({
    name: '',
    email: '',
    type: 'founder',
    commonShares: 0,
    preferredShares: 0,
    options: 0,
    vestingSchedule: ''
  });
  
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addShareholder = () => {
    if (!newShareholder.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a shareholder name.",
        variant: "destructive"
      });
      return;
    }

    if (newShareholder.email && !validateEmail(newShareholder.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    if (newShareholder.commonShares + newShareholder.preferredShares + newShareholder.options === 0) {
      toast({
        title: "Validation Error",
        description: "Please enter at least one type of equity (common shares, preferred shares, or options).",
        variant: "destructive"
      });
      return;
    }

    const shareholder: Shareholder = {
      ...newShareholder,
      id: Date.now().toString()
    };

    setShareholders([...shareholders, shareholder]);
    setNewShareholder({
      name: '',
      email: '',
      type: 'founder',
      commonShares: 0,
      preferredShares: 0,
      options: 0,
      vestingSchedule: ''
    });

    toast({
      title: "Shareholder Added",
      description: `${shareholder.name} has been added to the cap table.`,
    });
  };

  const removeShareholder = (id: string) => {
    const shareholderToRemove = shareholders.find(sh => sh.id === id);
    setShareholders(shareholders.filter(sh => sh.id !== id));
    toast({
      title: "Shareholder Removed",
      description: `${shareholderToRemove?.name} has been removed from the cap table.`,
    });
  };

  const totalShares = shareholders.reduce((sum, sh) => sum + sh.commonShares + sh.preferredShares, 0);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'founder': return 'bg-blue-100 text-blue-800';
      case 'investor': return 'bg-green-100 text-green-800';
      case 'employee': return 'bg-purple-100 text-purple-800';
      case 'advisor': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Shareholder */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add New Shareholder
          </CardTitle>
          <CardDescription>
            Add shareholders, investors, employees, and advisors to your cap table
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shareholder-name">Name *</Label>
              <Input
                id="shareholder-name"
                placeholder="John Doe"
                value={newShareholder.name}
                onChange={(e) => setNewShareholder({...newShareholder, name: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shareholder-email">Email</Label>
              <Input
                id="shareholder-email"
                type="email"
                placeholder="john@example.com"
                value={newShareholder.email}
                onChange={(e) => setNewShareholder({...newShareholder, email: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shareholder-type">Type *</Label>
              <Select
                value={newShareholder.type}
                onValueChange={(value: 'founder' | 'investor' | 'employee' | 'advisor') => 
                  setNewShareholder({...newShareholder, type: value})
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="founder">Founder</SelectItem>
                  <SelectItem value="investor">Investor</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="advisor">Advisor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="common-shares">Common Shares</Label>
              <Input
                id="common-shares"
                type="number"
                min="0"
                placeholder="0"
                value={newShareholder.commonShares || ''}
                onChange={(e) => setNewShareholder({...newShareholder, commonShares: parseInt(e.target.value) || 0})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preferred-shares">Preferred Shares</Label>
              <Input
                id="preferred-shares"
                type="number"
                min="0"
                placeholder="0"
                value={newShareholder.preferredShares || ''}
                onChange={(e) => setNewShareholder({...newShareholder, preferredShares: parseInt(e.target.value) || 0})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="options">Stock Options</Label>
              <Input
                id="options"
                type="number"
                min="0"
                placeholder="0"
                value={newShareholder.options || ''}
                onChange={(e) => setNewShareholder({...newShareholder, options: parseInt(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vesting-schedule">Vesting Schedule</Label>
              <Input
                id="vesting-schedule"
                placeholder="4 years, 1 year cliff"
                value={newShareholder.vestingSchedule}
                onChange={(e) => setNewShareholder({...newShareholder, vestingSchedule: e.target.value})}
              />
            </div>
          </div>
          
          <Button onClick={addShareholder} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Shareholder
          </Button>
        </CardContent>
      </Card>

      {/* Shareholders List */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Current Shareholders ({shareholders.length})
          </CardTitle>
          <CardDescription>
            Total shares issued: {totalShares.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {shareholders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No shareholders added yet.</p>
              <p className="text-sm">Add your first shareholder above to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Common</TableHead>
                    <TableHead className="text-right">Preferred</TableHead>
                    <TableHead className="text-right">Options</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Ownership %</TableHead>
                    <TableHead>Vesting</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shareholders.map((shareholder) => {
                    const shareholderTotal = shareholder.commonShares + shareholder.preferredShares;
                    const ownershipPercentage = totalShares > 0 ? (shareholderTotal / totalShares * 100).toFixed(2) : '0.00';
                    
                    return (
                      <TableRow key={shareholder.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <p className="font-medium">{shareholder.name}</p>
                            {shareholder.email && (
                              <p className="text-sm text-gray-500">{shareholder.email}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(shareholder.type)}>
                            {shareholder.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{shareholder.commonShares.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{shareholder.preferredShares.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{shareholder.options.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-medium">{shareholderTotal.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-medium">{ownershipPercentage}%</TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {shareholder.vestingSchedule || 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeShareholder(shareholder.id)}
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
