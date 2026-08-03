import React, { useState, memo } from 'react';

// ── Set to false before shipping ───────────────────────────────────────────
const PREVIEW_MODE = true;

const EASE  = 'cubic-bezier(0.22,1,0.36,1)';
const CREAM = '#E8E4C9';
const MUTED = '#C9C4B8';
const BG    = '#000000';
const CARD  = '#1A1318';

// ── RECEIVED types ────────────────────────────────────────────────────────
interface StarDef {
  id: string; name: string; tier: 1|2|3;
  x: number;  y: number;
  lesson: string; credit?: string; flip?: boolean;
}

// ── TRANSMITTED types ─────────────────────────────────────────────────────
export interface TxItem {
  id:          string;
  type:        'words' | 'frequency';
  title:       string;
  topic:       string;
  description: string;
  thumbnail:   string | null;
  url:         string;
  duration:    string;
  date:        string;
  status:      'published' | 'in-progress';
}
type Filter = 'all' | 'words' | 'frequency';

// ── DATA ───────────────────────────────────────────────────────────────────
const STARS: StarDef[] = [
  { id:'dr-k',       name:'DR K',                  tier:1, x:152,  y:44,
    lesson:'Regulate before you express.' },
  { id:'don-norman', name:'Don Norman',             tier:1, x:76,   y:192,
    lesson:'Usability needs affordance, feedback, and mapping in concert.',
    credit:'THE DESIGN OF EVERYDAY THINGS · 2013' },
  { id:'dan-ariely', name:'Dan Ariely',             tier:2, x:308,  y:155,
    lesson:'We are predictably irrational — design must account for that.',
    credit:'PREDICTABLY IRRATIONAL · 2008' },
  { id:'science',    name:'The Science of Product', tier:3, x:462,  y:258,
    lesson:'Product strategy is the art of saying no to good ideas.' },
  { id:'tim-brown',  name:'Tim Brown',              tier:1, x:592,  y:72,
    lesson:'Design thinking begins and ends with the human being.',
    credit:'CHANGE BY DESIGN · 2009' },
  { id:'donella',    name:'Donella H Meadows',      tier:1, x:704,  y:48,
    lesson:"You can't tame a system — find its leverage points.",
    credit:'THINKING IN SYSTEMS · 2008' },
  { id:'ansh',       name:'Ansh Mehra',             tier:2, x:842,  y:222,
    lesson:'Portfolio is proof of thinking, not just taste.' },
  { id:'saptarshi',  name:'Saptarshi Prakash',      tier:2, x:1068, y:178,
    lesson:'Design is politics — every choice includes and excludes.', flip:true },
];

// Edit this array to add items. Empty = ships the intentional empty state.
const ITEMS: TxItem[] = [];

// Preview-only — pixel-identical to production, just with sample data.
const SAMPLE_ITEMS: TxItem[] = [
  {
    id: 'preview-1', type: 'frequency',
    topic: 'MOTION & MICROMOMENTS',
    title: 'Why good transitions are invisible',
    description: 'Breaking down the timing curves behind interfaces that feel alive, and why most motion design draws attention to itself.',
    thumbnail: null, url: '#', duration: '12:40', date: 'Jun 2026', status: 'published',
  },
  {
    id: 'preview-2', type: 'words',
    topic: 'HOW PEOPLE DECIDE',
    title: 'The friction you cannot see',
    description: 'Notes on cognitive bias, habit loops, and the invisible architecture behind every tap.',
    thumbnail: null, url: '#', duration: '8 min', date: 'May 2026', status: 'published',
  },
  {
    id: 'preview-3', type: 'words',
    topic: 'DESIGN FOR EVERYONE',
    title: 'Accessibility is a research problem',
    description: 'What inclusive actually means in practice, and why contrast ratios are the easiest part of the job.',
    thumbnail: null, url: '#', duration: '6 min', date: 'Apr 2026', status: 'in-progress',
  },
];

// ── RECEIVED constants ─────────────────────────────────────────────────────
const TIER_R  = { 1:6,   2:3.5, 3:2   } as const;
const TIER_OP = { 1:1.0, 2:0.6, 3:0.35 } as const;
const TIER_FS = { 1:8,   2:9,   3:9   } as const;
const DRIFTS  = [
  '22s 0s',  '14s 1.8s', '19s 4.5s', '17s 7s',
  '15s 2.2s','18s 5.5s', '16s 3s',   '20s 8s',
];

