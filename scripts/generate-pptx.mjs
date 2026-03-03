import PptxGenJS from 'pptxgenjs';

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 inches

// ── THEME
const C = {
  ink:     '080808',
  ink2:    '0F0F0F',
  surface: '1A1A1A',
  surf2:   '222222',
  muted:   '3A3A3A',
  gold:    'C9A84C',
  goldL:   'E8C97A',
  goldD:   '7A6230',
  text:    'E8E4DC',
  textD:   '8A8580',
  red:     'E84040',
  green:   '3DBE72',
  blue:    '4A90D9',
  orange:  'E8874A',
  white:   'FFFFFF',
};

const W = 13.33;
const H = 7.5;

// Helper — add a full-bleed dark background rect
function bg(slide, color = C.ink) {
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color } });
}

// Helper — gold top line accent
function goldLine(slide, x, y, w = 1.2) {
  slide.addShape(pptx.ShapeType.rect, { x, y, w, h: 0.03, fill: { color: C.gold } });
}

// Helper — section label (monospace small caps style)
function sectionLabel(slide, text, x = 0.5, y = 0.55) {
  slide.addText(text, {
    x, y, w: 4, h: 0.25,
    fontSize: 9, bold: false, color: C.gold,
    fontFace: 'Courier New', charSpacing: 3,
  });
}

// Helper — big heading
function heading(slide, lines, x = 0.5, y = 0.9, sz = 44, color = C.text) {
  slide.addText(lines, {
    x, y, w: W - 1, h: 1.4,
    fontSize: sz, bold: true, color,
    fontFace: 'Arial', charSpacing: 1,
    breakLine: false,
  });
}

// Helper — body text
function body(slide, text, x, y, w, h, sz = 11, color = C.textD) {
  slide.addText(text, { x, y, w, h, fontSize: sz, color, fontFace: 'Arial', valign: 'top', wrap: true });
}

// Helper — dark card
function card(slide, x, y, w, h, topColor = C.muted) {
  slide.addShape(pptx.ShapeType.rect, { x, y, w, h, fill: { color: C.surface }, line: { color: C.muted, width: 0.5 } });
  slide.addShape(pptx.ShapeType.rect, { x, y, w, h: 0.04, fill: { color: topColor } });
}

// ══════════════════════════════════════════════
// SLIDE 1 — HERO
// ══════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  bg(slide);

  // Grid pattern suggestion — subtle gold lines
  for (let i = 1; i < 10; i++) {
    slide.addShape(pptx.ShapeType.rect, { x: i * 1.33, y: 0, w: 0.005, h: H, fill: { color: '1A1508' } });
  }
  for (let i = 1; i < 6; i++) {
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: i * 1.25, w: W, h: 0.005, fill: { color: '1A1508' } });
  }

  // Eyebrow
  slide.addText('INVESTOR PRESENTATION  ·  FEBRUARY 2026', {
    x: 0, y: 1.4, w: W, h: 0.3,
    fontSize: 9, color: C.gold, bold: false, fontFace: 'Courier New',
    align: 'center', charSpacing: 3,
  });

  // Main title
  slide.addText('AUTO', {
    x: 0, y: 1.8, w: W, h: 1.3,
    fontSize: 96, bold: true, color: C.text, fontFace: 'Arial Black',
    align: 'center', charSpacing: 2,
  });
  slide.addText('VINCI', {
    x: 0, y: 2.9, w: W, h: 1.3,
    fontSize: 96, bold: true, color: C.gold, fontFace: 'Arial Black',
    align: 'center', charSpacing: 2,
  });

  // Tagline
  slide.addText("India's first AI-powered used car trust engine.\nWe don't just list cars — we solve the $83 billion problem everyone is ignoring.", {
    x: 2, y: 4.35, w: 9.33, h: 0.7,
    fontSize: 12, color: C.textD, fontFace: 'Arial',
    align: 'center', wrap: true,
  });

  // Metrics row
  const metrics = [
    { val: '$83B', lbl: 'Market Size 2031' },
    { val: '204+', lbl: 'Routes Built' },
    { val: '10', lbl: 'Killer Features' },
    { val: '26.85%', lbl: 'Online CAGR' },
  ];
  metrics.forEach((m, i) => {
    const x = 1.2 + i * 2.8;
    slide.addShape(pptx.ShapeType.rect, { x, y: 5.2, w: 2.2, h: 0.9, fill: { color: C.surface }, line: { color: C.muted, width: 0.5 } });
    slide.addShape(pptx.ShapeType.rect, { x, y: 5.2, w: 2.2, h: 0.04, fill: { color: C.gold } });
    slide.addText(m.val, { x, y: 5.28, w: 2.2, h: 0.45, fontSize: 28, bold: true, color: C.gold, fontFace: 'Arial Black', align: 'center' });
    slide.addText(m.lbl, { x, y: 5.72, w: 2.2, h: 0.3, fontSize: 8, color: C.textD, fontFace: 'Courier New', align: 'center', charSpacing: 1 });
  });

  // Bottom label
  slide.addText('CONFIDENTIAL  ·  2026', {
    x: 0, y: 7.1, w: W, h: 0.25,
    fontSize: 8, color: C.muted, fontFace: 'Courier New', align: 'center', charSpacing: 2,
  });
}

