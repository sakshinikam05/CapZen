
export interface Company {
  name: string;
  incorporationDate: string;
  authorizedShares: number;
  jurisdiction: string;
}

export interface Shareholder {
  id: string;
  name: string;
  email: string;
  type: 'founder' | 'investor' | 'employee' | 'advisor';
  commonShares: number;
  preferredShares: number;
  options: number;
  vestingSchedule?: string;
  vestedShares?: number;
  cliffPeriod?: number;
  accelerationProvisions?: 'single' | 'double' | 'none';
}

export interface InvestmentRound {
  id: string;
  name: string;
  type: 'seed' | 'series-a' | 'series-b' | 'series-c' | 'bridge';
  date: string;
  preMoney: number;
  investment: number;
  sharesIssued: number;
  pricePerShare: number;
  liquidationPreference: number;
  liquidationType: 'participating' | 'non-participating';
  dividendRate?: number;
  antiDilution: 'weighted-average' | 'full-ratchet' | 'none';
  proRataRights: boolean;
  boardSeats?: number;
}

export interface ConvertibleInstrument {
  id: string;
  type: 'convertible-note' | 'safe';
  holderName: string;
  principalAmount: number;
  interestRate?: number;
  discountRate: number;
  valuationCap?: number;
  maturityDate?: string;
  conversionTrigger: 'qualified-financing' | 'maturity' | 'change-of-control';
  isConverted: boolean;
  conversionDate?: string;
}

export interface StockGrant {
  id: string;
  holderName: string;
  type: 'stock-options' | 'rsu' | 'restricted-stock';
  quantity: number;
  strikePrice?: number;
  grantDate: string;
  vestingSchedule: string;
  cliffPeriod: number;
  vestedQuantity: number;
  performanceMetrics?: string;
  accelerationProvisions: 'single' | 'double' | 'none';
}

export interface WaterfallScenario {
  id: string;
  name: string;
  exitValue: number;
  type: 'acquisition' | 'ipo' | 'liquidation';
  results: {
    shareholderId: string;
    payout: number;
    multiple: number;
  }[];
}
