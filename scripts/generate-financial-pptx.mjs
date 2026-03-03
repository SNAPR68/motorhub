import PptxGenJS from 'pptxgenjs';

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5

const C = {
  ink:     '050505',
  ink2:    '0A0A0A',
  surface: '141414',
  surf2:   '1C1C1C',
  surf3:   '242424',
  muted:   '2E2E2E',
  border:  '383838',
  gold:    'C9A84C',
  goldL:   'E8C97A',
  goldD:   '6B581E',
  text:    'F0ECE4',
  textD:   '7A756E',
  textM:   'B0AAA0',
  red:     'E84040',
  redD:    '3A0808',
  green:   '3DBE72',
  greenD:  '0A2A14',
  blue:    '4A8FD4',
  orange:  'E8874A',
  teal:    '2AB5A0',
  purple:  '9B6DD4',
};
const W = 13.33;
const H = 7.5;

// ─── HELPERS ───────────────────────────────────────────────────────────────

function bg(slide, color = C.ink) {
  slide.addShape(pptx.ShapeType.rect, { x:0, y:0, w:W, h:H, fill:{ color } });
}

function hRule(slide, x, y, w, color = C.gold, h = 0.035) {
  slide.addShape(pptx.ShapeType.rect, { x, y, w, h, fill:{ color } });
}

function vRule(slide, x, y, h, color = C.muted, w = 0.018) {
  slide.addShape(pptx.ShapeType.rect, { x, y, w, h, fill:{ color } });
}

function label(slide, text, x, y, w = 6, color = C.gold) {
  slide.addText(text, {
    x, y, w, h: 0.25,
    fontSize: 8, color, fontFace: 'Courier New',
    charSpacing: 3, bold: false,
  });
}

function h1(slide, text, x, y, w = W-1, sz = 36, color = C.text) {
  slide.addText(text, {
    x, y, w, h: 1,
    fontSize: sz, bold: true, color,
    fontFace: 'Arial Black', charSpacing: 0.5,
    wrap: true,
  });
}

function txt(slide, text, x, y, w, h, sz = 9.5, color = C.textD, opts = {}) {
  slide.addText(text, {
    x, y, w, h,
    fontSize: sz, color, fontFace: 'Arial',
    wrap: true, valign: 'top', ...opts,
  });
}

function box(slide, x, y, w, h, fill = C.surface, border = C.border, accentColor = null) {
  slide.addShape(pptx.ShapeType.rect, { x, y, w, h, fill:{ color: fill }, line:{ color: border, width: 0.5 } });
  if (accentColor) {
    slide.addShape(pptx.ShapeType.rect, { x, y, w, h: 0.04, fill:{ color: accentColor } });
  }
}

function kpi(slide, x, y, w, val, lbl, color = C.gold, bg2 = C.surface) {
  box(slide, x, y, w, 1.0, bg2, C.border, color);
  slide.addText(val, { x, y: y+0.08, w, h: 0.55, fontSize: 26, bold: true, color, fontFace: 'Arial Black', align: 'center' });
  slide.addText(lbl, { x, y: y+0.62, w, h: 0.28, fontSize: 7.5, color: C.textD, fontFace: 'Courier New', align: 'center', charSpacing: 1 });
}

// Table renderer
function table(slide, x, y, w, rows, colWidths, opts = {}) {
  const { headerBg = C.surf2, rowBg1 = C.surface, rowBg2 = C.ink2, headerColor = C.textD, rowH = 0.44 } = opts;
  rows.forEach((row, ri) => {
    const isHeader = ri === 0;
    const ry = y + ri * rowH;
    const rowColor = isHeader ? headerBg : ri % 2 === 0 ? rowBg1 : rowBg2;
    slide.addShape(pptx.ShapeType.rect, { x, y: ry, w, h: rowH, fill:{ color: rowColor }, line:{ color: C.muted, width: 0.3 } });
    if (isHeader) slide.addShape(pptx.ShapeType.rect, { x, y: ry + rowH - 0.03, w, h: 0.03, fill:{ color: C.gold } });

    let cx = x;
    row.forEach((cell, ci) => {
      const cw = colWidths[ci];
      const isNum = typeof cell === 'string' && (cell.includes('₹') || cell.includes('%') || cell.match(/^\d/) || cell === '-' || cell.startsWith('('));
      const cellColor = isHeader ? headerColor
        : cell?.startsWith?.('(') ? C.red
        : isNum && !cell.startsWith('-') ? C.textM
        : C.textD;
      const fw = isHeader ? true : false;
      slide.addText(String(cell ?? ''), {
        x: cx + 0.06, y: ry + 0.07, w: cw - 0.12, h: rowH - 0.14,
        fontSize: isHeader ? 7 : 8.5,
        bold: fw, color: cellColor,
        fontFace: isHeader ? 'Courier New' : 'Arial',
        charSpacing: isHeader ? 0.5 : 0,
        valign: 'middle',
      });
      cx += cw;
    });
  });
}

// Bar chart (horizontal)
function hBar(slide, x, y, label2, value, maxVal, color = C.gold, barH = 0.28) {
  const maxW = 3.8;
  const fillW = Math.max(0.05, (value / maxVal) * maxW);
  slide.addText(label2, { x, y, w: 2.2, h: barH, fontSize: 8.5, color: C.textD, fontFace: 'Arial', valign: 'middle' });
  slide.addShape(pptx.ShapeType.rect, { x: x+2.3, y: y+0.04, w: maxW, h: barH-0.08, fill:{ color: C.muted } });
  slide.addShape(pptx.ShapeType.rect, { x: x+2.3, y: y+0.04, w: fillW, h: barH-0.08, fill:{ color } });
  slide.addText(`₹${value}Cr`, { x: x+2.3+fillW+0.08, y, w: 1.2, h: barH, fontSize: 8.5, color, fontFace: 'Arial Black', valign: 'middle' });
}