// ══════════════════════════════════════════════
// SLIDE 2 — MARKET OPPORTUNITY
// ══════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  bg(slide, C.ink2);
  goldLine(slide, 0.5, 0.5, W - 1);

  sectionLabel(slide, '02  —  MARKET OPPORTUNITY');
  slide.addText('THE $36B TRUST DEFICIT', {
    x: 0.5, y: 0.75, w: 7, h: 0.9,
    fontSize: 38, bold: true, color: C.text, fontFace: 'Arial Black', charSpacing: 1,
  });
  // $36B in gold
  slide.addText('$36B', { x: 1.38, y: 0.75, w: 2, h: 0.9, fontSize: 38, bold: true, color: C.gold, fontFace: 'Arial Black', charSpacing: 1 });

  // Body
  body(slide,
    "The Indian used car market is $36B (2025) heading to $83B by 2031. Yet 70.83% is still controlled by unorganized local dealers. Online platforms are growing at 26.85% CAGR, but trust remains the #1 barrier.",
    0.5, 1.75, 4.8, 0.8, 10.5, C.textD
  );

  // Stat cards
  const stats = [
    { val: '$36B', lbl: 'Market Today' },
    { val: '$83B', lbl: 'Projected 2031' },
    { val: '26.85%', lbl: 'Online CAGR' },
    { val: '70.83%', lbl: 'Still Unorganized' },
  ];
  stats.forEach((s, i) => {
    const x = 0.5 + (i % 2) * 2.45;
    const y = 2.65 + Math.floor(i / 2) * 1.05;
    card(slide, x, y, 2.3, 0.9, C.gold);
    slide.addText(s.val, { x, y: y + 0.08, w: 2.3, h: 0.5, fontSize: 26, bold: true, color: C.gold, fontFace: 'Arial Black', align: 'center' });
    slide.addText(s.lbl, { x, y: y + 0.56, w: 2.3, h: 0.28, fontSize: 8, color: C.textD, fontFace: 'Courier New', align: 'center', charSpacing: 1 });
  });

  // Pain points (right column)
  const pains = [
    'Zero reliable vehicle history — 60%+ odometer tampering, no Carfax equivalent',
    'RC transfer nightmare — takes 1–4 years, sellers face police & criminal liability',
    'True cost invisible — ₹6L price hides ₹1.8L/year in maintenance costs',
    'Dealer tools nonexistent — 70% manage inventory on WhatsApp',
    'Post-purchase void — platforms vanish the moment you buy',
    'Interstate purchase impossible — different tax, NOC, re-registration in every state',
  ];
  slide.addText('REAL PAIN POINTS', { x: 5.8, y: 1.65, w: 7, h: 0.3, fontSize: 9, color: C.gold, fontFace: 'Courier New', charSpacing: 2 });
  pains.forEach((p, i) => {
    const y = 2.05 + i * 0.78;
    slide.addShape(pptx.ShapeType.rect, { x: 5.8, y, w: 7.0, h: 0.68, fill: { color: C.surface }, line: { color: C.red, width: 1 } });
    slide.addShape(pptx.ShapeType.rect, { x: 5.8, y, w: 0.05, h: 0.68, fill: { color: C.red } });
    slide.addText('!', { x: 5.85, y: y + 0.12, w: 0.4, h: 0.4, fontSize: 14, bold: true, color: C.red, fontFace: 'Arial', align: 'center' });
    slide.addText(p, { x: 6.3, y: y + 0.1, w: 6.4, h: 0.48, fontSize: 9.5, color: C.textD, fontFace: 'Arial', wrap: true, valign: 'top' });
  });
}

// ══════════════════════════════════════════════
// SLIDE 3 — PLATFORM ARCHITECTURE
// ══════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  bg(slide);
  goldLine(slide, 0.5, 0.5, W - 1);

  sectionLabel(slide, '03  —  PLATFORM ARCHITECTURE');
  slide.addText('204+ ROUTES, ONE PLATFORM', {
    x: 0.5, y: 0.75, w: W - 1, h: 0.75,
    fontSize: 36, bold: true, color: C.text, fontFace: 'Arial Black', charSpacing: 1,
  });

  const cols = [
    {
      title: 'BUYER SIDE', sub: '80+ consumer routes',
      routes: ['/showroom', '/vehicle/[id]/true-cost', '/vehicle/passport/[id]', '/vehicle/[id]/negotiate', '/compare', '/wishlist', '/concierge', '/vip', '/my-account/*', '/swap', '/inspection'],
    },
    {
      title: 'DEALER OS', sub: '30+ dealer routes',
      routes: ['/dashboard', '/inventory', '/leads', '/intelligence/*', '/analytics/*', '/studio', '/marketing', '/settings/*', '/dealer/signup', '/plans'],
    },
    {
      title: 'MARKETPLACE', sub: '60+ SEO routes',
      routes: ['/[brand]/[model]/*', '/used-cars/[city]', '/dealers/[city]', '/compare/[a]-vs-[b]', '/new-cars/*', '/electric-cars', '/upcoming-cars', '/car-news/*', '/expert-reviews/*', '/gaadi-store/[city]'],
    },
    {
      title: 'FINANCE & TOOLS', sub: 'Finance + utility routes',
      routes: ['/rc-transfer', '/cross-state', '/car-loan/*', '/car-insurance/*', '/fuel-price/[city]', '/rto/[state]', '/my-account/garage', '/my-account/warranty', '/my-account/documents', '/my-account/resale'],
    },
  ];

  cols.forEach((col, i) => {
    const x = 0.35 + i * 3.22;
    slide.addShape(pptx.ShapeType.rect, { x, y: 1.6, w: 3.08, h: 4.7, fill: { color: C.surface }, line: { color: C.muted, width: 0.5 } });
    slide.addShape(pptx.ShapeType.rect, { x, y: 1.6, w: 3.08, h: 0.03, fill: { color: i < 2 ? C.gold : C.muted } });
    // Header
    slide.addShape(pptx.ShapeType.rect, { x, y: 1.63, w: 3.08, h: 0.65, fill: { color: C.surf2 } });
    slide.addText(col.title, { x: x + 0.15, y: 1.67, w: 2.8, h: 0.32, fontSize: 13, bold: true, color: C.gold, fontFace: 'Arial Black', charSpacing: 1 });
    slide.addText(col.sub, { x: x + 0.15, y: 1.97, w: 2.8, h: 0.25, fontSize: 8, color: C.textD, fontFace: 'Courier New', charSpacing: 1 });
    // Routes
    col.routes.forEach((r, j) => {
      const ry = 2.38 + j * 0.38;
      const isFeatured = j < 4;
      slide.addShape(pptx.ShapeType.rect, { x: x + 0.12, y: ry, w: 2.84, h: 0.3, fill: { color: isFeatured ? '1A1508' : '111111' } });
      if (isFeatured) slide.addShape(pptx.ShapeType.rect, { x: x + 0.12, y: ry, w: 0.03, h: 0.3, fill: { color: C.gold } });
      slide.addText(r, { x: x + 0.2, y: ry + 0.04, w: 2.7, h: 0.22, fontSize: 8.5, color: isFeatured ? C.gold : C.textD, fontFace: 'Courier New' });
    });
  });

  // Stats bar
  const buildStats = [
    { val: '204+', lbl: 'Total Routes' },
    { val: '37', lbl: 'API Endpoints' },
    { val: '75+', lbl: 'Design Screens' },
    { val: '159', lbl: 'Static Pages' },
    { val: '0', lbl: 'Build Errors' },
  ];
  buildStats.forEach((s, i) => {
    const x = 0.35 + i * 2.6;
    slide.addShape(pptx.ShapeType.rect, { x, y: 6.45, w: 2.45, h: 0.75, fill: { color: C.surf2 }, line: { color: C.muted, width: 0.5 } });
    slide.addText(s.val, { x, y: 6.48, w: 2.45, h: 0.38, fontSize: 22, bold: true, color: C.gold, fontFace: 'Arial Black', align: 'center' });
    slide.addText(s.lbl, { x, y: 6.84, w: 2.45, h: 0.28, fontSize: 7.5, color: C.textD, fontFace: 'Courier New', align: 'center', charSpacing: 1 });
  });
}

