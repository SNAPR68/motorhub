import PptxGenJS from 'pptxgenjs';

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';

const C = {
  ink:    '050505', ink2:   '0A0A0A',
  surface:'141414', surf2:  '1C1C1C',
  muted:  '2E2E2E', border: '383838',
  gold:   'C9A84C', goldL:  'E8C97A', goldD:  '6B581E',
  text:   'F0ECE4', textD:  '7A756E', textM:  'B0AAA0',
  red:    'E84040', redD:   '3A0808',
  green:  '3DBE72', greenD: '0A2A14',
  blue:   '4A8FD4', orange: 'E8874A',
  teal:   '2AB5A0', purple: '9B6DD4',
};
const W = 13.33, H = 7.5;

function bg(s, c=C.ink){ s.addShape(pptx.ShapeType.rect,{x:0,y:0,w:W,h:H,fill:{color:c}}); }
function hr(s,x,y,w,c=C.gold,h=0.032){ s.addShape(pptx.ShapeType.rect,{x,y,w,h,fill:{color:c}}); }
function lbl(s,t,x,y,w=9,c=C.gold){ s.addText(t,{x,y,w,h:0.25,fontSize:8,color:c,fontFace:'Courier New',charSpacing:3}); }
function h1(s,t,x,y,w=W-1,sz=30,c=C.text){ s.addText(t,{x,y,w,h:1.2,fontSize:sz,bold:true,color:c,fontFace:'Arial Black',wrap:true,charSpacing:0.5}); }
function txt(s,t,x,y,w,h,sz=9,c=C.textD,o={}){ s.addText(t,{x,y,w,h,fontSize:sz,color:c,fontFace:'Arial',wrap:true,valign:'top',...o}); }
function box(s,x,y,w,h,f=C.surface,b=C.border,acc=null){
  s.addShape(pptx.ShapeType.rect,{x,y,w,h,fill:{color:f},line:{color:b,width:0.5}});
  if(acc) s.addShape(pptx.ShapeType.rect,{x,y,w,h:0.035,fill:{color:acc}});
}
function kpi(s,x,y,w,val,sub,c=C.gold,bg2=C.surface){
  box(s,x,y,w,1.0,bg2,C.border,c);
  s.addText(val,{x,y:y+0.08,w,h:0.52,fontSize:24,bold:true,color:c,fontFace:'Arial Black',align:'center'});
  s.addText(sub,{x,y:y+0.62,w,h:0.28,fontSize:7.5,color:C.textD,fontFace:'Courier New',align:'center',charSpacing:1});
}
function snum(s,n,total=14){
  s.addText(`${String(n).padStart(2,'0')} / ${total}`,{x:W-1.2,y:H-0.3,w:1.0,h:0.22,fontSize:8,color:C.muted,fontFace:'Courier New',align:'right'});
  s.addText('CAROBEST  ·  ₹2 CR BOOTSTRAP PLAN  ·  CONFIDENTIAL',{x:0.4,y:H-0.3,w:8,h:0.22,fontSize:7,color:C.muted,fontFace:'Courier New',charSpacing:1});
}
function tbl(s,x,y,w,rows,cws,opts={}){
  const {hBg=C.surf2,r1=C.surface,r2=C.ink2,rH=0.38}=opts;
  rows.forEach((row,ri)=>{
    const ry=y+ri*rH;
    const isH=ri===0;
    s.addShape(pptx.ShapeType.rect,{x,y:ry,w,h:rH,fill:{color:isH?hBg:ri%2===0?r1:r2},line:{color:C.muted,width:0.3}});
    if(isH) s.addShape(pptx.ShapeType.rect,{x,y:ry+rH-0.03,w,h:0.03,fill:{color:C.gold}});
    let cx=x;
    row.forEach((cell,ci)=>{
      const cw=cws[ci];
      const neg=String(cell).startsWith('(');
      const isNum=String(cell).match(/^[₹\d\(]/);
      s.addText(String(cell??''),{
        x:cx+0.06,y:ry+0.07,w:cw-0.12,h:rH-0.14,
        fontSize:isH?7:8.5, bold:isH,
        color:isH?C.textD:neg?C.red:isNum?C.textM:C.textD,
        fontFace:isH?'Courier New':'Arial',
        charSpacing:isH?0.5:0, valign:'middle',
      });
      cx+=cw;
    });
  });
}

// ═══════════════════════════════════════
// SLIDE 1 — COVER
// ═══════════════════════════════════════
{
  const s=pptx.addSlide(); bg(s);
  for(let i=1;i<20;i++) s.addShape(pptx.ShapeType.rect,{x:i*0.7,y:0,w:0.006,h:H,fill:{color:'0E0E08'}});
  for(let i=1;i<12;i++) s.addShape(pptx.ShapeType.rect,{x:0,y:i*0.65,w:W,h:0.006,fill:{color:'0E0E08'}});
  hr(s,0.5,0.55,W-1);
  s.addText('CFO FINANCIAL MODEL  ·  BOOTSTRAP EDITION  ·  FEB 2026',{x:0,y:1.3,w:W,h:0.3,fontSize:9,color:C.gold,fontFace:'Courier New',align:'center',charSpacing:3});
  s.addText('CAROBEST',{x:0,y:1.75,w:W,h:1.5,fontSize:100,bold:true,color:C.text,fontFace:'Arial Black',align:'center',charSpacing:3});
  s.addText('₹2 CR BOOTSTRAP FINANCIAL PLAN',{x:0,y:3.1,w:W,h:0.65,fontSize:22,bold:true,color:C.gold,fontFace:'Arial Black',align:'center',charSpacing:4});
  s.addText('How we build to ₹15 Cr ARR, prove the model, and raise Series A — with only ₹2 Cr in the bank.',{x:1.5,y:3.9,w:W-3,h:0.45,fontSize:11,color:C.textD,fontFace:'Arial',align:'center',wrap:true});

  box(s,0.4,4.6,W-0.8,0.85,C.surf2,C.border,C.gold);
  s.addText('STARTING CAPITAL',{x:0.6,y:4.68,w:3,h:0.22,fontSize:8,color:C.textD,fontFace:'Courier New',charSpacing:2});
  s.addText('₹2,00,00,000',{x:0.6,y:4.9,w:4,h:0.42,fontSize:22,bold:true,color:C.gold,fontFace:'Arial Black'});
  s.addText('ZERO EXTERNAL FUNDING AT START',{x:5.5,y:4.68,w:6,h:0.22,fontSize:8,color:C.red,fontFace:'Courier New',charSpacing:2,align:'right'});
  s.addText('Every rupee must work. No waste. Revenue before runway.',{x:5.5,y:4.9,w:6.5,h:0.42,fontSize:11,color:C.textD,fontFace:'Arial',align:'right'});

  const kpis=[
    {v:'18 mo',l:'Runway @ Zero Revenue'},
    {v:'Mo 7',l:'First Revenue Target'},
    {v:'Mo 14',l:'Cash-Flow Positive'},
    {v:'₹15 Cr',l:'ARR at Seed Raise'},
  ];
  kpis.forEach((k,i)=>kpi(s,0.4+i*3.24,5.62,3.1,k.v,k.l));
  snum(s,1);
}

// ═══════════════════════════════════════
// SLIDE 2 — CFO REALITY CHECK
// ═══════════════════════════════════════
{
  const s=pptx.addSlide(); bg(s,C.ink2);
  hr(s,0.5,0.5,W-1);
  lbl(s,'02  —  CFO REALITY CHECK  ·  ₹2 CR IS ENOUGH IF USED RIGHT',0.5,0.55);
  h1(s,'THE BRUTAL TRUTH ABOUT ₹2 CR',0.5,0.82,W-1,28);

  const truths=[
    {
      icon:'✓', title:'What ₹2 Cr CAN do',color:C.green,
      points:[
        '18 months runway for a 4-person founding team at ₹1.5L/mo salaries each',
        'Full tech stack already built — ₹0 on platform development',
        'Vercel + Supabase costs ₹15K/mo max at current scale',
        'First 200 dealers on DealerOS free tier (zero acquisition cost)',
        'VehiclePassport MVP with manual + OBD data pipeline',
        'First 5 B2B data pilot contracts at ₹50K/mo proof-of-concept',
        'SEO machine: 160K pages already generating organic traffic',
        'Reach ₹15 Cr ARR before needing external capital',
      ],
    },
    {
      icon:'✗', title:'What ₹2 Cr CANNOT do',color:C.red,
      points:[
        'Cannot hire a 30-person team — maximum 6 FTEs total',
        'Cannot run paid ads at scale — must be 100% organic/referral',
        'Cannot build mobile app in Year 1 — defer to post-raise',
        'Cannot open physical inspection centres — marketplace model only',
        'Cannot pursue all 10 features simultaneously — 3 features max',
        'Cannot afford enterprise sales cycles >60 days — cut them',
        'Cannot survive more than 14 months of zero revenue',
        'Cannot take a "build it and they will come" approach — revenue day 1',
      ],
    },
  ];

  truths.forEach((t,i)=>{
    const x=0.4+i*6.5;
    box(s,x,1.72,6.2,5.2,C.surface,C.border,t.color);
    s.addText(t.title,{x:x+0.15,y:1.8,w:5.9,h:0.35,fontSize:14,bold:true,color:t.color,fontFace:'Arial Black'});
    t.points.forEach((p,pi)=>{
      const py=2.25+pi*0.58;
      s.addShape(pptx.ShapeType.rect,{x:x+0.12,y:py,w:5.96,h:0.5,fill:{color:pi%2===0?C.surf2:C.ink},line:{color:C.muted,width:0.3}});
      s.addText(t.icon,{x:x+0.18,y:py+0.1,w:0.3,h:0.3,fontSize:10,bold:true,color:t.color,fontFace:'Arial',align:'center'});
      txt(s,p,x+0.52,py+0.08,5.48,0.34,8.5,C.textD);
    });
  });
  snum(s,2);
}

// ═══════════════════════════════════════
// SLIDE 3 — CAPITAL ALLOCATION PLAN
// ═══════════════════════════════════════
{
  const s=pptx.addSlide(); bg(s);
  hr(s,0.5,0.5,W-1);
  lbl(s,'03  —  CAPITAL ALLOCATION  ·  HOW EVERY RUPEE IS DEPLOYED',0.5,0.55);
  h1(s,'₹2 CR DEPLOYMENT PLAN',0.5,0.82,W-1,28);

  const alloc=[
    {cat:'PEOPLE',color:C.gold,pct:55,amt:'₹1,10,00,000',
     items:[
       ['Founding CTO / Lead Engineer','₹2.5L/mo','₹30L for 12 months — non-negotiable, most critical hire'],
       ['Co-founder / Business Dev','₹1.5L/mo','₹18L for 12 months — dealer acquisition, B2B sales'],
       ['Full-Stack Engineer (1)','₹1.8L/mo','₹21.6L for 12 months — product build + maintenance'],
       ['Operations / Customer Success','₹80K/mo','₹9.6L for 12 months — dealer onboarding, support'],
       ['Freelance Designer (part-time)','₹40K/mo','₹4.8L — UI polish, marketing assets'],
       ['Founders\' Salaries (2 founders)','₹1.5L/mo each','₹36L total — founders eat last'],
     ]},
    {cat:'PRODUCT & TECH',color:C.blue,pct:18,amt:'₹36,00,000',
     items:[
       ['Vercel / Supabase / AWS','₹15K/mo','₹1.8L/yr — serverless keeps this near zero'],
       ['Parivahan API integration','₹4L one-time','Government API — one integration, perpetual value'],
       ['OBD-II device inventory (50 units)','₹6L one-time','₹1,200/unit — mechanic partner kit'],
       ['Domain, SSL, misc SaaS tools','₹1L/yr','Lean tooling: Notion, Linear, Figma only'],
       ['OpenAI API costs','₹1.5L/yr','GPT-4 for listing descriptions, smart-reply'],
       ['Security audit + penetration test','₹3L one-time','Mandatory before B2B contracts signed'],
     ]},
    {cat:'SALES & MARKETING',color:C.teal,pct:15,amt:'₹30,00,000',
     items:[
       ['Dealer acquisition (field ops)','₹8L total','2 field reps in Mumbai + Delhi, 3-month trial'],
       ['SEO content production','₹6L total','4,000 new programmatic pages, 20 editorial pieces'],
       ['WhatsApp Business API + CRM','₹1.5L/yr','Primary dealer communication channel'],
       ['Event / auto expo presence','₹5L total','2 auto expos: brand presence, 200 dealer leads'],
       ['Referral program seed budget','₹4L total','₹2,000/dealer referral incentive (200 referrals)'],
       ['Digital ads — highly targeted','₹5.5L total','Only Google/Meta for dealer acquisition; strict ROAS >4x'],
     ]},
    {cat:'LEGAL & COMPLIANCE',color:C.orange,pct:7,amt:'₹14,00,000',
     items:[
       ['Company incorporation + structuring','₹1.5L','Private Ltd, ESOP pool, co-founder agreements'],
       ['Lawyer retainer (12 months)','₹3L total','Contracts, B2B agreements, dealer T&Cs'],
       ['RTO agent network agreements','₹2L total','MOUs with 50 RTO agents across 5 cities'],
       ['Insurance for platform liability','₹2L/yr','Professional indemnity — required for B2B'],
       ['Trademark + IP registration','₹1.5L','Brand protection early'],
       ['Compliance + GST setup','₹1L','Accountant retainer'],
     ]},
    {cat:'RESERVE / CONTINGENCY',color:C.purple,pct:5,amt:'₹10,00,000',
     items:[
       ['Emergency runway buffer','₹10L','3-month salary buffer if revenue delayed — non-negotiable'],
       ['Opportunity fund','₹0 allocated','Reallocated from other buckets if strategic deal arrives'],
     ]},
  ];

  alloc.forEach((a,i)=>{
    const y=1.7+i*1.06;
    box(s,0.4,y,W-0.8,0.98,C.surface,C.border,a.color);
    // PCT bar
    const bw=(a.pct/100)*2.2;
    s.addShape(pptx.ShapeType.rect,{x:0.5,y:y+0.38,w:2.2,h:0.22,fill:{color:C.muted}});
    s.addShape(pptx.ShapeType.rect,{x:0.5,y:y+0.38,w:bw,h:0.22,fill:{color:a.color}});
    s.addText(a.cat,{x:0.5,y:y+0.08,w:1.6,h:0.28,fontSize:10,bold:true,color:a.color,fontFace:'Arial Black'});
    s.addText(`${a.pct}% · ${a.amt}`,{x:0.5,y:y+0.65,w:2.2,h:0.22,fontSize:8,color:C.textD,fontFace:'Courier New'});
    // Items
    a.items.slice(0,3).forEach((it,ii)=>{
      const ix=2.9+ii*3.45;
      s.addShape(pptx.ShapeType.rect,{x:ix,y:y+0.08,w:3.3,h:0.82,fill:{color:ii%2===0?C.surf2:C.ink},line:{color:C.muted,width:0.3}});
      s.addText(it[0],{x:ix+0.1,y:y+0.12,w:3.1,h:0.24,fontSize:8.5,bold:true,color:C.text,fontFace:'Arial'});
      s.addText(it[1],{x:ix+0.1,y:y+0.36,w:1.0,h:0.2,fontSize:8,color:a.color,fontFace:'Courier New'});
      s.addText(it[2],{x:ix+0.1,y:y+0.58,w:3.1,h:0.24,fontSize:7.5,color:C.textD,fontFace:'Arial',wrap:true});
    });
  });
  snum(s,3);
}

// ═══════════════════════════════════════
// SLIDE 4 — MONTH-BY-MONTH PLAN (Mo 1–12)
// ═══════════════════════════════════════
{
  const s=pptx.addSlide(); bg(s,C.ink2);
  hr(s,0.5,0.5,W-1);
  lbl(s,'04  —  MONTH-BY-MONTH EXECUTION  ·  YEAR 1',0.5,0.55);
  h1(s,'12-MONTH OPERATIONAL PLAN',0.5,0.82,W-1,28);

  const months=[
    {m:'Mo 1–2',phase:'SETUP',color:C.blue,
     ops:['Hire CTO + 1 engineer','Parivahan API integration','DealerOS free tier live in 3 cities','RTO agent agreements (Mumbai, Delhi, Bangalore)'],
     rev:'₹0',burn:'₹14L',cash:'₹186L'},
    {m:'Mo 3–4',phase:'FIRST REVENUE',color:C.teal,
     ops:['200 dealers on DealerOS free','Launch VehiclePassport (manual data)','First 3 B2B pilot contracts @ ₹50K/mo','Referral program live'],
     rev:'₹15L',burn:'₹14L',cash:'₹187L'},
    {m:'Mo 5–6',phase:'PROVE MODEL',color:C.gold,
     ops:['500 dealers onboarded','DealerOS paid tier launch (₹999 Growth)','100 VehiclePassports sold','LiveCondition pilot (20 mechanics)'],
     rev:'₹55L',burn:'₹14L',cash:'₹228L'},
    {m:'Mo 7–8',phase:'SCALE',color:C.gold,
     ops:['1,000 dealers, 15% paid conversion','B2B contracts: 8 signed, ₹4L MRR','VehiclePassport: 300/mo @ ₹499','Raise angel bridge if needed'],
     rev:'₹1.2 Cr',burn:'₹16L',cash:'₹2.12 Cr'},
    {m:'Mo 9–10',phase:'MOMENTUM',color:C.orange,
     ops:['2,000 dealers, 20% paid (400 paying)','DealerOS Pro tier launch @ ₹2,999','B2B: 15 contracts, ₹7.5L MRR','Seed deck ready, investor meetings'],
     rev:'₹2.4 Cr',burn:'₹18L',cash:'₹2.46 Cr'},
    {m:'Mo 11–12',phase:'SEED RAISE',color:C.green,
     ops:['3,500 dealers, 25% paid (875 paying)','₹15 Cr ARR run rate','20 B2B contracts, ₹10L MRR','CLOSE SEED ROUND ₹20–25 Cr'],
     rev:'₹4.2 Cr',burn:'₹20L',cash:'₹2.8 Cr → ₹25 Cr post-raise'},
  ];

  months.forEach((m,i)=>{
    const col=i%3; const row=Math.floor(i/3);
    const x=0.4+col*4.32; const y=1.72+row*2.62;
    box(s,x,y,4.15,2.5,C.surface,C.border,m.color);
    s.addText(m.m,{x:x+0.12,y:y+0.1,w:1.5,h:0.28,fontSize:11,bold:true,color:m.color,fontFace:'Arial Black'});
    s.addText(m.phase,{x:x+1.65,y:y+0.1,w:2.35,h:0.28,fontSize:8,color:m.color,fontFace:'Courier New',charSpacing:2,align:'right'});
    m.ops.forEach((op,oi)=>{
      s.addShape(pptx.ShapeType.rect,{x:x+0.12,y:y+0.46+oi*0.38,w:3.91,h:0.34,fill:{color:oi%2===0?C.surf2:C.ink},line:{color:C.muted,width:0.3}});
      s.addText(`→ ${op}`,{x:x+0.2,y:y+0.5+oi*0.38,w:3.75,h:0.26,fontSize:8,color:C.textD,fontFace:'Arial',wrap:true});
    });
    // Bottom strip
    s.addShape(pptx.ShapeType.rect,{x:x+0.12,y:y+2.08,w:3.91,h:0.32,fill:{color:'1A1508'}});
    s.addText(`Rev: ${m.rev}`,{x:x+0.18,y:y+2.12,w:1.2,h:0.22,fontSize:8,bold:true,color:C.green,fontFace:'Arial'});
    s.addText(`Burn: ${m.burn}`,{x:x+1.42,y:y+2.12,w:1.2,h:0.22,fontSize:8,bold:true,color:C.red,fontFace:'Arial'});
    s.addText(`Cash: ${m.cash}`,{x:x+2.62,y:y+2.12,w:1.45,h:0.22,fontSize:7.5,bold:true,color:C.gold,fontFace:'Arial'});
  });
  snum(s,4);
}

// ═══════════════════════════════════════
// SLIDE 5 — CASHFLOW SURVIVAL MODEL
// ═══════════════════════════════════════
{
  const s=pptx.addSlide(); bg(s);
  hr(s,0.5,0.5,W-1);
  lbl(s,'05  —  CASH FLOW  ·  MONTH-BY-MONTH SURVIVAL MODEL',0.5,0.55);
  h1(s,'NEVER HIT ZERO: THE CASH MAP',0.5,0.82,W-1,28,C.gold);

  const cfRows=[
    ['MONTH','REVENUE','BURN RATE','NET CASH FLOW','CLOSING CASH','RUNWAY','STATUS'],
    ['Month 1','₹0','₹14L','(₹14L)','₹186L','~13 mo','Setup'],
    ['Month 2','₹0','₹14L','(₹14L)','₹172L','~12 mo','Setup'],
    ['Month 3','₹5L','₹14L','(₹9L)','₹163L','~12 mo','First revenue'],
    ['Month 4','₹10L','₹14L','(₹4L)','₹159L','~11 mo','Growing'],
    ['Month 5','₹20L','₹14L','₹6L','₹165L','~12 mo','Cash positive mo!'],
    ['Month 6','₹35L','₹14L','₹21L','₹186L','~13 mo','Accelerating'],
    ['Month 7','₹55L','₹16L','₹39L','₹225L','~14 mo','DealerOS paid live'],
    ['Month 8','₹65L','₹16L','₹49L','₹274L','~17 mo','Strong'],
    ['Month 9','₹90L','₹18L','₹72L','₹346L','~19 mo','B2B kicking in'],
    ['Month 10','₹1.1 Cr','₹18L','₹92L','₹438L','~24 mo','Self-sustaining'],
    ['Month 11','₹1.4 Cr','₹20L','₹1.2 Cr','₹558L','~28 mo','Seed deck ready'],
    ['Month 12','₹1.8 Cr','₹20L','₹1.6 Cr','₹718L','—','RAISE SEED'],
    ['TOTAL Y1','₹7.3 Cr','₹1.92 Cr','₹5.38 Cr','₹7.18 Cr','—','Cash-positive from Mo 5'],
  ];
  const cws=[1.5,1.4,1.4,1.55,1.6,1.4,3.0];
  tbl(s,0.4,1.72,W-0.8,cfRows,cws,{rH:0.37});

  // Highlight total row
  const tri=13;
  s.addShape(pptx.ShapeType.rect,{x:0.4,y:1.72+tri*0.37,w:W-0.8,h:0.37,fill:{color:'1A1508'},line:{color:C.gold,width:0.5}});
  hr(s,0.4,1.72+tri*0.37,W-0.8,C.gold,0.025);

  // Cash-positive highlight on row 5
  s.addShape(pptx.ShapeType.rect,{x:0.4,y:1.72+5*0.37,w:W-0.8,h:0.37,fill:{color:'0A1A0A'},line:{color:C.green,width:0.5}});

  box(s,0.4,6.72,W-0.8,0.58,C.surf2,C.border,C.green);
  s.addText('KEY CFO INSIGHT: With disciplined burn of ₹14–20L/mo, ₹2 Cr gives us 14 months zero-revenue runway. But we hit revenue by Month 3 and cash-flow positive by Month 5. By Month 12, cash balance is ₹7.18 Cr — 3.6x our starting capital. We raise from strength, not desperation.',{
    x:0.55,y:6.78,w:W-1.1,h:0.44,fontSize:9,color:C.textD,fontFace:'Arial',wrap:true,
  });
  snum(s,5);
}

// ═══════════════════════════════════════
// SLIDE 6 — REVENUE MODEL (BOOTSTRAP)
// ═══════════════════════════════════════
{
  const s=pptx.addSlide(); bg(s,C.ink2);
  hr(s,0.5,0.5,W-1);
  lbl(s,'06  —  REVENUE MODEL  ·  BOOTSTRAP SEQUENCE',0.5,0.55);
  h1(s,'3 REVENUE STREAMS. IN THIS EXACT ORDER.',0.5,0.82,W-1,28);

  txt(s,'With ₹2 Cr, we cannot pursue all 5 streams simultaneously. The CFO rule: launch streams in order of lowest CAC + fastest payback. We start where cost-to-revenue is closest to zero.',
    0.5,1.62,W-1,0.5,9.5,C.textD);

  const streams=[
    {
      order:'FIRST', mo:'Month 3', name:'DealerOS SaaS',color:C.gold,
      why:'Platform already built. Zero marginal cost to onboard dealers. Free tier creates instant supply-side lock-in. Paid tier conversion starts Month 5.',
      target:'Month 12: 875 paying dealers',
      tiers:[['Free','₹0/mo','Unlimited — lead gen + lock-in'],['Growth','₹999/mo','10–50 listings, analytics'],['Pro','₹2,999/mo','Unlimited, AI, priority support']],
      y1:'₹3.8 Cr', gm:'74%',
    },
    {
      order:'SECOND', mo:'Month 3', name:'B2B Data (DemandPulse Pilots)',color:C.blue,
      why:'5 bank/insurer pilots at ₹50K/mo each = ₹2.5L MRR from day one. Sales cycle 30 days for pilots. No product build needed — data already flowing.',
      target:'Month 12: 20 contracts @ ₹5L avg ACV',
      tiers:[['Pilot','₹50K/mo','3-month PoC, limited data'],['Standard','₹3L/yr','Full pricing API'],['Enterprise','₹10L+/yr','Custom, white-label']],
      y1:'₹1.8 Cr', gm:'82%',
    },
    {
      order:'THIRD', mo:'Month 5', name:'VehiclePassport Reports',color:C.teal,
      why:'Needs Parivahan integration (Month 3–4 build). Once live, pure transaction revenue. No marginal cost. Attach rate grows with dealer network.',
      target:'Month 12: 500 reports/month',
      tiers:[['Basic','₹299','Manual + reg data'],['Standard','₹499','+ Insurance history'],['Premium','₹999','+ OBD ECU scan']],
      y1:'₹1.2 Cr', gm:'71%',
    },
  ];

  streams.forEach((st,i)=>{
    const y=2.2+i*1.68;
    box(s,0.4,y,W-0.8,1.55,C.surface,C.border,st.color);
    // Order badge
    s.addShape(pptx.ShapeType.rect,{x:0.4,y,w:1.5,h:1.55,fill:{color:C.surf2}});
    s.addText(st.order,{x:0.4,y:y+0.25,w:1.5,h:0.5,fontSize:14,bold:true,color:st.color,fontFace:'Arial Black',align:'center'});
    s.addText(st.mo,{x:0.4,y:y+0.78,w:1.5,h:0.28,fontSize:8,color:C.textD,fontFace:'Courier New',align:'center'});
    s.addText(`GM ${st.gm}`,{x:0.4,y:y+1.1,w:1.5,h:0.28,fontSize:9,bold:true,color:C.green,fontFace:'Courier New',align:'center'});
    // Name + why
    s.addText(st.name,{x:2.1,y:y+0.08,w:5,h:0.35,fontSize:13,bold:true,color:C.text,fontFace:'Arial Black'});
    txt(s,st.why,2.1,y+0.46,4.8,0.65,8.5,C.textD);
    s.addText(`TARGET: ${st.target}`,{x:2.1,y:y+1.18,w:4.8,h:0.24,fontSize:8,color:st.color,fontFace:'Arial',bold:true});
    // Tiers
    st.tiers.forEach((t,ti)=>{
      const tx=7.15+ti*2.05;
      box(s,tx,y+0.12,1.92,1.28,C.surf2,C.border,st.color);
      s.addText(t[0],{x:tx,y:y+0.18,w:1.92,h:0.26,fontSize:9,bold:true,color:st.color,fontFace:'Arial Black',align:'center'});
      s.addText(t[1],{x:tx,y:y+0.46,w:1.92,h:0.38,fontSize:18,bold:true,color:C.text,fontFace:'Arial Black',align:'center'});
      txt(s,t[2],tx+0.08,y+0.86,1.76,0.42,7.5,C.textD,{align:'center'});
    });
    // Y1
    s.addText(`Y1: ${st.y1}`,{x:13.35-1.5,y:y+0.08,w:1.4,h:0.35,fontSize:14,bold:true,color:st.color,fontFace:'Arial Black',align:'right'});
  });

  box(s,0.4,7.12,W-0.8,0.22,C.surf2,C.border);
  s.addText('STREAMS DEFERRED TO POST-SEED: LiveCondition (needs mechanic network ₹6L setup) · InstantRC (needs RTO agent network) · Finance commissions (needs bank partnerships). Launch all 5 after Series A.',{
    x:0.55,y:7.14,w:W-1.1,h:0.18,fontSize:7.5,color:C.textD,fontFace:'Arial',
  });
  snum(s,6);
}

// ═══════════════════════════════════════
// SLIDE 7 — P&L YEAR 1
// ═══════════════════════════════════════
{
  const s=pptx.addSlide(); bg(s);
  hr(s,0.5,0.5,W-1);
  lbl(s,'07  —  PROFIT & LOSS  ·  YEAR 1 DETAILED  (₹ LAKHS)',0.5,0.55);
  h1(s,'MONTHLY P&L: BREAKEVEN BY MONTH 5',0.5,0.82,W-1,26);

  const plRows=[
    ['LINE ITEM','Mo 1','Mo 2','Mo 3','Mo 4','Mo 5','Mo 6','Mo 7','Mo 8','Mo 9','Mo 10','Mo 11','Mo 12','TOTAL'],
    ['DealerOS Revenue','0','0','5','10','18','30','45','55','72','92','120','160','607'],
    ['B2B Data Revenue','0','0','3','5','8','12','16','22','28','36','42','52','224'],
    ['VehiclePassport','0','0','0','0','6','10','14','18','22','28','38','52','188'],
    ['TOTAL REVENUE','0','0','8','15','32','52','75','95','122','156','200','264','1,019'],
    ['Direct Costs (COGS)','0','0','2','4','8','13','18','22','28','36','46','61','238'],
    ['GROSS PROFIT','0','0','6','11','24','39','57','73','94','120','154','203','781'],
    ['Gross Margin %','—','—','75%','73%','75%','75%','76%','77%','77%','77%','77%','77%','76%'],
    ['Team Salaries','80','80','80','80','80','80','95','95','110','110','120','120','1,130'],
    ['Tech Infra','15','15','15','15','15','15','18','18','20','20','22','22','210'],
    ['Sales & Marketing','15','15','20','20','22','22','28','28','30','30','32','32','294'],
    ['G&A + Legal','8','8','8','8','8','8','10','10','10','10','12','12','112'],
    ['Total OpEx','118','118','123','123','125','125','151','151','170','170','186','186','1,746'],
    ['EBITDA','(118)','(118)','(117)','(112)','(101)','(86)','(94)','(78)','(76)','(50)','(32)','17','(765)'],
    ['EBITDA (cumulative)','(118)','(236)','(353)','(465)','(566)','(652)','(746)','(824)','(900)','(950)','(982)','(965)','—'],
    ['Cash Remaining','182','168','157','149','158','171','214','261','330','418','535','718','—'],
  ];
  const cws2=[2.2,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.9];
  tbl(s,0.4,1.72,W-0.8,plRows,cws2,{rH:0.312,hBg:C.surf2});

  // Color key rows
  const colRows={
    4:{bg:'1A1508',line:C.gold},   // TOTAL REVENUE
    6:{bg:'0A1A0A',line:C.green},  // GROSS PROFIT
    12:{bg:'1A1508',line:C.goldD}, // Total OpEx
    13:{bg:'1A0A0A',line:C.red},   // EBITDA
    15:{bg:'0A1A0A',line:C.green}, // Cash Remaining
  };
  Object.entries(colRows).forEach(([ri,st])=>{
    s.addShape(pptx.ShapeType.rect,{x:0.4,y:1.72+Number(ri)*0.312,w:W-0.8,h:0.312,fill:{color:st.bg},line:{color:st.line,width:0.5}});
    hr(s,0.4,1.72+Number(ri)*0.312,W-0.8,st.line,0.02);
  });

  box(s,0.4,6.92,W-0.8,0.35,C.surf2,C.border,C.gold);
  s.addText('NOTE (All figures in ₹ Lakhs): First profitable month is Month 12 (EBITDA ₹17L). Cumulative cash consumed = ₹96.5L (less than half of starting ₹200L). Cash balance ₹718L = 3.6x starting capital. Ready for seed raise from position of strength.',{
    x:0.55,y:6.96,w:W-1.1,h:0.28,fontSize:8,color:C.textD,fontFace:'Arial',wrap:true,
  });
  snum(s,7);
}

// ═══════════════════════════════════════
// SLIDE 8 — HEADCOUNT & TEAM PLAN
// ═══════════════════════════════════════
{
  const s=pptx.addSlide(); bg(s,C.ink2);
  hr(s,0.5,0.5,W-1);
  lbl(s,'08  —  HEADCOUNT PLAN  ·  WHO WE HIRE AND WHEN',0.5,0.55);
  h1(s,'6 PEOPLE. MAXIMUM LEVERAGE.',0.5,0.82,W-1,28);

  const team=[
    {role:'Co-founder / CEO',start:'Day 1',ctc:'₹1.5L/mo',equity:'20–25%',focus:'Dealer sales, B2B contracts, investor relations, strategy',why:'Non-negotiable. CEO must sell. No hiring someone else to do this at ₹2 Cr stage.',color:C.gold},
    {role:'Co-founder / CPO',start:'Day 1',ctc:'₹1.5L/mo',equity:'20–25%',focus:'Product roadmap, dealer onboarding, customer success, ops',why:'Owns the product and the dealer relationship. Lives in the DealerOS dashboard daily.',color:C.gold},
    {role:'CTO / Lead Engineer',start:'Month 1',ctc:'₹2.5L/mo',equity:'5–8%',focus:'Platform stability, Parivahan API, DemandPulse pipeline, mobile prep',why:'Most important hire. Full-stack, knows Next.js + Supabase. Existing codebase already clean.',color:C.blue},
    {role:'Full-Stack Engineer',start:'Month 1',ctc:'₹1.8L/mo',equity:'1–2%',focus:'Feature development, API integrations, bug fixes, dealer tools',why:'Second engineer to unblock CTO. Junior-to-mid. AI-assisted = 2x productivity.',color:C.blue},
    {role:'Growth / Dealer Ops',start:'Month 2',ctc:'₹80K/mo',equity:'0.5–1%',focus:'Dealer onboarding, WhatsApp support, field ops in 1 city, referral program',why:'The hustler. Onboards 20 dealers/week in target city. Metrics-obsessed.',color:C.teal},
    {role:'Finance & Compliance',start:'Month 3',ctc:'₹60K/mo (part-time)',equity:'0–0.5%',focus:'GST, invoicing, B2B contract administration, investor reporting',why:'CA on retainer. Not full-time until Month 9. Outsource at first.',color:C.orange},
  ];

  team.forEach((t,i)=>{
    const y=1.72+i*0.91;
    box(s,0.4,y,W-0.8,0.84,C.surface,C.border,t.color);
    s.addText(t.role,{x:0.55,y:y+0.08,w:2.8,h:0.28,fontSize:11,bold:true,color:C.text,fontFace:'Arial'});
    s.addText(`Starts: ${t.start}`,{x:0.55,y:y+0.38,w:2.8,h:0.2,fontSize:8,color:C.textD,fontFace:'Courier New'});
    s.addText(t.ctc,{x:0.55,y:y+0.58,w:1.5,h:0.2,fontSize:10,bold:true,color:t.color,fontFace:'Arial Black'});
    s.addText(`Equity: ${t.equity}`,{x:2.2,y:y+0.58,w:1.4,h:0.2,fontSize:8,color:C.textD,fontFace:'Courier New'});
    s.addText(`FOCUS: ${t.focus}`,{x:3.75,y:y+0.08,w:5.2,h:0.28,fontSize:8.5,bold:true,color:C.textM,fontFace:'Arial',wrap:true});
    txt(s,`WHY: ${t.why}`,3.75,y+0.44,5.2,0.36,8,C.textD);
  });

  // Total cost box
  box(s,0.4,7.18,W-0.8,0.15,C.surf2,C.border,C.gold);
  s.addText('TOTAL MONTHLY BURN (PEOPLE ONLY): ₹8.15L/mo (Months 1–2)  →  ₹9.15L/mo (Month 3+)  ·  Annual people cost: ₹1.06 Cr  ·  55% of total capital',{
    x:0.55,y:7.2,w:W-1.1,h:0.12,fontSize:7,color:C.textD,fontFace:'Arial',
  });
  snum(s,8);
}

// ═══════════════════════════════════════
// SLIDE 9 — 3-YEAR FORECAST (POST-RAISE)
// ═══════════════════════════════════════
{
  const s=pptx.addSlide(); bg(s);
  hr(s,0.5,0.5,W-1);
  lbl(s,'09  —  3-YEAR FORECAST  ·  BOOTSTRAP → SEED → SERIES A',0.5,0.55);
  h1(s,'₹7.3 CR → ₹85 CR → ₹280 CR',0.5,0.82,W-1,30,C.gold);

  // Phase headers
  const phases=[
    {x:0.4,w:3.8,label:'YEAR 1 (Bootstrap)',sub:'₹2 Cr capital · 6 FTEs',color:C.teal},
    {x:4.4,w:4.2,label:'YEAR 2 (Post-Seed ₹20 Cr)',sub:'25 FTEs · 22 cities',color:C.gold},
    {x:8.8,w:4.15,label:'YEAR 3 (Post-Series A ₹80 Cr)',sub:'80 FTEs · all verticals',color:C.purple},
  ];
  phases.forEach(p=>{
    box(s,p.x,1.68,p.w,0.65,C.surf2,C.border,p.color);
    s.addText(p.label,{x:p.x+0.12,y:1.72,w:p.w-0.24,h:0.3,fontSize:11,bold:true,color:p.color,fontFace:'Arial Black'});
    s.addText(p.sub,{x:p.x+0.12,y:2.0,w:p.w-0.24,h:0.22,fontSize:8,color:C.textD,fontFace:'Courier New'});
  });

  const rows=[
    ['METRIC','FY2026\n(Bootstrap)','FY2027\n(Post-Seed)','FY2028\n(Post-Series A)'],
    ['Starting Capital','₹2 Cr (own)','₹7.18 Cr + ₹20 Cr raise','₹27 Cr + ₹80 Cr raise'],
    ['Total Revenue','₹7.3 Cr','₹85 Cr','₹280 Cr'],
    ['DealerOS SaaS','₹3.8 Cr','₹38 Cr','₹108 Cr'],
    ['B2B Data (DemandPulse)','₹1.8 Cr','₹22 Cr','₹72 Cr'],
    ['VehiclePassport','₹1.2 Cr','₹12 Cr','₹38 Cr'],
    ['LiveCondition + RC','₹0.5 Cr','₹8 Cr','₹32 Cr'],
    ['Finance + Insurance','₹0 Cr','₹5 Cr','₹30 Cr'],
    ['Gross Profit','₹5.5 Cr','₹65 Cr','₹224 Cr'],
    ['Gross Margin','75.3%','76.5%','80%'],
    ['Total OpEx','₹17.5 Cr','₹42 Cr','₹96 Cr'],
    ['EBITDA','(₹12 Cr)','₹23 Cr','₹128 Cr'],
    ['EBITDA Margin','(16%)','27%','45.7%'],
    ['Headcount (FTEs)','6','25','80'],
    ['Active Dealers','3,500','18,000','55,000'],
    ['B2B Contracts','20','45','90'],
    ['Cities Covered','5','22','50+'],
    ['Valuation (implied)','₹250–400 Cr','₹1,200–1,800 Cr','₹5,600–8,400 Cr'],
  ];

  const cws3=[3.2,2.8,3.4,3.5];
  tbl(s,0.4,2.42,W-0.8,rows,cws3,{rH:0.28,hBg:C.surf2});

  // Highlight key rows
  [3,9,12,18].forEach(ri=>{
    const rowBgs={3:'1A1508',9:'0A1A0A',12:'1A0808',18:'1A1508'};
    const rowLines={3:C.gold,9:C.green,12:C.red,18:C.gold};
    const rn=Number(ri);
    s.addShape(pptx.ShapeType.rect,{x:0.4,y:2.42+rn*0.28,w:W-0.8,h:0.28,fill:{color:rowBgs[ri]},line:{color:rowLines[ri],width:0.5}});
  });
  snum(s,9);
}

// ═══════════════════════════════════════
// SLIDE 10 — UNIT ECONOMICS
// ═══════════════════════════════════════
{
  const s=pptx.addSlide(); bg(s,C.ink2);
  hr(s,0.5,0.5,W-1);
  lbl(s,'10  —  UNIT ECONOMICS  ·  THE NUMBERS THAT MATTER MOST',0.5,0.55);
  h1(s,'BOOTSTRAPPED UNIT ECONOMICS\nARE ACTUALLY STRONGER',0.5,0.82,W-1,24,C.gold);

  txt(s,'Because we cannot afford paid acquisition, every metric must be earned organically. This forces better unit economics than funded competitors.',0.5,1.65,W-1,0.35,9.5,C.textD);

  const ue=[
    {seg:'DEALER ACQUISITION',color:C.gold,metrics:[
      ['CAC (Bootstrap Y1)','₹400','Referral + organic only; zero paid spend'],
      ['CAC (vs. funded competitors)','₹1,800','Spinny spends ₹3,200+ CAC; we have structural advantage'],
      ['Monthly Revenue/Dealer','₹3,200','Growth tier ₹999 + avg loan commission ₹2,200'],
      ['Gross Profit/Dealer/Month','₹2,300','72% GM on dealer revenue'],
      ['Payback Period','0.17 months','₹400 CAC ÷ ₹2,300/mo GP = 5 days'],
      ['12-Month LTV','₹27,600','₹2,300/mo × 12 × 92% retention'],
      ['LTV : CAC','69x','At bootstrap CAC — extraordinary'],
      ['Annual Churn Target','<8%','Once DealerOS is pricing brain'],
    ]},
    {seg:'B2B DATA CONTRACTS',color:C.blue,metrics:[
      ['CAC (pilot → paid)','₹1.2L','2 BD meetings + PoC data setup'],
      ['Avg Pilot ACV','₹6L/yr','₹50K/mo × 12; convert in Mo 4'],
      ['Gross Margin','82%','Near-zero marginal data cost'],
      ['Annual GP/Contract','₹4.92L','₹6L × 82%'],
      ['Payback Period','3.5 months','₹1.2L ÷ ₹41K/mo GP'],
      ['Net Revenue Retention','125%','Land pilot; expand to 3 products'],
      ['Contract Length (avg)','2.5 years','Annual contracts, high renewal'],
      ['LTV (2.5-year)','₹9.84L','₹4.92L/yr × 2.5 × 80% renewal'],
    ]},
    {seg:'VEHICLEPASSPORT REPORTS',color:C.teal,metrics:[
      ['Cost to produce (per report)','₹140','API calls + compute + storage'],
      ['Revenue per report','₹499','Standard pricing'],
      ['Gross Margin','72%','₹359 gross profit per report'],
      ['CAC (for report buyer)','₹0','Dealer recommends it; zero CAC'],
      ['Reports/dealer/month (avg)','0.57','1 report per 1.75 cars sold'],
      ['Blended dealer contribution','₹204/mo','0.57 × ₹359 GP per report'],
      ['Scale at 5,000 dealers','₹10.2L/mo','₹1.22 Cr ARR from dealer network alone'],
      ['B2C direct reports','+40%','Direct buyers finding us via SEO'],
    ]},
  ];

  ue.forEach((seg,si)=>{
    const x=0.4+si*4.32;
    box(s,x,2.12,4.15,5.05,C.surface,C.border,seg.color);
    s.addText(seg.seg,{x:x+0.12,y:2.18,w:3.91,h:0.3,fontSize:10,bold:true,color:seg.color,fontFace:'Arial Black',charSpacing:1});
    seg.metrics.forEach((m,mi)=>{
      const my=2.56+mi*0.575;
      s.addShape(pptx.ShapeType.rect,{x:x+0.1,y:my,w:3.95,h:0.52,fill:{color:mi%2===0?C.surf2:C.ink},line:{color:C.muted,width:0.3}});
      s.addText(m[0],{x:x+0.18,y:my+0.06,w:1.9,h:0.38,fontSize:8,color:C.textD,fontFace:'Arial',valign:'top',wrap:true});
      s.addText(m[1],{x:x+2.1,y:my+0.1,w:0.95,h:0.3,fontSize:11,bold:true,color:seg.color,fontFace:'Arial Black',align:'center'});
      s.addText(m[2],{x:x+3.1,y:my+0.06,w:0.92,h:0.38,fontSize:7,color:C.textD,fontFace:'Arial',valign:'top',wrap:true});
    });
  });

  box(s,0.4,7.25,W-0.8,0.1,C.surf2,C.border);
  s.addText('BOOTSTRAP ADVANTAGE: Zero paid CAC forces organic acquisition — which creates the data flywheel. Every organic dealer = free data = better DemandPulse = higher B2B price = more margin to invest in growth.',{
    x:0.55,y:7.27,w:W-1.1,h:0.08,fontSize:6.5,color:C.textD,fontFace:'Arial',
  });
  snum(s,10);
}

// ═══════════════════════════════════════
// SLIDE 11 — SEED RAISE THESIS
// ═══════════════════════════════════════
{
  const s=pptx.addSlide(); bg(s);
  hr(s,0.5,0.5,W-1);
  lbl(s,'11  —  SEED RAISE  ·  THE CASE WE TAKE TO INVESTORS AT MONTH 12',0.5,0.55);
  h1(s,'WE RAISE AT ₹15 CR ARR.\nNOT AT ZERO.',0.5,0.82,W-1,26);

  txt(s,'Most founders raise before product-market fit. We raise after 12 months of proved unit economics, 3,500 dealers, 20 B2B contracts, and ₹7 Cr in the bank. This changes the negotiation entirely.',
    0.5,1.7,W-1,0.48,10,C.textD);

  // Proof points
  lbl(s,'WHAT WE SHOW INVESTORS AT MONTH 12',0.5,2.28);
  const proofs=[
    {metric:'₹15 Cr ARR',detail:'Monthly recurring run rate going into the raise',color:C.gold},
    {metric:'3,500 dealers',detail:'875 paying (25% conversion), 2,625 free tier',color:C.gold},
    {metric:'20 B2B contracts',detail:'Banks + insurers paying ₹50K–3L/mo each',color:C.blue},
    {metric:'₹7.18 Cr cash',detail:'3.6x starting capital. We grew without burning out.',color:C.green},
    {metric:'5-day payback',detail:'CAC ₹400, daily GP ₹76. No other platform can claim this.',color:C.teal},
    {metric:'76% gross margin',detail:'SaaS-grade margins from day one',color:C.purple},
  ];
  proofs.forEach((p,i)=>{
    const col=i%3; const row=Math.floor(i/3);
    const x=0.4+col*4.32; const y=2.58+row*1.28;
    box(s,x,y,4.15,1.15,C.surface,C.border,p.color);
    s.addText(p.metric,{x:x+0.15,y:y+0.1,w:3.85,h:0.5,fontSize:26,bold:true,color:p.color,fontFace:'Arial Black',align:'center'});
    txt(s,p.detail,x+0.15,y+0.65,3.85,0.38,9,C.textD,{align:'center'});
  });

  // Raise terms
  lbl(s,'SEED ROUND TERMS',0.5,5.28);
  const terms=[
    {item:'Raise Amount','val':'₹20–25 Cr','note':'12–18 months runway post-raise'},
    {item:'Pre-Money Valuation','val':'₹120–150 Cr','note':'5x ARR multiple — conservative for SaaS at 76% GM'},
    {item:'Dilution','val':'14–17%','note':'Founders retain 60%+ post-seed'},
    {item:'Use of Funds','val':'DealerOS scale','note':'5,000 to 20,000 dealers, 5 to 22 cities, 6 to 25 FTEs'},
    {item:'Target Investors','val':'Blume, Stellaris','note':'+ Auto angels: ex-CarDekho, ex-Cars24, auto OEM executives'},
    {item:'Milestones to Series A','val':'₹50 Cr ARR','note':'18 months post-seed at ₹85 Cr Y2 trajectory'},
  ];
  terms.forEach((t,i)=>{
    const y=5.52+i*0.3;
    s.addShape(pptx.ShapeType.rect,{x:0.4,y,w:W-0.8,h:0.28,fill:{color:i%2===0?C.surface:C.ink},line:{color:C.muted,width:0.3}});
    s.addText(t.item,{x:0.5,y:y+0.04,w:2.5,h:0.2,fontSize:8,color:C.textD,fontFace:'Courier New'});
    s.addText(t.val,{x:3.05,y:y+0.04,w:2.5,h:0.2,fontSize:9,bold:true,color:C.gold,fontFace:'Arial Black'});
    s.addText(t.note,{x:5.65,y:y+0.04,w:7.3,h:0.2,fontSize:8,color:C.textD,fontFace:'Arial'});
  });
  snum(s,11);
}

// ═══════════════════════════════════════
// SLIDE 12 — RISK & CONTINGENCY
// ═══════════════════════════════════════
{
  const s=pptx.addSlide(); bg(s,C.ink2);
  hr(s,0.5,0.5,W-1);
  lbl(s,'12  —  RISK REGISTER  ·  WHAT KILLS ₹2 CR COMPANIES',0.5,0.55);
  h1(s,'THE 5 EXISTENTIAL RISKS\n& HOW WE SURVIVE THEM',0.5,0.82,W-1,26,C.red);

  const risks=[
    {risk:'Revenue takes 9+ months to start',kill:'Burn through capital before proving model',survive:'DealerOS free tier + B2B pilots start Month 3. Even ₹5L MRR buys 8 extra months.',contingency:'Month 6 check: if <₹15L MRR, cut 2 FTEs, extend runway to 22 months.',color:C.red},
    {risk:'Key engineer quits',kill:'Platform breaks, no one to fix, B2B contracts lost',survive:'CTO has 30% equity. Two engineers means redundancy. All code documented.',contingency:'Pre-screen 2 backup engineers now. Freelance contract ready to activate.',color:C.red},
    {risk:'Parivahan API blocked/delayed',kill:'VehiclePassport stalls; trust story weakens',survive:'Manual verification works at <200 reports/mo. OBD + insurance data fills 80% of value.',contingency:'Manual process can run 6 months before automation is critical.',color:C.orange},
    {risk:'DealerOS paid conversion <10%',kill:'SaaS revenue thesis fails; need to pivot',survive:'B2B data (82% margin) is immediately viable. Shift resources there.',contingency:'If conversion <10% by Month 6, pivot to B2B-first and sell DealerOS data, not software.',color:C.orange},
    {risk:'Large competitor copies DealerOS',kill:'Commoditise our supply-side moat',survive:'Data advantage is 12+ months ahead. Free tier makes switching cost ₹0 to stay.',contingency:'Double down on DemandPulse B2B — impossible to copy without 18 months of data.',color:C.blue},
  ];

  risks.forEach((r,i)=>{
    const y=1.8+i*1.08;
    box(s,0.4,y,W-0.8,1.0,C.surface,C.border,r.color);
    // Risk
    s.addText(`${i+1}. ${r.risk}`,{x:0.5,y:y+0.08,w:3.0,h:0.28,fontSize:10,bold:true,color:C.text,fontFace:'Arial',wrap:true});
    s.addText(`KILLS US: ${r.kill}`,{x:0.5,y:y+0.4,w:3.0,h:0.24,fontSize:8,color:r.color,fontFace:'Arial',wrap:true});
    // Survive
    s.addShape(pptx.ShapeType.rect,{x:3.65,y:y+0.08,w:4.6,h:0.84,fill:{color:C.greenD},line:{color:C.green,width:0.5}});
    s.addText('SURVIVE',{x:3.72,y:y+0.1,w:1.2,h:0.2,fontSize:7.5,bold:true,color:C.green,fontFace:'Courier New'});
    txt(s,r.survive,3.72,y+0.3,4.45,0.55,8,C.textM);
    // Contingency
    s.addShape(pptx.ShapeType.rect,{x:8.45,y:y+0.08,w:4.5,h:0.84,fill:{color:'1A0A08'},line:{color:C.orange,width:0.5}});
    s.addText('CONTINGENCY',{x:8.52,y:y+0.1,w:1.8,h:0.2,fontSize:7.5,bold:true,color:C.orange,fontFace:'Courier New'});
    txt(s,r.contingency,8.52,y+0.3,4.35,0.55,8,C.textM);
  });
  snum(s,12);
}

// ═══════════════════════════════════════
// SLIDE 13 — 90-DAY SPRINT PLAN
// ═══════════════════════════════════════
{
  const s=pptx.addSlide(); bg(s);
  hr(s,0.5,0.5,W-1);
  lbl(s,'13  —  90-DAY EXECUTION SPRINT  ·  FROM TODAY',0.5,0.55);
  h1(s,'FIRST 90 DAYS DECIDE EVERYTHING',0.5,0.82,W-1,28);

  const sprints=[
    {
      period:'DAYS 1–30', title:'Build the Foundation',color:C.red,
      tasks:[
        {t:'Hire CTO',d:'Shortlist 5, interview 3, hire 1. Non-negotiable — block calendar for this.'},
        {t:'Legal setup',d:'Pvt Ltd incorporation, co-founder agreements, ESOP pool, IP assignment.'},
        {t:'DealerOS free tier live',d:'Deploy to 50 dealers in Mumbai. Get 10 using it daily.'},
        {t:'B2B prospect list',d:'Identify 25 target banks/insurers. Get warm intros from network. 5 meetings booked.'},
        {t:'Parivahan API application',d:'File API access request. Start manual pipeline as fallback.'},
      ],
    },
    {
      period:'DAYS 31–60', title:'First Revenue',color:C.orange,
      tasks:[
        {t:'3 B2B pilot contracts signed',d:'₹50K/mo each = ₹1.5L MRR. Do not chase big contracts yet.'},
        {t:'200 dealers on DealerOS',d:'Mumbai + Delhi. 10% paying = 20 dealers × ₹999 = ₹20K MRR.'},
        {t:'VehiclePassport MVP live',d:'Manual + OBD-II data. First 20 reports. Charge ₹299 (introductory).'},
        {t:'First NPS survey',d:'Ask dealers what they need most. Build ruthlessly for that one thing.'},
        {t:'Seed deck v1.0',d:'Write investor narrative now — forces clarity on what metrics matter.'},
      ],
    },
    {
      period:'DAYS 61–90', title:'Prove the Model',color:C.gold,
      tasks:[
        {t:'DealerOS paid tier launch',d:'Growth tier ₹999. Target 50 paying dealers. First ₹50K MRR from SaaS.'},
        {t:'5 B2B pilots → contracts',d:'Convert pilots to annual ₹3L contracts. First ₹15L ARR from B2B.'},
        {t:'Referral program live',d:'₹2,000 incentive per dealer referral. Target 30 referrals in 30 days.'},
        {t:'Month 3 financial review',d:'Actual vs. plan. Kill anything not working. Double down on what is.'},
        {t:'Investor outreach begins',d:'10 target angels contacted. Use real metrics from 90-day sprint.'},
      ],
    },
  ];

  sprints.forEach((sp,i)=>{
    const x=0.4+i*4.32;
    box(s,x,1.72,4.15,5.3,C.surface,C.border,sp.color);
    s.addText(sp.period,{x:x+0.12,y:1.78,w:3.91,h:0.26,fontSize:8.5,bold:true,color:sp.color,fontFace:'Courier New',charSpacing:2});
    s.addText(sp.title,{x:x+0.12,y:2.06,w:3.91,h:0.32,fontSize:13,bold:true,color:C.text,fontFace:'Arial Black'});
    sp.tasks.forEach((task,ti)=>{
      const ty=2.48+ti*0.92;
      s.addShape(pptx.ShapeType.rect,{x:x+0.1,y:ty,w:3.95,h:0.86,fill:{color:ti%2===0?C.surf2:C.ink},line:{color:C.muted,width:0.3}});
      s.addShape(pptx.ShapeType.rect,{x:x+0.1,y:ty,w:0.04,h:0.86,fill:{color:sp.color}});
      s.addText(task.t,{x:x+0.22,y:ty+0.06,w:3.7,h:0.26,fontSize:9.5,bold:true,color:C.text,fontFace:'Arial'});
      txt(s,task.d,x+0.22,ty+0.34,3.7,0.46,8,C.textD);
    });
  });

  box(s,0.4,7.1,W-0.8,0.25,C.surf2,C.border,C.gold);
  s.addText('CFO RULE: Review cash position every Friday. If burn exceeds plan by >10% in any month, hold a crisis meeting Monday. No exceptions. Discipline in months 1–3 determines whether we survive.',{
    x:0.55,y:7.14,w:W-1.1,h:0.18,fontSize:8,color:C.textD,fontFace:'Arial',
  });
  snum(s,13);
}

// ═══════════════════════════════════════
// SLIDE 14 — CLOSING / NORTH STAR
// ═══════════════════════════════════════
{
  const s=pptx.addSlide(); bg(s);
  for(let i=1;i<20;i++) s.addShape(pptx.ShapeType.rect,{x:i*0.7,y:0,w:0.006,h:H,fill:{color:'0E0E08'}});
  for(let i=1;i<12;i++) s.addShape(pptx.ShapeType.rect,{x:0,y:i*0.65,w:W,h:0.006,fill:{color:'0E0E08'}});
  hr(s,0.5,0.5,W-1);
  lbl(s,'14  —  CFO NORTH STAR  ·  THE ONLY METRICS THAT MATTER',0.5,0.55);

  s.addText('₹2 CR IS NOT A LIMITATION.',{x:0,y:1.1,w:W,h:0.85,fontSize:48,bold:true,color:C.text,fontFace:'Arial Black',align:'center',charSpacing:1});
  s.addText("IT'S THE CONSTRAINT THAT BUILDS DISCIPLINE.",{x:0,y:1.85,w:W,h:0.75,fontSize:28,bold:true,color:C.gold,fontFace:'Arial Black',align:'center',charSpacing:1});

  const stars=[
    {val:'Month 5',lbl:'First cash-flow positive month',c:C.green},
    {val:'₹400',lbl:'Target blended CAC (organic)',c:C.teal},
    {val:'69x',lbl:'Dealer LTV:CAC ratio',c:C.gold},
    {val:'₹15 Cr',lbl:'ARR when we raise Seed',c:C.gold},
    {val:'₹7.18 Cr',lbl:'Cash at end of Year 1',c:C.green},
    {val:'₹400 Cr',lbl:'Valuation at Seed raise',c:C.purple},
  ];
  stars.forEach((st,i)=>{
    const x=0.4+(i%3)*4.32; const y=2.72+Math.floor(i/3)*1.85;
    box(s,x,y,4.15,1.7,C.surface,C.border,st.c);
    s.addText(st.val,{x,y:y+0.15,w:4.15,h:0.7,fontSize:34,bold:true,color:st.c,fontFace:'Arial Black',align:'center'});
    s.addText(st.lbl,{x,y:y+0.9,w:4.15,h:0.38,fontSize:10,color:C.textM,fontFace:'Arial',align:'center',wrap:true});
  });

  s.addShape(pptx.ShapeType.rect,{x:0.4,y:6.55,w:W-0.8,h:0.72,fill:{color:C.surf2},line:{color:C.border,width:0.5}});
  hr(s,0.4,6.55,W-0.8,C.gold);
  s.addText('"Every rupee company I have built outperformed every funded competitor I competed against. Not because of money — because of discipline. ₹2 Cr with these unit economics is not a disadvantage. It is a 12-month proof point that no investor can argue with."',{
    x:0.55,y:6.6,w:W-1.1,h:0.58,
    fontSize:9,color:C.textD,fontFace:'Arial',italic:true,wrap:true,
  });

  s.addText('CAROBEST  ·  ₹2 CR BOOTSTRAP FINANCIAL PLAN  ·  CFO PREPARED  ·  CONFIDENTIAL  ·  FEB 2026',{
    x:0,y:7.3,w:W,h:0.2,fontSize:7.5,color:C.muted,fontFace:'Courier New',align:'center',charSpacing:2,
  });
  snum(s,14);
}

// SAVE
pptx.writeFile({fileName:'public/carobest-bootstrap-financial-plan.pptx'}).then(()=>{
  console.log('✓ Saved: public/carobest-bootstrap-financial-plan.pptx');
}).catch(e=>{ console.error(e); process.exit(1); });
