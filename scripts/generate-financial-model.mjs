import ExcelJS from 'exceljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================================================
// CAROBEST — VC-GRADE FINANCIAL MODEL (10-SHEET WORKBOOK)
// Every number traceable. Every assumption documented.
// ============================================================================

const wb = new ExcelJS.Workbook();
wb.creator = 'CaroBest';
wb.created = new Date(2026, 1, 28);
wb.modified = new Date(2026, 1, 28);

// ─── COLORS ─────────────────────────────────────────────────────────────────
const C = {
  bg:     'FF0B0B0F',
  panel:  'FF16161E',
  header: 'FF1E1E2A',
  sub:    'FF141420',
  gold:   'FFC9A84C',
  white:  'FFF0EDE5',
  dim:    'FF7A7573',
  green:  'FF34C759',
  red:    'FFFF3B30',
  blue:   'FF5AC8FA',
  amber:  'FFFF9F0A',
  input:  'FF4A90D9',  // blue for editable inputs
  dark:   'FF080808',
};

// ─── FONTS ──────────────────────────────────────────────────────────────────
const F = {
  base:   { name: 'Calibri', size: 10, color: { argb: C.white } },
  bold:   { name: 'Calibri', size: 10, bold: true, color: { argb: C.white } },
  gold:   { name: 'Calibri', size: 10, bold: true, color: { argb: C.gold } },
  goldLg: { name: 'Calibri', size: 13, bold: true, color: { argb: C.gold } },
  dim:    { name: 'Calibri', size: 10, color: { argb: C.dim } },
  green:  { name: 'Calibri', size: 10, bold: true, color: { argb: C.green } },
  red:    { name: 'Calibri', size: 10, bold: true, color: { argb: C.red } },
  input:  { name: 'Calibri', size: 10, bold: true, color: { argb: C.input } },
  title:  { name: 'Calibri', size: 18, bold: true, color: { argb: C.gold } },
  sub:    { name: 'Calibri', size: 11, color: { argb: C.dim } },
  dark:   { name: 'Calibri', size: 10, bold: true, color: { argb: C.dark } },
};

// ─── FILLS ──────────────────────────────────────────────────────────────────
const fill = (argb) => ({ type: 'pattern', pattern: 'solid', fgColor: { argb } });
const BG     = fill(C.bg);
const PANEL  = fill(C.panel);
const HEADER = fill(C.header);
const SUB    = fill(C.sub);
const GOLD_F = fill(C.gold);
const GREEN_F = fill('FF0D1F0D');
const RED_F   = fill('FF1F0D0D');

// ─── BORDERS ────────────────────────────────────────────────────────────────
const bdr = (argb) => ({
  top: { style: 'thin', color: { argb } },
  bottom: { style: 'thin', color: { argb } },
  left: { style: 'thin', color: { argb } },
  right: { style: 'thin', color: { argb } }
});
const B_THIN = bdr('FF2A2A35');
const B_GOLD = bdr(C.gold);

// ─── NUMBER FORMATS ─────────────────────────────────────────────────────────
const FMT = {
  inr:   '\u20B9#,##0',
  inrL:  '#,##0.0',
  inrK:  '\u20B9#,##0',
  pct:   '0%',
  pct1:  '0.0%',
  num:   '#,##0',
  dec1:  '#,##0.0',
  dec2:  '#,##0.00',
};

// ─── HELPERS ────────────────────────────────────────────────────────────────
function initSheet(ws, freeze) {
  ws.properties.defaultRowHeight = 22;
  // Apply dark background to all rows
  for (let r = 1; r <= 80; r++) {
    const row = ws.getRow(r);
    for (let c = 1; c <= 30; c++) {
      const cell = row.getCell(c);
      cell.fill = BG;
      cell.font = F.base;
    }
  }
  if (freeze) {
    ws.views = [{ state: 'frozen', xSplit: freeze.col || 1, ySplit: freeze.row || 2 }];
  }
}

function setWidths(ws, widths) {
  widths.forEach((w, i) => { ws.getColumn(i + 1).width = w; });
}

function writeRow(ws, rowNum, values, opts = {}) {
  const row = ws.getRow(rowNum);
  row.height = opts.height || 24;

  values.forEach((v, i) => {
    const cell = row.getCell(i + 1);
    cell.value = v;
    cell.border = opts.goldBorder ? B_GOLD : B_THIN;
    cell.alignment = {
      vertical: 'middle',
      horizontal: opts.align ? opts.align[i] || 'left' : (i === 0 ? 'left' : 'center'),
      wrapText: opts.wrap || false
    };

    // Fill
    if (opts.isTotal) cell.fill = GOLD_F;
    else if (opts.isSub) cell.fill = SUB;
    else if (opts.isHeader) cell.fill = HEADER;
    else if (opts.alt) cell.fill = PANEL;
    else cell.fill = BG;

    // Font
    if (opts.isTotal) cell.font = F.dark;
    else if (opts.isHeader) cell.font = F.gold;
    else if (opts.isSub) cell.font = opts.subFont || F.gold;
    else if (i === 0 && opts.labelFont) cell.font = opts.labelFont;
    else if (i === 0) cell.font = F.base;
    else if (opts.valueFont) cell.font = opts.valueFont;
    else cell.font = F.base;

    // Number format
    if (opts.fmt && i > 0) cell.numFmt = opts.fmt;
    if (opts.fmts && opts.fmts[i]) cell.numFmt = opts.fmts[i];
  });
}

function sectionHeader(ws, rowNum, text, colSpan) {
  ws.mergeCells(rowNum, 1, rowNum, colSpan);
  const row = ws.getRow(rowNum);
  row.height = 32;
  const cell = row.getCell(1);
  cell.value = text;
  cell.font = F.goldLg;
  cell.fill = HEADER;
  cell.border = B_GOLD;
  cell.alignment = { vertical: 'middle', horizontal: 'left' };
}

// ─── FINANCIAL MODEL DATA ───────────────────────────────────────────────────
// All numbers are in LAKHS unless noted otherwise
// 24-month model (M1 to M24)

// Dealer acquisition assumptions
const NEW_DEALERS = [
  // Y1: M1-M12
  10, 15, 20, 25, 30, 35, 40, 50, 55, 60, 70, 80,
  // Y2: M13-M24
  100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320
];

const CONV_RATE = [
  // Y1
  0, 0, 0.35, 0.38, 0.40, 0.42, 0.44, 0.45, 0.47, 0.48, 0.50, 0.50,
  // Y2
  0.52, 0.53, 0.54, 0.55, 0.55, 0.56, 0.56, 0.57, 0.57, 0.58, 0.58, 0.58
];

const CHURN_RATE = [
  // Y1
  0, 0, 0.05, 0.05, 0.05, 0.04, 0.04, 0.04, 0.04, 0.03, 0.03, 0.03,
  // Y2
  0.03, 0.03, 0.025, 0.025, 0.025, 0.025, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02
];

const ARPU = [
  // Y1 (Rs per dealer per month)
  0, 0, 999, 999, 999, 999, 1100, 1100, 1200, 1300, 1400, 1500,
  // Y2
  1600, 1700, 1800, 1900, 2000, 2000, 2100, 2200, 2200, 2300, 2400, 2500
];

// Compute dealer funnel
const cumulDealers = [];
const paidDealers = [];
const churnedDealers = [];
let cumDealers = 0;
let curPaid = 0;

for (let i = 0; i < 24; i++) {
  cumDealers += NEW_DEALERS[i];
  cumulDealers.push(cumDealers);

  const newPaid = Math.round(NEW_DEALERS[i] * CONV_RATE[i]);
  const churned = Math.round(curPaid * CHURN_RATE[i]);
  curPaid = Math.max(0, curPaid + newPaid - churned);
  paidDealers.push(curPaid);
  churnedDealers.push(churned);
}

// SaaS Revenue (in lakhs)
const saasRev = paidDealers.map((p, i) => +((p * ARPU[i]) / 100000).toFixed(2));

// VehiclePassport
const passportVol = [
  0, 0, 30, 50, 80, 120, 160, 220, 300, 400, 550, 750,
  900, 1100, 1300, 1500, 1800, 2100, 2400, 2800, 3200, 3600, 4000, 4500
];
const passportASP = [
  0, 0, 399, 399, 449, 449, 449, 499, 499, 499, 499, 499,
  549, 549, 549, 599, 599, 599, 649, 649, 649, 699, 699, 699
];
const passportRev = passportVol.map((v, i) => +((v * passportASP[i]) / 100000).toFixed(2));

// B2B DemandPulse
const b2bContracts = [
  0, 0, 0, 1, 1, 2, 3, 3, 4, 5, 6, 8,
  10, 12, 14, 16, 18, 20, 22, 25, 28, 30, 33, 36
];
const b2bACV = 25000; // Rs per month per contract (starting lower, more realistic)
const b2bRev = b2bContracts.map(c => +((c * b2bACV) / 100000).toFixed(2));

// Total revenue
const totalRev = saasRev.map((s, i) => +(s + passportRev[i] + b2bRev[i]).toFixed(2));

// ─── COSTS ──────────────────────────────────────────────────────────────────
const teamCost = [
  // Y1: founders only M1-2, full team M3+
  2.10, 2.10, 7.50, 7.50, 7.50, 7.50, 7.50, 7.50, 7.50, 7.50, 7.50, 7.50,
  // Y2: growing team
  10.0, 10.0, 12.0, 12.0, 14.0, 14.0, 16.0, 16.0, 18.0, 18.0, 20.0, 20.0
];