// ── Helpers ────────────────────────────────────────────────────────────────
function seeded(seed: number) {
  let s = ((seed * 1664525) + 1013904223) >>> 0;
  return () => { s = ((s * 1664525) + 1013904223) >>> 0; return s / 0xffffffff; };
}

function strHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// Returns polyline `points` string. Seeded so stable across renders.
function buildTracePts(n: number, mobile = false): string {
  const W = 1000, cy = 24;
  if (n === 0) return `0,${cy} ${W},${cy}`;
  const rng    = seeded(n * 1234 + 5678);
  const maxAmp = mobile ? (n === 1 ? 6 : 12) : (n === 1 ? 12 : 24);
  const pts: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const t  = i / 100;
    const x  = t * W;
    const d1 = Math.abs(t - 0.50);
    const bw = n >= 4 ? 0.20 : 0.13;
    const e1 = d1 < bw ? Math.pow(Math.cos((d1 / bw) * (Math.PI / 2)), 1.8) : 0;
    let   e2 = 0;
    if (n >= 4) {
      const d2 = Math.abs(t - 0.72);
      e2 = d2 < 0.09 ? Math.pow(Math.cos((d2 / 0.09) * (Math.PI / 2)), 2) * 0.42 : 0;
    }
    const sig = Math.sin(t*88+0.3)*0.50 + Math.sin(t*53.7+1.8)*0.32
              + Math.sin(t*31.1+0.9)*0.18 + (rng()-0.5)*0.25;
    pts.push(`${x.toFixed(1)},${(cy - sig*(e1+e2)*maxAmp).toFixed(1)}`);
  }
  return pts.join(' ');
}

