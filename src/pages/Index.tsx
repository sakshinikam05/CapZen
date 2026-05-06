import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Users, TrendingUp, Download, FileSpreadsheet, LogOut, Sparkles, IndianRupee, Shield } from "lucide-react";
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
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { toast } = useToast();
  const { user, logout, saveCapData, loadCapData } = useAuth();
  const navigate = useNavigate();

  // Load user data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadCapData();
        if (data.company) setCompany(data.company as Company);
        if (data.shareholders) setShareholders(data.shareholders as Shareholder[]);
        if (data.investmentRounds) setInvestmentRounds(data.investmentRounds as InvestmentRound[]);
        if (data.convertibleInstruments) setConvertibleInstruments(data.convertibleInstruments as ConvertibleInstrument[]);
        if (data.stockGrants) setStockGrants(data.stockGrants as StockGrant[]);
        if (data.waterfallScenarios) setWaterfallScenarios(data.waterfallScenarios as WaterfallScenario[]);
      } finally {
        setIsDataLoaded(true);
      }
    };
    if (user) fetchData();
  }, [user]);

  // Auto-save data whenever it changes (only after initial load)
  useEffect(() => { if (user && isDataLoaded) saveCapData('company', company); }, [company, user, isDataLoaded]);
  useEffect(() => { if (user && isDataLoaded) saveCapData('shareholders', shareholders); }, [shareholders, user, isDataLoaded]);
  useEffect(() => { if (user && isDataLoaded) saveCapData('investmentRounds', investmentRounds); }, [investmentRounds, user, isDataLoaded]);
  useEffect(() => { if (user && isDataLoaded) saveCapData('convertibleInstruments', convertibleInstruments); }, [convertibleInstruments, user, isDataLoaded]);
  useEffect(() => { if (user && isDataLoaded) saveCapData('stockGrants', stockGrants); }, [stockGrants, user, isDataLoaded]);
  useEffect(() => { if (user && isDataLoaded) saveCapData('waterfallScenarios', waterfallScenarios); }, [waterfallScenarios, user, isDataLoaded]);

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
    <div className="min-h-screen flex flex-col" style={{ background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      <div className="container mx-auto px-4 py-8 flex-grow" style={{ maxWidth: 1400 }}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center gap-3">
              <Logo size="lg" />
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
                className="bg-slate-900 hover:bg-slate-800 text-white h-9 px-4 text-xs font-bold rounded-lg"
                disabled={shareholders.length === 0 && convertibleInstruments.length === 0 && stockGrants.length === 0}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 mr-2" />
                Export XLSX
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 h-9 px-4 text-xs font-bold rounded-lg"
              >
                <LogOut className="w-3.5 h-3.5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          
          {!isCompanyComplete && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6 flex items-center gap-3">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <p className="text-amber-800 text-sm font-medium">
                Complete your company information to unlock full features.
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {/* Company */}
          <Card className="border-slate-100 shadow-sm rounded-xl hover:shadow-md transition-all">
            <CardContent className="flex items-center p-4">
              <div className="p-2.5 rounded-lg mr-3 bg-blue-50">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-slate-500 mb-0.5">Company</p>
                <p className="text-sm font-black text-slate-900 truncate tracking-tight uppercase">
                  {company.name || 'Not Set'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Shareholders */}
          <Card className="border-slate-100 shadow-sm rounded-xl hover:shadow-md transition-all">
            <CardContent className="flex items-center p-4">
              <div className="p-2.5 rounded-lg mr-3 bg-green-50">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 mb-0.5">Shareholders</p>
                <p className="text-xl font-black text-slate-900 leading-none">{shareholders.length}</p>
              </div>
            </CardContent>
          </Card>

          {/* Total Shares */}
          <Card className="border-slate-100 shadow-sm rounded-xl hover:shadow-md transition-all">
            <CardContent className="flex items-center p-4">
              <div className="p-2.5 rounded-lg mr-3 bg-purple-50">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 mb-0.5 uppercase tracking-widest">Total Shares</p>
                <p className="text-xl font-black text-slate-900 leading-none">
                  {totalShares.toLocaleString('en-IN')}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Valuation */}
          <Card className="border-slate-100 shadow-sm rounded-xl hover:shadow-md transition-all">
            <CardContent className="flex items-center p-4">
              <div className="p-2.5 rounded-lg mr-3 bg-orange-50">
                <IndianRupee className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 mb-0.5">Valuation</p>
                <p className="text-xl font-black text-slate-900 leading-none">
                  {currentValuation ? `₹${currentValuation.toLocaleString('en-IN')}` : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Convertibles */}
          <Card className="border-slate-100 shadow-sm rounded-xl hover:shadow-md transition-all">
            <CardContent className="flex items-center p-4">
              <div className="p-2.5 rounded-lg mr-3 bg-red-50">
                <FileSpreadsheet className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 mb-0.5">Convertibles</p>
                <p className="text-xl font-black text-slate-900 leading-none">{convertibleInstruments.length}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Stock Grants */}
          <Card className="border-slate-100 shadow-sm rounded-xl hover:shadow-md transition-all">
            <CardContent className="flex items-center p-4">
              <div className="p-2.5 rounded-lg mr-3 bg-indigo-50">
                <Shield className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 mb-0.5">Stock Grants</p>
                <p className="text-xl font-black text-slate-900 leading-none">{stockGrants.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation Tabs */}
        <Tabs defaultValue="company" className="w-full">
          <div className="overflow-x-auto -mx-1 px-1">
            <TabsList className="flex w-max min-w-full bg-slate-50/80 border-none p-0 rounded-none mb-8 h-auto gap-1">
              <TabsTrigger value="company" className="px-8 py-4 rounded-none text-xs font-bold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-none relative transition-all border-b-2 border-transparent data-[state=active]:border-slate-900">
                Company
                {!isCompanyComplete && <span className="absolute top-3 right-5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />}
              </TabsTrigger>
              <TabsTrigger value="shareholders" className="px-8 py-4 rounded-none text-xs font-bold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-none transition-all border-b-2 border-transparent data-[state=active]:border-slate-900">
                Shareholders ({shareholders.length})
              </TabsTrigger>
              <TabsTrigger value="investments" className="px-8 py-4 rounded-none text-xs font-bold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-none transition-all border-b-2 border-transparent data-[state=active]:border-slate-900">
                Rounds ({investmentRounds.length})
              </TabsTrigger>
              <TabsTrigger value="ai-advisor" className="px-8 py-4 rounded-none text-xs font-bold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-none transition-all border-b-2 border-transparent data-[state=active]:border-slate-900 flex items-center gap-2">
                AI Advisor
              </TabsTrigger>
              <TabsTrigger value="convertibles" className="px-8 py-4 rounded-none text-xs font-bold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-none transition-all border-b-2 border-transparent data-[state=active]:border-slate-900">
                Convertibles ({convertibleInstruments.length})
              </TabsTrigger>
              <TabsTrigger value="grants" className="px-8 py-4 rounded-none text-xs font-bold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-none transition-all border-b-2 border-transparent data-[state=active]:border-slate-900">
                Grants ({stockGrants.length})
              </TabsTrigger>
              <TabsTrigger value="waterfall" className="px-8 py-4 rounded-none text-xs font-bold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-none transition-all border-b-2 border-transparent data-[state=active]:border-slate-900">
                Scenarios
              </TabsTrigger>
              <TabsTrigger value="captable" className="px-8 py-4 rounded-none text-xs font-bold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-none transition-all border-b-2 border-transparent data-[state=active]:border-slate-900">
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