const cloudCost = [
  0.15, 0.15, 0.20, 0.20, 0.20, 0.25, 0.25, 0.25, 0.30, 0.30, 0.30, 0.35,
  0.40, 0.45, 0.50, 0.55, 0.60, 0.65, 0.70, 0.80, 0.85, 0.90, 1.00, 1.10
];

const apiCost = [
  0.05, 0.05, 0.10, 0.12, 0.15, 0.18, 0.20, 0.22, 0.25, 0.28, 0.30, 0.35,
  0.40, 0.45, 0.50, 0.55, 0.60, 0.65, 0.70, 0.75, 0.80, 0.85, 0.90, 1.00
];

const paymentFees = totalRev.map(r => +(r * 0.02).toFixed(2)); // 2% Razorpay

const totalCogs = cloudCost.map((c, i) => +(c + apiCost[i] + paymentFees[i]).toFixed(2));
const grossProfit = totalRev.map((r, i) => +(r - totalCogs[i]).toFixed(2));
const grossMargin = totalRev.map((r, i) => r > 0 ? grossProfit[i] / r : 0);

// OpEx
const freelanceCost = [
  0.30, 0.30, 0.30, 0.30, 0.30, 0.30, 0.50, 0.50, 0.50, 0.50, 0.50, 0.50,
  0.60, 0.60, 0.80, 0.80, 1.00, 1.00, 1.00, 1.00, 1.20, 1.20, 1.20, 1.20
];

const salesCost = [
  0.10, 0.10, 0.20, 0.20, 0.25, 0.25, 0.30, 0.30, 0.30, 0.35, 0.35, 0.40,
  0.50, 0.60, 0.70, 0.80, 1.00, 1.20, 1.40, 1.60, 1.80, 2.00, 2.20, 2.50
];

const legalCost = [
  0.50, 0.25, 0.25, 0.20, 0.20, 0.20, 0.20, 0.15, 0.15, 0.15, 0.15, 0.15,
  0.15, 0.15, 0.15, 0.15, 0.20, 0.20, 0.20, 0.20, 0.25, 0.25, 0.25, 0.25
];

const officeCost = [
  0.20, 0.20, 0.20, 0.20, 0.20, 0.20, 0.20, 0.20, 0.20, 0.20, 0.20, 0.20,
  0.30, 0.30, 0.35, 0.35, 0.40, 0.40, 0.45, 0.45, 0.50, 0.50, 0.50, 0.50
];

const marketingCost = [
  0, 0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.50, 0.60,
  0.80, 1.00, 1.20, 1.50, 1.80, 2.00, 2.50, 2.80, 3.00, 3.50, 3.80, 4.00
];

const totalOpex = teamCost.map((t, i) =>
  +(t + freelanceCost[i] + salesCost[i] + legalCost[i] + officeCost[i] + marketingCost[i]).toFixed(2)
);

const ebitda = grossProfit.map((gp, i) => +(gp - totalOpex[i]).toFixed(2));
const ebitdaMargin = totalRev.map((r, i) => r > 0 ? ebitda[i] / r : 0);

// Cash flow
const STARTING_CAPITAL = 176.3; // lakhs (self-funded, excl contingency)
const CONTINGENCY = 37.1;
const netCashFlow = ebitda; // simplified: EBITDA ~ operating cash flow for early stage
const cumCash = [];
let cash = STARTING_CAPITAL;
for (let i = 0; i < 24; i++) {
  cash = +(cash + netCashFlow[i]).toFixed(1);
  cumCash.push(cash);
}

// Headcount plan
const headcount = {
  'Founder & CEO':       [1,1,1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1,1,1],
  'Co-Founder & CPO':    [1,1,1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1,1,1],
  'CTO':                 [0,1,1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1,1,1],
  'Ops & Sales Lead':    [0,0,1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1,1,1],
  'Backend Engineers':   [0,0,0,0,0,0,0,0,0,0,0,0, 1,1,2,2,2,3,3,3,3,4,4,4],
  'Frontend Engineers':  [0,0,0,0,0,0,0,0,0,0,0,0, 1,1,1,2,2,2,2,3,3,3,3,3],
  'Sales Reps':          [0,0,0,0,0,0,0,0,0,0,0,0, 1,2,2,3,3,4,4,5,5,6,6,7],
  'Customer Success':    [0,0,0,0,0,0,0,0,0,0,0,0, 0,1,1,1,2,2,2,2,3,3,3,3],
  'Data Analyst':        [0,0,0,0,0,0,0,0,0,0,0,0, 0,0,1,1,1,1,1,1,1,1,1,1],
  'Marketing':           [0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,1,1,1,1,1,2,2,2,2],
};

const totalHeadcount = Array(24).fill(0).map((_, i) =>
  Object.values(headcount).reduce((sum, arr) => sum + arr[i], 0)
);

// Summing helpers
const sumY1 = (arr) => arr.slice(0, 12).reduce((a, b) => a + b, 0);
const sumY2 = (arr) => arr.slice(12, 24).reduce((a, b) => a + b, 0);
const endY1 = (arr) => arr[11];
const endY2 = (arr) => arr[23];

// Global Y1 metrics (needed across sheets)
const y1Rev = () => +sumY1(totalRev).toFixed(1);
const y1SalesCostGlobal = () => +(sumY1(salesCost) + sumY1(marketingCost)).toFixed(1);
const y1CAC_global = () => {
  const sc = y1SalesCostGlobal();
  const np = paidDealers[11];
  return np > 0 ? Math.round((sc * 100000) / np) : 0;
};

// Month labels
const MONTHS_Y1 = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'];
const MONTHS_Y2 = ['M13', 'M14', 'M15', 'M16', 'M17', 'M18', 'M19', 'M20', 'M21', 'M22', 'M23', 'M24'];
const MONTHS_ALL = [...MONTHS_Y1, ...MONTHS_Y2];


// ════════════════════════════════════════════════════════════════════════════
// SHEET 1 — COVER & INDEX
// ════════════════════════════════════════════════════════════════════════════
{
  const ws = wb.addWorksheet('Cover', { properties: { tabColor: { argb: C.gold } } });
  initSheet(ws);
  setWidths(ws, [5, 40, 50]);

  ws.mergeCells('B3:C3');
  ws.getCell('B3').value = 'CAROBEST';
  ws.getCell('B3').font = { name: 'Calibri', size: 28, bold: true, color: { argb: C.gold } };
  ws.getCell('B3').fill = BG;
  ws.getRow(3).height = 50;

  ws.mergeCells('B5:C5');
  ws.getCell('B5').value = 'Financial Model & Business Plan';
  ws.getCell('B5').font = { name: 'Calibri', size: 16, color: { argb: C.white } };

  ws.mergeCells('B6:C6');
  ws.getCell('B6').value = 'Self-Funded | February 2026 | Confidential';
  ws.getCell('B6').font = F.dim;

  ws.mergeCells('B8:C8');
  ws.getCell('B8').value = 'AI-powered used car marketplace & dealer SaaS platform for India';
  ws.getCell('B8').font = F.dim;

  // Index
  let r = 11;
  ws.mergeCells(`B${r}:C${r}`);
  ws.getCell(`B${r}`).value = 'WORKBOOK INDEX';
  ws.getCell(`B${r}`).font = F.goldLg;
  ws.getCell(`B${r}`).fill = HEADER;
  ws.getCell(`B${r}`).border = B_GOLD;
  ws.getRow(r).height = 32;

  r++;
  const sheets = [
    ['Assumptions', 'All model inputs with sources. Blue = editable.'],
    ['Dealer Funnel', 'Bottom-up dealer acquisition: signups, conversion, churn, paying dealers (M1-M24)'],
    ['Revenue Model', 'All 3 revenue streams built up monthly (M1-M24)'],
    ['P&L Statement', 'Full income statement: Revenue, COGS, OpEx, EBITDA (M1-M24)'],
    ['Cash Flow', 'Cash waterfall, cumulative position, runway analysis (M1-M24)'],
    ['Unit Economics', 'CAC, LTV, LTV:CAC, payback, magic number, B2B economics'],
    ['Headcount', 'Role-by-role hiring plan with salary costs (M1-M24)'],
    ['3-Year Summary', 'Annual P&L, key metrics, fundraising milestones, valuation'],
    ['Scenarios', 'Bear/Base/Bull, sensitivity matrix, risk register'],
    ['Tech Infrastructure', 'Service-by-service tech costs with M1-M24 scaling projections']
  ];

  sheets.forEach((s, i) => {
    const row = ws.getRow(r + i);
    row.getCell(2).value = s[0];
    row.getCell(2).font = F.bold;
    row.getCell(2).fill = i % 2 === 0 ? PANEL : BG;
    row.getCell(2).border = B_THIN;
    row.getCell(3).value = s[1];
    row.getCell(3).font = F.dim;
    row.getCell(3).fill = i % 2 === 0 ? PANEL : BG;
    row.getCell(3).border = B_THIN;
    row.height = 26;
  });
}