// ══════════════════════════════════════════════
// SLIDE 4 — 10 KILLER FEATURES
// ══════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  bg(slide, C.ink2);
  goldLine(slide, 0.5, 0.5, W - 1);

  sectionLabel(slide, '04  —  COMPETITIVE FEATURES');
  slide.addText("10 FEATURES NOBODY ELSE BUILT", {
    x: 0.5, y: 0.75, w: W - 1, h: 0.75,
    fontSize: 36, bold: true, color: C.text, fontFace: 'Arial Black', charSpacing: 1,
  });

  const features = [
    { num: '01', name: 'VehiclePassport', desc: 'Tamper-proof vehicle history — Vahan API, OEM service records, insurance claims, OBD-II ECU scan vs. odometer', rev: '₹499/report', priority: 'P0', pColor: C.red },
    { num: '02', name: 'TrueCost Engine', desc: 'AI 3-year ownership cost predictor — maintenance forecast, known defects, real-world fuel, insurance, depreciation', rev: 'Drives conversion', priority: 'P0', pColor: C.red },
    { num: '03', name: 'InstantRC', desc: 'Escrow-based RC transfer with instant seller indemnity, automated Parivahan tracking, RTO agent network', rev: '₹999 policy', priority: 'P0', pColor: C.red },
    { num: '04', name: 'DealerOS', desc: 'Free SaaS for unorganized dealers — AI listing gen, dynamic pricing, embedded financing, digital storefront', rev: '₹2,999/mo', priority: 'P1', pColor: C.gold },
    { num: '05', name: 'SwapDirect', desc: 'P2P car exchange marketplace — match buyers/sellers swapping, value gap calc, dual escrow, simultaneous RC transfer', rev: '2–3% txn fee', priority: 'P2', pColor: C.blue },
    { num: '06', name: 'LiveCondition', desc: 'Uber-like independent mechanic network — 2-hour booking, live video stream, 250-point digital report', rev: '₹999–₹1,999', priority: 'P1', pColor: C.gold },
    { num: '07', name: 'CrossState Express', desc: 'Interstate purchase end-to-end — landed cost calc, document autopilot, flatbed delivery, single-window payment', rev: 'Service + logistics', priority: 'P2', pColor: C.blue },
    { num: '08', name: 'PostPurchase Hub', desc: 'Car companion from day 1 — warranty tracker, service scheduler, insurance renewal, resale value monitor', rev: 'Lifetime retention', priority: 'P1', pColor: C.gold },
    { num: '09', name: 'AI NegotiationCoach', desc: "Buyer's secret weapon — fair price range, negotiation scripts, walk-away alerts, post-deal validation", rev: 'Buyer loyalty', priority: 'P1', pColor: C.gold },
    { num: '10', name: 'DemandPulse', desc: 'Bloomberg Terminal for used cars — real-time pricing, demand heatmaps, depreciation curves, B2B API for banks', rev: '₹9,999/mo API', priority: 'P1', pColor: C.gold },
  ];

  features.forEach((f, i) => {
    const col = i % 5;
    const row = Math.floor(i / 5);
    const x = 0.35 + col * 2.6;
    const y = 1.65 + row * 2.7;
    const w = 2.45;
    const h = 2.55;

    slide.addShape(pptx.ShapeType.rect, { x, y, w, h, fill: { color: C.surface }, line: { color: C.muted, width: 0.5 } });
    slide.addShape(pptx.ShapeType.rect, { x, y, w, h: 0.04, fill: { color: f.pColor } });

    // Badge row
    slide.addText(`#${f.num}`, { x: x + 0.1, y: y + 0.1, w: 1, h: 0.22, fontSize: 8, color: C.textD, fontFace: 'Courier New' });
    slide.addShape(pptx.ShapeType.rect, { x: x + 1.6, y: y + 0.08, w: 0.72, h: 0.22, fill: { color: f.pColor === C.red ? '2A0808' : '1A1508' } });
    slide.addText(f.priority, { x: x + 1.6, y: y + 0.08, w: 0.72, h: 0.22, fontSize: 8, bold: true, color: f.pColor, fontFace: 'Courier New', align: 'center' });

    // Name
    slide.addText(f.name, { x: x + 0.1, y: y + 0.36, w: w - 0.2, h: 0.38, fontSize: 13, bold: true, color: C.text, fontFace: 'Arial', wrap: true });

    // Desc
    slide.addText(f.desc, { x: x + 0.1, y: y + 0.75, w: w - 0.2, h: 1.3, fontSize: 8.5, color: C.textD, fontFace: 'Arial', wrap: true, valign: 'top' });

    // Revenue
    slide.addShape(pptx.ShapeType.rect, { x: x + 0.1, y: y + 2.2, w: w - 0.2, h: 0.22, fill: { color: '0A1A0A' } });
    slide.addText(f.rev, { x: x + 0.1, y: y + 2.2, w: w - 0.2, h: 0.22, fontSize: 8, color: C.green, fontFace: 'Courier New', align: 'center' });
  });
}