// ── Generated mark (null thumbnails) ──────────────────────────────────────
function GeneratedMark({ title }: { title: string }) {
  const rng   = seeded(strHash(title));
  const n     = 5 + Math.floor(rng() * 3);
  const nodes = Array.from({ length: n }, () => ({ x: 32 + rng() * 96, y: 18 + rng() * 54 }));
  const edges: [number,number][] = nodes.slice(0,-1).map((_,i):[number,number] => [i, i+1]);
  if (n >= 6) edges.push([0, 2 + Math.floor(rng() * (n - 3))]);
  return (
    <svg viewBox="0 0 160 90" width="100%" height="100%" aria-hidden="true" style={{ display:'block' }}>
      {edges.map(([a,b],i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y}
          x2={nodes[b].x} y2={nodes[b].y} stroke={CREAM} strokeWidth={0.8} opacity={0.25} />
      ))}
      {nodes.map((nd,i) => (
        <circle key={i} cx={nd.x} cy={nd.y} r={1.8} fill={CREAM} opacity={0.25} />
      ))}
    </svg>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────
function TxCard({ item }: { item: TxItem }) {
  const inProgress = item.status === 'in-progress';
  const Tag        = inProgress ? 'div' : 'a';

  const mediaFrame = (
    <div className="tx-frame">
      {item.thumbnail
        ? <img src={item.thumbnail} alt=""
            style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
        : <GeneratedMark title={item.title} />
      }
      {item.type === 'frequency' && !inProgress && (
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{
            width:32, height:32, borderRadius:'50%',
            border:`1px solid rgba(232,228,201,0.6)`,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <svg width={10} height={12} viewBox="0 0 10 12" aria-hidden="true">
              <polygon points="0,0 10,6 0,12" fill={CREAM} />
            </svg>
          </div>
        </div>
      )}
      <div style={{
        position:'absolute', top:10, left:10,
        background:'rgba(10,4,9,0.78)', border:`1px solid rgba(232,228,201,0.2)`,
        borderRadius:4, padding:'2px 6px',
        fontFamily:"'DM Sans',sans-serif", fontSize:9,
        textTransform:'uppercase', letterSpacing:'0.16em', color:CREAM,
      }}>
        {inProgress ? 'In Progress' : item.type === 'words' ? 'Words' : 'Frequency'}
      </div>
    </div>
  );

  const body = (
    <>
      {mediaFrame}
      <div style={{ marginTop:12 }}>
        <p style={{
          fontFamily:"'DM Sans',sans-serif", fontSize:9, textTransform:'uppercase',
          letterSpacing:'0.18em', color:MUTED, opacity:0.4, margin:'0 0 4px',
        }}>{item.topic}</p>
        <p style={{
          fontFamily:"'Sora',sans-serif", fontSize:17, color:CREAM,
          margin:'0 0 6px', lineHeight:1.25,
          display:'-webkit-box', WebkitLineClamp:2,
          WebkitBoxOrient:'vertical', overflow:'hidden',
        }}>{item.title}</p>
        <p style={{
          fontFamily:"'DM Sans',sans-serif", fontSize:12, color:MUTED, opacity:0.55,
          margin:'0 0 12px', lineHeight:1.5,
          display:'-webkit-box', WebkitLineClamp:2,
          WebkitBoxOrient:'vertical', overflow:'hidden',
        }}>{item.description}</p>
        <div style={{ height:1, background:CREAM, opacity:0.12, marginBottom:10 }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:MUTED, opacity:0.4 }}>
            {item.duration} · {item.date}
          </span>
          {!inProgress && (
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:MUTED, opacity:0.6 }}>→</span>
          )}
        </div>
      </div>
    </>
  );

  if (inProgress) {
    return (
      <div aria-disabled="true" className="tx-card-base tx-card-inprogress">{body}</div>
    );
  }
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer"
      aria-label={`${item.title}, ${item.type === 'words' ? 'article' : 'video'}`}
      className="tx-card-base tx-card-link"
    >{body}</a>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const Styles = memo(() => (
  <style>{`
    @media (prefers-reduced-motion: no-preference) {
      @keyframes sg0{0%,100%{transform:translate(0,0)}40%{transform:translate(12px,-16px)}70%{transform:translate(-14px,8px)}}
      @keyframes sg1{0%,100%{transform:translate(0,0)}35%{transform:translate(-10px,18px)}65%{transform:translate(14px,-12px)}}
      @keyframes sg2{0%,100%{transform:translate(0,0)}50%{transform:translate(18px,-10px)}}
      @keyframes sg3{0%,100%{transform:translate(0,0)}30%{transform:translate(-8px,16px)}75%{transform:translate(12px,-18px)}}
      @keyframes sg4{0%,100%{transform:translate(0,0)}45%{transform:translate(16px,12px)}80%{transform:translate(-12px,-8px)}}
      @keyframes sg5{0%,100%{transform:translate(0,0)}25%{transform:translate(-18px,-10px)}60%{transform:translate(8px,16px)}}
      @keyframes sg6{0%,100%{transform:translate(0,0)}55%{transform:translate(10px,-18px)}}
      @keyframes sg7{0%,100%{transform:translate(0,0)}40%{transform:translate(-14px,12px)}70%{transform:translate(18px,-6px)}}
      .sg0{animation:sg0 var(--sgd) ease-in-out infinite}
      .sg1{animation:sg1 var(--sgd) ease-in-out infinite}
      .sg2{animation:sg2 var(--sgd) ease-in-out infinite}
      .sg3{animation:sg3 var(--sgd) ease-in-out infinite}
      .sg4{animation:sg4 var(--sgd) ease-in-out infinite}
      .sg5{animation:sg5 var(--sgd) ease-in-out infinite}
      .sg6{animation:sg6 var(--sgd) ease-in-out infinite}
      .sg7{animation:sg7 var(--sgd) ease-in-out infinite}
      @keyframes sg-node-pulse { 0%,100%{opacity:0.4} 50%{opacity:1.0} }
      .sg-node-pulse { animation: sg-node-pulse 3s ease-in-out infinite; }
      @keyframes tx-scroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      .tx-scroll { animation: tx-scroll 10s linear infinite; }
    }
    @media (prefers-reduced-motion: reduce) {
      .sg-node-pulse { opacity: 1.0; }
    }
    @keyframes sg-z { 0%,100%{transform:scale(1)} 50%{transform:scale(1.7)} }

    /* ── Transmitted card ── */
    .tx-card-base {
      display: block;
      text-decoration: none;
      border: 1px solid rgba(232,228,201,0.15);
      border-radius: 10px;
      background: ${CARD};
      padding: 16px;
      color: inherit;
    }
    .tx-card-link {
      cursor: pointer;
      transition: border-color 250ms ${EASE}, transform 250ms ${EASE};
    }
    .tx-card-link:hover {
      border-color: rgba(232,228,201,0.35);
      transform: translateY(-2px);
    }
    .tx-card-link:hover .tx-frame {
      border-color: rgba(232,228,201,0.30);
    }
    .tx-card-link:focus-visible {
      outline: 1px solid rgba(232,228,201,0.6);
      outline-offset: 2px;
      border-radius: 10px;
    }
    .tx-card-inprogress {
      opacity: 0.5;
      cursor: default;
    }
    .tx-frame {
      border: 1px solid rgba(232,228,201,0.15);
      border-radius: 6px;
      overflow: hidden;
      aspect-ratio: 16 / 9;
      position: relative;
      background: ${BG};
      transition: border-color 250ms ${EASE};
    }

    /* ── Grid ── */
    .tx-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      transition: opacity 150ms ease;
    }
    @media (max-width: 1100px) { .tx-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 900px)  { .tx-grid { grid-template-columns: 1fr; } }

    /* ── Filter buttons ── */
    .tx-filter {
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      background: none;
      border: none;
      color: ${MUTED};
      padding: 0;
      cursor: pointer;
      transition: opacity 150ms ease;
    }
    .tx-filter[aria-pressed="false"]       { opacity: 0.4; }
    .tx-filter[aria-pressed="true"]        { opacity: 1.0; }
    .tx-filter[aria-pressed="false"]:hover { opacity: 0.7; }
    .tx-filter:focus-visible {
      outline: 1px solid rgba(232,228,201,0.6);
      outline-offset: 3px;
      border-radius: 2px;
    }
  `}</style>
));
Styles.displayName = 'SignalsStyles';