// ════════════════════════════════════════════════════════════════════════════
// SHEET 2 — ASSUMPTIONS
// ════════════════════════════════════════════════════════════════════════════
{
  const ws = wb.addWorksheet('Assumptions', { properties: { tabColor: { argb: C.blue } } });
  initSheet(ws, { row: 2, col: 1 });
  setWidths(ws, [38, 22, 50]);

  sectionHeader(ws, 1, 'MODEL ASSUMPTIONS \u2014 All editable inputs in blue', 3);
  writeRow(ws, 2, ['Assumption', 'Value', 'Source / Rationale'], { isHeader: true });

  let r = 3;
  const sections = [
    { title: 'MARKET SIZING', items: [
      ['India used car market size (2025)', '\u20B96.4 Lakh Crore', 'FADA + RedSeer 2025 estimates'],
      ['Annual market growth rate', '15% YoY', 'Consistent with 2020-2025 CAGR'],
      ['Total used car dealers in India', '50 Lakh+', 'FADA registry (organized + unorganized)'],
      ['Digitally-addressable dealers', '5 Lakh', '~10% with smartphone + 10+ cars inventory'],
      ['Y1 penetration target', '0.08%', '~400 paying dealers out of 5L addressable'],
      ['Y2 penetration target', '0.6%', '~3,000 paying dealers'],
    ]},
    { title: 'DEALER ACQUISITION', items: [
      ['M1-M3 new dealers/month', '10\u201320', 'Manual field sales: Pune, Mumbai, Bangalore'],
      ['M4-M6 new dealers/month', '25\u201335', 'Referral loop + SEO content starts working'],
      ['M7-M9 new dealers/month', '40\u201355', 'Dedicated sales rep active, word-of-mouth'],
      ['M10-M12 new dealers/month', '60\u201380', 'Inbound organic + content marketing scaled'],
      ['Y2 new dealers/month', '100\u2013320', 'Multi-city expansion with seed capital'],
      ['Dealer CAC', '\u20B9400\u2013600', 'Content + field sales; zero paid ads in Y1'],
    ]},
    { title: 'CONVERSION & RETENTION', items: [
      ['Free to paid conversion (initial)', '35%', 'Conservative; Shopify benchmarks at 55%'],
      ['Free to paid conversion (M12)', '50%', 'Improves as product matures, referral loop'],
      ['Monthly churn (M3-M6)', '5%', 'Early product, limited stickiness'],
      ['Monthly churn (M7-M12)', '3\u20134%', 'Workflow integration increases retention'],
      ['Monthly churn (Y2)', '2\u20133%', 'Data lock-in + feature depth'],
      ['Average dealer lifetime', '20\u201333 months', '1 / monthly churn rate'],
    ]},
    { title: 'PRICING', items: [
      ['DealerOS Starter (free)', '\u20B90/mo', 'Basic inventory, limited features'],
      ['DealerOS Growth', '\u20B9999/mo', 'Full DealerOS: leads, analytics, CRM'],
      ['DealerOS Enterprise', '\u20B92,999/mo', 'AI tools, DemandPulse, priority support'],
      ['Blended ARPU (M3)', '\u20B9999/mo', 'Mostly Growth tier early on'],
      ['Blended ARPU (M12)', '\u20B91,500/mo', 'Enterprise tier mix increasing'],
      ['VehiclePassport reports', '\u20B9399\u2013\u20B9699', 'Tiered by report depth'],
      ['DemandPulse B2B contracts', '\u20B925,000/mo', 'Enterprise data subscription'],
    ]},
    { title: 'COST STRUCTURE', items: [
      ['Team salary pool (M1-M2)', '\u20B92.1L/mo', '2 founders, below-market (equity comp)'],
      ['Team salary pool (M3-M12)', '\u20B97.5L/mo', '4 people all-in (founders draw last)'],
      ['Cloud infra (Supabase+Vercel)', '\u20B915\u201335K/mo', 'Scales with traffic and storage'],
      ['API costs (OpenAI, Replicate, SMS)', '\u20B95\u201335K/mo', 'Usage-based, scales with transactions'],
      ['Razorpay payment fees', '2% of revenue', 'Standard gateway rate'],
      ['Contingency reserve', '\u20B937.1L', 'Held untouched, 4-month runway extension'],
    ]},
    { title: 'FUNDRAISING ASSUMPTIONS', items: [
      ['Seed raise timing', 'Month 12\u201315', 'After proving CF+ and unit economics'],
      ['Seed raise amount', '\u20B915\u201320 Cr', 'Based on 4\u20135x ARR multiple'],
      ['Pre-money valuation (seed)', '\u20B9100\u2013120 Cr', 'India B2B SaaS benchmarks'],
      ['Series A timing', 'Month 24\u201330', 'After 3,000+ paying dealers'],
      ['Series A amount', '\u20B960\u201380 Cr', 'Based on 6\u20138x forward ARR'],
    ]},
  ];

  sections.forEach(section => {
    writeRow(ws, r, [section.title, '', ''], { isSub: true });
    r++;
    section.items.forEach((item, i) => {
      writeRow(ws, r, item, { alt: i % 2 === 0, wrap: true });
      // Blue font for the "Value" column (editable assumption)
      ws.getRow(r).getCell(2).font = F.input;
      r++;
    });
    r++; // blank spacer row
  });
}


// ════════════════════════════════════════════════════════════════════════════
// SHEET 3 — DEALER FUNNEL
// ════════════════════════════════════════════════════════════════════════════
{
  const ws = wb.addWorksheet('Dealer Funnel', { properties: { tabColor: { argb: C.green } } });
  initSheet(ws, { row: 3, col: 1 });
  setWidths(ws, [28, ...Array(24).fill(8.5), 12, 12]);

  sectionHeader(ws, 1, 'DEALER ACQUISITION FUNNEL (M1\u2013M24)', 27);

  const hdr = ['', ...MONTHS_ALL, 'Y1 Total', 'Y2 Total'];
  const align = ['left', ...Array(26).fill('center')];
  writeRow(ws, 2, hdr, { isHeader: true, align, height: 28 });

  // Y1/Y2 separator
  writeRow(ws, 3, ['', ...MONTHS_Y1.map(() => ''), '', ...MONTHS_Y2.map(() => ''), '', ''], { isSub: true, subFont: F.dim });
  ws.mergeCells(3, 2, 3, 13);
  ws.getCell(3, 2).value = 'YEAR 1';
  ws.getCell(3, 2).font = F.gold;
  ws.mergeCells(3, 14, 3, 25);
  ws.getCell(3, 14).value = 'YEAR 2';
  ws.getCell(3, 14).font = F.gold;

  let r = 4;
  writeRow(ws, r, ['New dealers onboarded', ...NEW_DEALERS, sumY1(NEW_DEALERS), sumY2(NEW_DEALERS)], { alt: false, fmt: FMT.num, align }); r++;
  writeRow(ws, r, ['Cumulative dealers (all)', ...cumulDealers, '', ''], { alt: true, fmt: FMT.num, align }); r++;
  writeRow(ws, r, ['Paid conversion rate', ...CONV_RATE.map(v => v), '', ''], { fmt: FMT.pct, align, valueFont: F.input }); r++;
  writeRow(ws, r, ['Monthly churn rate', ...CHURN_RATE.map(v => v), '', ''], { alt: true, fmt: FMT.pct1, align, valueFont: F.input }); r++;
  writeRow(ws, r, ['Churned dealers', ...churnedDealers, sumY1(churnedDealers), sumY2(churnedDealers)], { fmt: FMT.num, align }); r++;
  writeRow(ws, r, ['NET PAYING DEALERS', ...paidDealers, '', ''], { isSub: true, subFont: F.green, fmt: FMT.num, align }); r++;
  r++;
  writeRow(ws, r, ['Blended ARPU (\u20B9/mo)', ...ARPU, '', ''], { alt: false, fmt: FMT.inr, align, valueFont: F.input }); r++;
  writeRow(ws, r, ['SaaS MRR (\u20B9L)', ...saasRev, +sumY1(saasRev).toFixed(1), +sumY2(saasRev).toFixed(1)], { isTotal: true, goldBorder: true, fmt: FMT.dec1, align }); r++;
  writeRow(ws, r, ['SaaS ARR (\u20B9L)', ...saasRev.map(v => +(v * 12).toFixed(1)), '', ''], { alt: true, fmt: FMT.dec1, align }); r++;
}


// ════════════════════════════════════════════════════════════════════════════
// SHEET 4 — REVENUE MODEL
// ════════════════════════════════════════════════════════════════════════════
{
  const ws = wb.addWorksheet('Revenue Model', { properties: { tabColor: { argb: C.gold } } });
  initSheet(ws, { row: 3, col: 1 });
  setWidths(ws, [28, ...Array(24).fill(8.5), 12, 12]);

  sectionHeader(ws, 1, 'REVENUE MODEL \u2014 ALL STREAMS (\u20B9 LAKHS)', 27);

  const hdr = ['', ...MONTHS_ALL, 'Y1', 'Y2'];
  const align = ['left', ...Array(26).fill('center')];
  writeRow(ws, 2, hdr, { isHeader: true, align, height: 28 });

  let r = 3;
  // SaaS
  writeRow(ws, r, ['DEALEROS SAAS', ...Array(26).fill('')], { isSub: true }); r++;
  writeRow(ws, r, ['Paying dealers', ...paidDealers, endY1(paidDealers), endY2(paidDealers)], { fmt: FMT.num, align }); r++;
  writeRow(ws, r, ['ARPU (\u20B9/mo)', ...ARPU, '', ''], { alt: true, fmt: FMT.inr, align }); r++;
  writeRow(ws, r, ['SaaS Revenue (\u20B9L)', ...saasRev, +sumY1(saasRev).toFixed(1), +sumY2(saasRev).toFixed(1)], { labelFont: F.green, fmt: FMT.dec1, align }); r++;
  r++;

  // Passport
  writeRow(ws, r, ['VEHICLEPASSPORT', ...Array(26).fill('')], { isSub: true }); r++;
  writeRow(ws, r, ['Reports sold', ...passportVol, sumY1(passportVol), sumY2(passportVol)], { fmt: FMT.num, align }); r++;
  writeRow(ws, r, ['Avg selling price (\u20B9)', ...passportASP, '', ''], { alt: true, fmt: FMT.inr, align }); r++;
  writeRow(ws, r, ['Passport Revenue (\u20B9L)', ...passportRev, +sumY1(passportRev).toFixed(1), +sumY2(passportRev).toFixed(1)], { labelFont: F.green, fmt: FMT.dec2, align }); r++;
  r++;

  // B2B
  writeRow(ws, r, ['B2B DEMANDPULSE', ...Array(26).fill('')], { isSub: true }); r++;
  writeRow(ws, r, ['Active contracts', ...b2bContracts, endY1(b2bContracts), endY2(b2bContracts)], { fmt: FMT.num, align }); r++;
  writeRow(ws, r, ['Contract value (\u20B9/mo)', ...Array(24).fill(b2bACV), '', ''], { alt: true, fmt: FMT.inr, align }); r++;
  writeRow(ws, r, ['B2B Revenue (\u20B9L)', ...b2bRev, +sumY1(b2bRev).toFixed(1), +sumY2(b2bRev).toFixed(1)], { labelFont: F.green, fmt: FMT.dec2, align }); r++;
  r++;

  // Total
  writeRow(ws, r, ['TOTAL REVENUE (\u20B9L)', ...totalRev, +sumY1(totalRev).toFixed(1), +sumY2(totalRev).toFixed(1)], { isTotal: true, goldBorder: true, fmt: FMT.dec1, align }); r++;
  r++;

  // Revenue mix
  writeRow(ws, r, ['REVENUE MIX %', ...Array(26).fill('')], { isSub: true }); r++;
  writeRow(ws, r, ['SaaS %', ...totalRev.map((t, i) => t > 0 ? saasRev[i] / t : 0), '', ''], { fmt: FMT.pct, align }); r++;
  writeRow(ws, r, ['Passport %', ...totalRev.map((t, i) => t > 0 ? passportRev[i] / t : 0), '', ''], { alt: true, fmt: FMT.pct, align }); r++;
  writeRow(ws, r, ['B2B %', ...totalRev.map((t, i) => t > 0 ? b2bRev[i] / t : 0), '', ''], { fmt: FMT.pct, align }); r++;
}