// ══════════════════════════════════════════════
// SLIDE 5 — COMPETITIVE MOAT
// ══════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  bg(slide);
  goldLine(slide, 0.5, 0.5, W - 1);

  sectionLabel(slide, '05  —  COMPETITIVE MOAT');
  slide.addText('NOT A LISTING PLATFORM.', { x: 0.5, y: 0.75, w: W - 1, h: 0.55, fontSize: 34, bold: true, color: C.text, fontFace: 'Arial Black', charSpacing: 1 });
  slide.addText('A TRUST ENGINE.', { x: 0.5, y: 1.2, w: W - 1, h: 0.55, fontSize: 34, bold: true, color: C.gold, fontFace: 'Arial Black', charSpacing: 1 });

  const moats = [
    { title: 'Data Network Effect', body: 'Every inspection, VehiclePassport, and transaction enriches the database. More data → better AI pricing → stronger trust → more transactions. Cannot be fast-followed.' },
    { title: 'Supply-Side Lock-In', body: 'When unorganized dealers use our free DealerOS tools, they list with us first. Controlling 70% of supply means we control price discovery for the entire market.' },
    { title: 'Lifetime Buyer Relationship', body: 'PostPurchase Hub keeps us in the buyer\'s life from day 1 to resale. When they sell, they sell through us. When they buy next, they buy through us.' },
    { title: 'Regulatory Integration', body: 'InstantRC + VehiclePassport require deep integrations with Vahan/Parivahan, OEM portals, insurance aggregators, and RTO networks — 12–18 months to build.' },
  ];

  moats.forEach((m, i) => {
    const y = 1.85 + i * 1.28;
    slide.addShape(pptx.ShapeType.rect, { x: 0.4, y, w: 5.8, h: 1.15, fill: { color: C.surface }, line: { color: C.muted, width: 0.5 } });
    slide.addShape(pptx.ShapeType.rect, { x: 0.4, y, w: 0.05, h: 1.15, fill: { color: C.gold } });
    slide.addText(m.title, { x: 0.55, y: y + 0.1, w: 5.5, h: 0.32, fontSize: 13, bold: true, color: C.gold, fontFace: 'Arial' });
    slide.addText(m.body, { x: 0.55, y: y + 0.42, w: 5.5, h: 0.65, fontSize: 9, color: C.textD, fontFace: 'Arial', wrap: true, valign: 'top' });
  });

  // Comparison matrix (right side)
  slide.addText('FEATURE COMPARISON MATRIX', { x: 6.7, y: 1.75, w: 6.3, h: 0.28, fontSize: 9, color: C.gold, fontFace: 'Courier New', charSpacing: 2 });

  const matrixRows = [
    ['FEATURE', 'COMPETITORS', 'CAROBEST', true],
    ['Vehicle History (Carfax-equiv)', 'None', '✓ Built', false],
    ['3-Year Cost Predictor', 'None', '✓ Built', false],
    ['RC Transfer Guarantee', 'Reactive only', '✓ Proactive', false],
    ['Dealer SaaS Platform', 'None', '✓ Built', false],
    ['B2B Data API (DemandPulse)', 'None', '✓ Built', false],
    ['Post-Purchase Hub', 'None', '✓ Built', false],
    ['P2P Car Swap Marketplace', 'None', '✓ Built', false],
  ];

  matrixRows.forEach((row, i) => {
    const y = 2.1 + i * 0.56;
    const isHeader = row[3];
    const bg2 = isHeader ? C.surf2 : i % 2 === 0 ? C.surface : '131313';
    slide.addShape(pptx.ShapeType.rect, { x: 6.7, y, w: 6.3, h: 0.52, fill: { color: bg2 } });
    if (isHeader) slide.addShape(pptx.ShapeType.rect, { x: 6.7, y: y + 0.49, w: 6.3, h: 0.03, fill: { color: C.gold } });

    const cols2 = [2.8, 1.7, 1.8];
    const xPos = [6.7, 9.5, 11.2];
    row.slice(0, 3).forEach((cell, ci) => {
      const color = isHeader ? C.textD : ci === 2 ? C.green : ci === 1 ? C.red : C.textD;
      slide.addText(String(cell), {
        x: xPos[ci] + 0.1, y: y + 0.1, w: cols2[ci] - 0.2, h: 0.32,
        fontSize: isHeader ? 8 : 9, bold: isHeader,
        color: isHeader ? C.textD : color,
        fontFace: isHeader ? 'Courier New' : 'Arial',
        charSpacing: isHeader ? 1 : 0,
      });
    });
  });

  // Quote
  slide.addShape(pptx.ShapeType.rect, { x: 6.7, y: 6.58, w: 6.3, h: 0.72, fill: { color: C.surf2 }, line: { color: C.gold, width: 1 } });
  slide.addText('"CardDekho is an information portal. Cars24 is a transaction platform. OLX is a classifieds board. None of them are a Trust Engine. That\'s the gap."', {
    x: 6.85, y: 6.62, w: 6.0, h: 0.64,
    fontSize: 8.5, color: C.textD, fontFace: 'Arial', italic: true, wrap: true, valign: 'top',
  });
}

