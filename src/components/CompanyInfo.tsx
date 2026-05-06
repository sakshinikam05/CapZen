import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building } from "lucide-react";
import { Company } from "@/types";

interface CompanyInfoProps {
  company: Company;
  setCompany: (company: Company) => void;
}

export const CompanyInfo: React.FC<CompanyInfoProps> = ({ company, setCompany }) => {
  const handleInputChange = (field: keyof Company, value: string | number) => {
    setCompany({
      ...company,
      [field]: value
    });
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building className="w-5 h-5 mr-2" />
          Company Information
        </CardTitle>
        <CardDescription>
          Enter your company's basic information to get started with your cap table
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name *</Label>
            <Input
              id="company-name"
              placeholder="Enter company name"
              value={company.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="incorporation-date">Incorporation Date *</Label>
            <Input
              id="incorporation-date"
              type="date"
              value={company.incorporationDate}
              onChange={(e) => handleInputChange('incorporationDate', e.target.value)}
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="authorized-shares">Authorized Shares *</Label>
            <Input
              id="authorized-shares"
              type="number"
              min="1"
              placeholder="10,000,000"
              value={company.authorizedShares || ''}
              onChange={(e) => handleInputChange('authorizedShares', parseInt(e.target.value) || 0)}
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jurisdiction">Jurisdiction *</Label>
            <Input
              id="jurisdiction"
              placeholder="Delaware, USA"
              value={company.jurisdiction}
              onChange={(e) => handleInputChange('jurisdiction', e.target.value)}
              className="w-full"
              required
            />
          </div>
        </div>
        
        {company.name && company.incorporationDate && company.authorizedShares > 0 && company.jurisdiction && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">✓ Company information is complete</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
