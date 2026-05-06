
import * as XLSX from 'xlsx';
import { Company, Shareholder, InvestmentRound, ConvertibleInstrument, StockGrant, WaterfallScenario } from '@/types';

export const exportEnhancedXLSX = (
  company: Company,
  shareholders: Shareholder[],
  investmentRounds: InvestmentRound[],
  convertibleInstruments: ConvertibleInstrument[],
  stockGrants: StockGrant[],
  waterfallScenarios: WaterfallScenario[]
) => {
  const workbook = XLSX.utils.book_new();

  // Company Summary Sheet
  const companyData = [
    ['AI-Powered CapTable Export - Enhanced'],
    [''],
    ['Company Information'],
    ['Company Name', company.name || 'Not Set'],
    ['Incorporation Date', company.incorporationDate || 'Not Set'],
    ['Jurisdiction', company.jurisdiction || 'Not Set'],
    ['Authorized Shares', company.authorizedShares?.toLocaleString() || '0'],
    [''],
    ['Generated On', new Date().toLocaleDateString()],
    ['Generated At', new Date().toLocaleTimeString()]
  ];

  const companySheet = XLSX.utils.aoa_to_sheet(companyData);
  XLSX.utils.book_append_sheet(workbook, companySheet, 'Company Info');

  // Enhanced Cap Table Summary
  const totalShares = shareholders.reduce((sum, sh) => sum + sh.commonShares + sh.preferredShares, 0);
  const totalOptions = shareholders.reduce((sum, sh) => sum + sh.options, 0);
  const totalVested = shareholders.reduce((sum, sh) => sum + (sh.vestedShares || 0), 0);
  const fullyDilutedShares = totalShares + totalOptions;

  const capTableHeaders = [
    'Name',
    'Email',
    'Type',
    'Common Shares',
    'Preferred Shares',
    'Stock Options',
    'Vested Shares',
    'Total Shares',
    'Ownership %',
    'Fully Diluted %',
    'Vesting Schedule',
    'Cliff Period',
    'Acceleration'
  ];

  const capTableData = shareholders.map(shareholder => {
    const shareholderShares = shareholder.commonShares + shareholder.preferredShares;
    const ownershipPercentage = totalShares > 0 ? (shareholderShares / totalShares * 100).toFixed(2) : '0.00';
    const fullyDilutedPercentage = fullyDilutedShares > 0 ? ((shareholderShares + shareholder.options) / fullyDilutedShares * 100).toFixed(2) : '0.00';

    return [
      shareholder.name,
      shareholder.email || '',
      shareholder.type,
      shareholder.commonShares,
      shareholder.preferredShares,
      shareholder.options,
      shareholder.vestedShares || 0,
      shareholderShares,
      `${ownershipPercentage}%`,
      `${fullyDilutedPercentage}%`,
      shareholder.vestingSchedule || '',
      shareholder.cliffPeriod || '',
      shareholder.accelerationProvisions || ''
    ];
  });

  capTableData.push([
    'TOTAL',
    '',
    '',
    shareholders.reduce((sum, sh) => sum + sh.commonShares, 0),
    shareholders.reduce((sum, sh) => sum + sh.preferredShares, 0),
    totalOptions,
    totalVested,
    totalShares,
    '100.00%',
    '100.00%',
    '',
    '',
    ''
  ]);

  const capTableSheet = XLSX.utils.aoa_to_sheet([capTableHeaders, ...capTableData]);
  XLSX.utils.book_append_sheet(workbook, capTableSheet, 'Enhanced Cap Table');

  // Enhanced Investment Rounds
  if (investmentRounds.length > 0) {
    const investmentHeaders = [
      'Round Name',
      'Type',
      'Date',
      'Pre-Money Valuation',
      'Investment Amount',
      'Post-Money Valuation',
      'Shares Issued',
      'Price Per Share',
      'Liquidation Preference',
      'Liquidation Type',
      'Dividend Rate',
      'Anti-Dilution',
      'Pro-Rata Rights',
      'Board Seats'
    ];

    const investmentData = investmentRounds.map(round => [
      round.name,
      round.type.replace('-', ' ').toUpperCase(),
      round.date || 'Not Set',
      `₹${round.preMoney.toLocaleString('en-IN')}`,
      `₹${round.investment.toLocaleString('en-IN')}`,
      `₹${(round.preMoney + round.investment).toLocaleString('en-IN')}`,
      round.sharesIssued.toLocaleString(),
      `₹${round.pricePerShare.toFixed(4)}`,
      `${round.liquidationPreference}x`,
      round.liquidationType,
      round.dividendRate ? `${round.dividendRate}%` : 'None',
      round.antiDilution,
      round.proRataRights ? 'Yes' : 'No',
      round.boardSeats || 0
    ]);

    const investmentSheet = XLSX.utils.aoa_to_sheet([investmentHeaders, ...investmentData]);
    XLSX.utils.book_append_sheet(workbook, investmentSheet, 'Investment Rounds');
  }

  // Convertible Instruments Sheet
  if (convertibleInstruments.length > 0) {
    const convertibleHeaders = [
      'Holder Name',
      'Type',
      'Principal Amount',
      'Interest Rate',
      'Discount Rate',
      'Valuation Cap',
      'Maturity Date',
      'Conversion Trigger',
      'Converted',
      'Conversion Date'
    ];

    const convertibleData = convertibleInstruments.map(instrument => [
      instrument.holderName,
      instrument.type.toUpperCase(),
      `₹${instrument.principalAmount.toLocaleString('en-IN')}`,
      instrument.interestRate ? `${instrument.interestRate}%` : 'N/A',
      `${instrument.discountRate}%`,
      instrument.valuationCap ? `₹${instrument.valuationCap.toLocaleString('en-IN')}` : 'None',
      instrument.maturityDate || 'N/A',
      instrument.conversionTrigger,
      instrument.isConverted ? 'Yes' : 'No',
      instrument.conversionDate || 'N/A'
    ]);

    const convertibleSheet = XLSX.utils.aoa_to_sheet([convertibleHeaders, ...convertibleData]);
    XLSX.utils.book_append_sheet(workbook, convertibleSheet, 'Convertible Instruments');
  }

  // Stock Grants Sheet
  if (stockGrants.length > 0) {
    const grantsHeaders = [
      'Holder Name',
      'Grant Type',
      'Quantity',
      'Strike Price',
      'Grant Date',
      'Vesting Schedule',
      'Cliff Period',
      'Vested Quantity',
      'Performance Metrics',
      'Acceleration'
    ];

    const grantsData = stockGrants.map(grant => [
      grant.holderName,
      grant.type.replace('-', ' ').toUpperCase(),
      grant.quantity.toLocaleString(),
      grant.strikePrice ? `₹${grant.strikePrice.toLocaleString('en-IN')}` : 'N/A',
      grant.grantDate,
      grant.vestingSchedule,
      `${grant.cliffPeriod} months`,
      grant.vestedQuantity.toLocaleString(),
      grant.performanceMetrics || 'None',
      grant.accelerationProvisions
    ]);

    const grantsSheet = XLSX.utils.aoa_to_sheet([grantsHeaders, ...grantsData]);
    XLSX.utils.book_append_sheet(workbook, grantsSheet, 'Stock Grants');
  }

  // Waterfall Analysis Sheets
  waterfallScenarios.forEach((scenario, index) => {
    const scenarioHeaders = [
      'Shareholder',
      'Type',
      'Shares',
      'Payout',
      'Multiple',
      '% of Exit Value'
    ];

    const scenarioData = scenario.results.map(result => {
      const shareholder = shareholders.find(sh => sh.id === result.shareholderId);
      if (!shareholder) return [];
      
      const shareholderShares = shareholder.commonShares + shareholder.preferredShares;
      const exitPercentage = (result.payout / scenario.exitValue) * 100;
      
      return [
        shareholder.name,
        shareholder.type,
        shareholderShares.toLocaleString(),
        `₹${result.payout.toLocaleString('en-IN')}`,
        `${result.multiple.toFixed(2)}x`,
        `${exitPercentage.toFixed(2)}%`
      ];
    });

    // Add scenario summary at the top
    const scenarioSummary = [
      [`Scenario: ${scenario.name}`],
      [`Exit Value: ₹${scenario.exitValue.toLocaleString('en-IN')}`],
      [`Exit Type: ${scenario.type.toUpperCase()}`],
      [`Generated: ${new Date().toLocaleDateString()}`],
      [''],
      scenarioHeaders,
      ...scenarioData
    ];

    const scenarioSheet = XLSX.utils.aoa_to_sheet(scenarioSummary);
    XLSX.utils.book_append_sheet(workbook, scenarioSheet, `Waterfall ${index + 1}`);
  });

  // Summary Analytics Sheet
  const analyticsData = [
    ['CapTable Analytics Summary'],
    [''],
    ['Equity Distribution'],
    ['Total Authorized Shares', company.authorizedShares?.toLocaleString() || '0'],
    ['Total Issued Shares', totalShares.toLocaleString()],
    ['Total Option Pool', totalOptions.toLocaleString()],
    ['Fully Diluted Shares', fullyDilutedShares.toLocaleString()],
    ['% of Authorized Used', company.authorizedShares ? `${((totalShares / company.authorizedShares) * 100).toFixed(2)}%` : 'N/A'],
    [''],
    ['Stakeholder Breakdown'],
    ['Founders', shareholders.filter(sh => sh.type === 'founder').length],
    ['Investors', shareholders.filter(sh => sh.type === 'investor').length],
    ['Employees', shareholders.filter(sh => sh.type === 'employee').length],
    ['Advisors', shareholders.filter(sh => sh.type === 'advisor').length],
    [''],
    ['Convertible Securities'],
    ['Total Convertible Amount', `₹${convertibleInstruments.reduce((sum, i) => sum + i.principalAmount, 0).toLocaleString('en-IN')}`],
    ['Converted Amount', `₹${convertibleInstruments.filter(i => i.isConverted).reduce((sum, i) => sum + i.principalAmount, 0).toLocaleString('en-IN')}`],
    ['Outstanding Amount', `₹${convertibleInstruments.filter(i => !i.isConverted).reduce((sum, i) => sum + i.principalAmount, 0).toLocaleString('en-IN')}`],
    [''],
    ['Funding History'],
    ['Total Rounds', investmentRounds.length],
    ['Total Funding Raised', `₹${investmentRounds.reduce((sum, r) => sum + r.investment, 0).toLocaleString('en-IN')}`],
    ['Latest Valuation', investmentRounds.length > 0 ? `₹${(investmentRounds[investmentRounds.length - 1].preMoney + investmentRounds[investmentRounds.length - 1].investment).toLocaleString('en-IN')}` : 'N/A']
  ];

  const analyticsSheet = XLSX.utils.aoa_to_sheet(analyticsData);
  XLSX.utils.book_append_sheet(workbook, analyticsSheet, 'Analytics');

  // Generate filename
  const companyName = company.name ? company.name.replace(/[^a-zA-Z0-9]/g, '_') : 'CapTable';
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${companyName}_Enhanced_CapTable_${timestamp}.xlsx`;

  // Export file
  XLSX.writeFile(workbook, filename);
};