// ══════════════════════════════════════════════
// SLIDE 6 — COMPETITOR RANKING TABLE
// ══════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  bg(slide, C.ink2);
  goldLine(slide, 0.5, 0.5, W - 1);

  sectionLabel(slide, '06  —  COMPETITIVE INTELLIGENCE');
  slide.addText('MARKET RANKING BY TRUST SCORE', {
    x: 0.5, y: 0.75, w: W - 1, h: 0.65,
    fontSize: 30, bold: true, color: C.text, fontFace: 'Arial Black', charSpacing: 1,
  });
  slide.addText('Ranked across 6 dimensions: Trust Infrastructure · Dealer Tools · Buyer AI · Data Intelligence · Post-Purchase · Market Coverage  (Score / 100)', {
    x: 0.5, y: 1.42, w: W - 1, h: 0.28,
    fontSize: 8.5, color: C.textD, fontFace: 'Arial',
  });

  const competitors = [
    { rank: '1', name: 'CaroBest', type: 'AI Trust Engine', score: 88, trust: 92, dealer: 85, ai: 90, data: 88, post: 85, strengths: 'VehiclePassport, TrueCost, DemandPulse, DealerOS', gap: 'APIs need live data', isTop: true },
    { rank: '2', name: 'Cars24', type: 'C2B Inventory Platform', score: 64, trust: 55, dealer: 40, ai: 58, data: 72, post: 35, strengths: 'Brand trust, financing, inventory scale', gap: 'No vehicle history', isTop: false },
    { rank: '3', name: 'CarWale', type: 'Media + Marketplace', score: 58, trust: 42, dealer: 55, ai: 62, data: 60, post: 30, strengths: 'Editorial, Autocar India backing', gap: 'Weak used car play', isTop: false },
    { rank: '3', name: 'CardDekho', type: 'Classified + Finance Portal', score: 56, trust: 48, dealer: 52, ai: 55, data: 60, post: 28, strengths: 'SEO scale, loan distribution', gap: 'TrustMark is theater', isTop: false },
    { rank: '5', name: 'Spinny', type: 'Full-Stack Used Car Retailer', score: 54, trust: 68, dealer: 22, ai: 52, data: 38, post: 55, strengths: '200-pt inspection, fixed price, 7-day return', gap: 'Asset-heavy, limited scale', isTop: false },
    { rank: '6', name: 'Droom', type: 'Used Car Classified + AI', score: 44, trust: 50, dealer: 48, ai: 55, data: 35, post: 25, strengths: 'Orange Book Value, AI valuation', gap: 'Trust & growth stalled', isTop: false },
    { rank: '7', name: 'OLX Autos', type: 'Classifieds (C2B)', score: 34, trust: 18, dealer: 30, ai: 28, data: 22, post: 15, strengths: 'Brand awareness, volume', gap: 'Zero trust layer', isTop: false },
  ];

  // Table header
  const headers = ['#', 'PLATFORM', 'SCORE', 'TRUST', 'DEALER', 'AI', 'DATA', 'POST-BUY', 'FATAL GAP'];
  const colX  = [0.3, 0.75, 2.55, 3.5, 4.35, 5.2, 6.05, 6.9, 7.9];
  const colW  = [0.42, 1.75, 0.9, 0.82, 0.82, 0.82, 0.82, 0.9, 5.0];

  slide.addShape(pptx.ShapeType.rect, { x: 0.3, y: 1.78, w: W - 0.6, h: 0.38, fill: { color: C.surf2 } });
  slide.addShape(pptx.ShapeType.rect, { x: 0.3, y: 2.13, w: W - 0.6, h: 0.03, fill: { color: C.gold } });
  headers.forEach((h, i) => {
    slide.addText(h, { x: colX[i] + 0.05, y: 1.82, w: colW[i] - 0.1, h: 0.28, fontSize: 7.5, bold: true, color: C.textD, fontFace: 'Courier New', charSpacing: 1, valign: 'middle' });
  });

  competitors.forEach((c, i) => {
    const y = 2.2 + i * 0.69;
    const rowBg = c.isTop ? '141008' : i % 2 === 0 ? C.surface : '111111';
    slide.addShape(pptx.ShapeType.rect, { x: 0.3, y, w: W - 0.6, h: 0.65, fill: { color: rowBg }, line: { color: c.isTop ? C.goldD : C.muted, width: 0.5 } });
    if (c.isTop) slide.addShape(pptx.ShapeType.rect, { x: 0.3, y, w: 0.04, h: 0.65, fill: { color: C.gold } });

    // Rank badge
    const badgeColor = c.rank === '1' ? C.gold : c.rank === '2' ? '8A8A8A' : c.rank === '3' ? '8B5E3C' : C.muted;
    slide.addShape(pptx.ShapeType.ellipse, { x: colX[0] + 0.04, y: y + 0.12, w: 0.38, h: 0.38, fill: { color: badgeColor } });
    slide.addText(c.rank, { x: colX[0] + 0.04, y: y + 0.12, w: 0.38, h: 0.38, fontSize: 12, bold: true, color: c.rank === '1' ? C.ink : C.text, fontFace: 'Arial Black', align: 'center', valign: 'middle' });

    // Name + type
    slide.addText(c.name, { x: colX[1] + 0.05, y: y + 0.06, w: colW[1] - 0.1, h: 0.28, fontSize: 10, bold: true, color: c.isTop ? C.gold : C.text, fontFace: 'Arial' });
    slide.addText(c.type, { x: colX[1] + 0.05, y: y + 0.34, w: colW[1] - 0.1, h: 0.22, fontSize: 7, color: C.textD, fontFace: 'Arial' });

    // Score
    slide.addText(`${c.score}`, { x: colX[2] + 0.05, y: y + 0.12, w: colW[2] - 0.1, h: 0.38, fontSize: 18, bold: true, color: c.isTop ? C.gold : C.text, fontFace: 'Arial Black', align: 'center', valign: 'middle' });

    // Sub-scores
    const scores = [c.trust, c.dealer, c.ai, c.data, c.post];
    scores.forEach((s, si) => {
      const cx = colX[3 + si];
      const barColor = s >= 80 ? C.green : s >= 60 ? C.gold : s >= 40 ? C.orange : C.red;
      slide.addText(`${s}`, { x: cx + 0.05, y: y + 0.08, w: colW[3 + si] - 0.1, h: 0.3, fontSize: 11, bold: true, color: barColor, fontFace: 'Arial Black', align: 'center' });
      // Mini bar
      const barW = (s / 100) * (colW[3 + si] - 0.2);
      slide.addShape(pptx.ShapeType.rect, { x: cx + 0.1, y: y + 0.44, w: colW[3 + si] - 0.2, h: 0.1, fill: { color: C.muted } });
      slide.addShape(pptx.ShapeType.rect, { x: cx + 0.1, y: y + 0.44, w: barW, h: 0.1, fill: { color: barColor } });
    });

    // Fatal gap
    slide.addText(c.gap, { x: colX[8] + 0.1, y: y + 0.16, w: colW[8] - 0.2, h: 0.3, fontSize: 8.5, color: C.red, fontFace: 'Arial', italic: true, valign: 'middle' });
  });
}