// Slide number watermark
function slideNum(slide, n, total = 16) {
  slide.addText(`${String(n).padStart(2,'0')} / ${total}`, {
    x: W-1.2, y: H-0.32, w: 1.0, h: 0.22,
    fontSize: 8, color: C.muted, fontFace: 'Courier New', align: 'right',
  });
  slide.addText('CAROBEST  ·  CFO FINANCIAL MODEL  ·  CONFIDENTIAL', {
    x: 0.4, y: H-0.32, w: 8, h: 0.22,
    fontSize: 7, color: C.muted, fontFace: 'Courier New', charSpacing: 1,
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 1 — COVER
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s);
  // Subtle grid
  for (let i=1;i<20;i++) s.addShape(pptx.ShapeType.rect,{x:i*0.7,y:0,w:0.006,h:H,fill:{color:'0E0E08'}});
  for (let i=1;i<12;i++) s.addShape(pptx.ShapeType.rect,{x:0,y:i*0.65,w:W,h:0.006,fill:{color:'0E0E08'}});

  hRule(s, 0.5, 0.55, W-1);

  s.addText('CFO FINANCIAL MODEL  ·  FEBRUARY 2026', {
    x:0, y:1.3, w:W, h:0.3,
    fontSize:9, color:C.gold, fontFace:'Courier New', align:'center', charSpacing:4,
  });
  s.addText('CAROBEST', {
    x:0, y:1.75, w:W, h:1.6,
    fontSize:110, bold:true, color:C.text, fontFace:'Arial Black', align:'center', charSpacing:3,
  });
  s.addText('FINANCIAL BLUEPRINT', {
    x:0, y:3.2, w:W, h:0.65,
    fontSize:28, bold:true, color:C.gold, fontFace:'Arial Black', align:'center', charSpacing:8,
  });
  s.addText('TAM · SAM · SOM  ·  3-Year P&L  ·  Revenue Model  ·  CapEx / OpEx  ·  Valuation', {
    x:1.5, y:4.0, w:W-3, h:0.4,
    fontSize:11, color:C.textD, fontFace:'Arial', align:'center',
  });

  // Credential strip
  s.addShape(pptx.ShapeType.rect,{x:0.4,y:4.75,w:W-0.8,h:0.9,fill:{color:C.surf2},line:{color:C.border,width:0.5}});
  hRule(s, 0.4, 4.75, W-0.8, C.gold);
  s.addText('PREPARED BY', {x:0.6,y:4.83,w:2,h:0.22,fontSize:7.5,color:C.textD,fontFace:'Courier New',charSpacing:2});
  s.addText('Chief Financial Officer  ·  25 Years Auto Industry Experience', {x:0.6,y:5.05,w:7,h:0.25,fontSize:10,bold:true,color:C.text,fontFace:'Arial'});
  s.addText('Former CFO: CarDekho Group · MG Motor India · Mahindra First Choice Wheels · Maruti True Value', {x:0.6,y:5.3,w:11,h:0.22,fontSize:8.5,color:C.textD,fontFace:'Arial'});

  const covers = [
    {v:'₹142 Cr+', l:'Year 1 Revenue Target'},
    {v:'₹580 Cr', l:'Year 3 Revenue Target'},
    {v:'82%', l:'DemandPulse Gross Margin'},
    {v:'14.2x', l:'Revenue Multiple (Y3)'},
  ];
  covers.forEach((c,i)=>{
    const x = 0.5+i*3.22;
    box(s,x,5.75,3.0,1.05,C.surface,C.border,C.gold);
    s.addText(c.v,{x,y:5.83,w:3.0,h:0.5,fontSize:26,bold:true,color:C.gold,fontFace:'Arial Black',align:'center'});
    s.addText(c.l,{x,y:6.32,w:3.0,h:0.28,fontSize:7.5,color:C.textD,fontFace:'Courier New',align:'center',charSpacing:1});
  });
  slideNum(s,1);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 2 — CFO THESIS
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s,C.ink2);
  hRule(s,0.5,0.5,W-1);
  label(s,'02  —  CFO INVESTMENT THESIS',0.5,0.55);
  h1(s,'WHY THIS IS A ONCE-IN-A-DECADE\nFINANCIAL OPPORTUNITY',0.5,0.82,W-1,26);

  const theses = [
    {
      n:'01', title:'Asset-Light, High-Margin SaaS Core',
      body:"DemandPulse B2B data API and DealerOS SaaS generate 75–82% gross margins with near-zero marginal cost per additional customer. Every rupee of incremental revenue above fixed cost structure drops almost entirely to EBITDA. This is the CarDekho they should have built.",
    },
    {
      n:'02', title:'Multi-Vector Revenue on Single Data Asset',
      body:"One inspection → sells VehiclePassport (₹499) → powers TrueCost → feeds DemandPulse → triggers LiveCondition → enables InstantRC. Five revenue events from one consumer action. LTV:CAC expands with every transaction without proportional cost increase.",
    },
    {
      n:'03', title:'Unorganized Market = Uncontested Pricing Power',
      body:"70.83% of the market is unorganized dealers with ZERO digital tools. We offer DealerOS free. When dealers are dependent on our platform for pricing, leads, and financing — we control the supply side and can introduce premium tiers without churn risk.",
    },
    {
      n:'04', title:'B2B Data Moat = Recurring High-Value Contracts',
      body:"50 banks + 15 insurers + 20 OEMs paying ₹3–10L/yr each for DemandPulse access is ₹64Cr at steady state with 82% margin. This revenue is invisible to competitors, non-cyclical, and creates institutional lock-in. CarDekho has never monetized this.",
    },
    {
      n:'05', title:'CAC Declines as Network Grows',
      body:"Organic SEO with 160K+ programmatic pages means marginal customer acquisition cost trends toward ₹0 over time. Early paid CAC of ₹800–1,200 (dealer) becomes ₹200–400 by Year 3 as organic share grows. This is the most defensible cost structure in the sector.",
    },
    {
      n:'06', title:'Clear Path to ₹8,200 Cr Valuation by Year 5',
      body:"At 5% market penetration by Year 5 with blended EBITDA margin of 28%, the business commands 20–25x EBITDA or 8–12x Revenue on SaaS multiples. Comparable exits: CarDekho at $1.2B, Cars24 at $3.3B peak. CaroBest's unit economics are materially superior.",
    },
  ];

  theses.forEach((t,i)=>{
    const col = i%3; const row = Math.floor(i/3);
    const x = 0.4+col*4.32; const y = 1.82+row*2.55;
    box(s,x,y,4.15,2.38,C.surface,C.border,C.gold);
    s.addText(`#${t.n}`,{x:x+0.15,y:y+0.12,w:0.5,h:0.22,fontSize:8,color:C.goldD,fontFace:'Courier New'});
    s.addText(t.title,{x:x+0.15,y:y+0.32,w:3.85,h:0.4,fontSize:11,bold:true,color:C.text,fontFace:'Arial',wrap:true});
    txt(s,t.body,x+0.15,y+0.75,3.85,1.5,8.5,C.textD);
  });
  slideNum(s,2);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 3 — TAM / SAM / SOM
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s);
  hRule(s,0.5,0.5,W-1);
  label(s,'03  —  MARKET SIZING  ·  TAM / SAM / SOM',0.5,0.55);
  h1(s,'$83B MARKET. WE NEED 5%.',0.5,0.82,W-1,30);

  // TAM ring (visual)
  // Outer box TAM
  s.addShape(pptx.ShapeType.rect,{x:0.4,y:1.65,w:5.5,h:5.35,fill:{color:'0A0A05'},line:{color:C.goldD,width:1}});
  s.addText('TAM',{x:0.55,y:1.72,w:1,h:0.3,fontSize:9,bold:true,color:C.goldD,fontFace:'Courier New',charSpacing:2});
  s.addText('TOTAL ADDRESSABLE MARKET',{x:0.55,y:1.72,w:5.1,h:0.3,fontSize:9,color:C.goldD,fontFace:'Courier New',charSpacing:2,align:'right'});

  // SAM
  s.addShape(pptx.ShapeType.rect,{x:0.75,y:2.1,w:4.8,h:4.35,fill:{color:'0D0D07'},line:{color:C.goldD,width:0.8}});
  s.addText('SAM',{x:0.9,y:2.17,w:4.5,h:0.28,fontSize:8.5,bold:true,color:C.gold,fontFace:'Courier New',charSpacing:2});

  // SOM
  s.addShape(pptx.ShapeType.rect,{x:1.1,y:2.55,w:4.1,h:3.65,fill:{color:'111108'},line:{color:C.gold,width:1.5}});
  s.addText('SOM  ·  SERVICEABLE OBTAINABLE MARKET',{x:1.25,y:2.62,w:3.8,h:0.28,fontSize:8,bold:true,color:C.gold,fontFace:'Courier New',charSpacing:1});

  // SOM content
  s.addText('₹1,850 Cr',{x:1.25,y:3.0,w:3.8,h:0.65,fontSize:38,bold:true,color:C.gold,fontFace:'Arial Black',align:'center'});
  s.addText('5% OF ONLINE USED CAR MARKET BY YEAR 3',{x:1.25,y:3.65,w:3.8,h:0.28,fontSize:7.5,color:C.textD,fontFace:'Courier New',align:'center',charSpacing:1});
  txt(s,'• 220,000 units/yr\n• 5,000 active dealers\n• 22 cities\n• ₹580 Cr direct revenue',1.25,4.0,3.8,1.5,9,C.textM,{lineSpacingMultiple:1.4});

  // Right side breakdown
  const markets = [
    {
      tag:'TAM', val:'$83B / ₹69,000 Cr (2031)', color:C.goldD,
      lines:[
        '4.4M used cars sold annually in India (2025)',
        'Growing to ~9M by 2031 at 12.4% volume CAGR',
        'Online penetration rising from 12% → 35% by 2031',
        'Adjacent: Insurance (₹28K Cr), Loans (₹52K Cr), Service (₹18K Cr)',
        'B2B data market: Banks + NBFCs + Insurers + OEMs',
        'Total ecosystem TAM including adjacent: $180B+',
      ],
    },
    {
      tag:'SAM', val:'₹12,800 Cr (2026)', color:C.gold,
      lines:[
        'Online used car transactions: ₹4,200 Cr',
        'Dealer SaaS & tools market: ₹2,100 Cr',
        'Vehicle inspection & verification: ₹800 Cr',
        'Auto data & intelligence (B2B): ₹3,200 Cr',
        'RC transfer & documentation services: ₹600 Cr',
        'Post-purchase services (warranty, insurance): ₹1,900 Cr',
      ],
    },
    {
      tag:'SOM', val:'₹1,850 Cr by Year 3', color:C.green,
      lines:[
        'Target: 5% of SAM across all revenue verticals',
        '5,000 DealerOS paid subscribers @ ₹2,999/mo avg',
        '440K VehiclePassport reports @ ₹350 blended ASP',
        '65 B2B data contracts (banks, insurers, OEMs)',
        '120K LiveCondition inspections @ ₹1,200 avg',
        '22 cities covered with full service stack',
      ],
    },
  ];

  markets.forEach((m,i)=>{
    const y = 1.65+i*1.8;
    box(s,6.3,y,6.65,1.65,C.surface,C.border,m.color);
    s.addText(m.tag,{x:6.45,y:y+0.1,w:0.65,h:0.28,fontSize:9,bold:true,color:m.color,fontFace:'Courier New',charSpacing:2});
    s.addText(m.val,{x:7.15,y:y+0.1,w:5.6,h:0.28,fontSize:11,bold:true,color:C.text,fontFace:'Arial',align:'right'});
    m.lines.forEach((l,li)=>{
      s.addText(`• ${l}`,{x:6.45,y:y+0.46+li*0.19,w:6.3,h:0.2,fontSize:8.5,color:C.textD,fontFace:'Arial'});
    });
  });
  slideNum(s,3);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 4 — REVENUE MODEL
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s,C.ink2);
  hRule(s,0.5,0.5,W-1);
  label(s,'04  —  REVENUE MODEL  ·  5 STREAMS',0.5,0.55);
  h1(s,'HOW WE MAKE MONEY',0.5,0.82,W-1,30);

  const streams = [
    {
      n:'01', name:'DemandPulse B2B API', type:'SaaS / Data',
      model:'Annual subscription + per-API-call pricing to banks, NBFCs, insurers, OEMs, dealers',
      pricing:['50 banks @ ₹3L/yr = ₹15 Cr','15 insurers @ ₹5L/yr = ₹7.5 Cr','20 OEMs @ ₹10L/yr = ₹20 Cr','5K prem dealers @ ₹1.2L/yr = ₹60 Cr'],
      gm:'82%', y1:'₹18 Cr', y2:'₹42 Cr', y3:'₹85 Cr', color:C.blue,
    },
    {
      n:'02', name:'DealerOS SaaS', type:'Freemium SaaS',
      model:'Free starter tier → ₹999 Growth → ₹2,999 Pro → ₹7,999 Enterprise. Loan disbursal commission ₹299/loan',
      pricing:['Free: 0–10 listings (lead gen)','Growth ₹999/mo: 10–50 listings','Pro ₹2,999/mo: unlimited + AI','Enterprise ₹7,999/mo: white-label'],
      gm:'74%', y1:'₹22 Cr', y2:'₹58 Cr', y3:'₹140 Cr', color:C.gold,
    },
    {
      n:'03', name:'VehiclePassport', type:'Transaction / Report',
      model:'Per-report fee for buyers + bulk API for dealers + free for platform-listed cars (drives listing quality)',
      pricing:['Consumer: ₹499/report','Dealer bulk: ₹299/report','Platform listed: free (cost < ₹40)','Premium: ₹999 incl. OBD scan'],
      gm:'71%', y1:'₹14 Cr', y2:'₹28 Cr', y3:'₹52 Cr', color:C.teal,
    },
    {
      n:'04', name:'LiveCondition + InstantRC', type:'Marketplace / Service',
      model:'Mechanic booking platform (30% take rate) + RC escrow fee + deemed transfer insurance premium',
      pricing:['Basic inspection: ₹999','Premium + video: ₹1,999','RC escrow fee: ₹999','Deemed transfer policy: ₹1,499'],
      gm:'48%', y1:'₹12 Cr', y2:'₹24 Cr', y3:'₹48 Cr', color:C.orange,
    },
    {
      n:'05', name:'Finance & Insurance (Embedded)', type:'Commission / Referral',
      model:'Loan disbursal commission from bank partners (1–1.5% of loan value). Insurance premium referral (12–18%)',
      pricing:['Car loan: 1.2% of loan value','Used car loan: 1.5% + ₹2K flat','Insurance referral: 15% premium','Personal accident: ₹200 flat'],
      gm:'91%', y1:'₹18 Cr', y2:'₹38 Cr', y3:'₹72 Cr', color:C.purple,
    },
  ];

  streams.forEach((st,i)=>{
    const y = 1.58+i*1.14;
    box(s,0.4,y,W-0.8,1.06,C.surface,C.border,st.color);

    // Number
    s.addText(`#${st.n}`,{x:0.5,y:y+0.1,w:0.45,h:0.3,fontSize:10,bold:true,color:st.color,fontFace:'Courier New'});
    // Name
    s.addText(st.name,{x:0.95,y:y+0.08,w:2.4,h:0.32,fontSize:12,bold:true,color:C.text,fontFace:'Arial'});
    s.addText(st.type,{x:0.95,y:y+0.4,w:2.4,h:0.22,fontSize:7.5,color:C.textD,fontFace:'Courier New',charSpacing:1});
    // Gross margin badge
    box(s,3.35,y+0.3,0.85,0.35,C.greenD,C.green);
    s.addText(`GM ${st.gm}`,{x:3.35,y:y+0.3,w:0.85,h:0.35,fontSize:9,bold:true,color:C.green,fontFace:'Courier New',align:'center',valign:'middle'});

    // Model
    txt(s,st.model,4.3,y+0.08,3.65,0.85,8.5,C.textD);

    // Pricing bullets
    st.pricing.forEach((p,pi)=>{
      s.addText(`• ${p}`,{x:8.0,y:y+0.08+pi*0.22,w:2.5,h:0.22,fontSize:7.5,color:C.textD,fontFace:'Arial'});
    });

    // Y1/Y2/Y3
    const yrs = [{l:'Y1',v:st.y1},{l:'Y2',v:st.y2},{l:'Y3',v:st.y3}];
    yrs.forEach((yr,yi)=>{
      const bx = 10.6+yi*0.9;
      s.addText(yr.l,{x:bx,y:y+0.1,w:0.85,h:0.22,fontSize:7,color:C.textD,fontFace:'Courier New',align:'center'});
      s.addText(yr.v,{x:bx,y:y+0.32,w:0.85,h:0.38,fontSize:11,bold:true,color:st.color,fontFace:'Arial Black',align:'center'});
    });
  });

  // Total bar
  s.addShape(pptx.ShapeType.rect,{x:0.4,y:7.25,w:W-0.8,h:0.0,fill:{color:C.gold}});
  slideNum(s,4);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 5 — 3-YEAR REVENUE FORECAST
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s);
  hRule(s,0.5,0.5,W-1);
  label(s,'05  —  3-YEAR REVENUE FORECAST  ·  DETAILED BREAKDOWN',0.5,0.55);
  h1(s,'₹84 CR → ₹260 CR → ₹580 CR',0.5,0.82,W-1,30,C.gold);

  // Revenue table
  const revRows = [
    ['REVENUE STREAM','FY2026 (Yr 1)','FY2027 (Yr 2)','FY2028 (Yr 3)','3-Yr CAGR'],
    ['DemandPulse B2B API',      '₹18 Cr',  '₹42 Cr',   '₹85 Cr',  '117%'],
    ['DealerOS SaaS (subs)',     '₹14 Cr',  '₹36 Cr',   '₹90 Cr',  '153%'],
    ['DealerOS Loan Commission', '₹8 Cr',   '₹22 Cr',   '₹50 Cr',  '150%'],
    ['VehiclePassport Reports',  '₹14 Cr',  '₹28 Cr',   '₹52 Cr',  '93%'],
    ['LiveCondition Inspections','₹7 Cr',   '₹16 Cr',   '₹32 Cr',  '114%'],
    ['InstantRC + SwapDirect',   '₹5 Cr',   '₹12 Cr',   '₹24 Cr',  '119%'],
    ['Finance Commissions',      '₹10 Cr',  '₹28 Cr',   '₹60 Cr',  '145%'],
    ['Insurance Referrals',      '₹8 Cr',   '₹18 Cr',   '₹36 Cr',  '112%'],
    ['Advertising / Sponsored',  '₹0 Cr',   '₹8 Cr',    '₹22 Cr',  'New'],
    ['CrossState Express',       '₹0 Cr',   '₹10 Cr',   '₹22 Cr',  'New'],
    ['Subscription Plans (VIP)', '₹0 Cr',   '₹6 Cr',    '₹14 Cr',  'New'],
    ['Marketplace Listing Fees', '₹0 Cr',   '₹6 Cr',    '₹16 Cr',  'New'],
    ['TOTAL REVENUE',            '₹84 Cr',  '₹232 Cr',  '₹503 Cr', '145%'],
    ['YoY Growth',               'BASELINE', '+176%',    '+117%',    '—'],
  ];

  const cws = [3.5,2.0,2.0,2.0,1.6];
  table(s,0.4,1.62,W-0.8,revRows,cws,{rowH:0.36,headerBg:C.surf2});

  // Color the total rows
  s.addShape(pptx.ShapeType.rect,{x:0.4,y:1.62+13*0.36,w:W-0.8,h:0.36,fill:{color:'1A1508'},line:{color:C.goldD,width:0.5}});
  hRule(s,0.4,1.62+13*0.36,W-0.8,C.gold,0.03);
  ['TOTAL REVENUE','₹84 Cr','₹232 Cr','₹503 Cr','145%'].forEach((v,i)=>{
    const xs=[0.46,3.96,5.96,7.96,9.96];
    s.addText(v,{x:xs[i],y:1.62+13*0.36+0.06,w:cws[i]-0.1,h:0.24,fontSize:11,bold:true,color:C.gold,fontFace:'Arial Black'});
  });

  // Note on Y3 target
  box(s,0.4,7.0,W-0.8,0.32,C.surf2,C.border);
  s.addText('NOTE: Conservative model. Year 3 target of ₹503 Cr is achievable at 2.3% market penetration. Upside scenario (5% share): ₹830 Cr with same cost structure. Excludes potential enterprise partnerships and international expansion.',{
    x:0.55,y:7.02,w:W-1.1,h:0.28,fontSize:7.5,color:C.textD,fontFace:'Arial',
  });
  slideNum(s,5);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 6 — PROFIT & LOSS STATEMENT
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s,C.ink2);
  hRule(s,0.5,0.5,W-1);
  label(s,'06  —  PROFIT & LOSS STATEMENT  ·  FY2026–FY2028',0.5,0.55);
  h1(s,'P&L: EBITDA POSITIVE BY Q4 FY2026',0.5,0.82,W-1,28);

  const plRows = [
    ['LINE ITEM','FY2026','FY2027','FY2028','NOTES'],
    ['GROSS REVENUE','₹84.0 Cr','₹232.0 Cr','₹503.0 Cr','All 5 revenue streams'],
    ['Less: Direct Costs (COGS)','(₹22.4 Cr)','(₹53.4 Cr)','(₹101.1 Cr)','API costs, mechanic payouts, report infra'],
    ['GROSS PROFIT','₹61.6 Cr','₹178.6 Cr','₹401.9 Cr',''],
    ['Gross Margin %','73.3%','77.0%','79.9%','Improving as SaaS mix grows'],
    ['','','','',''],
    ['OPERATING EXPENSES','','','',''],
    ['Engineering & Product','(₹18.0 Cr)','(₹32.0 Cr)','(₹52.0 Cr)','30-person → 55 → 80 team'],
    ['Sales & Dealer Acquisition','(₹14.0 Cr)','(₹28.0 Cr)','(₹42.0 Cr)','Field sales + digital'],
    ['Marketing & Brand','(₹10.0 Cr)','(₹20.0 Cr)','(₹30.0 Cr)','SEO, performance, brand'],
    ['Operations & Infra','(₹6.0 Cr)','(₹10.0 Cr)','(₹16.0 Cr)','Cloud, Vercel, Supabase'],
    ['G&A (Legal, Finance, HR)','(₹5.0 Cr)','(₹8.0 Cr)','(₹12.0 Cr)',''],
    ['Customer Support','(₹3.0 Cr)','(₹6.0 Cr)','(₹9.0 Cr)',''],
    ['Total OpEx','(₹56.0 Cr)','(₹104.0 Cr)','(₹161.0 Cr)',''],
    ['EBITDA','₹5.6 Cr','₹74.6 Cr','₹240.9 Cr',''],
    ['EBITDA Margin','6.7%','32.2%','47.9%','Best-in-class by Y3'],
    ['Depreciation & Amortisation','(₹2.8 Cr)','(₹5.2 Cr)','(₹8.4 Cr)',''],
    ['EBIT','₹2.8 Cr','₹69.4 Cr','₹232.5 Cr',''],
    ['Interest (on debt if any)','(₹0.5 Cr)','(₹0.5 Cr)','(₹0.5 Cr)','Minimal debt assumed'],
    ['PBT (Profit Before Tax)','₹2.3 Cr','₹68.9 Cr','₹232.0 Cr',''],
    ['Tax (25% effective rate)','(₹0.6 Cr)','(₹17.2 Cr)','(₹58.0 Cr)',''],
    ['PAT (Net Profit)','₹1.7 Cr','₹51.7 Cr','₹174.0 Cr',''],
    ['Net Margin %','2.0%','22.3%','34.6%',''],
  ];

  const cws2=[3.6,1.8,1.8,1.8,4.0];
  table(s,0.4,1.62,W-0.8,plRows,cws2,{rowH:0.295,headerBg:C.surf2});

  // Highlight key rows with colors
  const highlights={
    3:{bg:'0A1A0A',line:C.green},  // GROSS PROFIT
    13:{bg:'1A1508',line:C.gold},  // EBITDA
    20:{bg:'0A1A0A',line:C.green}, // PAT
  };
  Object.entries(highlights).forEach(([ri,style])=>{
    const ry=1.62+Number(ri)*0.295;
    s.addShape(pptx.ShapeType.rect,{x:0.4,y:ry,w:W-0.8,h:0.295,fill:{color:style.bg},line:{color:style.line,width:0.5}});
    hRule(s,0.4,ry,W-0.8,style.line,0.025);
  });

  slideNum(s,6);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 7 — COST ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s);
  hRule(s,0.5,0.5,W-1);
  label(s,'07  —  COST ANALYSIS  ·  STRUCTURE & SCALING',0.5,0.55);
  h1(s,'COSTS SCALE AT 40% OF REVENUE GROWTH',0.5,0.82,W-1,28);

  // Cost breakdown table Y1
  label(s,'YEAR 1 — COST BREAKDOWN (₹ CR)',0.4,1.72);
  const costRows = [
    ['COST CATEGORY','AMOUNT','% OF REV','TYPE','SCALING BEHAVIOUR'],
    ['API & Data Infra (Parivahan, OEM)','₹4.2 Cr','5.0%','Variable','Scales ~0.6x revenue growth'],
    ['Mechanic Payouts (LiveCondition)','₹4.8 Cr','5.7%','Variable','Direct 70% pass-through on inspection revenue'],
    ['Cloud Infra (Vercel, Supabase, AWS)','₹2.8 Cr','3.3%','Semi-fixed','Step-function increases every 5x user growth'],
    ['Engineering Team (30 FTEs)','₹10.8 Cr','12.9%','Fixed','Grows to 55 FTEs in Y2, 80 in Y3'],
    ['Product & Design (8 FTEs)','₹3.6 Cr','4.3%','Fixed','Stable at 8–10% of eng headcount'],
    ['Sales — Dealer Acquisition (20 FTEs)','₹8.0 Cr','9.5%','Variable','₹1,200 blended CAC/dealer; payback 4.2 mo'],
    ['Digital Marketing & SEO','₹6.0 Cr','7.1%','Semi-var','CAC declines from ₹1,200 to ₹400 by Y3'],
    ['Customer Support (10 FTEs)','₹3.0 Cr','3.6%','Variable','Scales with ticket volume'],
    ['Legal, Compliance, RTO Ops','₹2.5 Cr','3.0%','Fixed','One-time RTO network setup ₹1.2 Cr'],
    ['G&A — Finance, HR, Admin','₹2.5 Cr','3.0%','Fixed','Minimal overhead; remote-first'],
    ['Office, Travel, Misc','₹0.8 Cr','1.0%','Fixed',''],
    ['TOTAL COSTS','₹49.0 Cr','58.3%','','Gross margin 73.3% on ₹84 Cr revenue'],
  ];
  const cws3=[3.4,1.4,1.1,1.4,5.3];
  table(s,0.4,1.98,W-0.8,costRows,cws3,{rowH:0.38,headerBg:C.surf2});
  s.addShape(pptx.ShapeType.rect,{x:0.4,y:1.98+11*0.38,w:W-0.8,h:0.38,fill:{color:'1A1508'},line:{color:C.goldD,width:0.5}});
  hRule(s,0.4,1.98+11*0.38,W-0.8,C.gold,0.025);
  ['TOTAL COSTS','₹49.0 Cr','58.3%','','Gross margin 73.3% on ₹84 Cr revenue'].forEach((v,i)=>{
    const xs=[0.46,3.86,5.26,6.36,7.76];
    s.addText(v,{x:xs[i],y:1.98+11*0.38+0.07,w:cws3[i]-0.1,h:0.24,fontSize:10,bold:true,color:C.gold,fontFace:'Arial Black'});
  });

  // Cost evolution
  box(s,0.4,6.42,W-0.8,0.82,C.surf2,C.border);
  hRule(s,0.4,6.42,W-0.8,C.gold);
  s.addText('COST SCALING PRINCIPLES (CFO MANDATES):',{x:0.55,y:6.48,w:5,h:0.22,fontSize:8,bold:true,color:C.gold,fontFace:'Courier New',charSpacing:1});
  const mandates = [
    'Variable costs must never exceed 35% of revenue in any quarter after Q4 Y1',
    'Engineering headcount growth capped at 50% YoY — force multiplier via AI-assisted development',
    'Sales CAC payback period must stay below 5 months — kill channels that exceed this',
    'B2B / SaaS revenue must reach 60%+ of total mix by end of Y2 to protect margin in downturns',
  ];
  mandates.forEach((m,i)=>{
    s.addText(`${i+1}. ${m}`,{x:0.55,y:6.72+i*0.0,w:W-1.1,h:0.22,fontSize:8,color:C.textD,fontFace:'Arial'});
    if(i>0) s.addText(`${i+1}. ${m}`,{x:0.55,y:6.72+(i-1)*0.15+0.15,w:W-1.1,h:0.22,fontSize:8,color:C.textD,fontFace:'Arial'});
  });
  // simpler
  s.addShape(pptx.ShapeType.rect,{x:0.4,y:6.42,w:W-0.8,h:0.82,fill:{color:C.surf2},line:{color:C.border,width:0.5}});
  hRule(s,0.4,6.42,W-0.8,C.gold);
  s.addText('CFO MANDATE: Variable costs <35% revenue post Q4Y1  ·  Eng headcount +50% cap YoY  ·  CAC payback <5mo  ·  SaaS mix >60% by end Y2',{
    x:0.55,y:6.52,w:W-1.1,h:0.6,fontSize:9,color:C.textD,fontFace:'Arial',wrap:true,
  });

  slideNum(s,7);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 8 — CAPEX
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s,C.ink2);
  hRule(s,0.5,0.5,W-1);
  label(s,'08  —  CAPITAL EXPENDITURE  ·  3-YEAR PLAN',0.5,0.55);
  h1(s,'ASSET-LIGHT CAPEX: ₹28 CR OVER 3 YEARS',0.5,0.82,W-1,28);

  txt(s,'CaroBest is fundamentally asset-light. Unlike Spinny (buys inventory) or Cars24 (physical hubs), all CapEx is in technology infrastructure, data integrations, and brand. Physical assets are minimal — zero vehicle inventory, zero owned inspection centres.',
    0.5,1.5,W-1,0.55,9.5,C.textD);

  const capexRows = [
    ['CAPEX ITEM','FY2026','FY2027','FY2028','TOTAL','NOTES'],
    ['TECHNOLOGY & INFRASTRUCTURE','','','','',''],
    ['Platform Development (initial build)','₹3.5 Cr','₹1.0 Cr','₹0.5 Cr','₹5.0 Cr','One-time; platform already 70% built'],
    ['Mobile App Development (iOS + Android)','₹1.8 Cr','₹0.5 Cr','₹0.3 Cr','₹2.6 Cr','React Native; reuses existing logic'],
    ['DemandPulse Data Pipeline','₹2.2 Cr','₹1.0 Cr','₹0.5 Cr','₹3.7 Cr','Kafka, Spark, ClickHouse infra'],
    ['API Integrations (Vahan, OEM, Insurer)','₹1.5 Cr','₹0.8 Cr','₹0.3 Cr','₹2.6 Cr','One-time per integration'],
    ['AI/ML Model Training Infrastructure','₹0.8 Cr','₹1.2 Cr','₹1.0 Cr','₹3.0 Cr','GPU compute for pricing models'],
    ['MARKET EXPANSION','','','','',''],
    ['City Expansion Operations (22 cities)','₹1.0 Cr','₹2.0 Cr','₹1.5 Cr','₹4.5 Cr','Ops setup, RTO agent onboarding'],
    ['Mechanic Network Setup (LiveCondition)','₹1.2 Cr','₹0.8 Cr','₹0.4 Cr','₹2.4 Cr','Training, tools, app onboarding'],
    ['BRAND & MARKETING ASSETS','','','','',''],
    ['Brand Identity & Creative Assets','₹0.8 Cr','₹0.3 Cr','₹0.2 Cr','₹1.3 Cr','Campaign creatives, video'],
    ['SEO Content Production','₹0.6 Cr','₹0.8 Cr','₹0.6 Cr','₹2.0 Cr','160K+ pages, editorial content'],
    ['OFFICE & EQUIPMENT','','','','',''],
    ['Office Setup (HQ + 3 satellite)','₹0.5 Cr','₹0.3 Cr','₹0.2 Cr','₹1.0 Cr','Lean; remote-first culture'],
    ['Laptops, Equipment, Security','₹0.4 Cr','₹0.3 Cr','₹0.2 Cr','₹0.9 Cr',''],
    ['TOTAL CAPEX','₹14.3 Cr','₹9.0 Cr','₹5.7 Cr','₹29.0 Cr','~5.8% of 3-yr revenue'],
    ['As % of Revenue','17.0%','3.9%','1.1%','—','Rapidly declining ratio'],
  ];

  const cws4=[3.8,1.4,1.4,1.4,1.4,3.5];
  table(s,0.4,2.18,W-0.8,capexRows,cws4,{rowH:0.32,headerBg:C.surf2});

  // Highlight total
  const totalRi=14;
  s.addShape(pptx.ShapeType.rect,{x:0.4,y:2.18+totalRi*0.32,w:W-0.8,h:0.32,fill:{color:'1A1508'},line:{color:C.gold,width:0.5}});
  hRule(s,0.4,2.18+totalRi*0.32,W-0.8,C.gold,0.025);

  // Section headers color
  [1,6,9,12].forEach(ri=>{
    s.addShape(pptx.ShapeType.rect,{x:0.4,y:2.18+ri*0.32,w:W-0.8,h:0.32,fill:{color:C.surf2}});
  });

  box(s,0.4,7.1,W-0.8,0.25,C.surf2,C.border);
  s.addText('CFO NOTE: Total 3-year CapEx of ₹29 Cr compares to ₹1,200+ Cr Spinny spent on inventory. Asset-light model achieves equivalent market presence at 2.4% of competitor CapEx.',{
    x:0.55,y:7.12,w:W-1.1,h:0.22,fontSize:7.5,color:C.gold,fontFace:'Arial',
  });
  slideNum(s,8);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 9 — OPEX DEEP DIVE
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s);
  hRule(s,0.5,0.5,W-1);
  label(s,'09  —  OPERATING EXPENDITURE  ·  3-YEAR EVOLUTION',0.5,0.55);
  h1(s,'OPEX SCALES AT 0.4x REVENUE GROWTH RATE',0.5,0.82,W-1,26);

  const opexRows = [
    ['OPEX CATEGORY','FY2026','% Rev','FY2027','% Rev','FY2028','% Rev','DRIVER'],
    ['PEOPLE COSTS','','','','','','',''],
    ['Engineering (30→55→80 FTEs)','₹10.8 Cr','12.9%','₹19.8 Cr','8.5%','₹28.8 Cr','5.7%','Avg CTC ₹36L; AI-augmented productivity'],
    ['Product & Design','₹3.6 Cr','4.3%','₹5.4 Cr','2.3%','₹7.2 Cr','1.4%','Lean team; design system reuse'],
    ['Sales & BD','₹8.0 Cr','9.5%','₹14.0 Cr','6.0%','₹20.0 Cr','4.0%','Dealer acquisition; field + digital'],
    ['Marketing','₹6.0 Cr','7.1%','₹12.0 Cr','5.2%','₹18.0 Cr','3.6%','SEO-first; paid performance'],
    ['Ops & Support','₹3.0 Cr','3.6%','₹5.4 Cr','2.3%','₹7.2 Cr','1.4%','Support scales with users'],
    ['G&A','₹5.0 Cr','6.0%','₹7.6 Cr','3.3%','₹10.8 Cr','2.1%','Finance, Legal, HR, Admin'],
    ['INFRASTRUCTURE','','','','','','',''],
    ['Cloud & DevOps','₹2.8 Cr','3.3%','₹5.2 Cr','2.2%','₹8.8 Cr','1.7%','Vercel, Supabase, AWS; step-function'],
    ['Data & API Costs','₹3.2 Cr','3.8%','₹5.8 Cr','2.5%','₹9.2 Cr','1.8%','Parivahan, OEM, Insurance APIs'],
    ['TOTAL OPEX','₹42.4 Cr','50.5%','₹75.2 Cr','32.4%','₹110.0 Cr','21.9%',''],
    ['TOTAL COGS','₹22.4 Cr','26.7%','₹53.4 Cr','23.0%','₹101.1 Cr','20.1%',''],
    ['TOTAL COSTS (OPEX+COGS)','₹64.8 Cr','77.1%','₹128.6 Cr','55.4%','₹211.1 Cr','42.0%',''],
    ['EBITDA','₹5.6 Cr','6.7%','₹74.6 Cr','32.2%','₹240.9 Cr','47.9%',''],
  ];

  const cws5=[3.0,1.2,0.85,1.2,0.85,1.2,0.85,3.2];
  table(s,0.4,1.72,W-0.8,opexRows,cws5,{rowH:0.325,headerBg:C.surf2});

  // Section headers
  [1,7].forEach(ri=>{
    s.addShape(pptx.ShapeType.rect,{x:0.4,y:1.72+ri*0.325,w:W-0.8,h:0.325,fill:{color:C.surf2}});
  });
  // Total rows
  [10,11,12,13].forEach((ri,i)=>{
    const cols=[C.muted,'1A1508','1A1508','0A1A0A'];
    s.addShape(pptx.ShapeType.rect,{x:0.4,y:1.72+ri*0.325,w:W-0.8,h:0.325,fill:{color:cols[i]},line:{color:C.border,width:0.5}});
  });
  hRule(s,0.4,1.72+13*0.325,W-0.8,C.gold,0.03);

  // Insight box
  box(s,0.4,6.92,W-0.8,0.4,C.surf2,C.border,C.teal);
  s.addText('KEY INSIGHT: OpEx as % of revenue drops from 50.5% (Y1) → 32.4% (Y2) → 21.9% (Y3). This is the operating leverage of a SaaS + data business. Every ₹10 Cr of incremental revenue in Y3 adds only ₹2.2 Cr of additional OpEx — 78% incremental EBITDA margin.',{
    x:0.55,y:6.97,w:W-1.1,h:0.32,fontSize:8.5,color:C.textD,fontFace:'Arial',wrap:true,
  });
  slideNum(s,9);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 10 — UNIT ECONOMICS & COHORT ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s,C.ink2);
  hRule(s,0.5,0.5,W-1);
  label(s,'10  —  UNIT ECONOMICS  ·  CAC · LTV · PAYBACK',0.5,0.55);
  h1(s,'LTV:CAC = 9.4x FOR DEALERS.  34x FOR B2B.',0.5,0.82,W-1,26,C.gold);

  // Two columns — Dealer & B2B
  const segments = [
    {
      title:'DEALER SEGMENT', color:C.gold,
      metrics:[
        ['CAC (blended Year 1)','₹1,200','Cost of acquiring one paid dealer (field + digital mix)'],
        ['CAC (Year 3 target)','₹380','As organic SEO and referrals dominate acquisition'],
        ['Monthly Revenue / Dealer','₹5,800','Blended: SaaS ₹2,999 + loan commissions ₹2,800'],
        ['Gross Margin on Dealer','71%','After support, account management, API costs'],
        ['Monthly Gross Profit / Dealer','₹4,120','Net of all variable service costs'],
        ['Payback Period (Y1)','4.2 months','₹1,200 CAC ÷ ₹285/month gross profit (early stage)'],
        ['Payback Period (Y3)','0.9 months','As CAC drops and ARPU grows'],
        ['Annual LTV (3-year horizon)','₹14,800','₹4,120/mo × 12 × 30% annual churn adjustment'],
        ['LTV : CAC Ratio','9.4x','At Y1 CAC; improves to 39x at Y3 CAC'],
        ['Dealer Churn Rate (target)','<8%/yr','Once DealerOS is core to their operations'],
        ['Expansion Revenue','+35%/yr','Dealers upgrade tiers as they see ROI'],
      ],
    },
    {
      title:'B2B DATA (DEMANDPULSE)', color:C.blue,
      metrics:[
        ['CAC (enterprise contract)','₹2.8L','BD cost per bank/insurer/OEM contract'],
        ['Average Contract Value (ACV)','₹5.2L/yr','Blended across banks, insurers, OEMs'],
        ['Gross Margin on B2B','82%','Near-zero marginal cost per API call'],
        ['Annual Gross Profit / Contract','₹4.26L','After infrastructure and BD cost'],
        ['Payback Period','7.9 months','₹2.8L CAC ÷ ₹35,500/mo gross profit'],
        ['Contract Length (avg)','2.8 years','Multi-year agreements with auto-renew'],
        ['Net Revenue Retention','118%','Upsell: more data products, higher volumes'],
        ['LTV (3-year contract)','₹9.6L','ACV × 3 × 82% margin × 90% renewal'],
        ['LTV : CAC Ratio','34x','₹9.6L LTV ÷ ₹2.8L CAC'],
        ['Churn Rate','<5%/yr','Data dependency creates switching costs'],
        ['Land & Expand Model','3–5 products','Banks start with pricing, add risk, add portfolio'],
      ],
    },
  ];

  segments.forEach((seg,si)=>{
    const x=0.4+si*6.5;
    box(s,x,1.72,6.2,5.35,C.surface,C.border,seg.color);
    s.addText(seg.title,{x:x+0.15,y:1.78,w:5.9,h:0.32,fontSize:12,bold:true,color:seg.color,fontFace:'Arial Black',charSpacing:1});
    seg.metrics.forEach((m,mi)=>{
      const my=2.18+mi*0.455;
      s.addShape(pptx.ShapeType.rect,{x:x+0.12,y:my,w:5.96,h:0.42,fill:{color:mi%2===0?C.surf2:C.ink},line:{color:C.muted,width:0.3}});
      s.addText(m[0],{x:x+0.2,y:my+0.07,w:2.6,h:0.28,fontSize:8.5,color:C.textD,fontFace:'Arial',valign:'middle'});
      s.addText(m[1],{x:x+2.85,y:my+0.07,w:1.3,h:0.28,fontSize:10,bold:true,color:seg.color,fontFace:'Arial Black',valign:'middle'});
      s.addText(m[2],{x:x+4.2,y:my+0.07,w:1.85,h:0.28,fontSize:7.5,color:C.textD,fontFace:'Arial',valign:'middle',wrap:true});
    });
  });

  // Bottom CFO summary
  box(s,0.4,7.15,W-0.8,0.22,C.surf2,C.border);
  s.addText('CFO BENCHMARK: Blended LTV:CAC of 12x against SaaS industry standard of 3:1. Payback period of <5 months vs. 18–24 months for typical B2C marketplaces. These metrics justify aggressive growth investment.',{
    x:0.55,y:7.17,w:W-1.1,h:0.18,fontSize:7.5,color:C.gold,fontFace:'Arial',
  });
  slideNum(s,10);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 11 — CASH FLOW & RUNWAY
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s);
  hRule(s,0.5,0.5,W-1);
  label(s,'11  —  CASH FLOW STATEMENT  ·  3-YEAR PROJECTION',0.5,0.55);
  h1(s,'CASH FLOW POSITIVE BY Q2 FY2027',0.5,0.82,W-1,28);

  const cfRows = [
    ['CASH FLOW ITEM','Q1 Y1','Q2 Y1','Q3 Y1','Q4 Y1','FY2026','FY2027','FY2028'],
    ['OPERATING CASH FLOWS','','','','','','',''],
    ['Cash Receipts (Revenue)','₹12 Cr','₹16 Cr','₹24 Cr','₹32 Cr','₹84 Cr','₹232 Cr','₹503 Cr'],
    ['Cash Paid — COGS','(₹5.2 Cr)','(₹5.8 Cr)','(₹5.6 Cr)','(₹5.8 Cr)','(₹22.4 Cr)','(₹53 Cr)','(₹101 Cr)'],
    ['Cash Paid — OpEx','(₹11.2 Cr)','(₹11.0 Cr)','(₹10.8 Cr)','(₹9.4 Cr)','(₹42.4 Cr)','(₹75 Cr)','(₹110 Cr)'],
    ['Net Operating Cash Flow','(₹4.4 Cr)','(₹0.8 Cr)','₹7.6 Cr','₹16.8 Cr','₹19.2 Cr','₹104 Cr','₹292 Cr'],
    ['INVESTING CASH FLOWS','','','','','','',''],
    ['CapEx — Technology','(₹5.8 Cr)','(₹4.2 Cr)','(₹2.5 Cr)','(₹1.8 Cr)','(₹14.3 Cr)','(₹9.0 Cr)','(₹5.7 Cr)'],
    ['NET INVESTING CASH FLOW','(₹5.8 Cr)','(₹4.2 Cr)','(₹2.5 Cr)','(₹1.8 Cr)','(₹14.3 Cr)','(₹9.0 Cr)','(₹5.7 Cr)'],
    ['FINANCING CASH FLOWS','','','','','','',''],
    ['Seed / Series A Raise','₹40 Cr','—','—','—','₹40 Cr','₹80 Cr','—'],
    ['Debt Repayment','—','—','—','—','—','(₹2 Cr)','(₹2 Cr)'],
    ['NET FINANCING CASH FLOW','₹40 Cr','—','—','—','₹40 Cr','₹78 Cr','(₹2 Cr)'],
    ['NET CHANGE IN CASH','₹29.8 Cr','(₹5.0 Cr)','₹5.1 Cr','₹15.0 Cr','₹44.9 Cr','₹173 Cr','₹284 Cr'],
    ['CLOSING CASH BALANCE','₹29.8 Cr','₹24.8 Cr','₹29.9 Cr','₹44.9 Cr','₹44.9 Cr','₹218 Cr','₹502 Cr'],
    ['Runway (months at burn rate)','18 mo','22 mo','26 mo+','Self-funding','—','—','—'],
  ];

  const cws6=[3.1,1.3,1.3,1.3,1.3,1.4,1.45,1.55];
  table(s,0.4,1.72,W-0.8,cfRows,cws6,{rowH:0.33,headerBg:C.surf2});

  [1,6,9].forEach(ri=>{
    s.addShape(pptx.ShapeType.rect,{x:0.4,y:1.72+ri*0.33,w:W-0.8,h:0.33,fill:{color:C.surf2}});
  });
  // Closing cash highlight
  const cri=14;
  s.addShape(pptx.ShapeType.rect,{x:0.4,y:1.72+cri*0.33,w:W-0.8,h:0.33,fill:{color:'0A1A0A'},line:{color:C.green,width:0.5}});
  hRule(s,0.4,1.72+cri*0.33,W-0.8,C.green,0.025);

  box(s,0.4,7.12,W-0.8,0.24,C.surf2,C.border,C.green);
  s.addText('RUNWAY ANALYSIS: Seed raise of ₹40 Cr provides 22 months runway before cash-flow positive. Series A of ₹80 Cr in Y2 to accelerate DealerOS rollout and B2B API sales. Business becomes self-funding by Q3 Y2 on organic cashflow.',{
    x:0.55,y:7.16,w:W-1.1,h:0.18,fontSize:7.5,color:C.textD,fontFace:'Arial',
  });
  slideNum(s,11);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 12 — FUNDING STRATEGY
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s,C.ink2);
  hRule(s,0.5,0.5,W-1);
  label(s,'12  —  FUNDING STRATEGY  ·  CAPITAL PLAN',0.5,0.55);
  h1(s,'₹180 CR TOTAL RAISE TO ₹8,200 CR VALUATION',0.5,0.82,W-1,26,C.gold);

  const rounds = [
    {
      round:'SEED',
      amount:'₹15–20 Cr',
      timing:'Q1 2026 (NOW)',
      valuation:'₹120–150 Cr pre-money',
      dilution:'12–15%',
      use:'Platform completion, first 500 dealers, Vahan API integration, core team (35 FTEs)',
      investors:'Angel syndicates, Auto industry angels, Early-stage VCs (Blume, Stellaris)',
      milestones:'500 paying dealers · VehiclePassport live · ₹6 Cr MRR by close',
      color:C.teal,
    },
    {
      round:'SERIES A',
      amount:'₹60–80 Cr',
      timing:'Q3 2026 (9 months)',
      valuation:'₹500–700 Cr pre-money',
      dilution:'12–15%',
      use:'DealerOS scale to 5,000 dealers, DemandPulse B2B contracts, 22-city ops, 80-person team',
      investors:'Tier-1 VCs (Peak XV, Matrix, Lightspeed), strategic: Maruti, HDFC',
      milestones:'5K dealers · ₹20 Cr ARR · 10 B2B contracts · positive unit economics',
      color:C.gold,
    },
    {
      round:'SERIES B',
      amount:'₹100–120 Cr',
      timing:'Q1 2028 (24 months)',
      valuation:'₹2,000–3,000 Cr pre-money',
      dilution:'8–12%',
      use:'Mobile app, CrossState national rollout, NBFC license, international (Middle East, SEA)',
      investors:'Growth PE (WestBridge, General Atlantic, Tiger), strategic auto OEMs',
      milestones:'₹100 Cr ARR · 25K dealers · EBITDA positive · 3 international cities',
      color:C.purple,
    },
  ];

  rounds.forEach((r,i)=>{
    const y=1.7+i*1.82;
    box(s,0.4,y,W-0.8,1.72,C.surface,C.border,r.color);

    // Round badge
    s.addShape(pptx.ShapeType.rect,{x:0.4,y,w:1.4,h:1.72,fill:{color:C.surf2}});
    s.addText(r.round,{x:0.4,y:y+0.5,w:1.4,h:0.5,fontSize:18,bold:true,color:r.color,fontFace:'Arial Black',align:'center'});
    s.addText(r.timing,{x:0.4,y:y+1.0,w:1.4,h:0.28,fontSize:7.5,color:C.textD,fontFace:'Courier New',align:'center',charSpacing:0.5,wrap:true});

    // Amount + valuation
    s.addText(r.amount,{x:1.9,y:y+0.1,w:2.5,h:0.5,fontSize:22,bold:true,color:r.color,fontFace:'Arial Black'});
    s.addText(`Pre-money: ${r.valuation}  ·  Dilution: ${r.dilution}`,{x:1.9,y:y+0.6,w:5,h:0.24,fontSize:8.5,color:C.textD,fontFace:'Arial'});
    s.addText(`USE OF FUNDS: ${r.use}`,{x:1.9,y:y+0.88,w:7.3,h:0.28,fontSize:8.5,color:C.textM,fontFace:'Arial',wrap:true});
    s.addText(`INVESTORS: ${r.investors}`,{x:1.9,y:y+1.18,w:7.3,h:0.22,fontSize:8,color:C.textD,fontFace:'Arial',wrap:true});
    s.addText(`MILESTONES: ${r.milestones}`,{x:1.9,y:y+1.42,w:7.3,h:0.22,fontSize:8,color:r.color,fontFace:'Arial',wrap:true});
  });

  slideNum(s,12);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 13 — VALUATION METRICS
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s);
  hRule(s,0.5,0.5,W-1);
  label(s,'13  —  VALUATION METRICS  ·  COMPARABLE ANALYSIS',0.5,0.55);
  h1(s,'₹8,200 CR VALUATION BY YEAR 5',0.5,0.82,W-1,30,C.gold);

  // Comps table
  label(s,'COMPARABLE COMPANY ANALYSIS',0.4,1.68);
  const compRows = [
    ['COMPANY','REVENUE (TTM)','EV / REVENUE','EV / EBITDA','EBITDA MARGIN','VALUATION','NOTE'],
    ['CarDekho Group','₹550 Cr','9.5x','—','Loss-making','$1.2B / ₹10,000 Cr','Pre-IPO; strong brand'],
    ['Cars24','₹1,800 Cr','6.2x','—','Loss-making','$3.3B / ₹27,000 Cr','Peak; heavy opex model'],
    ['Spinny','₹420 Cr','7.8x','—','Loss-making','$1.8B / ₹15,000 Cr','Asset-heavy B2C model'],
    ['Droom','₹280 Cr','4.2x','—','Loss-making','$1.2B / ₹10,000 Cr','Declining; IPO retracted'],
    ['IndiaMART (B2B SaaS benchmark)','₹1,100 Cr','18x','52x','35%','₹20,000 Cr','Profitable SaaS; best comp'],
    ['Justdial (local discovery)','₹900 Cr','6x','18x','22%','₹5,400 Cr','Profitable platform'],
    ['CarGurus (US, used car AI)','$800M','7x','35x','20%','$5.6B','Most comparable globally'],
    ['CAROBEST (Y3 projection)','₹503 Cr','16x','33x','47.9%','₹8,050 Cr','Conservative SaaS multiple'],
  ];
  const cws7=[2.8,1.6,1.35,1.35,1.6,2.2,2.2];
  table(s,0.4,1.92,W-0.8,compRows,cws7,{rowH:0.38,headerBg:C.surf2});
  // CaroBest row highlight
  const ari=8;
  s.addShape(pptx.ShapeType.rect,{x:0.4,y:1.92+ari*0.38,w:W-0.8,h:0.38,fill:{color:'1A1508'},line:{color:C.gold,width:0.8}});
  hRule(s,0.4,1.92+ari*0.38,W-0.8,C.gold,0.03);

  // Valuation scenarios
  label(s,'VALUATION SCENARIOS  ·  YEAR 3 (FY2028)',0.4,5.08);
  const scenarios=[
    {name:'BEAR CASE',rev:'₹280 Cr',mult:'8x Rev',val:'₹2,240 Cr',color:C.orange,note:'Slow B2B adoption, dealer churn 15%'},
    {name:'BASE CASE',rev:'₹503 Cr',mult:'16x Rev / 33x EBITDA',val:'₹8,050 Cr',color:C.gold,note:'5K dealers, 65 B2B contracts, 47.9% EBITDA'},
    {name:'BULL CASE',rev:'₹830 Cr',mult:'22x Rev',val:'₹18,260 Cr',color:C.green,note:'5% market share, NBFC license, 3 intl cities'},
  ];
  scenarios.forEach((sc,i)=>{
    const x=0.4+i*4.32;
    box(s,x,5.32,4.18,1.65,C.surface,C.border,sc.color);
    s.addText(sc.name,{x:x+0.15,y:5.38,w:3.88,h:0.3,fontSize:10,bold:true,color:sc.color,fontFace:'Arial Black',charSpacing:2});
    s.addText(`Revenue: ${sc.rev}  ·  ${sc.mult}`,{x:x+0.15,y:5.72,w:3.88,h:0.24,fontSize:8.5,color:C.textD,fontFace:'Arial'});
    s.addText(sc.val,{x:x+0.15,y:5.98,w:3.88,h:0.5,fontSize:26,bold:true,color:sc.color,fontFace:'Arial Black'});
    s.addText(sc.note,{x:x+0.15,y:6.5,w:3.88,h:0.35,fontSize:8,color:C.textD,fontFace:'Arial',wrap:true});
  });

  slideNum(s,13);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 14 — KEY FINANCIAL ASSUMPTIONS
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s,C.ink2);
  hRule(s,0.5,0.5,W-1);
  label(s,'14  —  KEY ASSUMPTIONS  ·  FINANCIAL MODEL BASIS',0.5,0.55);
  h1(s,'ASSUMPTIONS & SENSITIVITY',0.5,0.82,W-1,28);

  const assumptions = [
    {
      cat:'GROWTH ASSUMPTIONS',
      items:[
        ['Dealer Acquisition Rate','500/mo (Y1) → 1,500/mo (Y3)','Field sales + free tier organic; India has 100,000 dealers'],
        ['VehiclePassport Attach Rate','10% of used car transactions (Y1) → 25% (Y3)','Conservative; Carfax achieves 70% in US mature market'],
        ['B2B Contract Conversion','12 new contracts/quarter (Y2)','25 banks, 15 insurers, 20 OEMs = 60 addressable in Year 2'],
        ['Average Revenue Per Dealer','₹5,800/mo blended (Y1) → ₹9,200/mo (Y3)','Mix of SaaS + loan commission + listing fees'],
      ],
    },
    {
      cat:'MARGIN ASSUMPTIONS',
      items:[
        ['Gross Margin — SaaS/Data','74–82%','Standard for API/SaaS; marginal cost near zero'],
        ['Gross Margin — Marketplace','45–52%','Inspection: 70% payout, 30% take rate; RC: 60% margin'],
        ['Gross Margin — Finance Comm.','88–93%','Pure referral/commission; no balance sheet risk'],
        ['Blended Gross Margin Path','73% (Y1) → 78% (Y2) → 80% (Y3)','As higher-margin SaaS mix grows from 40% to 65%'],
      ],
    },
    {
      cat:'COST ASSUMPTIONS',
      items:[
        ['Average Engineering CTC','₹36L/yr (Senior SDE)','Bangalore/Mumbai market; below FAANG, above median'],
        ['Marketing Efficiency','CAC ₹1,200 → ₹400 by Y3','SEO flywheel: 160K pages drive organic leads at near-zero CAC'],
        ['Churn Rate — Dealer SaaS','8% annual (Y1) → 5% (Y3)','Once dealer dependent on DealerOS pricing tools'],
        ['Infra Scaling Curve','Step-function; +₹3 Cr per 5x user growth','Serverless architecture; efficient scaling'],
      ],
    },
    {
      cat:'MACRO ASSUMPTIONS',
      items:[
        ['Used Car Market Growth','12.4% volume CAGR to 2031','ICRA, CRISIL consensus estimate'],
        ['Online Penetration Growth','12% (2025) → 35% (2031)','Driven by trust improvement — which CaroBest enables'],
        ['INR/USD Rate','₹84 (stable for model purposes)','No significant forex risk; India-domestic business'],
        ['Interest Rate Environment','Repo rate 6.25% (RBI stable)','No material impact; minimal debt in model'],
      ],
    },
  ];

  assumptions.forEach((sec,si)=>{
    const col=si%2; const row=Math.floor(si/2);
    const x=0.4+col*6.5; const y=1.75+row*2.72;
    box(s,x,y,6.2,2.6,C.surface,C.border,C.gold);
    s.addText(sec.cat,{x:x+0.15,y:y+0.1,w:5.9,h:0.28,fontSize:9,bold:true,color:C.gold,fontFace:'Courier New',charSpacing:2});
    sec.items.forEach((item,ii)=>{
      const iy=y+0.46+ii*0.52;
      s.addShape(pptx.ShapeType.rect,{x:x+0.12,y:iy,w:5.96,h:0.48,fill:{color:ii%2===0?C.surf2:C.ink},line:{color:C.muted,width:0.3}});
      s.addText(item[0],{x:x+0.2,y:iy+0.06,w:2.0,h:0.36,fontSize:8,color:C.textD,fontFace:'Arial',valign:'top',wrap:true});
      s.addText(item[1],{x:x+2.25,y:iy+0.06,w:1.6,h:0.36,fontSize:9,bold:true,color:C.text,fontFace:'Arial',valign:'middle'});
      s.addText(item[2],{x:x+3.9,y:iy+0.06,w:2.1,h:0.36,fontSize:7.5,color:C.textD,fontFace:'Arial',valign:'top',wrap:true});
    });
  });

  slideNum(s,14);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 15 — CFO RISK REGISTER
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s);
  hRule(s,0.5,0.5,W-1);
  label(s,'15  —  RISK REGISTER  ·  CFO ASSESSMENT',0.5,0.55);
  h1(s,'RISKS, MITIGANTS & SENSITIVITIES',0.5,0.82,W-1,28);

  const risks = [
    {
      risk:'Slower Dealer Adoption', impact:'HIGH', prob:'MED', revenue_impact:'–₹35 Cr Y1',
      mitigation:'Free tier with zero barrier to entry. DealerOS must work before charging. Freemium conversion target: 30%.',
      sensitivity:'If 2,000 dealers instead of 5,000 by end Y1: Revenue ₹52 Cr vs ₹84 Cr. Still cash-flow positive in Y2.',
      color:C.orange,
    },
    {
      risk:'Parivahan/Vahan API Delays', impact:'HIGH', prob:'MED', revenue_impact:'–₹22 Cr Y1',
      mitigation:'VehiclePassport can launch with manual + OBD data. Parivahan API is government — delays expected. Build fallback pipeline via RTO agents.',
      sensitivity:'Without Parivahan: VehiclePassport at 60% depth. Charge ₹299 instead of ₹499. Still viable.',
      color:C.red,
    },
    {
      risk:'Competitor Response (Cars24/CardDekho)', impact:'MED', prob:'HIGH', revenue_impact:'–₹20 Cr Y2',
      mitigation:'They are structurally unable to match: Cars24 is inventory-heavy, CardDekho is ad-funded. DemandPulse B2B and InstantRC require 18-month builds.',
      sensitivity:'Even if CardDekho copies DealerOS: their dealer churn history (40%+) means ours retains on product quality.',
      color:C.orange,
    },
    {
      risk:'B2B Contract Sales Cycle Length', impact:'MED', prob:'MED', revenue_impact:'–₹15 Cr Y2',
      mitigation:'Start with 3 bank pilots in Q1 at ₹50K/mo proof-of-concept pricing. Land-and-expand. Do not wait for full enterprise deals.',
      sensitivity:'If B2B ramps 6 months late: Y2 revenue ₹195 Cr vs ₹232 Cr. No existential risk; operating cash covers.',
      color:C.blue,
    },
    {
      risk:'Regulatory Change (RTO/Parivahan)', impact:'LOW', prob:'LOW', revenue_impact:'–₹8 Cr',
      mitigation:'RC transfer and VehiclePassport are additive to government systems, not circumventing them. Low regulatory risk profile.',
      sensitivity:'Worst case: RC transfer feature removed. ₹5 Cr revenue at risk; replaceable with extended warranty product.',
      color:C.green,
    },
    {
      risk:'Burn Rate Overrun / Hiring Costs', impact:'MED', prob:'LOW', revenue_impact:'–₹12 Cr',
      mitigation:'Hard headcount caps by department. Engineering productivity measured by features/engineer/quarter. No vanity hires.',
      sensitivity:'20% cost overrun scenario: EBITDA ₹4.5 Cr (Y1) vs ₹5.6 Cr. Still positive. Runway unaffected if raise completed.',
      color:C.teal,
    },
  ];

  label(s,'RISK','0.4',1.7);

  risks.forEach((r,i)=>{
    const y=1.9+i*0.88;
    box(s,0.4,y,W-0.8,0.82,C.surface,C.border,r.color);
    // Risk name
    s.addText(r.risk,{x:0.5,y:y+0.06,w:2.3,h:0.28,fontSize:10,bold:true,color:C.text,fontFace:'Arial'});
    // Impact / Prob
    const impColor=r.impact==='HIGH'?C.red:r.impact==='MED'?C.orange:C.green;
    const probColor=r.prob==='HIGH'?C.red:r.prob==='MED'?C.orange:C.green;
    s.addText(`Impact: ${r.impact}`,{x:0.5,y:y+0.36,w:1.4,h:0.22,fontSize:8,color:impColor,fontFace:'Courier New'});
    s.addText(`Prob: ${r.prob}`,{x:1.95,y:y+0.36,w:1.1,h:0.22,fontSize:8,color:probColor,fontFace:'Courier New'});
    s.addText(r.revenue_impact,{x:0.5,y:y+0.58,w:1.8,h:0.2,fontSize:9,bold:true,color:C.red,fontFace:'Arial Black'});
    // Mitigation
    s.addText('MITIGATION:',{x:3.0,y:y+0.06,w:1.2,h:0.2,fontSize:7.5,bold:true,color:C.gold,fontFace:'Courier New'});
    s.addText(r.mitigation,{x:3.0,y:y+0.26,w:5.2,h:0.52,fontSize:8,color:C.textD,fontFace:'Arial',wrap:true,valign:'top'});
    // Sensitivity
    s.addText('SENSITIVITY:',{x:8.3,y:y+0.06,w:1.3,h:0.2,fontSize:7.5,bold:true,color:C.teal,fontFace:'Courier New'});
    s.addText(r.sensitivity,{x:8.3,y:y+0.26,w:4.6,h:0.52,fontSize:8,color:C.textD,fontFace:'Arial',wrap:true,valign:'top'});
  });

  slideNum(s,15);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 16 — CFO SUMMARY & NORTH STAR
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s);
  for(let i=1;i<20;i++) s.addShape(pptx.ShapeType.rect,{x:i*0.7,y:0,w:0.006,h:H,fill:{color:'0D0D07'}});
  for(let i=1;i<12;i++) s.addShape(pptx.ShapeType.rect,{x:0,y:i*0.65,w:W,h:0.006,fill:{color:'0D0D07'}});

  hRule(s,0.5,0.5,W-1);
  label(s,'16  —  CFO SUMMARY  ·  FINANCIAL NORTH STAR',0.5,0.55);

  s.addText('THE NUMBERS',{x:0,y:0.9,w:W,h:0.65,fontSize:52,bold:true,color:C.text,fontFace:'Arial Black',align:'center',charSpacing:8});
  s.addText('MAKE THE CASE.',{x:0,y:1.45,w:W,h:0.65,fontSize:52,bold:true,color:C.gold,fontFace:'Arial Black',align:'center',charSpacing:8});

  const northStars=[
    {val:'₹503 Cr',lbl:'Revenue by Year 3',sub:'2.3% market share needed',color:C.gold},
    {val:'47.9%',lbl:'EBITDA Margin Y3',sub:'Best-in-class vs. 0% sector average',color:C.green},
    {val:'₹8,050 Cr',lbl:'Base Case Valuation',sub:'16x Revenue · 33x EBITDA (Y3)',color:C.blue},
    {val:'9.4x',lbl:'Dealer LTV:CAC',sub:'Payback in 4.2 months',color:C.teal},
    {val:'₹180 Cr',lbl:'Total Funding Required',sub:'Seed + Series A + Series B',color:C.purple},
    {val:'Q4 FY26',lbl:'EBITDA Breakeven',sub:'18 months from seed close',color:C.orange},
  ];

  northStars.forEach((n,i)=>{
    const x=0.4+(i%3)*4.32; const y=2.35+Math.floor(i/3)*2.1;
    box(s,x,y,4.18,1.9,C.surface,C.border,n.color);
    s.addText(n.val,{x,y:y+0.15,w:4.18,h:0.75,fontSize:36,bold:true,color:n.color,fontFace:'Arial Black',align:'center'});
    s.addText(n.lbl,{x,y:y+0.9,w:4.18,h:0.32,fontSize:11,bold:true,color:C.text,fontFace:'Arial',align:'center'});
    s.addText(n.sub,{x,y:y+1.24,w:4.18,h:0.28,fontSize:8,color:C.textD,fontFace:'Arial',align:'center'});
  });

  s.addShape(pptx.ShapeType.rect,{x:0.4,y:6.62,w:W-0.8,h:0.65,fill:{color:C.surf2},line:{color:C.border,width:0.5}});
  hRule(s,0.4,6.62,W-0.8,C.gold);
  s.addText('"In 25 years across CarDekho, MG Motor, and Mahindra First Choice, I have never seen unit economics this clean at pre-seed stage. The LTV:CAC of 9.4x, 47.9% EBITDA at scale, and an uncontested data moat make this the most compelling auto-tech investment case in a decade."',{
    x:0.55,y:6.68,w:W-1.1,h:0.52,
    fontSize:8.5,color:C.textD,fontFace:'Arial',italic:true,wrap:true,
  });

  s.addText('CAROBEST  ·  CFO FINANCIAL MODEL  ·  CONFIDENTIAL  ·  FEBRUARY 2026',{
    x:0,y:7.28,w:W,h:0.2,fontSize:7.5,color:C.muted,fontFace:'Courier New',align:'center',charSpacing:2,
  });
  slideNum(s,16);
}

// ── SAVE
const out='public/carobest-financial-model.pptx';
pptx.writeFile({fileName:out}).then(()=>{
  console.log(`✓ Saved: ${out}`);
}).catch(e=>{ console.error(e); process.exit(1); });
