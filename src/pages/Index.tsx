import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Users, TrendingUp, Download, FileSpreadsheet, LogOut, Sparkles, IndianRupee } from "lucide-react";
import { CompanyInfo } from "@/components/CompanyInfo";
import { ShareholderManagement } from "@/components/ShareholderManagement";
import { InvestmentRounds } from "@/components/InvestmentRounds";
import { CapTableDisplay } from "@/components/CapTableDisplay";
import { ConvertibleInstruments } from "@/components/ConvertibleInstruments";
import { StockGrants } from "@/components/StockGrants";
import { WaterfallAnalysis } from "@/components/WaterfallAnalysis";
import { AIEquityCalculator } from "@/components/AIEquityCalculator";
import { Footer } from "@/components/Footer";
import { exportEnhancedXLSX } from "@/utils/enhancedExportUtils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Company, Shareholder, InvestmentRound, ConvertibleInstrument, StockGrant, WaterfallScenario } from "@/types";

const Index = () => {
  const [company, setCompany] = useState<Company>({
    name: '',
    incorporationDate: '',
    authorizedShares: 0,
    jurisdiction: ''
  });
  
  const [shareholders, setShareholders] = useState<Shareholder[]>([]);
  const [investmentRounds, setInvestmentRounds] = useState<InvestmentRound[]>([]);
  const [convertibleInstruments, setConvertibleInstruments] = useState<ConvertibleInstrument[]>([]);
  const [stockGrants, setStockGrants] = useState<StockGrant[]>([]);
  const [waterfallScenarios, setWaterfallScenarios] = useState<WaterfallScenario[]>([]);
  const { toast } = useToast();
  const { user, logout, saveCapData, loadCapData } = useAuth();
  const navigate = useNavigate();

  // Load user data on mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await loadCapData();
      if (data.company) setCompany(data.company as Company);
      if (data.shareholders) setShareholders(data.shareholders as Shareholder[]);
      if (data.investmentRounds) setInvestmentRounds(data.investmentRounds as InvestmentRound[]);
      if (data.convertibleInstruments) setConvertibleInstruments(data.convertibleInstruments as ConvertibleInstrument[]);
      if (data.stockGrants) setStockGrants(data.stockGrants as StockGrant[]);
      if (data.waterfallScenarios) setWaterfallScenarios(data.waterfallScenarios as WaterfallScenario[]);
    };
    if (user) fetchData();
  }, [user]);

  // Auto-save data whenever it changes
  useEffect(() => { if (user) saveCapData('company', company); }, [company, user]);
  useEffect(() => { if (user) saveCapData('shareholders', shareholders); }, [shareholders, user]);
  useEffect(() => { if (user) saveCapData('investmentRounds', investmentRounds); }, [investmentRounds, user]);
  useEffect(() => { if (user) saveCapData('convertibleInstruments', convertibleInstruments); }, [convertibleInstruments, user]);
  useEffect(() => { if (user) saveCapData('stockGrants', stockGrants); }, [stockGrants, user]);
  useEffect(() => { if (user) saveCapData('waterfallScenarios', waterfallScenarios); }, [waterfallScenarios, user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleExportToXLSX = () => {
    if (shareholders.length === 0 && convertibleInstruments.length === 0 && stockGrants.length === 0) {
      toast({
        title: "No Data to Export",
        description: "Please add shareholders, convertible instruments, or stock grants before exporting.",
        variant: "destructive"
      });
      return;
    }

    try {
      exportEnhancedXLSX(company, shareholders, investmentRounds, convertibleInstruments, stockGrants, waterfallScenarios);
      toast({
        title: "Export Successful",
        description: "Your enhanced cap table has been exported to XLSX format with all advanced features.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your cap table. Please try again.",
        variant: "destructive"
      });
    }
  };

  const totalShares = shareholders.reduce((sum, sh) => sum + sh.commonShares + sh.preferredShares, 0);
  const latestRound = investmentRounds[investmentRounds.length - 1];
  const currentValuation = latestRound ? latestRound.preMoney + latestRound.investment : 0;

  const isCompanyComplete = company.name && company.incorporationDate && company.authorizedShares > 0 && company.jurisdiction;

  const totalConvertibleValue = convertibleInstruments.reduce((sum, i) => sum + i.principalAmount, 0);
  const totalGrantedOptions = stockGrants.reduce((sum, g) => sum + g.quantity, 0);

  const currentCapTable = {
    company,
    shareholders,
    investmentRounds,
    convertibleInstruments,
    stockGrants
  };

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      <div className="container mx-auto px-4 py-8" style={{ maxWidth: 1140 }}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center gap-3">
              <Logo />
              <div style={{ width: 1, height: 24, background: '#e2e8f0', margin: '0 4px' }} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Dashboard</span>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              {user && (
                <div className="flex flex-col items-end mr-2">
                  <span className="text-sm font-bold text-slate-900">{user.name}</span>
                  <span className="text-xs text-slate-400">{user.email}</span>
                </div>
              )}
              <Button 
                onClick={handleExportToXLSX} 
                className="bg-slate-900 hover:bg-slate-800 text-white"
                disabled={shareholders.length === 0 && convertibleInstruments.length === 0 && stockGrants.length === 0}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export XLSX
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          
          {!isCompanyComplete && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
              <p className="text-amber-800 text-sm flex items-center gap-2">
                <span className="text-lg">⚠️</span> Complete your company information to unlock full features.
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="flex items-center p-6">
              <div className="bg-slate-100 p-3 rounded-xl mr-4">
                <Building className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Company</p>
                <p className="text-lg font-black text-slate-900 truncate">
                  {company.name || 'Set Name'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="flex items-center p-6">
              <div className="bg-slate-100 p-3 rounded-xl mr-4">
                <Users className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Shareholders</p>
                <p className="text-lg font-black text-slate-900">{shareholders.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="flex items-center p-6">
              <div className="bg-slate-100 p-3 rounded-xl mr-4">
                <IndianRupee className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Current Valuation</p>
                <p className="text-lg font-black text-slate-900">
                  {currentValuation ? `₹${currentValuation.toLocaleString('en-IN')}` : '₹0'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="flex items-center p-6">
              <div className="bg-slate-900 p-3 rounded-xl mr-4">
                <Sparkles className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">AI Advisor</p>
                <p className="text-lg font-black text-slate-900">Online</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="company" className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="flex w-max min-w-full bg-white border border-slate-200 p-1 rounded-xl mb-6">
              <TabsTrigger value="company" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                Company
              </TabsTrigger>
              <TabsTrigger value="shareholders" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                Shareholders
              </TabsTrigger>
              <TabsTrigger value="investments" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                Rounds
              </TabsTrigger>
              <TabsTrigger value="ai-advisor" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white gap-2">
                <Sparkles size={14} className="text-yellow-500" /> AI Advisor
              </TabsTrigger>
              <TabsTrigger value="convertibles" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                Convertibles
              </TabsTrigger>
              <TabsTrigger value="grants" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                Grants
              </TabsTrigger>
              <TabsTrigger value="waterfall" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                Scenarios
              </TabsTrigger>
              <TabsTrigger value="captable" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                Cap Table
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="company" className="space-y-6">
            <CompanyInfo company={company} setCompany={setCompany} />
          </TabsContent>

          <TabsContent value="shareholders" className="space-y-6">
            <ShareholderManagement 
              shareholders={shareholders} 
              setShareholders={setShareholders} 
            />
          </TabsContent>

          <TabsContent value="investments" className="space-y-6">
            <InvestmentRounds 
              investmentRounds={investmentRounds}
              setInvestmentRounds={setInvestmentRounds}
            />
          </TabsContent>

          <TabsContent value="ai-advisor" className="space-y-6">
            <AIEquityCalculator currentData={currentCapTable} />
          </TabsContent>

          <TabsContent value="convertibles" className="space-y-6">
            <ConvertibleInstruments 
              instruments={convertibleInstruments}
              setInstruments={setConvertibleInstruments}
            />
          </TabsContent>

          <TabsContent value="grants" className="space-y-6">
            <StockGrants 
              grants={stockGrants}
              setGrants={setStockGrants}
            />
          </TabsContent>

          <TabsContent value="waterfall" className="space-y-6">
            <WaterfallAnalysis 
              scenarios={waterfallScenarios}
              setScenarios={setWaterfallScenarios}
              shareholders={shareholders}
              investmentRounds={investmentRounds}
            />
          </TabsContent>

          <TabsContent value="captable" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase">Capitalization Table</h2>
                <p className="text-slate-500">Real-time ownership breakdown in INR (₹)</p>
              </div>
              <Button 
                onClick={handleExportToXLSX} 
                className="bg-slate-900 hover:bg-slate-800"
                disabled={shareholders.length === 0 && convertibleInstruments.length === 0 && stockGrants.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export XLSX
              </Button>
            </div>
            <CapTableDisplay 
              shareholders={shareholders}
              investmentRounds={investmentRounds}
              company={company}
            />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