// ══════════════════════════════════════════════
// SLIDE 7 — REVENUE ARCHITECTURE
// ══════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  bg(slide);
  goldLine(slide, 0.5, 0.5, W - 1);

  sectionLabel(slide, '07  —  REVENUE ARCHITECTURE');
  slide.addText('5 REVENUE STREAMS,  ₹142+ CR POTENTIAL', {
    x: 0.5, y: 0.75, w: W - 1, h: 0.65,
    fontSize: 28, bold: true, color: C.text, fontFace: 'Arial Black', charSpacing: 1,
  });

  const streams = [
    { name: 'VehiclePassport', sub: 'Report fees', detail: '₹499/report for buyers, ₹299 bulk for dealers, 440K reports/yr at 10% market penetration', amount: '₹22 Cr' },
    { name: 'DealerOS SaaS', sub: 'Subscription + loan commission', detail: '₹2,999/mo Pro (5K dealers = ₹18Cr/yr) + ₹299/loan (5K dealers × 10 loans/mo = ₹18Cr/yr)', amount: '₹36 Cr' },
    { name: 'DemandPulse B2B', sub: 'Data API + SaaS', detail: '50 banks × ₹3L + 15 insurers × ₹5L + 20 OEMs × ₹10L + 5K premium dealers × ₹1.2L/yr', amount: '₹64 Cr' },
    { name: 'LiveCondition', sub: 'Inspection marketplace', detail: '₹999 basic, ₹1,999 premium, ₹499 second opinion. 30% platform take from mechanic network', amount: '₹8 Cr' },
    { name: 'InstantRC + SwapDirect', sub: 'Transaction fees + insurance', detail: '₹999 Deemed Transfer policy, escrow float on ₹10–25K per deal, 2–3% flat fee on swaps', amount: '₹12 Cr' },
  ];

  streams.forEach((s, i) => {
    const y = 1.58 + i * 0.95;
    slide.addShape(pptx.ShapeType.rect, { x: 0.4, y, w: 9.0, h: 0.85, fill: { color: C.surface }, line: { color: C.muted, width: 0.5 } });
    // Name col
    slide.addShape(pptx.ShapeType.rect, { x: 0.4, y, w: 2.2, h: 0.85, fill: { color: C.surf2 } });
    slide.addText(s.name, { x: 0.5, y: y + 0.08, w: 2.0, h: 0.3, fontSize: 10.5, bold: true, color: C.text, fontFace: 'Arial' });
    slide.addText(s.sub, { x: 0.5, y: y + 0.42, w: 2.0, h: 0.28, fontSize: 7.5, color: C.textD, fontFace: 'Courier New' });
    // Detail
    slide.addText(s.detail, { x: 2.7, y: y + 0.1, w: 5.4, h: 0.65, fontSize: 8.5, color: C.textD, fontFace: 'Arial', wrap: true, valign: 'top' });
    // Amount
    slide.addShape(pptx.ShapeType.rect, { x: 8.1, y, w: 1.3, h: 0.85, fill: { color: C.surf2 } });
    slide.addText(s.amount, { x: 8.1, y: y + 0.22, w: 1.3, h: 0.4, fontSize: 18, bold: true, color: C.green, fontFace: 'Arial Black', align: 'center' });
  });

  // Total bar
  slide.addShape(pptx.ShapeType.rect, { x: 0.4, y: 6.38, w: 9.0, h: 0.65, fill: { color: C.gold } });
  slide.addText('COMBINED YEAR 1 POTENTIAL', { x: 0.6, y: 6.45, w: 5, h: 0.5, fontSize: 12, bold: true, color: C.ink, fontFace: 'Arial Black', valign: 'middle' });
  slide.addText('₹142+ CRORE', { x: 5.6, y: 6.45, w: 3.6, h: 0.5, fontSize: 22, bold: true, color: C.ink, fontFace: 'Arial Black', align: 'right', valign: 'middle' });

  // Unit economics (right)
  const ue = [
    ['Avg. revenue per dealer/yr', '₹72K'],
    ['Avg. revenue per buyer txn', '₹3,200'],
    ['B2B API avg. contract', '₹5L/yr'],
    ['DemandPulse gross margin', '82%+'],
    ['Total addressable market', '4.4M cars/yr'],
  ];
  slide.addText('UNIT ECONOMICS', { x: 9.7, y: 1.5, w: 3.3, h: 0.28, fontSize: 9, color: C.gold, fontFace: 'Courier New', charSpacing: 2 });
  ue.forEach(([lbl, val], i) => {
    const y = 1.85 + i * 0.88;
    slide.addShape(pptx.ShapeType.rect, { x: 9.7, y, w: 3.3, h: 0.78, fill: { color: C.surface }, line: { color: C.muted, width: 0.5 } });
    slide.addText(lbl, { x: 9.8, y: y + 0.06, w: 3.1, h: 0.26, fontSize: 8, color: C.textD, fontFace: 'Arial' });
    slide.addText(val, { x: 9.8, y: y + 0.36, w: 3.1, h: 0.32, fontSize: 16, bold: true, color: C.gold, fontFace: 'Arial Black' });
  });
}