// ── Main component ─────────────────────────────────────────────────────────
export default function SignalsSection() {
  const [hov, setHov]           = useState<string|null>(null);
  const [filter, setFilter]     = useState<Filter>('all');
  const [gridOp, setGridOp]     = useState(1);

  const source     = PREVIEW_MODE ? SAMPLE_ITEMS : ITEMS;
  const published  = source.filter(x => x.status === 'published');
  const inProgress = source.filter(x => x.status === 'in-progress').slice(0, 1);
  const hasItems   = source.length > 0;

  const sorted = [
    ...published.sort((a, b) => (b.date > a.date ? 1 : -1)),
    ...inProgress,
  ];

  const visible = sorted.filter(x =>
    filter === 'all' || x.type === filter || x.status === 'in-progress'
  );

  const changeFilter = (f: Filter) => {
    if (f === filter) return;
    setGridOp(0);
    setTimeout(() => { setFilter(f); setGridOp(1); }, 150);
  };

  const tracePts = buildTracePts(published.length);
  const tracePts2 = tracePts.split(' ').map(pt => {
    const [x, y] = pt.split(',');
    return `${(parseFloat(x) + 1000).toFixed(1)},${y}`;
  }).join(' ');

  return (
    <section style={{ position:'relative', background:'transparent', overflow:'visible' }}>
      <Styles />

      <div className="section" style={{ paddingBlock:'120px 80px' }}>

        {/* ── HALF 1: RECEIVED — do not modify ── */}
        <p style={{
          fontFamily:"'DM Sans',sans-serif", fontSize:'11px', letterSpacing:'0.22em',
          textTransform:'uppercase', color:MUTED, opacity:0.35, margin:'0 0 4px',
        }}>Received</p>

        <div style={{ position:'relative', width:'100%' }}>
          <svg viewBox="0 0 1200 300" width="100%"
            style={{ display:'block', overflow:'visible' }}
            aria-label="Influential thinkers as stars"
            role="group"
          >
            {STARS.map((s, i) => {
              const r      = TIER_R[s.tier];
              const baseOp = TIER_OP[s.tier];
              const active = hov === s.id;
              const dimmed = hov && !active;
              const starOp = dimmed ? 0.15 : (active ? 1.0 : baseOp);
              const nOp    = dimmed ? 0.1  : (active ? 0.9  : 0.6);
              const glow   = active
                ? `drop-shadow(0 0 ${r*3}px rgba(232,228,201,0.85))`
                : s.tier === 1 ? 'drop-shadow(0 0 4px rgba(232,228,201,0.35))' : 'none';
              const [dur, delay] = DRIFTS[i].split(' ');
              const flip   = s.flip || s.x > 900;
              const nx     = flip ? s.x - r - 10 : s.x + r + 10;
              const anchor = flip ? 'end' : 'start';
              return (
                <g key={s.id}
                  className={`sg${i}`}
                  style={{ ['--sgd' as string]: dur, animationDelay: delay } as React.CSSProperties}
                >
                  <circle cx={s.x} cy={s.y} r={22} fill="transparent"
                    role="button" tabIndex={0}
                    aria-label={`${s.name}, influence`}
                    style={{ cursor:'pointer', pointerEvents:'all', outline:'none' }}
                    onMouseEnter={() => setHov(s.id)}
                    onMouseLeave={() => setHov(null)}
                    onFocus={() => setHov(s.id)}
                    onBlur={() => setHov(null)}
                  />
                  <circle cx={s.x} cy={s.y} r={r} fill={CREAM}
                    style={{
                      opacity: starOp, filter: glow, pointerEvents:'none',
                      transition:`opacity 350ms ${EASE}, filter 350ms ${EASE}`,
                      animation:`sg-z ${3.2+i*0.5}s ${i*0.6}s ease-in-out infinite`,
                      transformBox:'fill-box', transformOrigin:'center',
                    }} />
                  <text x={nx} y={s.y+3.5} textAnchor={anchor}
                    fill={MUTED} fontSize={TIER_FS[s.tier]} fontFamily="'DM Sans',sans-serif"
                    letterSpacing="2.1" fontWeight="500" aria-hidden="true"
                    style={{ textTransform:'uppercase', pointerEvents:'none',
                      opacity:nOp, transition:`opacity 350ms ${EASE}` }}>
                    {s.name.toUpperCase()}
                  </text>
                  <text x={nx} y={s.y+17} textAnchor={anchor}
                    fill={MUTED} fontSize="9" fontFamily="'DM Sans',sans-serif"
                    fontWeight="400" aria-hidden="true"
                    style={{ opacity:active?0.72:0, pointerEvents:'none',
                      transition:`opacity 350ms ${EASE}` }}>
                    {s.lesson}
                  </text>
                  {s.credit && (
                    <text x={nx} y={s.y+30} textAnchor={anchor}
                      fill={MUTED} fontSize="7" fontFamily="'DM Sans',sans-serif"
                      letterSpacing="0.8" fontWeight="400" aria-hidden="true"
                      style={{ opacity:active?0.3:0, pointerEvents:'none',
                        transition:`opacity 350ms ${EASE}` }}>
                      {s.credit}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Waveform — divider between Received and Transmitted */}
        <div style={{ margin:'32px 0', overflow:'hidden' }} aria-hidden="true">
          <svg width="200%" height="48" viewBox="0 0 2000 48"
            preserveAspectRatio="none" aria-hidden="true"
            className="tx-scroll">
            <polyline
              points={`${tracePts} ${tracePts2}`}
              fill="none" stroke={CREAM} strokeWidth={1}
              strokeLinecap="round" strokeLinejoin="round" opacity={0.5}
            />
            <circle cx={500} cy={24} r={3} fill={CREAM} className="sg-node-pulse" />
            <circle cx={1500} cy={24} r={3} fill={CREAM} className="sg-node-pulse" />
          </svg>
        </div>

        {/* ── HALF 2: TRANSMITTED ── */}
        <p style={{
          fontFamily:"'DM Sans',sans-serif", fontSize:'11px', letterSpacing:'0.22em',
          textTransform:'uppercase', color:MUTED, opacity:0.35, margin:'0 0 0',
        }}>Transmitted</p>

        {/* Filter — hidden when no items */}
        {hasItems && (
          <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:32 }}>
            {(['all','words','frequency'] as Filter[]).map((f, i) => (
              <React.Fragment key={f}>
                {i > 0 && (
                  <span style={{
                    fontFamily:"'DM Sans',sans-serif", fontSize:11,
                    color:MUTED, opacity:0.2, userSelect:'none',
                  }}>·</span>
                )}
                <button
                  className="tx-filter"
                  aria-pressed={filter === f ? 'true' : 'false'}
                  onClick={() => changeFilter(f)}
                >
                  {f === 'all' ? 'All' : f === 'words' ? 'Words' : 'Frequencies'}
                </button>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!hasItems && (
          <p style={{
            fontFamily:"'DM Sans',sans-serif", fontSize:13,
            color:MUTED, opacity:0.4, textAlign:'center',
            margin:'24px 0 0', letterSpacing:'0.04em',
          }}>nothing transmitted yet</p>
        )}

        {/* Grid — 80px below waveform, shown only when items exist */}
        {hasItems && (
          <div
            className="tx-grid"
            style={{ marginTop:80, opacity:gridOp }}
            aria-live="polite"
            aria-label="Transmitted work"
          >
            {visible.map(item => <TxCard key={item.id} item={item} />)}
          </div>
        )}

      </div>
    </section>
  );
}