// ════════════════════════════════════════════════════════════════════════════
// SHEET 5 — P&L STATEMENT
// ════════════════════════════════════════════════════════════════════════════
{
  const ws = wb.addWorksheet('P&L Statement', { properties: { tabColor: { argb: C.gold } } });
  initSheet(ws, { row: 3, col: 1 });
  setWidths(ws, [30, ...Array(24).fill(8.5), 12, 12]);

  sectionHeader(ws, 1, 'PROFIT & LOSS STATEMENT (\u20B9 LAKHS)', 27);

  const hdr = ['', ...MONTHS_ALL, 'Y1', 'Y2'];
  const align = ['left', ...Array(26).fill('center')];
  writeRow(ws, 2, hdr, { isHeader: true, align, height: 28 });

  let r = 3;

  // Revenue
  writeRow(ws, r, ['REVENUE', ...Array(26).fill('')], { isSub: true }); r++;
  writeRow(ws, r, ['SaaS Revenue', ...saasRev, +sumY1(saasRev).toFixed(1), +sumY2(saasRev).toFixed(1)], { fmt: FMT.dec1, align }); r++;
  writeRow(ws, r, ['VehiclePassport Revenue', ...passportRev, +sumY1(passportRev).toFixed(1), +sumY2(passportRev).toFixed(1)], { alt: true, fmt: FMT.dec2, align }); r++;
  writeRow(ws, r, ['B2B Data Revenue', ...b2bRev, +sumY1(b2bRev).toFixed(1), +sumY2(b2bRev).toFixed(1)], { fmt: FMT.dec2, align }); r++;
  writeRow(ws, r, ['TOTAL REVENUE', ...totalRev, +sumY1(totalRev).toFixed(1), +sumY2(totalRev).toFixed(1)], { isTotal: true, goldBorder: true, fmt: FMT.dec1, align }); r++;
  r++;

  // COGS
  writeRow(ws, r, ['COST OF GOODS SOLD', ...Array(26).fill('')], { isSub: true }); r++;
  writeRow(ws, r, ['Cloud infrastructure', ...cloudCost, +sumY1(cloudCost).toFixed(2), +sumY2(cloudCost).toFixed(2)], { fmt: FMT.dec2, align }); r++;
  writeRow(ws, r, ['API costs (AI, SMS)', ...apiCost, +sumY1(apiCost).toFixed(2), +sumY2(apiCost).toFixed(2)], { alt: true, fmt: FMT.dec2, align }); r++;
  writeRow(ws, r, ['Payment processing', ...paymentFees, +sumY1(paymentFees).toFixed(2), +sumY2(paymentFees).toFixed(2)], { fmt: FMT.dec2, align }); r++;
  writeRow(ws, r, ['TOTAL COGS', ...totalCogs, +sumY1(totalCogs).toFixed(2), +sumY2(totalCogs).toFixed(2)], { isSub: true, subFont: F.red, fmt: FMT.dec2, align }); r++;
  r++;

  // Gross Profit
  writeRow(ws, r, ['GROSS PROFIT', ...grossProfit, +sumY1(grossProfit).toFixed(1), +sumY2(grossProfit).toFixed(1)], { isTotal: true, goldBorder: true, fmt: FMT.dec1, align }); r++;
  writeRow(ws, r, ['Gross Margin %', ...grossMargin, '', ''], { fmt: FMT.pct, align, alt: true }); r++;
  r++;

  // OpEx
  writeRow(ws, r, ['OPERATING EXPENSES', ...Array(26).fill('')], { isSub: true }); r++;
  writeRow(ws, r, ['Team salaries (all-in)', ...teamCost, +sumY1(teamCost).toFixed(1), +sumY2(teamCost).toFixed(1)], { fmt: FMT.dec2, align }); r++;
  writeRow(ws, r, ['Freelance / contractors', ...freelanceCost, +sumY1(freelanceCost).toFixed(1), +sumY2(freelanceCost).toFixed(1)], { alt: true, fmt: FMT.dec2, align }); r++;
  writeRow(ws, r, ['Sales & field ops', ...salesCost, +sumY1(salesCost).toFixed(2), +sumY2(salesCost).toFixed(2)], { fmt: FMT.dec2, align }); r++;
  writeRow(ws, r, ['Marketing & content', ...marketingCost, +sumY1(marketingCost).toFixed(2), +sumY2(marketingCost).toFixed(2)], { alt: true, fmt: FMT.dec2, align }); r++;
  writeRow(ws, r, ['Legal & CA', ...legalCost, +sumY1(legalCost).toFixed(2), +sumY2(legalCost).toFixed(2)], { fmt: FMT.dec2, align }); r++;
  writeRow(ws, r, ['Office & misc', ...officeCost, +sumY1(officeCost).toFixed(2), +sumY2(officeCost).toFixed(2)], { alt: true, fmt: FMT.dec2, align }); r++;
  writeRow(ws, r, ['TOTAL OPEX', ...totalOpex, +sumY1(totalOpex).toFixed(1), +sumY2(totalOpex).toFixed(1)], { isSub: true, subFont: F.red, fmt: FMT.dec1, align }); r++;
  r++;

  // EBITDA
  writeRow(ws, r, ['EBITDA', ...ebitda, +sumY1(ebitda).toFixed(1), +sumY2(ebitda).toFixed(1)], { isTotal: true, goldBorder: true, fmt: FMT.dec1, align }); r++;

  // Color EBITDA values
  const ebitdaRow = ws.getRow(r - 1);
  for (let c = 2; c <= 27; c++) {
    const val = ebitdaRow.getCell(c).value;
    if (typeof val === 'number') {
      ebitdaRow.getCell(c).font = val >= 0 ? { ...F.dark, color: { argb: C.dark } } : F.dark;
    }
  }

  writeRow(ws, r, ['EBITDA Margin %', ...ebitdaMargin, '', ''], { fmt: FMT.pct, align, alt: true }); r++;
}


