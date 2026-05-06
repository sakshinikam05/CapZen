
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, IndianRupee } from "lucide-react";
import { Company, Shareholder, InvestmentRound } from "@/types";

interface CapTableDisplayProps {
  shareholders: Shareholder[];
  investmentRounds: InvestmentRound[];
  company: Company;
}

export const CapTableDisplay: React.FC<CapTableDisplayProps> = ({ 
  shareholders, 
  investmentRounds, 
  company 
}) => {
  const totalShares = shareholders.reduce((sum, sh) => sum + sh.commonShares + sh.preferredShares, 0);
  const totalOptions = shareholders.reduce((sum, sh) => sum + sh.options, 0);
  const fullyDilutedShares = totalShares + totalOptions;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'founder': return 'bg-blue-100 text-blue-800';
      case 'investor': return 'bg-green-100 text-green-800';
      case 'employee': return 'bg-purple-100 text-purple-800';
      case 'advisor': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (shareholders.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Cap Table Data</h3>
          <p className="text-gray-500">Add shareholders to see your capitalization table.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Shareholders</p>
              <p className="text-2xl font-bold text-gray-900">{shareholders.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Issued Shares</p>
              <p className="text-2xl font-bold text-gray-900">{totalShares.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <IndianRupee className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Option Pool</p>
              <p className="text-2xl font-bold text-gray-900">{totalOptions.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <TrendingUp className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Fully Diluted</p>
              <p className="text-2xl font-bold text-gray-900">{fullyDilutedShares.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cap Table */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Capitalization Table</CardTitle>
          <CardDescription>
            Complete ownership breakdown for {company.name || 'Your Company'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shareholder</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Common Shares</TableHead>
                  <TableHead className="text-right">Preferred Shares</TableHead>
                  <TableHead className="text-right">Stock Options</TableHead>
                  <TableHead className="text-right">Total Equity</TableHead>
                  <TableHead className="text-right">Ownership %</TableHead>
                  <TableHead className="text-right">Fully Diluted %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shareholders.map((shareholder) => {
                  const shareholderTotal = shareholder.commonShares + shareholder.preferredShares;
                  const ownershipPercentage = totalShares > 0 ? (shareholderTotal / totalShares * 100).toFixed(2) : '0.00';
                  const fullyDilutedPercentage = fullyDilutedShares > 0 ? ((shareholderTotal + shareholder.options) / fullyDilutedShares * 100).toFixed(2) : '0.00';
                  
                  return (
                    <TableRow key={shareholder.id}>
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
                      <TableCell className="text-right font-medium">{(shareholderTotal + shareholder.options).toLocaleString()}</TableCell>
                      <TableCell className="text-right font-medium">{ownershipPercentage}%</TableCell>
                      <TableCell className="text-right font-medium">{fullyDilutedPercentage}%</TableCell>
                    </TableRow>
                  );
                })}
                {/* Summary Row */}
                <TableRow className="bg-gray-50 font-semibold">
                  <TableCell>TOTAL</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell className="text-right">{shareholders.reduce((sum, sh) => sum + sh.commonShares, 0).toLocaleString()}</TableCell>
                  <TableCell className="text-right">{shareholders.reduce((sum, sh) => sum + sh.preferredShares, 0).toLocaleString()}</TableCell>
                  <TableCell className="text-right">{totalOptions.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{fullyDilutedShares.toLocaleString()}</TableCell>
                  <TableCell className="text-right">100.00%</TableCell>
                  <TableCell className="text-right">100.00%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
