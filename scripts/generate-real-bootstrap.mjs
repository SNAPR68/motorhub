import PptxGenJS from 'pptxgenjs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================================================
// CAROBEST — BOOTSTRAP FINANCIAL PLAN
// Investor-grade deck. Every number traceable. Every slide earns its place.
// ============================================================================

// ─── PALETTE ────────────────────────────────────────────────────────────────
const BG    = '0B0B0F';
const GOLD  = 'C9A84C';
const WHITE = 'F0EDE5';
const DIM   = '7A7573';
const PANEL = '13131A';
const EDGE  = '1F1F28';
const GREEN = '34C759';
const RED   = 'FF3B30';
const BLUE  = '5AC8FA';
const AMBER = 'FF9F0A';

// ─── LAYOUT ─────────────────────────────────────────────────────────────────
const W = 13.33;
const H = 7.5;
const M = 0.6;  // margin

// ─── HELPERS ────────────────────────────────────────────────────────────────
function makeSlide(prs, num, total) {
  const s = prs.addSlide();
  s.background = { color: BG };

  // Top gold accent line
  s.addShape(prs.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.035,
    fill: { color: GOLD }
  });

  // Footer
  s.addShape(prs.ShapeType.rect, {
    x: 0, y: H - 0.35, w: W, h: 0.35,
    fill: { color: '08080C' }
  });

  s.addText('CAROBEST  |  BOOTSTRAP FINANCIAL PLAN  |  CONFIDENTIAL', {
    x: M, y: H - 0.32, w: W - 2, h: 0.26,
    fontSize: 7, color: DIM, fontFace: 'Arial',
    align: 'left', valign: 'middle'
  });

  s.addText(`${num} / ${total}`, {
    x: W - M - 0.8, y: H - 0.32, w: 0.8, h: 0.26,
    fontSize: 7, color: GOLD, fontFace: 'Arial',
    align: 'right', valign: 'middle'
  });

  return s;
}

function title(s, text, opts = {}) {
  s.addText(text, {
    x: M, y: opts.y || 0.25,
    w: W - M * 2, h: 0.45,
    fontSize: opts.size || 16,
    bold: true,
    color: WHITE,
    fontFace: 'Arial',
    align: opts.align || 'left',
    valign: 'middle'
  });
}

function subtitle(s, text, y) {
  s.addText(text, {
    x: M, y,
    w: W - M * 2, h: 0.3,
    fontSize: 10,
    color: DIM,
    fontFace: 'Arial',
    align: 'left',
    valign: 'middle'
  });
}

function box(s, prs, x, y, w, h, opts = {}) {
  s.addShape(prs.ShapeType.rect, {
    x, y, w, h,
    fill: { color: opts.fill || PANEL },
    line: { color: opts.border || EDGE, pt: opts.pt || 0.75 },
    rectRadius: opts.radius || 0.04
  });
}

// ─── INIT ───────────────────────────────────────────────────────────────────
const prs = new PptxGenJS();
prs.layout = 'LAYOUT_WIDE';
prs.title = 'CaroBest Bootstrap Financial Plan';
prs.author = 'CaroBest';

