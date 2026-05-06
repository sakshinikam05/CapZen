
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
import { ConvertibleInstrument } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface ConvertibleInstrumentsProps {
  instruments: ConvertibleInstrument[];
  setInstruments: (instruments: ConvertibleInstrument[]) => void;
}

export const ConvertibleInstruments: React.FC<ConvertibleInstrumentsProps> = ({ 
  instruments, 
  setInstruments 
}) => {
  const [newInstrument, setNewInstrument] = useState<Omit<ConvertibleInstrument, 'id'>>({
    type: 'safe',
    holderName: '',
    principalAmount: 0,
    interestRate: 0,
    discountRate: 20,
    valuationCap: 0,
    maturityDate: '',
    conversionTrigger: 'qualified-financing',
    isConverted: false
  });
  
  const { toast } = useToast();

  const addInstrument = () => {
    if (!newInstrument.holderName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter the holder name.",
        variant: "destructive"
      });
      return;
    }

    if (newInstrument.principalAmount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid principal amount.",
        variant: "destructive"
      });
      return;
    }

    const instrument: ConvertibleInstrument = {
      ...newInstrument,
      id: Date.now().toString()
    };

    setInstruments([...instruments, instrument]);
    setNewInstrument({
      type: 'safe',
      holderName: '',
      principalAmount: 0,
      interestRate: 0,
      discountRate: 20,
      valuationCap: 0,
      maturityDate: '',
      conversionTrigger: 'qualified-financing',
      isConverted: false
    });

    toast({
      title: "Convertible Instrument Added",
      description: `${instrument.type.toUpperCase()} for ${instrument.holderName} has been added.`,
    });
  };

  const removeInstrument = (id: string) => {
    const instrumentToRemove = instruments.find(i => i.id === id);
    setInstruments(instruments.filter(i => i.id !== id));
    toast({
      title: "Instrument Removed",
      description: `${instrumentToRemove?.type.toUpperCase()} has been removed.`,
    });
  };

  const toggleConversion = (id: string) => {
    setInstruments(instruments.map(instrument => 
      instrument.id === id 
        ? { 
            ...instrument, 
            isConverted: !instrument.isConverted,
            conversionDate: !instrument.isConverted ? new Date().toISOString().split('T')[0] : undefined
          }
        : instrument
    ));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'safe': return 'bg-green-100 text-green-800';
      case 'convertible-note': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPrincipal = instruments.reduce((sum, i) => sum + i.principalAmount, 0);
  const convertedAmount = instruments.filter(i => i.isConverted).reduce((sum, i) => sum + i.principalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Add New Convertible Instrument */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add Convertible Instrument
          </CardTitle>
          <CardDescription>
            Add SAFEs, convertible notes, and other convertible securities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instrument-type">Type *</Label>
              <Select
                value={newInstrument.type}
                onValueChange={(value: 'safe' | 'convertible-note') => 
                  setNewInstrument({...newInstrument, type: value})
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="safe">SAFE</SelectItem>
                  <SelectItem value="convertible-note">Convertible Note</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="holder-name">Holder Name *</Label>
              <Input
                id="holder-name"
                placeholder="Investor Name"
                value={newInstrument.holderName}
                onChange={(e) => setNewInstrument({...newInstrument, holderName: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="principal">Principal Amount *</Label>
              <Input
                id="principal"
                type="number"
                min="0"
                placeholder="100,000"
                value={newInstrument.principalAmount || ''}
                onChange={(e) => setNewInstrument({...newInstrument, principalAmount: parseFloat(e.target.value) || 0})}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {newInstrument.type === 'convertible-note' && (
              <div className="space-y-2">
                <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                <Input
                  id="interest-rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="8"
                  value={newInstrument.interestRate || ''}
                  onChange={(e) => setNewInstrument({...newInstrument, interestRate: parseFloat(e.target.value) || 0})}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="discount-rate">Discount Rate (%)</Label>
              <Input
                id="discount-rate"
                type="number"
                min="0"
                max="100"
                step="1"
                placeholder="20"
                value={newInstrument.discountRate || ''}
                onChange={(e) => setNewInstrument({...newInstrument, discountRate: parseFloat(e.target.value) || 0})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="valuation-cap">Valuation Cap</Label>
              <Input
                id="valuation-cap"
                type="number"
                min="0"
                placeholder="10,000,000"
                value={newInstrument.valuationCap || ''}
                onChange={(e) => setNewInstrument({...newInstrument, valuationCap: parseFloat(e.target.value) || 0})}
              />
            </div>

            {newInstrument.type === 'convertible-note' && (
              <div className="space-y-2">
                <Label htmlFor="maturity-date">Maturity Date</Label>
                <Input
                  id="maturity-date"
                  type="date"
                  value={newInstrument.maturityDate}
                  onChange={(e) => setNewInstrument({...newInstrument, maturityDate: e.target.value})}
                />
              </div>
            )}
          </div>
          
          <Button onClick={addInstrument} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Convertible Instrument
          </Button>
        </CardContent>
      </Card>

      {/* Instruments List */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Convertible Instruments ({instruments.length})
          </CardTitle>
          <CardDescription>
            Total principal: ₹{totalPrincipal.toLocaleString('en-IN')} • Converted: ₹{convertedAmount.toLocaleString('en-IN')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {instruments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No convertible instruments added yet.</p>
              <p className="text-sm">Add your first SAFE or convertible note above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Holder</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Principal</TableHead>
                    <TableHead className="text-right">Discount %</TableHead>
                    <TableHead className="text-right">Val Cap</TableHead>
                    <TableHead className="text-right">Interest %</TableHead>
                    <TableHead>Maturity</TableHead>
                    <TableHead>Converted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instruments.map((instrument) => (
                    <TableRow key={instrument.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{instrument.holderName}</TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(instrument.type)}>
                          {instrument.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">₹{instrument.principalAmount.toLocaleString('en-IN')}</TableCell>
                      <TableCell className="text-right">{instrument.discountRate}%</TableCell>
                      <TableCell className="text-right">
                        {instrument.valuationCap ? `₹${instrument.valuationCap.toLocaleString('en-IN')}` : 'None'}
                      </TableCell>
                      <TableCell className="text-right">
                        {instrument.interestRate ? `${instrument.interestRate}%` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {instrument.maturityDate ? new Date(instrument.maturityDate).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={instrument.isConverted}
                            onCheckedChange={() => toggleConversion(instrument.id)}
                          />
                          <span className="text-sm">
                            {instrument.isConverted ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeInstrument(instrument.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