// ══════════════════════════════════════════════
// SLIDE 8 — TECH STACK
// ══════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  bg(slide, C.ink2);
  goldLine(slide, 0.5, 0.5, W - 1);

  sectionLabel(slide, '08  —  TECHNOLOGY');
  slide.addText('PRODUCTION-GRADE STACK, ZERO TECHNICAL DEBT', {
    x: 0.5, y: 0.75, w: W - 1, h: 0.65,
    fontSize: 26, bold: true, color: C.text, fontFace: 'Arial Black', charSpacing: 1,
  });

  const techCats = [
    { name: 'FRONTEND', items: ['Next.js 16.1.6 App Router', 'TypeScript 5', 'React 19', 'Tailwind CSS v4', 'Framer Motion 12', 'Zustand 5'] },
    { name: 'BACKEND + DATABASE', items: ['Prisma 7.4.1', 'Supabase PostgreSQL', 'Supabase Auth', 'Next.js API Routes', 'Zod Validation', 'Row-Level Security'] },
    { name: 'AI + INTEGRATIONS', items: ['OpenAI GPT-4', 'Replicate API (photo AI)', 'Razorpay Payments', 'Vahan/Parivahan API', 'OBD-II ECU Scan', 'Insurance Aggregators'] },
    { name: 'INFRASTRUCTURE', items: ['Vercel Edge Deployment', 'ISR + SSR + CSR hybrid', 'Cloudflare R2 Storage', 'Elasticsearch Search', 'Redis Cache', 'CDN + Edge Functions'] },
    { name: 'SEO ARCHITECTURE', items: ['160,000+ generated pages', 'Programmatic SEO', 'ISR revalidation', 'JSON-LD Structured Data', 'City × Brand pages', 'Auto sitemap generation'] },
    { name: 'AUTH + SECURITY', items: ['OTP-based login', 'AuthGuard HOC', 'Middleware protection', 'Row-level security', 'Dealer role gating', 'Session management'] },
  ];

  techCats.forEach((cat, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.35 + col * 4.32;
    const y = 1.55 + row * 2.6;

    slide.addShape(pptx.ShapeType.rect, { x, y, w: 4.18, h: 2.45, fill: { color: C.surface }, line: { color: C.muted, width: 0.5 } });
    slide.addShape(pptx.ShapeType.rect, { x, y, w: 4.18, h: 0.04, fill: { color: C.gold } });
    slide.addText(cat.name, { x: x + 0.15, y: y + 0.1, w: 3.9, h: 0.3, fontSize: 11, bold: true, color: C.gold, fontFace: 'Arial Black', charSpacing: 1 });

    cat.items.forEach((item, j) => {
      const iy = y + 0.5 + j * 0.3;
      slide.addShape(pptx.ShapeType.rect, { x: x + 0.15, y: iy, w: 3.88, h: 0.26, fill: { color: j % 2 === 0 ? C.surf2 : '111111' } });
      slide.addText(item, { x: x + 0.25, y: iy + 0.04, w: 3.68, h: 0.18, fontSize: 8.5, color: C.textD, fontFace: 'Courier New' });
    });
  });

  slide.addShape(pptx.ShapeType.rect, { x: 0.35, y: 6.85, w: W - 0.7, h: 0.42, fill: { color: C.surface }, line: { color: C.blue, width: 1 } });
  slide.addShape(pptx.ShapeType.rect, { x: 0.35, y: 6.85, w: 0.05, h: 0.42, fill: { color: C.blue } });
  slide.addText('Rendering Strategy: Homepage + model pages use ISR (60s–5min) for SEO. Used car listings use SSR (always fresh). Interactive tools (EMI, TrueCost, NegotiationCoach) use CSR. Dealer dashboard is auth-gated CSR. Hybrid delivers both Google-indexable content at scale AND real-time transactional features.', {
    x: 0.5, y: 6.88, w: W - 0.9, h: 0.36,
    fontSize: 7.5, color: C.textD, fontFace: 'Arial', wrap: true, valign: 'middle',
  });
}