// ════════════════════════════════════════════════════════════════════════════
// SHEET 6 — CASH FLOW
// ════════════════════════════════════════════════════════════════════════════
{
  const ws = wb.addWorksheet('Cash Flow', { properties: { tabColor: { argb: C.red } } });
  initSheet(ws, { row: 3, col: 1 });
  setWidths(ws, [30, ...Array(24).fill(8.5), 12]);

  sectionHeader(ws, 1, 'CASH FLOW & RUNWAY ANALYSIS (\u20B9 LAKHS)', 26);

  const hdr = ['', ...MONTHS_ALL, ''];
  const align = ['left', ...Array(25).fill('center')];
  writeRow(ws, 2, hdr, { isHeader: true, align, height: 28 });

  let r = 3;

  writeRow(ws, r, ['CAPITAL DEPLOYED', ...Array(25).fill('')], { isSub: true }); r++;
  writeRow(ws, r, ['Starting capital', STARTING_CAPITAL, ...Array(24).fill('')], { fmt: FMT.dec1, align }); r++;
  writeRow(ws, r, ['Contingency reserve (held aside)', CONTINGENCY, ...Array(24).fill('')], { alt: true, fmt: FMT.dec1, align }); r++;
  r++;

  writeRow(ws, r, ['MONTHLY CASH FLOW', ...Array(25).fill('')], { isSub: true }); r++;
  writeRow(ws, r, ['Revenue (inflow)', ...totalRev, ''], { fmt: FMT.dec1, align }); r++;

  const totalExp = totalCogs.map((c, i) => +(c + totalOpex[i]).toFixed(2));
  writeRow(ws, r, ['Total expenses (outflow)', ...totalExp, ''], { alt: true, fmt: FMT.dec2, align }); r++;
  writeRow(ws, r, ['Net cash flow', ...netCashFlow, ''], { isSub: true, fmt: FMT.dec1, align }); r++;

  // Color net cash flow
  const ncfRow = ws.getRow(r - 1);
  for (let c = 2; c <= 25; c++) {
    const val = ncfRow.getCell(c).value;
    if (typeof val === 'number') {
      ncfRow.getCell(c).font = val >= 0 ? F.green : F.red;
    }
  }
  r++;

  writeRow(ws, r, ['CASH POSITION', ...Array(25).fill('')], { isSub: true }); r++;
  writeRow(ws, r, ['Cumulative cash (excl contingency)', ...cumCash, ''], { fmt: FMT.dec1, align }); r++;

  // Color cash position
  const cashRow = ws.getRow(r - 1);
  for (let c = 2; c <= 25; c++) {
    const val = cashRow.getCell(c).value;
    if (typeof val === 'number') {
      cashRow.getCell(c).font = val >= 100 ? F.green : val >= 50 ? { ...F.bold, color: { argb: C.amber } } : F.red;
    }
  }

  writeRow(ws, r, ['+ Contingency reserve', ...Array(24).fill(CONTINGENCY), ''], { alt: true, fmt: FMT.dec1, align }); r++;

  const totalCashPos = cumCash.map(c => +(c + CONTINGENCY).toFixed(1));
  writeRow(ws, r, ['TOTAL CASH POSITION', ...totalCashPos, ''], { isTotal: true, goldBorder: true, fmt: FMT.dec1, align }); r++;
  r++;

  // Runway analysis
  writeRow(ws, r, ['RUNWAY ANALYSIS', ...Array(25).fill('')], { isSub: true }); r++;

  const monthlyBurn = totalExp.map((e, i) => totalRev[i] > 0 ? Math.max(0, e - totalRev[i]) : e);
  writeRow(ws, r, ['Net burn (if rev stops)', ...monthlyBurn.map(b => +b.toFixed(1)), ''], { fmt: FMT.dec1, align }); r++;

  const runwayMonths = cumCash.map((c, i) => {
    if (netCashFlow[i] >= 0) return 'CF+';
    const burn = monthlyBurn[i];
    return burn > 0 ? Math.round((c + CONTINGENCY) / burn) : 'CF+';
  });
  writeRow(ws, r, ['Months of runway', ...runwayMonths, ''], { alt: true, align }); r++;

  r++;
  // Key milestones
  const cfPosMonth = netCashFlow.findIndex(v => v >= 0);
  const lowestCash = Math.min(...cumCash);
  const lowestMonth = cumCash.indexOf(lowestCash);

  writeRow(ws, r, ['KEY MILESTONES', '', ''], { isSub: true }); r++;
  writeRow(ws, r, [`First EBITDA-positive month`, `Month ${cfPosMonth + 1}`, ''], { labelFont: F.green, align }); r++;
  writeRow(ws, r, [`Lowest cash point`, `\u20B9${lowestCash.toFixed(1)}L (Month ${lowestMonth + 1})`, ''], { alt: true, align }); r++;
  writeRow(ws, r, [`Cash at Year 1 end`, `\u20B9${(cumCash[11] + CONTINGENCY).toFixed(1)}L`, ''], { align }); r++;
  writeRow(ws, r, [`Cash at Year 2 end`, `\u20B9${(cumCash[23] + CONTINGENCY).toFixed(1)}L`, ''], { alt: true, align }); r++;
}


// ════════════════════════════════════════════════════════════════════════════
// SHEET 7 — UNIT ECONOMICS
// ════════════════════════════════════════════════════════════════════════════
{
  const ws = wb.addWorksheet('Unit Economics', { properties: { tabColor: { argb: C.amber } } });
  initSheet(ws, { row: 2, col: 1 });
  setWidths(ws, [35, 18, 18, 18, 38]);

  sectionHeader(ws, 1, 'UNIT ECONOMICS', 5);
  writeRow(ws, 2, ['Metric', 'Year 1', 'Year 2', 'Year 3', 'Calculation'], { isHeader: true });

  let r = 3;

  // SaaS Unit Economics
  writeRow(ws, r, ['DEALEROS SAAS', '', '', '', ''], { isSub: true }); r++;

  const y1SalesCost = y1SalesCostGlobal();
  const y1CAC = y1CAC_global();

  const ue = [
    ['Customer Acquisition Cost (CAC)', `\u20B9${y1CAC}`, '\u20B9380', '\u20B9320', 'Total S&M spend / new paying dealers acquired'],
    ['Blended ARPU (monthly)', '\u20B91,200', '\u20B92,000', '\u20B92,800', 'Weighted avg across Growth + Enterprise tiers'],
    ['Monthly gross margin', '72%', '76%', '79%', '(Revenue - COGS) / Revenue'],
    ['Monthly churn rate', '3.5%', '2.5%', '2.0%', 'Lost dealers / start-of-month base'],
    ['Average customer lifetime', '29 months', '40 months', '50 months', '1 / monthly churn rate'],
    ['Customer Lifetime Value (LTV)', `\u20B9${Math.round(1200 * 29 * 0.72).toLocaleString()}`, `\u20B9${Math.round(2000 * 40 * 0.76).toLocaleString()}`, `\u20B9${Math.round(2800 * 50 * 0.79).toLocaleString()}`, 'ARPU x Lifetime x Gross Margin'],
    ['LTV : CAC Ratio', `${(1200 * 29 * 0.72 / y1CAC).toFixed(0)}x`, '160x', '346x', 'LTV / CAC (healthy SaaS > 3x)'],
    ['CAC Payback Period', `${Math.round(y1CAC / (1200 * 0.72))} days`, '6 days', '4 days', 'CAC / (ARPU x Gross Margin) in months * 30'],
  ];

  ue.forEach((row, i) => {
    writeRow(ws, r, row, { alt: i % 2 === 0 }); r++;
  });

  r++;
  writeRow(ws, r, ['SAAS MAGIC NUMBER', '', '', '', ''], { isSub: true }); r++;
  const magic = [
    ['Net new MRR (end of year)', `\u20B9${saasRev[11].toFixed(1)}L`, `\u20B9${saasRev[23].toFixed(1)}L`, '', 'MRR at month 12 / 24'],
    ['Annualized new ARR', `\u20B9${(saasRev[11] * 12).toFixed(0)}L`, `\u20B9${(saasRev[23] * 12).toFixed(0)}L`, '', 'MRR x 12'],
    ['S&M spend (annual)', `\u20B9${y1SalesCost}L`, `\u20B9${+(sumY2(salesCost) + sumY2(marketingCost)).toFixed(1)}L`, '', 'Sales + marketing total'],
    ['Magic Number', `${((saasRev[11] * 12) / (y1SalesCost || 1)).toFixed(1)}x`, '', '', 'Net New ARR / S&M Spend (>0.75 = efficient)'],
  ];
  magic.forEach((row, i) => {
    writeRow(ws, r, row, { alt: i % 2 === 0 }); r++;
  });

  r++;
  writeRow(ws, r, ['B2B DATA (DEMANDPULSE)', '', '', '', ''], { isSub: true }); r++;
  const b2bUe = [
    ['Enterprise CAC', '\u20B980,000', '\u20B960,000', '\u20B950,000', 'BD + events + pilot costs / new contracts'],
    ['Annual Contract Value', '\u20B93,00,000', '\u20B94,00,000', '\u20B95,00,000', '\u20B925K/mo scaling to \u20B942K/mo'],
    ['B2B Gross Margin', '80%', '83%', '86%', 'Near-zero marginal cost of aggregated data'],
    ['Average contract lifetime', '2.5 years', '3 years', '3.5 years', 'Based on enterprise retention'],
    ['B2B LTV', '\u20B96,00,000', '\u20B99,96,000', '\u20B915,05,000', 'ACV x Lifetime x Margin'],
    ['B2B LTV : CAC', '7.5x', '16.6x', '30.1x', 'Improves with scale + brand'],
  ];
  b2bUe.forEach((row, i) => {
    writeRow(ws, r, row, { alt: i % 2 === 0 }); r++;
  });
}


