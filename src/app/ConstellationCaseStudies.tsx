import React, { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionRail } from './DesignerMind';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const SKY_W = 1400;
const SKY_H = 430;

type Pt   = { dx: number; dy: number };
type Edge = [number, number];

interface ConsDef {
  id: string; number: string; name: string; category: string; timeline: string;
  cx: number; cy: number;
  nodes: Pt[]; edges: Edge[];
  driftKf: string; driftDur: string; driftDelay: string;
}

// Deliberately irregular shapes — no symmetry, no equal spacing
const CONS: ConsDef[] = [
  {
    id: 'margdarshak', number: '01', name: 'Margdarshak', category: 'Civic UX', timeline: 'Jan 2026',
    cx: 200, cy: 200,
    nodes: [
      { dx: -40, dy: -18 }, { dx: 2,  dy: -52 }, { dx: 38, dy: -6 },
      { dx: 28,  dy: 32  }, { dx: -8, dy: 50  }, { dx: -55, dy: 14 },
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[2,4]],
    driftKf: 'cs-drift-0', driftDur: '14s', driftDelay: '0s',
  },
  {
    id: 'murmur', number: '02', name: 'Murmur', category: 'Healthcare', timeline: 'June 2026',
    cx: 540, cy: 125,
    nodes: [
      { dx: -18, dy: -36 }, { dx: 26, dy: -24 }, { dx: 44, dy: 14 },
      { dx:  -4, dy: 40  }, { dx: -42, dy:  8 },
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,0],[1,3]],
    driftKf: 'cs-drift-1', driftDur: '12s', driftDelay: '4s',
  },
  {
    id: 'behive', number: '03', name: 'Behive', category: 'Coming Soon', timeline: 'July 2026',
    cx: 1200, cy: 110,
    nodes: [
      { dx: -20, dy: -44 }, { dx: 28, dy: -32 }, { dx: 48, dy: 8 },
      { dx: 16,  dy: 44  }, { dx: -38, dy: 20  },
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,0],[0,2]],
    driftKf: 'cs-drift-3', driftDur: '18s', driftDelay: '2s',
  },
];

function elen(nodes: Pt[], [i, j]: Edge): number {
  const dx = nodes[j].dx - nodes[i].dx;
  const dy = nodes[j].dy - nodes[i].dy;
  return Math.sqrt(dx * dx + dy * dy);
}

function hitBounds(c: ConsDef, pad = 28) {
  const xs = c.nodes.map(n => c.cx + n.dx);
  const ys = c.nodes.map(n => c.cy + n.dy);
  return {
    x: Math.min(...xs) - pad,
    y: Math.min(...ys) - pad,
    w: Math.max(...xs) - Math.min(...xs) + pad * 2,
    h: Math.max(...ys) - Math.min(...ys) + pad * 2,
  };
}

// ─── Styles ────────────────────────────────────────────────────────────────

const Styles = memo(() => (
  <style>{`
    @media (prefers-reduced-motion: no-preference) {
      @keyframes cs-drift-0 {
        0%,100%{transform:translate(0,0)} 30%{transform:translate(2px,-4px)} 65%{transform:translate(-3px,2px)}
      }
      @keyframes cs-drift-1 {
        0%,100%{transform:translate(0,0)} 40%{transform:translate(-2px,3px)} 75%{transform:translate(3px,-3px)}
      }
      @keyframes cs-drift-2 {
        0%,100%{transform:translate(0,0)} 25%{transform:translate(3px,2px)} 60%{transform:translate(-2px,-3px)}
      }
      @keyframes cs-drift-3 {
        0%,100%{transform:translate(0,0)} 35%{transform:translate(-3px,2px)} 70%{transform:translate(2px,-2px)}
      }
      .cs-g0{animation:cs-drift-0 14s ease-in-out infinite 0s}
      .cs-g1{animation:cs-drift-1 12s ease-in-out infinite 4s}
      .cs-g2{animation:cs-drift-2 16s ease-in-out infinite 7s}
      .cs-g3{animation:cs-drift-3 18s ease-in-out infinite 2s}
    }
    @keyframes cs-line-draw {
      from { stroke-dashoffset: var(--ll); }
      to   { stroke-dashoffset: 0; }
    }
    .cs-cons { transition: opacity 400ms ${EASE}; }
    .cs-cons, .cs-cons:focus, .cs-cons:focus-visible { outline: none; }
    .cs-line { transition: opacity 400ms ${EASE}; }
    .cs-node { transition: opacity 400ms ${EASE}; }
    .cs-label { transition: opacity 400ms ${EASE}; pointer-events: none; }

    @media (min-width: 901px) { .cs-plates { display: none !important; } }
    @media (max-width: 900px) {
      .cs-sky-wrap { display: none !important; }
      .cs-desktop-panel { display: none !important; }
      .cs-plates { display: flex !important; }
    }
  `}</style>
));
Styles.displayName = 'ConstellationStyles';