// ══════════════════════════════════════════════
// SLIDE 9 — ROADMAP
// ══════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  bg(slide);
  goldLine(slide, 0.5, 0.5, W - 1);

  sectionLabel(slide, '09  —  ROADMAP');
  slide.addText('FROM PLATFORM TO MARKET STANDARD', {
    x: 0.5, y: 0.75, w: W - 1, h: 0.65,
    fontSize: 28, bold: true, color: C.text, fontFace: 'Arial Black', charSpacing: 1,
  });

  // Timeline line
  slide.addShape(pptx.ShapeType.rect, { x: 0.8, y: 2.05, w: W - 1.6, h: 0.04, fill: { color: C.goldD } });

  const phases = [
    {
      label: 'SPRINT 20  ·  NOW', title: 'API WIRING', color: C.gold,
      items: [
        { text: '204+ routes built, zero errors', done: true },
        { text: 'VehiclePassport on real API', done: true },
        { text: 'DealerOS dashboard API-wired', done: true },
        { text: '37 API endpoints functional', done: true },
        { text: 'InstantRC → Parivahan integration', done: false },
        { text: 'SwapDirect → escrow banking API', done: false },
      ],
    },
    {
      label: 'SPRINT 21–22  ·  Q1 2026', title: 'AI & PAYMENTS', color: C.gold,
      items: [
        { text: 'Replicate AI photo studio', done: false },
        { text: 'OpenAI smart-reply for leads', done: false },
        { text: 'Razorpay subscription /plans', done: false },
        { text: 'CarBrand / NewCar DB models', done: false },
        { text: 'Car catalog → real DB', done: false },
        { text: 'DemandPulse data pipeline', done: false },
      ],
    },
    {
      label: 'Q2 2026', title: 'NETWORK EFFECTS', color: C.textD,
      items: [
        { text: 'Vahan + OEM service API integrations', done: false },
        { text: 'Insurance aggregator partnerships', done: false },
        { text: 'RTO agent network (50 cities)', done: false },
        { text: 'LiveCondition mechanic onboarding', done: false },
        { text: 'DemandPulse B2B API launch', done: false },
        { text: 'Dealer co-marketing program', done: false },
      ],
    },
    {
      label: 'Q3–Q4 2026', title: 'MARKET STANDARD', color: C.textD,
      items: [
        { text: 'VehiclePassport industry standard', done: false },
        { text: 'Bank / NBFC DemandPulse contracts', done: false },
        { text: 'CrossState 10+ state coverage', done: false },
        { text: '100K+ DealerOS free tier dealers', done: false },
        { text: 'Series A fundraise', done: false },
        { text: 'Mobile app launch (React Native)', done: false },
      ],
    },
  ];

  phases.forEach((p, i) => {
    const x = 0.5 + i * 3.22;
    // Dot on timeline
    slide.addShape(pptx.ShapeType.ellipse, { x: x + 0.45, y: 1.88, w: 0.28, h: 0.28, fill: { color: i < 2 ? C.gold : C.muted }, line: { color: i < 2 ? C.gold : C.muted, width: 1 } });

    // Phase card
    slide.addShape(pptx.ShapeType.rect, { x, y: 2.22, w: 3.08, h: 4.55, fill: { color: C.surface }, line: { color: C.muted, width: 0.5 } });
    slide.addShape(pptx.ShapeType.rect, { x, y: 2.22, w: 3.08, h: 0.03, fill: { color: p.color } });

    slide.addText(p.label, { x: x + 0.12, y: 2.27, w: 2.85, h: 0.25, fontSize: 7.5, color: p.color, fontFace: 'Courier New', charSpacing: 1 });
    slide.addText(p.title, { x: x + 0.12, y: 2.52, w: 2.85, h: 0.38, fontSize: 14, bold: true, color: C.text, fontFace: 'Arial Black', charSpacing: 1 });

    p.items.forEach((item, j) => {
      const iy = 3.0 + j * 0.58;
      slide.addShape(pptx.ShapeType.rect, { x: x + 0.1, y: iy, w: 2.88, h: 0.5, fill: { color: item.done ? '0A1A0A' : '111111' }, line: { color: item.done ? '1A3A1A' : C.muted, width: 0.5 } });
      slide.addText(item.done ? '✓' : '—', { x: x + 0.15, y: iy + 0.1, w: 0.3, h: 0.3, fontSize: 10, bold: true, color: item.done ? C.green : C.goldD, fontFace: 'Arial', align: 'center' });
      slide.addText(item.text, { x: x + 0.48, y: iy + 0.08, w: 2.45, h: 0.34, fontSize: 8.5, color: item.done ? C.text : C.textD, fontFace: 'Arial', wrap: true, valign: 'top' });
    });
  });

  // Summary bar
  const targets = [
    { val: '₹142+ Cr', lbl: 'Year 1 Revenue Potential' },
    { val: '100K+', lbl: 'Target Dealer Partners' },
    { val: '$83B', lbl: 'Market to Own by 2031' },
  ];
  targets.forEach((t, i) => {
    const x = 0.5 + i * 4.28;
    slide.addShape(pptx.ShapeType.rect, { x, y: 6.88, w: 4.1, h: 0.5, fill: { color: C.surf2 }, line: { color: C.gold, width: 0.5 } });
    slide.addText(t.val, { x: x + 0.15, y: 6.9, w: 2, h: 0.44, fontSize: 20, bold: true, color: C.gold, fontFace: 'Arial Black', valign: 'middle' });
    slide.addText(t.lbl, { x: x + 2.1, y: 6.95, w: 1.85, h: 0.36, fontSize: 8, color: C.textD, fontFace: 'Arial', valign: 'middle', wrap: true });
  });
}

// ══════════════════════════════════════════════
// SLIDE 10 — CLOSING
// ══════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  bg(slide);

  // Grid bg
  for (let i = 1; i < 14; i++) slide.addShape(pptx.ShapeType.rect, { x: i * 0.96, y: 0, w: 0.008, h: H, fill: { color: '111108' } });
  for (let i = 1; i < 8; i++) slide.addShape(pptx.ShapeType.rect, { x: 0, y: i * 0.94, w: W, h: 0.008, fill: { color: '111108' } });

  slide.addText('THE OPPORTUNITY', {
    x: 0, y: 1.4, w: W, h: 0.35,
    fontSize: 11, color: C.gold, fontFace: 'Courier New', align: 'center', charSpacing: 4,
  });

  slide.addText('TRUST THE', { x: 0, y: 1.9, w: W, h: 1.1, fontSize: 78, bold: true, color: C.text, fontFace: 'Arial Black', align: 'center', charSpacing: 2 });
  slide.addText('MARKET', { x: 0, y: 2.85, w: W, h: 1.1, fontSize: 78, bold: true, color: C.gold, fontFace: 'Arial Black', align: 'center', charSpacing: 2 });
  slide.addText("HASN'T GOT", { x: 0, y: 3.8, w: W, h: 1.1, fontSize: 78, bold: true, color: C.text, fontFace: 'Arial Black', align: 'center', charSpacing: 2 });

  slide.addText('"The used car market doesn\'t need another listing platform. It needs someone to fix the trust deficit. Build that, and you own the $83 billion market."', {
    x: 2.5, y: 5.1, w: 8.33, h: 0.8,
    fontSize: 12, color: C.textD, fontFace: 'Arial', italic: true, align: 'center', wrap: true,
  });

  slide.addText('CAROBEST  ·  INVESTOR PRESENTATION  ·  CONFIDENTIAL 2026', {
    x: 0, y: 7.0, w: W, h: 0.3,
    fontSize: 8, color: C.muted, fontFace: 'Courier New', align: 'center', charSpacing: 2,
  });
}

// ── SAVE
const outPath = `public/carobest-presentation.pptx`;
pptx.writeFile({ fileName: outPath }).then(() => {
  console.log(`✓ Saved: ${outPath}`);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