// ════════════════════════════════════════════════════════════════════════════
// SHEET 8 — HEADCOUNT
// ════════════════════════════════════════════════════════════════════════════
{
  const ws = wb.addWorksheet('Headcount', { properties: { tabColor: { argb: C.blue } } });
  initSheet(ws, { row: 3, col: 1 });
  setWidths(ws, [28, ...Array(24).fill(6.5), 8, 8]);

  sectionHeader(ws, 1, 'HEADCOUNT PLAN (M1\u2013M24)', 27);

  const hdr = ['Role', ...MONTHS_ALL, 'Y1 Avg', 'Y2 Avg'];
  const align = ['left', ...Array(26).fill('center')];
  writeRow(ws, 2, hdr, { isHeader: true, align, height: 28 });

  let r = 3;

  Object.entries(headcount).forEach(([role, counts], i) => {
    const y1Avg = +(counts.slice(0, 12).reduce((a, b) => a + b, 0) / 12).toFixed(1);
    const y2Avg = +(counts.slice(12, 24).reduce((a, b) => a + b, 0) / 12).toFixed(1);
    writeRow(ws, r, [role, ...counts, y1Avg, y2Avg], { alt: i % 2 === 0, fmt: FMT.num, align }); r++;
  });

  const y1AvgTotal = +(totalHeadcount.slice(0, 12).reduce((a, b) => a + b, 0) / 12).toFixed(1);
  const y2AvgTotal = +(totalHeadcount.slice(12, 24).reduce((a, b) => a + b, 0) / 12).toFixed(1);
  writeRow(ws, r, ['TOTAL HEADCOUNT', ...totalHeadcount, y1AvgTotal, y2AvgTotal], { isTotal: true, goldBorder: true, fmt: FMT.num, align }); r++;
  r++;

  writeRow(ws, r, ['SALARY COSTS (\u20B9 LAKHS/MO)', ...Array(26).fill('')], { isSub: true }); r++;
  writeRow(ws, r, ['Total team cost', ...teamCost, +sumY1(teamCost).toFixed(1), +sumY2(teamCost).toFixed(1)], { fmt: FMT.dec1, align }); r++;
  writeRow(ws, r, ['Freelance / contractors', ...freelanceCost, +sumY1(freelanceCost).toFixed(1), +sumY2(freelanceCost).toFixed(1)], { alt: true, fmt: FMT.dec2, align }); r++;

  const totalPeopleCost = teamCost.map((t, i) => +(t + freelanceCost[i]).toFixed(2));
  writeRow(ws, r, ['TOTAL PEOPLE COST', ...totalPeopleCost, +sumY1(totalPeopleCost).toFixed(1), +sumY2(totalPeopleCost).toFixed(1)], { isTotal: true, goldBorder: true, fmt: FMT.dec1, align }); r++;
  r++;

  const costPerHead = totalPeopleCost.map((c, i) => totalHeadcount[i] > 0 ? +(c / totalHeadcount[i]).toFixed(2) : 0);
  writeRow(ws, r, ['Cost per head (\u20B9L/mo)', ...costPerHead, '', ''], { alt: true, fmt: FMT.dec2, align }); r++;
  writeRow(ws, r, ['People cost as % of revenue', ...totalRev.map((rev, i) => rev > 0 ? totalPeopleCost[i] / rev : 0), '', ''], { fmt: FMT.pct, align }); r++;
}


// ════════════════════════════════════════════════════════════════════════════
// SHEET 9 — 3-YEAR SUMMARY
// ════════════════════════════════════════════════════════════════════════════
{
  const ws = wb.addWorksheet('3-Year Summary', { properties: { tabColor: { argb: C.blue } } });
  initSheet(ws, { row: 2, col: 1 });
  setWidths(ws, [35, 20, 20, 20, 22]);

  sectionHeader(ws, 1, '3-YEAR FINANCIAL SUMMARY', 5);
  writeRow(ws, 2, ['', 'Year 1', 'Year 2', 'Year 3', 'Y1\u2192Y3 CAGR'], { isHeader: true });

  let r = 3;

  const s9y1Rev = +sumY1(totalRev).toFixed(1);
  const s9y2Rev = +sumY2(totalRev).toFixed(1);
  const s9y3Rev = +(s9y2Rev * 3.2).toFixed(0);

  const s9y1SaasRev = +sumY1(saasRev).toFixed(1);
  const s9y2SaasRev = +sumY2(saasRev).toFixed(1);

  writeRow(ws, r, ['REVENUE (\u20B9 LAKHS)', '', '', '', ''], { isSub: true }); r++;
  writeRow(ws, r, ['DealerOS SaaS', s9y1SaasRev, s9y2SaasRev, Math.round(s9y2SaasRev * 3.5), ''], { fmt: FMT.dec1 }); r++;
  writeRow(ws, r, ['VehiclePassport', +sumY1(passportRev).toFixed(1), +sumY2(passportRev).toFixed(1), Math.round(sumY2(passportRev) * 2.8), ''], { alt: true, fmt: FMT.dec1 }); r++;
  writeRow(ws, r, ['B2B DemandPulse', +sumY1(b2bRev).toFixed(1), +sumY2(b2bRev).toFixed(1), Math.round(sumY2(b2bRev) * 3), ''], { fmt: FMT.dec1 }); r++;
  writeRow(ws, r, ['TOTAL REVENUE', s9y1Rev, s9y2Rev, s9y3Rev, `${Math.round(Math.pow(s9y3Rev / s9y1Rev, 0.5) * 100 - 100)}%`], { isTotal: true, goldBorder: true, fmt: FMT.dec1 }); r++;
  r++;

  const s9y1COGS = +sumY1(totalCogs).toFixed(1);
  const s9y2COGS = +sumY2(totalCogs).toFixed(1);
  const s9y1GP = +(s9y1Rev - s9y1COGS).toFixed(1);
  const s9y2GP = +(s9y2Rev - s9y2COGS).toFixed(1);
  const s9y3GP = Math.round(s9y3Rev * 0.78);

  writeRow(ws, r, ['PROFITABILITY', '', '', '', ''], { isSub: true }); r++;
  writeRow(ws, r, ['COGS', s9y1COGS, s9y2COGS, Math.round(s9y3Rev * 0.22), ''], { fmt: FMT.dec1 }); r++;
  writeRow(ws, r, ['Gross Profit', s9y1GP, s9y2GP, s9y3GP, ''], { alt: true, fmt: FMT.dec1 }); r++;
  writeRow(ws, r, ['Gross Margin %', `${Math.round(s9y1GP / s9y1Rev * 100)}%`, `${Math.round(s9y2GP / s9y2Rev * 100)}%`, '78%', ''], {}); r++;

  const s9y1Opex = +sumY1(totalOpex).toFixed(1);
  const s9y2Opex = +sumY2(totalOpex).toFixed(1);
  writeRow(ws, r, ['Total OpEx', s9y1Opex, s9y2Opex, Math.round(s9y3Rev * 0.45), ''], { alt: true, fmt: FMT.dec1 }); r++;

  const s9y1EBITDA = +sumY1(ebitda).toFixed(1);
  const s9y2EBITDA = +sumY2(ebitda).toFixed(1);
  const s9y3EBITDA = Math.round(s9y3Rev * 0.33);
  writeRow(ws, r, ['EBITDA', s9y1EBITDA, s9y2EBITDA, s9y3EBITDA, ''], { isTotal: true, goldBorder: true, fmt: FMT.dec1 }); r++;
  writeRow(ws, r, ['EBITDA Margin %', `${Math.round(s9y1EBITDA / s9y1Rev * 100)}%`, `${Math.round(s9y2EBITDA / s9y2Rev * 100)}%`, `${Math.round(s9y3EBITDA / s9y3Rev * 100)}%`, ''], { alt: true }); r++;
  r++;

  writeRow(ws, r, ['KEY METRICS', '', '', '', ''], { isSub: true }); r++;
  writeRow(ws, r, ['Paying Dealers (end)', endY1(paidDealers), endY2(paidDealers), Math.round(endY2(paidDealers) * 3.5), ''], { fmt: FMT.num }); r++;
  writeRow(ws, r, ['B2B Contracts (end)', endY1(b2bContracts), endY2(b2bContracts), Math.round(endY2(b2bContracts) * 2.2), ''], { alt: true, fmt: FMT.num }); r++;
  writeRow(ws, r, ['Team Size (end)', endY1(totalHeadcount), endY2(totalHeadcount), Math.round(endY2(totalHeadcount) * 2.5), ''], { fmt: FMT.num }); r++;
  writeRow(ws, r, ['Monthly Churn', '3%', '2%', '1.5%', ''], { alt: true }); r++;
  writeRow(ws, r, ['Dealer CAC', `\u20B9${y1CAC_global()}`, '\u20B9380', '\u20B9320', ''], {}); r++;
  writeRow(ws, r, ['MRR (end of year)', `\u20B9${saasRev[11].toFixed(1)}L`, `\u20B9${saasRev[23].toFixed(1)}L`, '', ''], { alt: true }); r++;
  writeRow(ws, r, ['ARR (end of year)', `\u20B9${(saasRev[11] * 12).toFixed(0)}L`, `\u20B9${(saasRev[23] * 12).toFixed(0)}L`, '', ''], {}); r++;
  r++;

  // Fundraising
  writeRow(ws, r, ['FUNDRAISING ROADMAP', '', '', '', ''], { isSub: true }); r++;
  writeRow(ws, r, ['Stage', 'Bootstrap', 'Seed', 'Series A', ''], {}); r++;
  writeRow(ws, r, ['Timing', 'Now', 'Month 12\u201315', 'Month 24\u201330', ''], { alt: true }); r++;
  writeRow(ws, r, ['Capital', 'Self-Funded', '\u20B915\u201320 Cr', '\u20B960\u201380 Cr', ''], {}); r++;
  writeRow(ws, r, ['Pre-money Valuation', '\u2014', '\u20B9100\u2013120 Cr', '\u20B9500\u2013700 Cr', ''], { alt: true }); r++;
  writeRow(ws, r, ['Dilution', '0%', '14\u201317%', '10\u201312%', ''], {}); r++;
  writeRow(ws, r, ['Revenue Multiple', '\u2014', '4\u20135x ARR', '6\u20138x fwd ARR', ''], { alt: true }); r++;
  writeRow(ws, r, ['Use of Funds', 'Build product', '5K dealers, 12 cities', '30 cities, 50K dealers', ''], {}); r++;
}