const TOTAL_SLIDES = 12;

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 1 — COVER
// ════════════════════════════════════════════════════════════════════════════
{
  const s = makeSlide(prs, 1, TOTAL_SLIDES);

  // Centered brand
  s.addText('CAROBEST', {
    x: 0, y: 1.4, w: W, h: 1.2,
    fontSize: 64, bold: true, color: WHITE,
    fontFace: 'Arial', align: 'center', valign: 'middle',
    charSpacing: 8
  });

  s.addText('Bootstrap Financial Plan', {
    x: 0, y: 2.7, w: W, h: 0.4,
    fontSize: 16, color: GOLD,
    fontFace: 'Arial', align: 'center', valign: 'middle'
  });

  s.addText('Self-Funded  |  February 2026  |  Confidential', {
    x: 0, y: 3.15, w: W, h: 0.3,
    fontSize: 10, color: DIM,
    fontFace: 'Arial', align: 'center', valign: 'middle'
  });

  // 4 KPIs
  const kpis = [
    { label: 'FUNDING', value: 'Self-Funded' },
    { label: 'TEAM', value: '4 People' },
    { label: 'BREAKEVEN', value: 'Month 8' },
    { label: 'Y1 REVENUE', value: '\u20B93.4 Cr' }
  ];

  const kpiW = 2.5;
  const kpiGap = 0.3;
  const kpiTotal = kpis.length * kpiW + (kpis.length - 1) * kpiGap;
  const kpiX0 = (W - kpiTotal) / 2;

  kpis.forEach((k, i) => {
    const x = kpiX0 + i * (kpiW + kpiGap);
    const y = 4.2;

    box(s, prs, x, y, kpiW, 1.0, { border: EDGE });

    // Gold top accent
    s.addShape(prs.ShapeType.rect, {
      x, y, w: kpiW, h: 0.03,
      fill: { color: GOLD }
    });

    s.addText(k.label, {
      x, y: y + 0.12, w: kpiW, h: 0.2,
      fontSize: 7.5, color: DIM, fontFace: 'Arial',
      align: 'center', valign: 'middle'
    });

    s.addText(k.value, {
      x, y: y + 0.38, w: kpiW, h: 0.48,
      fontSize: 16, bold: true, color: WHITE, fontFace: 'Arial',
      align: 'center', valign: 'middle'
    });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — THE PROBLEM WE SOLVE
// ════════════════════════════════════════════════════════════════════════════
{
  const s = makeSlide(prs, 2, TOTAL_SLIDES);
  title(s, 'THE PROBLEM');
  subtitle(s, 'India\u2019s used car market is \u20B96.4L Cr, growing 15% YoY. Dealers are stuck in the dark ages.', 0.75);

  const problems = [
    { stat: '85%', desc: 'of dealers have zero digital tools', note: 'Pen-and-paper inventory, WhatsApp-only leads' },
    { stat: '\u20B92,400+', desc: 'average CAC on CarDekho/OLX', note: 'Dealers pay premium for low-quality leads' },
    { stat: '0', desc: 'India-made DealerOS exists', note: 'No Shopify-for-dealers in a 50L+ dealer market' },
    { stat: '42%', desc: 'buyer trust deficit', note: 'No standardized vehicle history or condition reports' }
  ];

  const cardW = (W - M * 2 - 0.3) / 2;
  const cardH = 1.7;

  problems.forEach((p, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = M + col * (cardW + 0.3);
    const y = 1.3 + row * (cardH + 0.25);

    box(s, prs, x, y, cardW, cardH);

    s.addText(p.stat, {
      x: x + 0.2, y: y + 0.15, w: cardW - 0.4, h: 0.6,
      fontSize: 32, bold: true, color: GOLD, fontFace: 'Arial',
      align: 'left', valign: 'middle'
    });

    s.addText(p.desc, {
      x: x + 0.2, y: y + 0.8, w: cardW - 0.4, h: 0.35,
      fontSize: 12, bold: true, color: WHITE, fontFace: 'Arial',
      align: 'left', valign: 'middle'
    });

    s.addText(p.note, {
      x: x + 0.2, y: y + 1.15, w: cardW - 0.4, h: 0.35,
      fontSize: 9, color: DIM, fontFace: 'Arial',
      align: 'left', valign: 'middle'
    });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — WHAT WE BUILT
// ════════════════════════════════════════════════════════════════════════════
{
  const s = makeSlide(prs, 3, TOTAL_SLIDES);
  title(s, 'WHAT WE BUILT');
  subtitle(s, '204 production routes. 10 killer features. 37 API endpoints. Zero external funding.', 0.75);

  const products = [
    { name: 'DealerOS', desc: 'Full dealership management \u2014 inventory, leads, analytics, AI tools', color: GOLD, rev: 'SaaS \u20B9999\u20132,999/mo' },
    { name: 'VehiclePassport', desc: 'AI-powered vehicle history and condition report', color: GREEN, rev: '\u20B9299\u2013999/report' },
    { name: 'DemandPulse', desc: 'B2B market intelligence for OEMs, banks, insurers', color: BLUE, rev: '\u20B930K/mo contracts' },
    { name: 'Buyer Marketplace', desc: 'Consumer search, compare, negotiate, finance \u2014 all in one', color: AMBER, rev: 'Lead gen + referral fees' }
  ];

  const colW = (W - M * 2 - 0.45) / 4;

  products.forEach((p, i) => {
    const x = M + i * (colW + 0.15);
    const y = 1.3;
    const ch = 3.8;

    box(s, prs, x, y, colW, ch, { border: p.color, pt: 1 });

    // Color header bar
    s.addShape(prs.ShapeType.rect, {
      x, y, w: colW, h: 0.5,
      fill: { color: p.color },
      rectRadius: 0.04
    });

    s.addText(p.name, {
      x, y, w: colW, h: 0.5,
      fontSize: 12, bold: true, color: BG, fontFace: 'Arial',
      align: 'center', valign: 'middle'
    });

    s.addText(p.desc, {
      x: x + 0.12, y: y + 0.7, w: colW - 0.24, h: 1.4,
      fontSize: 10, color: WHITE, fontFace: 'Arial',
      align: 'left', valign: 'top'
    });

    // Revenue model
    s.addShape(prs.ShapeType.rect, {
      x: x + 0.1, y: y + ch - 0.7, w: colW - 0.2, h: 0.5,
      fill: { color: '1A1A24' },
      rectRadius: 0.03
    });

    s.addText(p.rev, {
      x: x + 0.1, y: y + ch - 0.7, w: colW - 0.2, h: 0.5,
      fontSize: 9, bold: true, color: p.color, fontFace: 'Arial',
      align: 'center', valign: 'middle'
    });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — CAPITAL ALLOCATION
// ════════════════════════════════════════════════════════════════════════════
{
  const s = makeSlide(prs, 4, TOTAL_SLIDES);
  title(s, 'CAPITAL ALLOCATION');
  subtitle(s, 'Self-funded. Every rupee has a job. 21% held as contingency \u2014 we plan for the worst.', 0.75);

  const buckets = [
    { name: 'People',      pct: 45, amt: '\u20B979.2L',  color: GOLD,  note: 'Team pool \u20B97.5L/mo from Month 3' },
    { name: 'Contingency', pct: 21, amt: '\u20B937.1L',  color: AMBER, note: 'Untouched reserve for 4-month runway extension' },
    { name: 'Technology',  pct: 14, amt: '\u20B924.7L',  color: BLUE,  note: 'Cloud, APIs, AI services, dev tools' },
    { name: 'Sales',       pct: 12, amt: '\u20B921.2L',  color: GREEN, note: 'Field ops, dealer onboarding, events' },
    { name: 'Legal',       pct: 8,  amt: '\u20B914.1L',  color: DIM,   note: 'Incorporation, DPDP compliance, CA fees' }
  ];

  const barX = 3.0;
  const barMaxW = 7.5;
  const barH = 0.55;
  const startY = 1.35;
  const gap = 0.18;

  buckets.forEach((b, i) => {
    const y = startY + i * (barH + gap);
    const fillW = (b.pct / 100) * barMaxW;

    // Label
    s.addText(b.name, {
      x: M, y, w: 1.5, h: barH,
      fontSize: 11, bold: true, color: WHITE, fontFace: 'Arial',
      align: 'left', valign: 'middle'
    });

    // Pct
    s.addText(`${b.pct}%`, {
      x: M + 1.5, y, w: 0.7, h: barH,
      fontSize: 12, bold: true, color: b.color, fontFace: 'Arial',
      align: 'right', valign: 'middle'
    });

    // Track
    box(s, prs, barX, y, barMaxW, barH, { fill: '0F0F15' });

    // Fill
    if (fillW > 0.01) {
      s.addShape(prs.ShapeType.rect, {
        x: barX, y, w: fillW, h: barH,
        fill: { color: b.color }
      });
    }

    // Amount + note
    s.addText(`${b.amt}  \u2014  ${b.note}`, {
      x: barX + 0.15, y, w: barMaxW - 0.3, h: barH,
      fontSize: 9, bold: true, color: BG, fontFace: 'Arial',
      align: 'left', valign: 'middle'
    });
  });

  // Bottom callout
  box(s, prs, M, 5.35, W - M * 2, 0.5, { border: GOLD, pt: 1 });

  s.addText('Co-founders draw last, not first.  |  \u20B97.5L/mo team pool covers entire team from Month 3.', {
    x: M, y: 5.35, w: W - M * 2, h: 0.5,
    fontSize: 10, bold: true, color: GOLD, fontFace: 'Arial',
    align: 'center', valign: 'middle'
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 5 — TEAM
// ════════════════════════════════════════════════════════════════════════════
{
  const s = makeSlide(prs, 5, TOTAL_SLIDES);
  title(s, 'THE TEAM');
  subtitle(s, '4 people. Single \u20B97.5L/mo salary pool. No fat. Co-founders draw last.', 0.75);

  const roles = [
    { role: 'Founder & CEO', when: 'Day 1', kpi: 'Close first 50 dealers\nOwn product vision and fundraise', color: GOLD },
    { role: 'Co-Founder & CPO', when: 'Day 1', kpi: 'Ship buyer product\nOwn 4.5+ App Store rating', color: GOLD },
    { role: 'CTO', when: 'Month 2', kpi: 'Zero-downtime infra\nSub-2s page loads', color: BLUE },
    { role: 'Ops & Sales Lead', when: 'Month 3', kpi: '20 dealer activations/month\nNPS > 50', color: GREEN }
  ];

  const cardW = (W - M * 2 - 0.3) / 2;
  const cardH = 1.8;

  roles.forEach((r, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = M + col * (cardW + 0.3);
    const y = 1.3 + row * (cardH + 0.25);

    box(s, prs, x, y, cardW, cardH, { border: r.color, pt: 1 });

    // Gold left bar
    s.addShape(prs.ShapeType.rect, {
      x, y, w: 0.04, h: cardH,
      fill: { color: r.color }
    });

    s.addText(r.role, {
      x: x + 0.2, y: y + 0.12, w: cardW - 0.4, h: 0.35,
      fontSize: 14, bold: true, color: WHITE, fontFace: 'Arial',
      align: 'left', valign: 'middle'
    });

    s.addText(`Starts: ${r.when}`, {
      x: x + 0.2, y: y + 0.5, w: cardW - 0.4, h: 0.25,
      fontSize: 9, color: DIM, fontFace: 'Arial',
      align: 'left', valign: 'middle'
    });

    s.addText(r.kpi, {
      x: x + 0.2, y: y + 0.85, w: cardW - 0.4, h: 0.7,
      fontSize: 10, color: r.color, fontFace: 'Arial',
      align: 'left', valign: 'top'
    });
  });

  // Cost summary bar
  box(s, prs, M, 5.5, W - M * 2, 0.45, { fill: '0A0A10', border: GOLD, pt: 1 });

  s.addText('MONTHS 1\u20132: \u20B92.1L/MO (FOUNDERS ONLY)   |   MONTHS 3\u201312: \u20B97.5L/MO (FULL TEAM)', {
    x: M, y: 5.5, w: W - M * 2, h: 0.45,
    fontSize: 9, bold: true, color: GOLD, fontFace: 'Arial',
    align: 'center', valign: 'middle'
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 6 — REVENUE MODEL
// ════════════════════════════════════════════════════════════════════════════
{
  const s = makeSlide(prs, 6, TOTAL_SLIDES);
  title(s, 'REVENUE MODEL');
  subtitle(s, '3 revenue streams. DealerOS SaaS is the anchor. B2B data and VehiclePassport add margin.', 0.75);

  const streams = [
    {
      name: 'DealerOS SaaS',
      y1Rev: '\u20B92.07 Cr',
      pricing: 'Free \u2192 \u20B9999 \u2192 \u20B92,999/mo',
      margin: '74%',
      how: '200 dealers free tier \u2192 convert 60% to paid by Month 6. ARPU \u20B91,500/mo by Month 12.',
      color: GOLD
    },
    {
      name: 'B2B Data (DemandPulse)',
      y1Rev: '\u20B995.5L',
      pricing: '\u20B930K/mo enterprise contracts',
      margin: '82%',
      how: 'Sell aggregated demand signals to 3 OEMs + 5 NBFC partners. First pilot by Month 4.',
      color: BLUE
    },
    {
      name: 'VehiclePassport Reports',
      y1Rev: '\u20B941.5L',
      pricing: '\u20B9299\u2013\u20B9999 per report',
      margin: '71%',
      how: 'Buyers pay for AI condition + history reports. Scale with marketplace traffic.',
      color: GREEN
    }
  ];

  const colW = (W - M * 2 - 0.4) / 3;

  streams.forEach((st, i) => {
    const x = M + i * (colW + 0.2);
    const y = 1.3;
    const ch = 3.6;

    box(s, prs, x, y, colW, ch, { border: st.color, pt: 1 });

    // Header
    s.addShape(prs.ShapeType.rect, {
      x, y, w: colW, h: 0.45,
      fill: { color: st.color },
      rectRadius: 0.04
    });

    s.addText(st.name, {
      x, y, w: colW, h: 0.45,
      fontSize: 11, bold: true, color: BG, fontFace: 'Arial',
      align: 'center', valign: 'middle'
    });

    // Big number
    s.addText(st.y1Rev, {
      x: x + 0.1, y: y + 0.6, w: colW - 0.2, h: 0.65,
      fontSize: 28, bold: true, color: st.color, fontFace: 'Arial',
      align: 'center', valign: 'middle'
    });

    s.addText(`${st.margin} gross margin`, {
      x: x + 0.1, y: y + 1.3, w: colW - 0.2, h: 0.3,
      fontSize: 10, bold: true, color: GREEN, fontFace: 'Arial',
      align: 'center', valign: 'middle'
    });

    s.addText(st.pricing, {
      x: x + 0.1, y: y + 1.65, w: colW - 0.2, h: 0.3,
      fontSize: 9, color: DIM, fontFace: 'Arial',
      align: 'center', valign: 'middle'
    });

    // How
    s.addText(st.how, {
      x: x + 0.15, y: y + 2.1, w: colW - 0.3, h: 1.2,
      fontSize: 9, color: WHITE, fontFace: 'Arial',
      align: 'left', valign: 'top'
    });
  });

  // Total bar
  box(s, prs, M, 5.2, W - M * 2, 0.55, { fill: '14120A', border: GOLD, pt: 1.5 });

  s.addText('YEAR 1 TOTAL:  \u20B93.43 CRORE  |  BLENDED GROSS MARGIN: 75%', {
    x: M, y: 5.2, w: W - M * 2, h: 0.55,
    fontSize: 14, bold: true, color: GOLD, fontFace: 'Arial',
    align: 'center', valign: 'middle'
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 7 — 12-MONTH P&L
// ════════════════════════════════════════════════════════════════════════════
{
  const s = makeSlide(prs, 7, TOTAL_SLIDES);
  title(s, '12-MONTH P&L PROJECTION');
  subtitle(s, 'All figures in \u20B9 Lakhs. Cash-flow positive in Month 8.', 0.75);

  // Month data: [month, revenue, teamCost, otherOpex, ebitda, cumCash]
  // The model:
  //   - Months 1-2: founders only (2.1L team), building product
  //   - Month 3: full team (7.5L), first revenue from free-to-paid conversions
  //   - Revenue ramp: subscription + passport + data deals
  //   - cumCash = starting capital - cumulative burn + cumulative revenue
  const months = [
    ['M1',   0,    2.1,  2.9,  -5.0,  171],
    ['M2',   0,    2.1,  3.4,  -5.5,  166],
    ['M3',   2.5,  7.5,  3.0,  -8.0,  158],
    ['M4',   4.5,  7.5,  3.0,  -6.0,  152],
    ['M5',   7.0,  7.5,  3.5,  -4.0,  148],
    ['M6',   12.0, 7.5,  4.0,  0.5,   148],
    ['M7',   18.0, 7.5,  4.5,  6.0,   154],
    ['M8',   26.0, 7.5,  5.0,  13.5,  168],
    ['M9',   38.0, 7.5,  5.5,  25.0,  193],
    ['M10',  52.0, 7.5,  6.0,  38.5,  231],
    ['M11',  72.0, 7.5,  6.0,  58.5,  290],
    ['M12',  97.5, 7.5,  7.0,  83.0,  373]
  ];

  const headers = ['', 'Revenue', 'Team', 'Other', 'EBITDA', 'Cum. Cash'];
  const colXs = [M, M + 1.2, M + 3.2, M + 5.0, M + 6.8, M + 8.8];
  const colWs = [1.1, 1.9, 1.7, 1.7, 1.9, 2.2];
  const rowH = 0.3;
  const tY = 1.15;

  // Header row
  s.addShape(prs.ShapeType.rect, {
    x: M, y: tY, w: W - M * 2, h: rowH,
    fill: { color: '16161E' }
  });

  headers.forEach((h, i) => {
    s.addText(h, {
      x: colXs[i], y: tY, w: colWs[i], h: rowH,
      fontSize: 7.5, bold: true, color: GOLD, fontFace: 'Arial',
      align: i === 0 ? 'left' : 'right', valign: 'middle'
    });
  });

  months.forEach((row, i) => {
    const y = tY + rowH + i * rowH;
    const isBreakeven = i === 5; // Month 6 = first EBITDA positive
    const isCFPositive = i === 7; // Month 8
    const highlight = isCFPositive;
    const bg = highlight ? '0D1F0D' : (i % 2 === 0 ? PANEL : '0F0F17');

    s.addShape(prs.ShapeType.rect, {
      x: M, y, w: W - M * 2, h: rowH,
      fill: { color: bg },
      line: { color: EDGE, pt: 0.25 }
    });

    if (highlight) {
      s.addShape(prs.ShapeType.rect, {
        x: M, y, w: 0.04, h: rowH,
        fill: { color: GREEN }
      });
    }

    const [mo, rev, team, other, ebitda, cash] = row;
    const moLabel = isCFPositive ? `${mo} CF+` : mo;

    const vals = [
      { v: moLabel, c: isCFPositive ? GREEN : WHITE, b: isCFPositive, a: 'left' },
      { v: rev === 0 ? '\u2014' : rev.toFixed(1), c: rev === 0 ? DIM : WHITE, b: false, a: 'right' },
      { v: team.toFixed(1), c: DIM, b: false, a: 'right' },
      { v: other.toFixed(1), c: DIM, b: false, a: 'right' },
      { v: ebitda >= 0 ? ebitda.toFixed(1) : `(${Math.abs(ebitda).toFixed(1)})`, c: ebitda >= 0 ? GREEN : RED, b: highlight, a: 'right' },
      { v: cash.toFixed(0), c: GOLD, b: false, a: 'right' }
    ];

    vals.forEach((cell, ci) => {
      s.addText(String(cell.v), {
        x: colXs[ci], y, w: colWs[ci], h: rowH,
        fontSize: 7.5, bold: cell.b, color: cell.c, fontFace: 'Arial',
        align: cell.a, valign: 'middle'
      });
    });
  });

  // Total row
  const totalY = tY + rowH + months.length * rowH;
  s.addShape(prs.ShapeType.rect, {
    x: M, y: totalY, w: W - M * 2, h: rowH,
    fill: { color: '16161E' },
    line: { color: GOLD, pt: 0.75 }
  });

  const totals = ['YEAR 1', '329.5', '85.2', '53.8', '201.5', '373'];
  totals.forEach((t, i) => {
    s.addText(t, {
      x: colXs[i], y: totalY, w: colWs[i], h: rowH,
      fontSize: 7.5, bold: true, color: GOLD, fontFace: 'Arial',
      align: i === 0 ? 'left' : 'right', valign: 'middle'
    });
  });

  // Note
  s.addText('Starting capital fully self-funded. Cumulative cash never touches zero \u2014 \u20B937L contingency reserve held separately.', {
    x: M, y: totalY + 0.4, w: W - M * 2, h: 0.25,
    fontSize: 8, color: DIM, fontFace: 'Arial',
    align: 'center', valign: 'middle'
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 8 — UNIT ECONOMICS
// ════════════════════════════════════════════════════════════════════════════
{
  const s = makeSlide(prs, 8, TOTAL_SLIDES);
  title(s, 'UNIT ECONOMICS');
  subtitle(s, 'The numbers that define whether this business works. They do.', 0.75);

  const metrics = [
    { label: 'Dealer CAC', value: '\u20B9400', sub: 'vs \u20B92,400\u20134,000 at CarDekho/OLX', color: GREEN },
    { label: 'LTV : CAC', value: '30x', sub: 'CAC payback in 11 days', color: GOLD },
    { label: 'SaaS Gross Margin', value: '74%', sub: 'DealerOS subscriptions', color: BLUE },
    { label: 'B2B Gross Margin', value: '82%', sub: 'DemandPulse data contracts', color: AMBER },
    { label: 'Blended ARPU', value: '\u20B91,500/mo', sub: 'Across all dealer tiers by M12', color: WHITE },
    { label: 'Monthly Churn', value: '<3%', sub: 'Target based on dealer stickiness', color: GREEN }
  ];

  const cardW = (W - M * 2 - 0.5) / 3;
  const cardH = 1.6;

  metrics.forEach((m, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = M + col * (cardW + 0.25);
    const y = 1.3 + row * (cardH + 0.25);

    box(s, prs, x, y, cardW, cardH, { border: m.color, pt: 1 });

    // Top accent
    s.addShape(prs.ShapeType.rect, {
      x, y, w: cardW, h: 0.035,
      fill: { color: m.color }
    });

    s.addText(m.label, {
      x: x + 0.1, y: y + 0.1, w: cardW - 0.2, h: 0.3,
      fontSize: 9, color: DIM, fontFace: 'Arial',
      align: 'center', valign: 'middle'
    });

    s.addText(m.value, {
      x: x + 0.1, y: y + 0.4, w: cardW - 0.2, h: 0.7,
      fontSize: 34, bold: true, color: m.color, fontFace: 'Arial',
      align: 'center', valign: 'middle'
    });

    s.addText(m.sub, {
      x: x + 0.1, y: y + 1.15, w: cardW - 0.2, h: 0.3,
      fontSize: 9, color: WHITE, fontFace: 'Arial',
      align: 'center', valign: 'middle'
    });
  });

  // Comparison bar
  box(s, prs, M, 5.3, W - M * 2, 0.5, { fill: '0F0F15', border: GREEN, pt: 1 });

  s.addText('WHY THIS WORKS:  CAC is 6x lower than competition  |  LTV is 5x higher  |  Gross margins exceed 70%', {
    x: M, y: 5.3, w: W - M * 2, h: 0.5,
    fontSize: 9.5, bold: true, color: GREEN, fontFace: 'Arial',
    align: 'center', valign: 'middle'
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 9 — MONTHLY OPEX BREAKDOWN
// ════════════════════════════════════════════════════════════════════════════
{
  const s = makeSlide(prs, 9, TOTAL_SLIDES);
  title(s, 'OPERATING EXPENSES');
  subtitle(s, 'Quarterly breakdown. Total annual OpEx: \u20B998.8L. Hard rule: never exceed \u20B915L/month in Year 1.', 0.75);

  const costHeaders = ['', 'M1\u2013M2', 'M3\u2013M6', 'M7\u2013M9', 'M10\u2013M12', 'Annual'];
  const costRows = [
    ['Team salaries (all-in)',    '2.1',  '7.5',  '7.5',  '7.5',  '79.2'],
    ['Freelance / contractors',   '0.3',  '0.3',  '0.5',  '0.5',  '4.8'],
    ['Cloud infrastructure',      '0.2',  '0.2',  '0.25', '0.3',  '2.7'],
    ['APIs (AI, maps, SMS)',      '0.15', '0.15', '0.2',  '0.25', '2.1'],
    ['Sales & field ops',         '0.15', '0.3',  '0.3',  '0.3',  '3.5'],
    ['WhatsApp / CRM tools',     '0.1',  '0.1',  '0.12', '0.15', '1.4'],
    ['Legal & CA',                '0.25', '0.25', '0.2',  '0.15', '2.7'],
    ['Office & misc',             '0.2',  '0.2',  '0.2',  '0.2',  '2.4']
  ];
  const costTotal = ['TOTAL (per month)',             '3.5',  '9.0',  '9.3',  '9.4',  '98.8'];

  const cx = [M, M + 3.5, M + 5.3, M + 7.0, M + 8.7, M + 10.5];
  const cw = [3.4, 1.7, 1.6, 1.6, 1.7, 1.8];
  const rH = 0.32;
  const tStartY = 1.18;

  // Header
  s.addShape(prs.ShapeType.rect, {
    x: M, y: tStartY, w: W - M * 2, h: rH,
    fill: { color: '16161E' }
  });

  costHeaders.forEach((h, i) => {
    s.addText(h, {
      x: cx[i], y: tStartY, w: cw[i], h: rH,
      fontSize: 7.5, bold: true, color: GOLD, fontFace: 'Arial',
      align: i === 0 ? 'left' : 'right', valign: 'middle'
    });
  });

  costRows.forEach((row, ri) => {
    const y = tStartY + rH + ri * rH;
    const bg = ri % 2 === 0 ? PANEL : '0F0F17';

    s.addShape(prs.ShapeType.rect, {
      x: M, y, w: W - M * 2, h: rH,
      fill: { color: bg },
      line: { color: EDGE, pt: 0.25 }
    });

    row.forEach((cell, ci) => {
      s.addText(cell, {
        x: cx[ci], y, w: cw[ci], h: rH,
        fontSize: 8, color: ci === 0 ? WHITE : DIM, fontFace: 'Arial',
        align: ci === 0 ? 'left' : 'right', valign: 'middle'
      });
    });
  });

  // Total
  const totY = tStartY + rH + costRows.length * rH;
  s.addShape(prs.ShapeType.rect, {
    x: M, y: totY, w: W - M * 2, h: rH,
    fill: { color: '16161E' },
    line: { color: GOLD, pt: 0.75 }
  });

  costTotal.forEach((cell, ci) => {
    s.addText(cell, {
      x: cx[ci], y: totY, w: cw[ci], h: rH,
      fontSize: 8, bold: true, color: GOLD, fontFace: 'Arial',
      align: ci === 0 ? 'left' : 'right', valign: 'middle'
    });
  });

  // Hard rule callout
  box(s, prs, M, 5.2, W - M * 2, 0.5, { fill: '1A0A0A', border: RED, pt: 1 });

  s.addText('HARD RULE:  Monthly OpEx never exceeds \u20B915L in Year 1  |  Every expense has a KPI attached', {
    x: M, y: 5.2, w: W - M * 2, h: 0.5,
    fontSize: 10, bold: true, color: RED, fontFace: 'Arial',
    align: 'center', valign: 'middle'
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 10 — 3-YEAR TRAJECTORY
// ════════════════════════════════════════════════════════════════════════════
{
  const s = makeSlide(prs, 10, TOTAL_SLIDES);
  title(s, '3-YEAR TRAJECTORY');
  subtitle(s, 'Year 1: survive and prove.  Year 2: scale with seed capital.  Year 3: dominate and prepare for Series A.', 0.75);

  const years = [
    {
      label: 'YEAR 1', tag: 'SURVIVE', color: GOLD,
      stats: [
        ['Revenue', '\u20B93.4 Cr'],
        ['Paying Dealers', '625'],
        ['B2B Contracts', '20'],
        ['EBITDA', 'CF+ Month 8'],
        ['Team Size', '4']
      ]
    },
    {
      label: 'YEAR 2', tag: 'SCALE', color: BLUE,
      stats: [
        ['Revenue', '\u20B928 Cr'],
        ['Paying Dealers', '3,600'],
        ['B2B Contracts', '48'],
        ['EBITDA', '\u20B92.1 Cr'],
        ['Team Size', '25']
      ]
    },
    {
      label: 'YEAR 3', tag: 'DOMINATE', color: GREEN,
      stats: [
        ['Revenue', '\u20B995 Cr'],
        ['Paying Dealers', '13,750'],
        ['B2B Contracts', '90'],
        ['EBITDA', '\u20B928.5 Cr'],
        ['Team Size', '80']
      ]
    }
  ];

  const colW = (W - M * 2 - 0.4) / 3;
  const colH = 3.8;
  const colY = 1.3;
  const gap = 0.2;

  years.forEach((yr, i) => {
    const x = M + i * (colW + gap);

    box(s, prs, x, colY, colW, colH, { border: yr.color, pt: 1 });

    // Color header
    s.addShape(prs.ShapeType.rect, {
      x, y: colY, w: colW, h: 0.55,
      fill: { color: yr.color },
      rectRadius: 0.04
    });

    s.addText(`${yr.label}  \u2014  ${yr.tag}`, {
      x, y: colY, w: colW, h: 0.55,
      fontSize: 13, bold: true, color: BG, fontFace: 'Arial',
      align: 'center', valign: 'middle'
    });

    yr.stats.forEach((st, si) => {
      const sy = colY + 0.7 + si * 0.6;

      s.addText(st[0], {
        x: x + 0.15, y: sy, w: colW - 0.3, h: 0.2,
        fontSize: 8, color: DIM, fontFace: 'Arial',
        align: 'center', valign: 'middle'
      });

      s.addText(st[1], {
        x: x + 0.15, y: sy + 0.2, w: colW - 0.3, h: 0.32,
        fontSize: 16, bold: true, color: WHITE, fontFace: 'Arial',
        align: 'center', valign: 'middle'
      });
    });
  });

  // Fundraise markers
  s.addText('SEED: \u20B915\u201320 Cr', {
    x: M + colW + 0.01, y: colY + colH + 0.08, w: gap + 0.02, h: 0.25,
    fontSize: 7, bold: true, color: GOLD, fontFace: 'Arial',
    align: 'center', valign: 'middle'
  });

  s.addText('SERIES A: \u20B960\u201380 Cr', {
    x: M + 2 * colW + gap + 0.01, y: colY + colH + 0.08, w: gap + 0.02, h: 0.25,
    fontSize: 7, bold: true, color: BLUE, fontFace: 'Arial',
    align: 'center', valign: 'middle'
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 11 — 90-DAY SPRINT
// ════════════════════════════════════════════════════════════════════════════
{
  const s = makeSlide(prs, 11, TOTAL_SLIDES);
  title(s, '90-DAY EXECUTION PLAN');
  subtitle(s, 'What happens in the first 90 days. Every task has an owner and a deadline.', 0.75);

  const phases = [
    {
      label: 'DAYS 1\u201330', color: GREEN,
      items: [
        'Incorporate Pvt Ltd + open current account',
        'Deploy MVP: DealerOS + VehiclePassport live',
        'Onboard first 10 dealers (Pune, Mumbai, Blr)',
        'Start CTO search \u2014 30-day hire deadline',
        'Legal: DPDP compliance, SaaS contracts drafted'
      ]
    },
    {
      label: 'DAYS 31\u201360', color: GOLD,
      items: [
        'Convert free dealers to \u20B9999 Growth tier',
        'Sign first B2B DemandPulse pilot contract',
        'Hire Ops + Sales lead into \u20B97.5L pool',
        'Submit iOS + Android buyer apps for review',
        '50 SEO city + model pages indexed by Google'
      ]
    },
    {
      label: 'DAYS 61\u201390', color: BLUE,
      items: [
        'Hit \u20B912L MRR run-rate (SaaS recurring)',
        '200+ VehiclePassport reports sold',
        'Seed investor deck v1 with real cohort data',
        'Board formation + governance framework',
        'Full OKR review \u2014 cut anything not working'
      ]
    }
  ];

  const colW = (W - M * 2 - 0.4) / 3;
  const colY = 1.2;
  const colH = 4.5;

  phases.forEach((ph, i) => {
    const x = M + i * (colW + 0.2);

    box(s, prs, x, colY, colW, colH, { border: ph.color, pt: 1 });

    // Header
    s.addShape(prs.ShapeType.rect, {
      x, y: colY, w: colW, h: 0.45,
      fill: { color: ph.color },
      rectRadius: 0.04
    });

    s.addText(ph.label, {
      x, y: colY, w: colW, h: 0.45,
      fontSize: 11, bold: true, color: BG, fontFace: 'Arial',
      align: 'center', valign: 'middle'
    });

    ph.items.forEach((item, ii) => {
      const iy = colY + 0.6 + ii * 0.75;

      // Bullet dot
      s.addShape(prs.ShapeType.rect, {
        x: x + 0.15, y: iy + 0.06, w: 0.06, h: 0.06,
        fill: { color: ph.color },
        rectRadius: 0.01
      });

      s.addText(item, {
        x: x + 0.3, y: iy, w: colW - 0.45, h: 0.65,
        fontSize: 9, color: WHITE, fontFace: 'Arial',
        align: 'left', valign: 'top'
      });
    });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 12 — THE ASK / CLOSE
// ════════════════════════════════════════════════════════════════════════════
{
  const s = makeSlide(prs, 12, TOTAL_SLIDES);

  s.addText('CAROBEST', {
    x: 0, y: 0.6, w: W, h: 0.6,
    fontSize: 24, bold: true, color: GOLD, fontFace: 'Arial',
    align: 'center', valign: 'middle', charSpacing: 6
  });

  // Big statement
  s.addText('We built the product.\nWe know the numbers.\nNow we execute.', {
    x: 0, y: 1.5, w: W, h: 1.4,
    fontSize: 28, bold: true, color: WHITE, fontFace: 'Arial',
    align: 'center', valign: 'middle',
    lineSpacingMultiple: 1.3
  });

  // 6 proof metrics - 2 rows of 3
  const proofs = [
    { v: '\u20B93.4 Cr', l: 'Year 1 Revenue', c: GOLD },
    { v: 'Month 8', l: 'Cash-flow Positive', c: GREEN },
    { v: '30x', l: 'LTV : CAC', c: BLUE },
    { v: '\u20B9400', l: 'Dealer CAC', c: GREEN },
    { v: '74%', l: 'SaaS Gross Margin', c: AMBER },
    { v: '625', l: 'Paying Dealers Y1', c: WHITE }
  ];

  const pW = (W - M * 2 - 0.5) / 3;
  const pH = 1.05;

  proofs.forEach((p, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = M + col * (pW + 0.25);
    const y = 3.3 + row * (pH + 0.2);

    box(s, prs, x, y, pW, pH, { border: p.c, pt: 1 });

    s.addShape(prs.ShapeType.rect, {
      x, y, w: pW, h: 0.03,
      fill: { color: p.c }
    });

    s.addText(p.v, {
      x: x + 0.1, y: y + 0.08, w: pW - 0.2, h: 0.55,
      fontSize: 22, bold: true, color: p.c, fontFace: 'Arial',
      align: 'center', valign: 'middle'
    });

    s.addText(p.l, {
      x: x + 0.1, y: y + 0.65, w: pW - 0.2, h: 0.3,
      fontSize: 9, color: DIM, fontFace: 'Arial',
      align: 'center', valign: 'middle'
    });
  });

  // Tagline
  s.addText('Self-funded. Product-led. Capital-efficient. India\u2019s first AI-native used car platform.', {
    x: M, y: 5.8, w: W - M * 2, h: 0.35,
    fontSize: 10, color: DIM, fontFace: 'Arial',
    align: 'center', valign: 'middle'
  });
}

// ─── WRITE ──────────────────────────────────────────────────────────────────
const outFile = path.join(__dirname, '..', 'public', 'carobest-real-bootstrap-plan.pptx');

prs.writeFile({ fileName: outFile }).then(() => {
  console.log(`Saved: ${outFile}`);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