// ─── Types ─────────────────────────────────────────────────────────────────

interface StarItem {
  label: string;
  text: string | null;
  metrics?: { value: string; label: string }[];
}

interface CsData {
  situation: string;
  task: string;
  actionTitle: string;
  result: string;
  metrics: { value: string; label: string }[];
}

interface Props {
  caseStudiesData: CsData[];
  murmurBannerUrl: string;
  onMargdarshakOpen: () => void;
  onMurmurOpen: () => void;
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function ConstellationCaseStudies({
  caseStudiesData, murmurBannerUrl, onMargdarshakOpen, onMurmurOpen,
}: Props) {
  const [focused,  setFocused]  = useState(0);
  const [hovered,  setHovered]  = useState<number | null>(null);
  // incrementing key per constellation forces line <g> remount → CSS animation replays
  const [lineKeys, setLineKeys] = useState([0, 0, 0, 0]);

  const bumpLines = useCallback((i: number) =>
    setLineKeys(prev => prev.map((k, j) => j === i ? k + 1 : k)), []);

  const activate = useCallback((i: number) => {
    if (i === focused) return;
    setFocused(i);
    bumpLines(i);
  }, [focused, bumpLines]);

  const onEnter = useCallback((i: number) => {
    setHovered(i);
    if (i !== focused) bumpLines(i);
  }, [focused, bumpLines]);

  const onLeave = useCallback(() => setHovered(null), []);

  const onKey = useCallback((e: React.KeyboardEvent, i: number) => {
    if (e.key === 'Enter' || e.key === ' ')   { e.preventDefault(); activate(i); }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); activate((i + 1) % 3); }
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); activate((i + 2) % 3); }
  }, [activate]);

  // Opacity helpers — no filter:blur, just opacity
  const gOpacity   = (i: number) => (i === focused || i === hovered) ? 1 : 0.55;
  const nOpacity   = (i: number) => i === focused ? 1 : i === hovered ? 0.8 : 0.55;
  const lnOpacity  = (i: number) => i === focused ? 0.6 : i === hovered ? 0.6 : 0.3;
  const isActive   = (i: number) => i === focused || i === hovered;

  // ─── Per-project data ────────────────────────────────────────────────────

  const stars: StarItem[][] = [
    [
      { label: 'Situation', text: caseStudiesData[0].situation },
      { label: 'Task',      text: caseStudiesData[0].task },
      { label: 'Action',   text: caseStudiesData[0].actionTitle },
      { label: 'Result',   text: null, metrics: caseStudiesData[0].metrics.slice(0, 3) },
    ],
    [
      { label: 'Situation', text: caseStudiesData[1].situation },
      { label: 'Task',      text: caseStudiesData[1].task },
      { label: 'Action',   text: caseStudiesData[1].actionTitle },
      { label: 'Result',   text: caseStudiesData[1].result.replace(/\n+/g, ' ') },
    ],
    [
      { label: 'Situation', text: 'Coming soon' },
      { label: 'Task',      text: 'Coming soon' },
      { label: 'Action',   text: 'Coming soon' },
      { label: 'Result',   text: 'Coming soon' },
    ],
  ];

  const descs = [
    'Bridging welfare schemes and the families they\'re meant to serve',
    'AI-powered postpartum couples platform that reads maternal distress signals and translates them into one actionable daily nudge for the partner',
    'Coming soon',
  ];

  function renderArtwork(idx: number) {
    if (idx === 0) return (
      <img
        src="https://img.youtube.com/vi/oaA4V-_D63A/maxresdefault.jpg"
        alt="Margdarshak"
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }}
      />
    );
    if (idx === 1) return (
      <img
        src={murmurBannerUrl}
        alt="Murmur"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    );
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', background: 'linear-gradient(155deg,#160828 0%,#261045 55%,#190830 100%)' }}>
        <svg style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
          width="110" height="84" viewBox="0 0 90 70" fill="none" opacity="0.28">
          <circle cx="45" cy="32" r="18" stroke="#E8E4C9" strokeWidth="1.4"/>
          <circle cx="45" cy="32" r="4" fill="#E8E4C9"/>
          <path d="M45 14 L47 21 L45 19 L43 21 Z" fill="#E8E4C9" opacity="0.7"/>
          <circle cx="68" cy="20" r="5.5" stroke="#E8E4C9" strokeWidth="1.2"/>
          <circle cx="20" cy="52" r="4.5" stroke="#E8E4C9" strokeWidth="1.2"/>
          <circle cx="70" cy="54" r="3.5" stroke="#E8E4C9" strokeWidth="1.2"/>
          <line x1="45" y1="32" x2="68" y2="20" stroke="#E8E4C9" strokeWidth="0.7" opacity="0.35"/>
          <line x1="45" y1="32" x2="20" y2="52" stroke="#E8E4C9" strokeWidth="0.7" opacity="0.35"/>
        </svg>
      </div>
    );
  }

  function renderCta(idx: number) {
    if (idx === 0) return (
      <>
        <button
          style={{ flex: 1, background: 'linear-gradient(90deg,rgba(250,255,199,0.92),rgba(250,255,199,0.72))', color: '#0a0a0a', fontFamily: "'DM Sans',sans-serif", fontSize: '13px', fontWeight: 600, padding: '11px 18px', borderRadius: '9999px', border: 'none', cursor: 'pointer' }}
          onClick={onMargdarshakOpen}
        >
          See how I did it →
        </button>
        <a
          href="https://www.figma.com/proto/oKryn0vKJGZ8oZw63x1drX/Margdarshak?node-id=2285-32311&p=f&t=08OH4pGyXfe9PhPq-1&scaling=scale-down&content-scaling=fixed&page-id=1972%3A1741&starting-point-node-id=2285%3A32298&show-proto-sidebar=1"
          target="_blank" rel="noopener noreferrer"
          style={{ flexShrink: 0, color: '#E8E4C9', fontSize: '13px', fontWeight: 500, padding: '11px 16px', borderRadius: '9999px', border: '1px solid rgba(232,228,201,0.25)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}
        >
          Prototype&nbsp;
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
            <path d="M1 5.5H10M10 5.5L6.5 2M10 5.5L6.5 9" stroke="#E8E4C9" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </>
    );
    if (idx === 1) return (
      <button
        style={{ flex: 1, background: 'linear-gradient(90deg,rgba(250,255,199,0.92),rgba(250,255,199,0.72))', color: '#0a0a0a', fontFamily: "'DM Sans',sans-serif", fontSize: '13px', fontWeight: 600, padding: '11px 18px', borderRadius: '9999px', border: 'none', cursor: 'pointer' }}
        onClick={onMurmurOpen}
      >
        See how I did it →
      </button>
    );
    return (
      <span style={{ flex: 1, fontFamily: "'DM Sans',sans-serif", fontSize: '12px', padding: '10px 16px', borderRadius: '9999px', border: '1px solid rgba(232,228,201,0.12)', color: 'rgba(232,228,201,0.28)', background: 'rgba(232,228,201,0.02)', textAlign: 'center', letterSpacing: '0.06em' }}>
        Case Study Coming Soon
      </span>
    );
  }

  const proj = CONS[focused];

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <section
      id="work"
      style={{ position: 'relative', background: 'transparent', zIndex: 10, overflow: 'visible', minHeight: '600px' }}
    >
      <Styles />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Heading ── */}
        <div className="section" style={{ paddingBlock: '120px 0' }}>
          <h2 style={{
            fontFamily: "'Sora',sans-serif", fontWeight: 300,
            fontSize: '28px', color: '#C9C4B8',
            letterSpacing: '0.22em', opacity: 0.35,
            textAlign: 'center', lineHeight: 1.08, margin: 0,
          }}>
            What I Made
          </h2>
        </div>

        {/* ── Constellation sky ── */}
        <div className="cs-sky-wrap" style={{ width: '100%', overflow: 'visible' }}>
          <svg
            viewBox={`0 0 ${SKY_W} ${SKY_H}`}
            width="100%"
            style={{ display: 'block', overflow: 'visible' }}
            role="group"
            aria-label="Select a case study by focusing a constellation"
          >
            {/* Inter-constellation bridge lines */}
            <g aria-hidden="true" style={{ pointerEvents: 'none' }}>
              <line x1={200} y1={200} x2={540} y2={125}
                stroke="#E8E4C9" strokeWidth={0.8} strokeDasharray="5 8" opacity={0.3} />
              <line x1={540} y1={125} x2={880} y2={255}
                stroke="#E8E4C9" strokeWidth={0.8} strokeDasharray="5 8" opacity={0.3} />
              <line x1={880} y1={255} x2={1200} y2={110}
                stroke="#E8E4C9" strokeWidth={0.8} strokeDasharray="5 8" opacity={0.3} />
            </g>

            {CONS.map((c, i) => {
              const b    = hitBounds(c);
              const act  = isActive(i);
              const lk   = lineKeys[i];
              const maxDy = Math.max(...c.nodes.map(n => n.dy));

              return (
                <g
                  key={c.id}
                  className={`cs-cons cs-g${i}`}
                  style={{ opacity: gOpacity(i), outline: 'none' }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${c.name}, ${c.category} case study`}
                  aria-pressed={focused === i}
                  onMouseEnter={() => onEnter(i)}
                  onMouseLeave={onLeave}
                  onClick={() => activate(i)}
                  onKeyDown={e => onKey(e, i)}
                >
                  {/* Invisible hit area — guarantees ≥ 44px tap target */}
                  <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="transparent" style={{ cursor: 'pointer', outline: 'none' }} />

{/* Lines — remount via key to replay draw animation */}
                  <g key={lk} aria-hidden="true">
                    {c.edges.map(([si, ti], ei) => {
                      const len = elen(c.nodes, [si, ti]);
                      return (
                        <line
                          key={ei}
                          x1={c.cx + c.nodes[si].dx} y1={c.cy + c.nodes[si].dy}
                          x2={c.cx + c.nodes[ti].dx} y2={c.cy + c.nodes[ti].dy}
                          stroke="#E8E4C9"
                          strokeWidth={1}
                          {...(act ? { strokeDasharray: len, strokeDashoffset: len } : {})}
                          className="cs-line"
                          style={{
                            opacity: lnOpacity(i),
                            ...(act ? {
                              animation: `cs-line-draw 500ms ${EASE} forwards`,
                            } : {}),
                            ['--ll' as string]: `${len}`,
                          } as React.CSSProperties}
                        />
                      );
                    })}
                  </g>

                  {/* Nodes */}
                  {c.nodes.map((n, ni) => (
                    <circle
                      key={ni}
                      cx={c.cx + n.dx} cy={c.cy + n.dy}
                      r={ni === 0 ? 3.5 : 2.5}
                      fill="#E8E4C9"
                      className="cs-node"
                      aria-hidden="true"
                      style={{
                        opacity: nOpacity(i),
                        filter: (act && ni === 0)
                          ? 'drop-shadow(0 0 6px rgba(232,228,201,0.75))'
                          : 'none',
                        transition: `opacity 400ms ${EASE}, filter 400ms ${EASE}`,
                      }}
                    />
                  ))}

                  {/* Name — always visible */}
                  <text
                    x={c.cx} y={c.cy + maxDy + 22}
                    textAnchor="middle" fill="#E8E4C9"
                    fontSize="9" fontFamily="'DM Sans',sans-serif"
                    letterSpacing="2.6" fontWeight="500"
                    aria-hidden="true"
                    style={{ opacity: act ? 1 : 0.65, textTransform: 'uppercase', pointerEvents: 'none' }}
                  >
                    {c.name.toUpperCase()}
                  </text>
                  {/* Timeline */}
                  <text
                    x={c.cx} y={c.cy + maxDy + 36}
                    textAnchor="middle" fill="#E8E4C9"
                    fontSize="7.5" fontFamily="'DM Sans',sans-serif"
                    letterSpacing="1.2" fontWeight="400"
                    aria-hidden="true"
                    style={{ opacity: act ? 0.5 : 0.3, pointerEvents: 'none' }}
                  >
                    {c.timeline}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* ── Detail panel (desktop) ── */}
        <div
          className="cs-desktop-panel section"
          style={{ paddingBlock: '0px 80px' }}
          aria-live="polite"
          aria-atomic="true"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={focused}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 360px',
                gap: '44px',
                alignItems: 'start',
                background: 'rgba(8,8,8,0.88)',
                border: '1px solid rgba(232,228,201,0.15)',
                borderRadius: '20px',
                padding: '40px 44px',
              }}
            >
              {/* Left: text content */}
              <div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '10px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(232,228,201,0.4)', margin: '0 0 10px 0' }}>
                  {proj.number} — {proj.category}
                </p>
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(26px,3vw,40px)', fontWeight: 500, color: '#E8E4C9', margin: '0 0 8px 0', lineHeight: 1.05 }}>
                  {proj.name}
                </h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '13px', color: 'rgba(232,228,201,0.5)', margin: '0 0 26px 0', lineHeight: 1.55 }}>
                  {descs[focused]}
                </p>

                <ul style={{ listStyle: 'none', margin: '0 0 26px 0', padding: 0, display: 'flex', flexDirection: 'column', gap: '13px' }}>
                  {stars[focused].map((s, si) => (
                    <li key={si} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '12px', color: 'rgba(232,228,201,0.6)', lineHeight: 1.6 }}>
                      <span style={{ color: '#E8E4C9', opacity: 0.45, flexShrink: 0, marginTop: '2px', fontSize: '9px' }}>✦</span>
                      <div style={{ minWidth: 0 }}>
                        <strong style={{ display: 'block', fontSize: '8px', letterSpacing: '1.1px', textTransform: 'uppercase', color: 'rgba(232,228,201,0.32)', marginBottom: '3px' }}>
                          {s.label}
                        </strong>
                        {s.text !== null ? (
                          <span>{s.text}</span>
                        ) : (
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '3px' }}>
                            {s.metrics!.map((m, mi) => (
                              <div key={mi} style={{ background: 'rgba(232,228,201,0.04)', border: '1px solid rgba(232,228,201,0.12)', borderRadius: '6px', padding: '4px 9px' }}>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: '#E8E4C9', lineHeight: 1 }}>{m.value}</div>
                                <div style={{ fontSize: '7px', textTransform: 'uppercase', color: 'rgba(232,228,201,0.3)', marginTop: '2px', letterSpacing: '0.08em' }}>{m.label}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {renderCta(focused)}
                </div>
              </div>

              {/* Right: framed artwork — dark frame, cream border, never full-bleed */}
              <div style={{
                border: '1px solid rgba(232,228,201,0.18)',
                borderRadius: '14px',
                background: '#060606',
                overflow: 'hidden',
                aspectRatio: '4 / 3',
                position: 'relative',
                flexShrink: 0,
                alignSelf: 'center',
              }}>
                {renderArtwork(focused)}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Mobile stacked plates (< 900px) ── */}
        <div
          className="cs-plates section"
          style={{ display: 'none', flexDirection: 'column', gap: '24px', paddingBlock: '60px 80px' }}
        >
          {CONS.map((c, i) => (
            <div key={c.id} style={{ border: '1px solid rgba(232,228,201,0.15)', borderRadius: '16px', overflow: 'hidden', background: 'rgba(8,8,8,0.85)' }}>
              {/* Framed artwork */}
              <div style={{ margin: '12px', border: '1px solid rgba(232,228,201,0.12)', borderRadius: '10px', background: '#060606', overflow: 'hidden', aspectRatio: '16 / 9', position: 'relative' }}>
                {renderArtwork(i)}
              </div>
              {/* Text */}
              <div style={{ padding: '16px 20px 24px' }}>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(232,228,201,0.38)', margin: '0 0 8px 0' }}>
                  {c.number} — {c.category}
                </p>
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: '24px', fontWeight: 500, color: '#E8E4C9', margin: '0 0 6px 0', lineHeight: 1.1 }}>{c.name}</h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '13px', color: 'rgba(232,228,201,0.48)', margin: '0 0 18px 0', lineHeight: 1.5 }}>{descs[i]}</p>
                <ul style={{ listStyle: 'none', margin: '0 0 18px 0', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {stars[i].map((s, si) => (
                    <li key={si} style={{ display: 'flex', gap: '9px', fontSize: '12px', color: 'rgba(232,228,201,0.58)', lineHeight: 1.55 }}>
                      <span style={{ color: '#E8E4C9', opacity: 0.38, flexShrink: 0, fontSize: '9px', marginTop: '2px' }}>✦</span>
                      <div>
                        <strong style={{ display: 'block', fontSize: '8px', letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(232,228,201,0.3)', marginBottom: '2px' }}>{s.label}</strong>
                        {s.text !== null ? <span>{s.text}</span> : (
                          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '2px' }}>
                            {s.metrics?.map((m, mi) => (
                              <div key={mi} style={{ background: 'rgba(232,228,201,0.04)', border: '1px solid rgba(232,228,201,0.1)', borderRadius: '5px', padding: '3px 7px' }}>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: '#E8E4C9' }}>{m.value}</div>
                                <div style={{ fontSize: '7px', textTransform: 'uppercase', color: 'rgba(232,228,201,0.3)' }}>{m.label}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>{renderCta(i)}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