// ════════════════════════════════════════════════════════════════════════════
// SHEET 10 — SCENARIOS & SENSITIVITY
// ════════════════════════════════════════════════════════════════════════════
{
  const ws = wb.addWorksheet('Scenarios', { properties: { tabColor: { argb: C.red } } });
  initSheet(ws, { row: 2, col: 1 });
  setWidths(ws, [30, 20, 20, 20, 28]);

  sectionHeader(ws, 1, 'SCENARIO ANALYSIS & SENSITIVITY', 5);
  writeRow(ws, 2, ['Metric', 'Bear Case', 'Base Case', 'Bull Case', 'Key Driver'], { isHeader: true });

  let r = 3;

  writeRow(ws, r, ['YEAR 1 SCENARIOS', '', '', '', ''], { isSub: true }); r++;

  const scenarios = [
    ['Dealers onboarded (Y1)', '350', '490', '700', 'Field sales execution speed'],
    ['Paid conversion %', '30%', '42%', '55%', 'Product-market fit signal'],
    ['Paying dealers (Y1 end)', '105', `${endY1(paidDealers)}`, '385', 'Conversion x retention'],
    ['Blended ARPU', '\u20B9999', '\u20B91,200', '\u20B91,800', 'Enterprise tier adoption'],
    ['Monthly churn', '6%', '3.5%', '2%', 'Workflow stickiness'],
    ['B2B contracts (Y1)', '3', `${endY1(b2bContracts)}`, '15', 'Enterprise BD pipeline'],
    ['', '', '', '', ''],
    ['Y1 Total Revenue', '\u20B940\u201360L', `\u20B9${sumY1(totalRev).toFixed(0)}L`, '\u20B9180\u2013220L', ''],
    ['Y1 EBITDA', '(\u20B940L)', `\u20B9${sumY1(ebitda).toFixed(0)}L`, '\u20B960\u201380L', ''],
    ['Cash-flow positive', 'Never in Y1', `Month ${netCashFlow.findIndex(v => v >= 0) + 1}`, 'Month 5\u20136', ''],
    ['Cash at Y1 end (incl contingency)', '\u20B950\u201380L', `\u20B9${(cumCash[11] + CONTINGENCY).toFixed(0)}L`, '\u20B9280\u2013320L', ''],
    ['Runway if rev = 0', '10 months', '14+ months', 'Infinite (CF+)', '']
  ];

  scenarios.forEach((row, i) => {
    if (row[0] === '') return;
    const isResult = row[0].startsWith('Y1') || row[0].startsWith('Cash') || row[0].startsWith('Runway');
    writeRow(ws, r, row, { alt: i % 2 === 0, isSub: isResult, subFont: isResult ? F.gold : undefined }); r++;
  });

  r += 2;
  sectionHeader(ws, r, 'SENSITIVITY: Y1 REVENUE BY PAYING DEALERS x ARPU (\u20B9 LAKHS)', 5); r++;
  writeRow(ws, r, ['Paying Dealers \u2193 / ARPU \u2192', '\u20B9999', '\u20B91,200', '\u20B91,500', '\u20B92,000'], { isHeader: true }); r++;

  const dealerCounts = [80, 150, 250, 400, 600];
  const arpuOptions = [999, 1200, 1500, 2000];

  dealerCounts.forEach((d, i) => {
    const vals = arpuOptions.map(a => {
      const annual = +((d * a * 8) / 100000).toFixed(0); // ~8 avg months of payment
      return annual;
    });
    writeRow(ws, r, [`${d} dealers`, ...vals, ''], { alt: i % 2 === 0, fmt: FMT.dec1 }); r++;
  });

  r += 2;
  sectionHeader(ws, r, 'RISK REGISTER', 5); r++;
  writeRow(ws, r, ['Risk', 'Probability', 'Impact', 'Mitigation', ''], { isHeader: true }); r++;

  const risks = [
    ['Slow dealer adoption', 'Medium', 'High', 'Free tier removes friction; 3-city field sales focus'],
    ['High churn (>5%/mo)', 'Low-Med', 'High', 'DealerOS becomes daily workflow; data lock-in'],
    ['B2B sales cycle >6 months', 'Medium', 'Medium', 'Start with pilot contracts; P&L not B2B-dependent'],
    ['Competitor launches dealer SaaS', 'Medium', 'Medium', '12-month head start; 10 features already live'],
    ['Cash burn exceeds plan', 'Low', 'High', '\u20B937L contingency + founders forgo salary first'],
    ['Regulatory (DPDP compliance)', 'Low', 'Medium', 'Legal counsel from Day 1; privacy-first architecture'],
    ['Key person risk', 'Low', 'Critical', '2 co-founders; shared IP ownership; vesting schedule'],
    ['OpenAI API cost spike', 'Medium', 'Low', 'GPT-4o-mini is cheap; can switch to open-source LLMs'],
    ['Supabase outage', 'Low', 'High', 'Multi-region backups; can migrate to self-hosted Postgres'],
  ];

  risks.forEach((row, i) => {
    writeRow(ws, r, [...row, ''], { alt: i % 2 === 0, wrap: true }); r++;
  });
}


// ════════════════════════════════════════════════════════════════════════════
// SHEET 11 — TECH INFRASTRUCTURE COSTS
// ════════════════════════════════════════════════════════════════════════════
{
  const ws = wb.addWorksheet('Tech Infrastructure', { properties: { tabColor: { argb: C.amber } } });
  initSheet(ws, { row: 2, col: 1 });
  setWidths(ws, [30, ...Array(24).fill(7.5), 12, 12]);

  sectionHeader(ws, 1, 'TECH INFRASTRUCTURE COST BREAKDOWN (\u20B9 THOUSANDS / MONTH)', 27);

  const hdr = ['Service', ...MONTHS_ALL, 'Y1 Total', 'Y2 Total'];
  const align = ['left', ...Array(26).fill('center')];
  writeRow(ws, 2, hdr, { isHeader: true, align, height: 28 });

  let r = 3;

  // ─── HOSTING & DATABASE ─────────────────────────────────────────────
  writeRow(ws, r, ['HOSTING & DATABASE', ...Array(26).fill('')], { isSub: true }); r++;

  const supabase = [
    2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 4.2, 4.2, 4.2, 4.2,
    4.2, 4.2, 4.2, 8.3, 8.3, 8.3, 8.3, 8.3, 12.5, 12.5, 12.5, 12.5
  ]; // Free->Starter($25)->Pro($99)->Team($150)

  const vercel = [
    0, 0, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7,
    1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 3.3, 3.3, 3.3, 3.3, 3.3, 3.3
  ]; // Free->Pro($20)->Pro+bandwidth($40)

  const s3Storage = [
    0.1, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1.0, 1.2, 1.5, 1.8,
    2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 7.0, 8.0, 9.0
  ]; // S3/Supabase storage for vehicle images

  const domain = [
    0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1,
    0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1
  ]; // Domain + SSL (~$15/yr)

  writeRow(ws, r, ['Supabase (DB + Auth)', ...supabase, +supabase.slice(0,12).reduce((a,b)=>a+b,0).toFixed(1), +supabase.slice(12).reduce((a,b)=>a+b,0).toFixed(1)], { fmt: FMT.dec1, align }); r++;
  writeRow(ws, r, ['Vercel (Hosting + CDN)', ...vercel, +vercel.slice(0,12).reduce((a,b)=>a+b,0).toFixed(1), +vercel.slice(12).reduce((a,b)=>a+b,0).toFixed(1)], { alt: true, fmt: FMT.dec1, align }); r++;
  writeRow(ws, r, ['Image storage (S3/Supabase)', ...s3Storage, +s3Storage.slice(0,12).reduce((a,b)=>a+b,0).toFixed(1), +s3Storage.slice(12).reduce((a,b)=>a+b,0).toFixed(1)], { fmt: FMT.dec1, align }); r++;
  writeRow(ws, r, ['Domain + SSL', ...domain, +domain.slice(0,12).reduce((a,b)=>a+b,0).toFixed(1), +domain.slice(12).reduce((a,b)=>a+b,0).toFixed(1)], { alt: true, fmt: FMT.dec1, align }); r++;

  const hostingTotal = supabase.map((s, i) => +(s + vercel[i] + s3Storage[i] + domain[i]).toFixed(1));
  writeRow(ws, r, ['Subtotal: Hosting', ...hostingTotal, +hostingTotal.slice(0,12).reduce((a,b)=>a+b,0).toFixed(1), +hostingTotal.slice(12).reduce((a,b)=>a+b,0).toFixed(1)], { isSub: true, subFont: F.gold, fmt: FMT.dec1, align }); r++;
  r++;

  // ─── AI & API SERVICES ──────────────────────────────────────────────
  writeRow(ws, r, ['AI & API SERVICES', ...Array(26).fill('')], { isSub: true }); r++;

  const openai = [
    0.5, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5,
    6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 18.0
  ]; // GPT-4o-mini: sentiment, descriptions, smart-reply, concierge

  const replicate = [
    0, 0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 5.0, 6.0,
    7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 18.0, 20.0
  ]; // Background removal + photo studio

  const smsSvc = [
    0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1.0, 1.2, 1.5, 1.8, 2.0,
    2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0
  ]; // OTP + transactional SMS

  const mapsSvc = [
    0, 0, 0.1, 0.2, 0.3, 0.3, 0.4, 0.5, 0.5, 0.6, 0.7, 0.8,
    1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.5, 2.8, 3.0, 3.2, 3.5
  ]; // Google Maps for dealer/buyer location

  writeRow(ws, r, ['OpenAI (GPT-4o-mini)', ...openai, +openai.slice(0,12).reduce((a,b)=>a+b,0).toFixed(1), +openai.slice(12).reduce((a,b)=>a+b,0).toFixed(1)], { fmt: FMT.dec1, align }); r++;
  writeRow(ws, r, ['Replicate (photo AI)', ...replicate, +replicate.slice(0,12).reduce((a,b)=>a+b,0).toFixed(1), +replicate.slice(12).reduce((a,b)=>a+b,0).toFixed(1)], { alt: true, fmt: FMT.dec1, align }); r++;
  writeRow(ws, r, ['SMS (OTP + transactional)', ...smsSvc, +smsSvc.slice(0,12).reduce((a,b)=>a+b,0).toFixed(1), +smsSvc.slice(12).reduce((a,b)=>a+b,0).toFixed(1)], { fmt: FMT.dec1, align }); r++;
  writeRow(ws, r, ['Maps API', ...mapsSvc, +mapsSvc.slice(0,12).reduce((a,b)=>a+b,0).toFixed(1), +mapsSvc.slice(12).reduce((a,b)=>a+b,0).toFixed(1)], { alt: true, fmt: FMT.dec1, align }); r++;

  const aiTotal = openai.map((o, i) => +(o + replicate[i] + smsSvc[i] + mapsSvc[i]).toFixed(1));
  writeRow(ws, r, ['Subtotal: AI & APIs', ...aiTotal, +aiTotal.slice(0,12).reduce((a,b)=>a+b,0).toFixed(1), +aiTotal.slice(12).reduce((a,b)=>a+b,0).toFixed(1)], { isSub: true, subFont: F.gold, fmt: FMT.dec1, align }); r++;
  r++;

  // ─── PAYMENTS & COMMUNICATION ───────────────────────────────────────
  writeRow(ws, r, ['PAYMENTS & COMMUNICATION', ...Array(26).fill('')], { isSub: true }); r++;

  // Razorpay = 2% of revenue (already in COGS). Show absolute cost here in thousands.
  const razorpay = totalRev.map(rev => +(rev * 0.02 * 10).toFixed(1)); // rev is in lakhs, *10 = thousands

  const whatsapp = [
    0, 0, 0.5, 0.8, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 5.0,
    6.0, 7.0, 8.0, 9.0, 10.0, 12.0, 14.0, 16.0, 18.0, 20.0, 22.0, 25.0
  ]; // WhatsApp Business API messages

  writeRow(ws, r, ['Razorpay (2% of rev)', ...razorpay, +razorpay.slice(0,12).reduce((a,b)=>a+b,0).toFixed(1), +razorpay.slice(12).reduce((a,b)=>a+b,0).toFixed(1)], { fmt: FMT.dec1, align }); r++;
  writeRow(ws, r, ['WhatsApp Business API', ...whatsapp, +whatsapp.slice(0,12).reduce((a,b)=>a+b,0).toFixed(1), +whatsapp.slice(12).reduce((a,b)=>a+b,0).toFixed(1)], { alt: true, fmt: FMT.dec1, align }); r++;

  const payCommTotal = razorpay.map((rz, i) => +(rz + whatsapp[i]).toFixed(1));
  writeRow(ws, r, ['Subtotal: Payments & Comms', ...payCommTotal, +payCommTotal.slice(0,12).reduce((a,b)=>a+b,0).toFixed(1), +payCommTotal.slice(12).reduce((a,b)=>a+b,0).toFixed(1)], { isSub: true, subFont: F.gold, fmt: FMT.dec1, align }); r++;
  r++;

  // ─── ANALYTICS & MONITORING ─────────────────────────────────────────
  writeRow(ws, r, ['ANALYTICS & MONITORING', ...Array(26).fill('')], { isSub: true }); r++;

  const posthog = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 4.2, 4.2, 4.2, 4.2, 4.2, 4.2, 4.2, 4.2
  ]; // Free tier Y1, then $50/mo when scaling

  const sentry = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 2.4, 2.4, 2.4, 2.4, 2.4, 2.4, 2.4, 2.4, 2.4
  ]; // Free tier Y1, then $29/mo

  writeRow(ws, r, ['PostHog (analytics)', ...posthog, +posthog.slice(0,12).reduce((a,b)=>a+b,0).toFixed(1), +posthog.slice(12).reduce((a,b)=>a+b,0).toFixed(1)], { fmt: FMT.dec1, align }); r++;
  writeRow(ws, r, ['Sentry (error monitoring)', ...sentry, +sentry.slice(0,12).reduce((a,b)=>a+b,0).toFixed(1), +sentry.slice(12).reduce((a,b)=>a+b,0).toFixed(1)], { alt: true, fmt: FMT.dec1, align }); r++;

  const analyticsTotal = posthog.map((p, i) => +(p + sentry[i]).toFixed(1));
  writeRow(ws, r, ['Subtotal: Analytics', ...analyticsTotal, +analyticsTotal.slice(0,12).reduce((a,b)=>a+b,0).toFixed(1), +analyticsTotal.slice(12).reduce((a,b)=>a+b,0).toFixed(1)], { isSub: true, subFont: F.gold, fmt: FMT.dec1, align }); r++;
  r++;

  // ─── DEV TOOLS (FREE) ──────────────────────────────────────────────
  writeRow(ws, r, ['DEV TOOLS (FREE / OPEN-SOURCE)', ...Array(26).fill('')], { isSub: true }); r++;
  writeRow(ws, r, ['Next.js 16 + React 19', ...Array(24).fill(0), 0, 0], { fmt: FMT.dec1, align }); r++;
  writeRow(ws, r, ['Prisma ORM', ...Array(24).fill(0), 0, 0], { alt: true, fmt: FMT.dec1, align }); r++;
  writeRow(ws, r, ['Tailwind CSS + Framer Motion', ...Array(24).fill(0), 0, 0], { fmt: FMT.dec1, align }); r++;
  writeRow(ws, r, ['TypeScript + Zod + Zustand', ...Array(24).fill(0), 0, 0], { alt: true, fmt: FMT.dec1, align }); r++;
  r++;

  // ─── GRAND TOTAL ────────────────────────────────────────────────────
  const grandTotal = hostingTotal.map((h, i) => +(h + aiTotal[i] + payCommTotal[i] + analyticsTotal[i]).toFixed(1));
  writeRow(ws, r, ['TOTAL TECH INFRA COST (\u20B9K/mo)', ...grandTotal, +grandTotal.slice(0,12).reduce((a,b)=>a+b,0).toFixed(1), +grandTotal.slice(12).reduce((a,b)=>a+b,0).toFixed(1)], { isTotal: true, goldBorder: true, fmt: FMT.dec1, align }); r++;
  r++;

  // Tech cost as % of revenue
  const techPctRev = totalRev.map((rev, i) => rev > 0 ? grandTotal[i] / (rev * 10) : 0); // grandTotal in K, rev in L
  writeRow(ws, r, ['Tech cost as % of revenue', ...techPctRev, '', ''], { fmt: FMT.pct1, align, alt: true }); r++;
  r++;

  // Summary table
  writeRow(ws, r, ['COST SUMMARY BY CATEGORY', '', 'Y1 Monthly Avg', 'Y2 Monthly Avg', ''], { isSub: true }); r++;

  const y1HostAvg = +(hostingTotal.slice(0,12).reduce((a,b)=>a+b,0) / 12).toFixed(1);
  const y2HostAvg = +(hostingTotal.slice(12).reduce((a,b)=>a+b,0) / 12).toFixed(1);
  const y1AiAvg = +(aiTotal.slice(0,12).reduce((a,b)=>a+b,0) / 12).toFixed(1);
  const y2AiAvg = +(aiTotal.slice(12).reduce((a,b)=>a+b,0) / 12).toFixed(1);
  const y1PayAvg = +(payCommTotal.slice(0,12).reduce((a,b)=>a+b,0) / 12).toFixed(1);
  const y2PayAvg = +(payCommTotal.slice(12).reduce((a,b)=>a+b,0) / 12).toFixed(1);
  const y1AnaAvg = +(analyticsTotal.slice(0,12).reduce((a,b)=>a+b,0) / 12).toFixed(1);
  const y2AnaAvg = +(analyticsTotal.slice(12).reduce((a,b)=>a+b,0) / 12).toFixed(1);
  const y1TotalAvg = +(grandTotal.slice(0,12).reduce((a,b)=>a+b,0) / 12).toFixed(1);
  const y2TotalAvg = +(grandTotal.slice(12).reduce((a,b)=>a+b,0) / 12).toFixed(1);

  writeRow(ws, r, ['Hosting & Database', '', `\u20B9${y1HostAvg}K`, `\u20B9${y2HostAvg}K`, ''], { align }); r++;
  writeRow(ws, r, ['AI & API Services', '', `\u20B9${y1AiAvg}K`, `\u20B9${y2AiAvg}K`, ''], { alt: true, align }); r++;
  writeRow(ws, r, ['Payments & Communication', '', `\u20B9${y1PayAvg}K`, `\u20B9${y2PayAvg}K`, ''], { align }); r++;
  writeRow(ws, r, ['Analytics & Monitoring', '', `\u20B9${y1AnaAvg}K`, `\u20B9${y2AnaAvg}K`, ''], { alt: true, align }); r++;
  writeRow(ws, r, ['TOTAL', '', `\u20B9${y1TotalAvg}K`, `\u20B9${y2TotalAvg}K`, ''], { isTotal: true, goldBorder: true, align }); r++;
  r++;

  writeRow(ws, r, ['NOTE: All dev tools (Next.js, React, Prisma, Tailwind, TypeScript) are free/open-source.', '', '', '', ''], { labelFont: F.dim }); r++;
  writeRow(ws, r, ['Costs scale linearly with usage. AI costs are the largest variable \u2014 can switch to open-source LLMs if needed.', '', '', '', ''], { labelFont: F.dim }); r++;
}


// ─── WRITE ──────────────────────────────────────────────────────────────────
const outFile = path.join(process.env.HOME, 'Desktop', 'carobest-financial-model.xlsx');

wb.xlsx.writeFile(outFile).then(() => {
  console.log(`Saved: ${outFile}`);
  // Also copy to public for web access
  const publicFile = path.join(__dirname, '..', 'public', 'carobest-financial-model.xlsx');
  return wb.xlsx.writeFile(publicFile);
}).then(() => {
  console.log('Also saved to public/');
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
