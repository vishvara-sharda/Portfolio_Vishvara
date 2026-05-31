import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, Lightbulb, Search, Zap, User, TrendingUp, AlertCircle, RotateCw, CheckCircle, XCircle, Star, Unlock, Sparkles, MoveRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import FavoriteLogo from '../imports/Margdarshak/Margdarshak Logo.svg';
import margdarshakHome from '../imports/Margdarshak/Home.jpg';
import margdarshakSchemes from '../imports/Margdarshak/all Schemes.jpg';
import margdarshakGuides from '../imports/Margdarshak/Guides.jpg';
import margdarshakPersona from '../imports/Margdarshak/User Persona.jpg';
import homeFrame from '../imports/Margdarshak/home frame.png';
import schemesFrame from '../imports/Margdarshak/schemes frame.png';
import guideFrame from '../imports/Margdarshak/guide frame.png';
import secretWireframes from '../imports/Margdarshak/Secret folder/wireframes.jpeg';
import secretDesignSystem from '../imports/Margdarshak/Secret folder/design system.jpeg';
import secretPeople from '../imports/Margdarshak/Secret folder/people.jpeg';
import secretIA from '../imports/Margdarshak/Secret folder/IA.jpeg';
import secretAskingHelp1 from '../imports/Margdarshak/Secret folder/asking help1.jpeg';
import secretAskingHelp2 from '../imports/Margdarshak/Secret folder/asking help 2.jpeg';

interface CaseStudyPageProps {
  project: {
    title: string;
    tools?: string[];
    situation: string;
    task: string;
    actions?: string[];
    metrics?: { value: string; label: string }[];
    result?: string;
    images?: any[];
    deliverables?: string[];
  };
  onClose: (scrollTo?: string) => void;
}

const heroPhones = [
  { src: margdarshakHome, alt: 'Home Screen' },
  { src: margdarshakSchemes, alt: 'Schemes Screen' },
  { src: margdarshakGuides, alt: 'Guides Screen' },
];

const FlipCard = ({ card }: { card: {title: string, text: string, image?: string, images?: string[]} }) => {
  const [developed, setDeveloped] = useState(false);

  return (
    <div
      className="aspect-[4/3] relative overflow-hidden rounded-2xl cursor-pointer"
      style={{
        border: '1px solid #1a1a1a',
        boxShadow: developed
          ? '0 0 40px rgba(242,167,196,0.12), 0 8px 40px rgba(0,0,0,0.7)'
          : '0 4px 20px rgba(0,0,0,0.6)',
        transition: 'box-shadow 1.4s ease',
      }}
      onMouseEnter={() => setDeveloped(true)}
      onMouseLeave={() => setDeveloped(false)}
    >
      {/* Image — filtered until developed */}
      <div
        className="absolute inset-0"
        style={{
          filter: developed
            ? 'grayscale(0%) brightness(1) blur(0px) saturate(1.1)'
            : 'grayscale(100%) brightness(0.18) blur(5px)',
          transform: developed ? 'scale(1.03)' : 'scale(1)',
          transition: 'filter 1.5s cubic-bezier(0.25,1,0.5,1), transform 1.5s cubic-bezier(0.25,1,0.5,1)',
        }}
      >
        {card.images ? (
          <div className="w-full h-full flex flex-col">
            <div className="flex-1 overflow-hidden flex items-center justify-center bg-[#e8e8ea]">
              <img src={card.images[0]} alt="" style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', display:'block' }} />
            </div>
            <div className="h-px flex-shrink-0 bg-[#ccc]" />
            <div className="flex-1 overflow-hidden flex items-center justify-center bg-[#e8e8ea]">
              <img src={card.images[1]} alt="" style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', display:'block' }} />
            </div>
          </div>
        ) : card.image ? (
          <img src={card.image} alt="" className="w-full h-full object-cover object-center" />
        ) : (
          <div className="w-full h-full bg-[#080808]" />
        )}
      </div>

      {/* Grain noise — visible when undeveloped */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          opacity: developed ? 0 : 0.55,
          transition: 'opacity 1.2s ease',
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          mixBlendMode: 'overlay',
        }}
      />

      {/* Dark veil — lifts as it develops */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'rgba(0,0,0,0.62)',
          opacity: developed ? 0 : 1,
          transition: 'opacity 1.5s ease',
        }}
      />

      {/* Scan line — sweeps once on develop */}
      <div
        className="absolute left-0 right-0 z-20 pointer-events-none"
        style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(242,167,196,0.7), transparent)',
          top: developed ? '110%' : '-10%',
          transition: developed ? 'top 1s ease' : 'none',
          boxShadow: '0 0 12px rgba(242,167,196,0.5)',
        }}
      />

      {/* Text — emerges after image clears */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30 px-4 py-4"
        style={{
          opacity: developed ? 1 : 0,
          transform: developed ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.6s ease 0.8s, transform 0.6s ease 0.8s',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          background: 'rgba(0,0,0,0.55)',
        }}
      >
        <span className="text-[9px] uppercase tracking-[0.22em] text-[#F2A7C4]/65 font-mono block mb-1.5">{card.title}</span>
        <p className="text-[11px] text-white/80 leading-relaxed">{card.text}</p>
      </div>
    </div>
  );
}

// ── Secret Level ─────────────────────────────────────────────────────────────

const SECRET_GRAIN_BG = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='sl-n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23sl-n)'/%3E%3C/svg%3E\")";

interface SecretCardProps {
  fileLabel: string;
  title: string;
  subtitle: string;
  dataReadout: string[];
  image?: string;
  images?: [string, string];
}

function SecretLevelCard({ fileLabel, title, subtitle, dataReadout, image, images }: SecretCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [developed, setDeveloped] = useState(false);
  const [redOn, setRedOn] = useState(false);
  const [yellowOn, setYellowOn] = useState(false);
  const [pinkOn, setPinkOn] = useState(false);
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [showTitle, setShowTitle] = useState(false);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const twTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const tapActive = useRef(false);
  const reducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const clearAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (twTimer.current) { clearTimeout(twTimer.current); twTimer.current = null; }
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  };

  const typeLines = (lines: string[]) => {
    let li = 0, ci = 0;
    const built: string[] = [];
    const tick = () => {
      if (li >= lines.length) return;
      const line = lines[li];
      if (ci === 0) built.push('');
      if (ci < line.length) {
        built[li] = line.slice(0, ci + 1);
        ci++;
        setTypedLines([...built]);
        twTimer.current = setTimeout(tick, 15);
      } else {
        li++; ci = 0;
        twTimer.current = setTimeout(tick, 0);
      }
    };
    twTimer.current = setTimeout(tick, 0);
  };

  const enter = () => {
    clearAll();
    setIsHovered(true);

    if (reducedMotion.current) {
      setDeveloped(true);
      timers.current.push(setTimeout(() => typeLines(dataReadout), 50));
      timers.current.push(setTimeout(() => setShowTitle(true), 100));
      return;
    }

    if (scanRef.current) {
      const el = scanRef.current;
      el.style.transition = 'none';
      el.style.top = '0px';
      el.style.opacity = '1';
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          el.style.transition = 'top 600ms ease-in';
          el.style.top = '102%';
          timers.current.push(setTimeout(() => { el.style.opacity = '0'; }, 480));
        });
      });
    }

    const sched = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };
    sched(() => setDeveloped(true), 300);
    sched(() => setRedOn(true), 300);
    sched(() => setRedOn(false), 700);
    sched(() => setYellowOn(true), 500);
    sched(() => setYellowOn(false), 900);
    sched(() => setPinkOn(true), 700);
    sched(() => setPinkOn(false), 1100);
    sched(() => typeLines(dataReadout), 800);
    sched(() => setShowTitle(true), 1000);
  };

  const leave = () => {
    clearAll();
    setIsHovered(false);
    setDeveloped(false);
    setRedOn(false);
    setYellowOn(false);
    setPinkOn(false);
    setTypedLines([]);
    setShowTitle(false);
    if (scanRef.current) {
      const el = scanRef.current;
      el.style.transition = 'none';
      el.style.top = '0px';
      el.style.opacity = '0';
    }
  };

  const handleTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!tapActive.current) { tapActive.current = true; enter(); }
    else { tapActive.current = false; leave(); }
  };

  const noT = 'none';

  return (
    <div
      style={{ position: 'relative', overflow: 'hidden', borderRadius: 14, aspectRatio: '4/3', cursor: 'pointer' }}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onTouchStart={handleTouch}
    >
      {/* Image layer */}
      <div style={{
        position: 'absolute', inset: 0,
        filter: developed ? 'grayscale(0%) blur(0px) brightness(1)' : 'grayscale(100%) blur(1.5px) brightness(0.6)',
        transition: developed ? 'filter 1.2s ease' : noT,
      }}>
        {images ? (
          <div style={{ display: 'flex', width: '100%', height: '100%' }}>
            <img src={images[0]} alt="" style={{ flex: 1, minWidth: 0, height: '100%', objectFit: 'cover' }} />
            <div style={{ width: 1, background: 'rgba(242,167,196,0.2)', flexShrink: 0 }} />
            <img src={images[1]} alt="" style={{ flex: 1, minWidth: 0, height: '100%', objectFit: 'cover' }} />
          </div>
        ) : image ? (
          <img src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : null}
      </div>

      {/* Layer 1 — Dark veil */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'rgba(10,6,8,0.72)',
        opacity: developed ? 0 : 1,
        transition: developed ? 'opacity 1s ease' : noT,
      }} />

      {/* Layer 3 — Grain noise */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        backgroundImage: SECRET_GRAIN_BG,
        mixBlendMode: 'overlay' as React.CSSProperties['mixBlendMode'],
        opacity: developed ? 0 : 0.55,
        transition: developed ? 'opacity 1.2s ease' : noT,
      }} />

      {/* Layer 4 — Scan line static */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
        background: 'repeating-linear-gradient(transparent,transparent 2px,rgba(255,255,255,0.015) 2px,rgba(255,255,255,0.015) 3px)',
      }} />

      {/* Layer 5 — RAW label */}
      <div style={{
        position: 'absolute', top: 14, left: 14, zIndex: 10, pointerEvents: 'none',
        fontFamily: "'Space Mono', monospace", fontSize: 8,
        color: 'rgba(255,255,255,0.3)', letterSpacing: '0.16em',
      }}>
        RAW / UNPROCESSED
      </div>

      {/* Layer 6 — Bottom data strip */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10, pointerEvents: 'none',
        background: 'rgba(0,0,0,0.6)', padding: '10px 16px',
        opacity: developed ? 0 : 1,
        transition: developed ? 'opacity 0.5s ease' : noT,
      }}>
        <span style={{
          fontFamily: "'Space Mono', monospace", fontSize: 8,
          color: '#F2A7C4', opacity: 0.5, letterSpacing: '0.12em',
        }}>
          {fileLabel}
        </span>
      </div>

      {/* Hover — Pink scan line sweep */}
      <div ref={scanRef} style={{
        position: 'absolute', left: 0, right: 0, height: 2, top: 0, zIndex: 20, pointerEvents: 'none',
        background: 'linear-gradient(to right, transparent, #F2A7C4, #FAFFC7, #F2A7C4, transparent)',
        boxShadow: '0 0 12px #F2A7C4',
        opacity: 0,
      }} />

      {/* Color channels */}
      {(
        [
          ['rgba(109,31,42,0.4)', redOn],
          ['rgba(250,255,199,0.25)', yellowOn],
          ['rgba(242,167,196,0.2)', pinkOn],
        ] as [string, boolean][]
      ).map(([color, on], i) => (
        <div key={i} aria-hidden="true" style={{
          position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none',
          background: color,
          mixBlendMode: 'color' as React.CSSProperties['mixBlendMode'],
          opacity: isHovered ? (on ? 1 : 0) : 0,
          transition: isHovered ? 'opacity 0.4s ease' : noT,
        }} />
      ))}

      {/* Step 3 — Data readout */}
      {typedLines.length > 0 && (
        <div style={{
          position: 'absolute', top: 14, right: 14, zIndex: 15, pointerEvents: 'none',
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(242,167,196,0.15)', borderRadius: 8,
          padding: '10px 14px',
          fontFamily: "'Space Mono', monospace", fontSize: 9,
          color: '#FAFFC7', lineHeight: 1.8,
        }}>
          {typedLines.map((line, i) => <div key={i}>{line}</div>)}
        </div>
      )}

      {/* Step 4 — Title fade up */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 15, pointerEvents: 'none',
        background: 'linear-gradient(transparent, rgba(10,6,8,0.92) 40%)',
        padding: '32px 20px 20px',
        opacity: showTitle ? 1 : 0,
        transform: showTitle ? 'translateY(0)' : 'translateY(20px)',
        transition: showTitle ? 'opacity 0.4s ease, transform 0.4s ease' : noT,
      }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 16, color: 'white' }}>
          {title}
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 4, letterSpacing: '0.08em' }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}

const SECRET_CARDS: SecretCardProps[] = [
  {
    fileLabel: 'FILE — 001',
    title: 'The moment reality hit',
    subtitle: 'FigJam · Week 01',
    dataReadout: [
      '> SIGNAL: CONFUSION DETECTED',
      '> SOURCE: FIGJAM BOARD',
      '> STATUS: PRE-RESEARCH PANIC',
      '> OUTCOME: TURNED INTO METHOD',
    ],
    images: [secretAskingHelp2, secretAskingHelp1],
  },
  {
    fileLabel: 'FILE — 002',
    title: 'Teaching systems through cricket',
    subtitle: 'GURUX · Design Education Session',
    dataReadout: [
      '> SESSION: DESIGN SYSTEMS',
      '> ANALOGY: CRICKET PLAYBOOK',
      '> ATTENDEES: GURUX TEAM',
      '> INNINGS: 10 · COMPONENTS: 11',
    ],
    image: secretDesignSystem,
  },
  {
    fileLabel: 'FILE — 003',
    title: 'The IA nobody sees',
    subtitle: 'Information Architecture · Raw',
    dataReadout: [
      '> TYPE: INFORMATION ARCHITECTURE',
      '> STATE: UNPROCESSED',
      '> NODES: NAVBAR / HOME / PROFILE',
      '> VERSION: 01 OF MANY',
    ],
    image: secretIA,
  },
  {
    fileLabel: 'FILE — 004',
    title: 'Salma, Rekha, Mansi',
    subtitle: 'Field Research · User Interviews',
    dataReadout: [
      '> PARTICIPANTS: SALMA · REKHA · MANSI',
      '> SURPRISE: PEOPLE LIVE WITH SO MUCH',
      '> UNCOMFORTABLE: SOME STARTED CRYING',
      '> INSIGHT: MONEY IS A SENSITIVE TOPIC',
    ],
    image: secretPeople,
  },
  {
    fileLabel: 'FILE — 005',
    title: 'Before it looked like anything',
    subtitle: 'Wireframe Sketching · Paper',
    dataReadout: [
      '> MEDIUM: PEN AND PAPER',
      '> SCREENS SKETCHED: 12+',
      '> TOOLS: NOTEBOOK · BALLPOINT',
      '> NEXT: FIGMA',
    ],
    image: secretWireframes,
  },
];

// ── IA Constellation ─────────────────────────────────────────────────────────

const IA_NODES: Array<{
  id: string; label: string; cx: number; cy: number;
  color: string; tooltip: string; isHub?: boolean; labelLines?: string[];
}> = [
  { id: 'welcome',       label: 'Welcome',         cx: 100, cy: 80,  color: '#F2A7C4', tooltip: 'Entry point · Onboarding gateway' },
  { id: 'onboarding',   label: 'Onboarding',       cx: 100, cy: 180, color: '#F2A7C4', tooltip: 'Profile setup · Eligibility inputs' },
  { id: 'home',         label: 'Home',             cx: 270, cy: 130, color: '#FAFFC7', tooltip: 'Core hub · Scheme discovery', isHub: true },
  { id: 'schemes',      label: 'Schemes',          cx: 420, cy: 80,  color: '#FAFFC7', tooltip: 'Filtered matches · Apply flow' },
  { id: 'guide',        label: 'Guide',            cx: 420, cy: 200, color: '#F2A7C4', tooltip: 'Step-by-step help · FAQs' },
  { id: 'profile',      label: 'Profile',          cx: 580, cy: 130, color: '#FAFFC7', tooltip: 'User data · Document vault' },
  { id: 'guideDashboard', label: 'Guide Dashboard', cx: 700, cy: 150, color: '#FAFFC7', tooltip: 'Application tracking · Status', labelLines: ['Guide', 'Dashboard'] },
];

const IA_CONNECTIONS: [string, string][] = [
  ['welcome', 'onboarding'],
  ['onboarding', 'home'],
  ['home', 'schemes'],
  ['home', 'guide'],
  ['home', 'profile'],
  ['profile', 'guideDashboard'],
];

const IA_BG_STARS = [
  { cx: 50,  cy: 20,  r: 0.8, op: 0.15 },
  { cx: 180, cy: 40,  r: 0.5, op: 0.10 },
  { cx: 320, cy: 15,  r: 1.0, op: 0.20 },
  { cx: 450, cy: 35,  r: 0.6, op: 0.12 },
  { cx: 600, cy: 20,  r: 0.8, op: 0.18 },
  { cx: 720, cy: 40,  r: 0.5, op: 0.10 },
  { cx: 150, cy: 260, r: 0.7, op: 0.15 },
  { cx: 350, cy: 275, r: 1.0, op: 0.20 },
  { cx: 500, cy: 260, r: 0.4, op: 0.10 },
  { cx: 650, cy: 280, r: 0.8, op: 0.18 },
  { cx: 780, cy: 100, r: 0.6, op: 0.12 },
  { cx: 30,  cy: 150, r: 0.5, op: 0.10 },
];

function IAConstellation() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const prefersReduced = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const isTouch = useRef(
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  );

  const getNode = (id: string) => IA_NODES.find(n => n.id === id)!;
  const lineActive = (a: string, b: string) =>
    hoveredNode !== null && (a === hoveredNode || b === hoveredNode);

  return (
    <div style={{ width: '100%', height: 320 }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 300"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Margdarshak Information Architecture"
        style={{ display: 'block', overflow: 'visible', pointerEvents: isTouch.current ? 'none' : undefined }}
      >
        <rect width="800" height="300" rx="16" fill="#0D0A0B" opacity="0.5" />

        <g aria-hidden="true">
          {IA_BG_STARS.map((s, i) => (
            <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={s.op} />
          ))}
        </g>

        {/* Connection lines */}
        {IA_CONNECTIONS.map(([a, b], i) => {
          const nA = getNode(a);
          const nB = getNode(b);
          const active = lineActive(a, b);
          return (
            <line
              key={i}
              x1={nA.cx} y1={nA.cy} x2={nB.cx} y2={nB.cy}
              stroke={active ? getNode(hoveredNode!).color : 'rgba(255,255,255,0.35)'}
              strokeWidth="0.8"
              strokeDasharray="4 5"
              opacity={active ? 0.5 : 1}
              style={{ transition: 'stroke 0.25s ease, opacity 0.25s ease' }}
            />
          );
        })}

        {/* Nodes */}
        {IA_NODES.map((node) => {
          const hov = hoveredNode === node.id;
          const baseR = node.isHub ? 7 : 5;
          const outerR = node.isHub ? 16 : 10;
          const dotR = !prefersReduced.current && hov ? (node.isHub ? 9 : 7) : baseR;
          const ttW = 185;
          const ttX = Math.max(4, Math.min(node.cx - ttW / 2, 796 - ttW));
          const ttY = node.cy - 56;
          const lines = node.labelLines ?? [node.label];

          return (
            <g
              key={node.id}
              aria-label={node.label}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Glow */}
              <circle cx={node.cx} cy={node.cy} r="14"
                fill={node.color}
                opacity={hov ? 0.35 : 0.2}
                style={{ filter: `blur(${!prefersReduced.current && hov ? 8 : 6}px)`, transition: 'opacity 0.25s ease' }}
              />
              {/* Outer ring */}
              <circle cx={node.cx} cy={node.cy} r={outerR}
                fill="none" stroke={node.color} strokeWidth="0.6"
                opacity={hov ? 0.7 : 0.25}
                style={{ transition: 'opacity 0.25s ease' }}
              />
              {/* Main dot */}
              <circle cx={node.cx} cy={node.cy} r={dotR}
                fill={node.color} opacity="0.9"
                style={{
                  filter: node.isHub
                    ? `drop-shadow(0 0 ${!prefersReduced.current && hov ? 14 : 10}px #FAFFC7)`
                    : `drop-shadow(0 0 6px ${node.color})`,
                  transition: 'filter 0.25s ease',
                }}
              />
              {/* Hit area */}
              <circle cx={node.cx} cy={node.cy} r="22" fill="transparent" style={{ cursor: 'default' }} />

              {/* Labels */}
              {lines.map((ln, li) => (
                <text key={li}
                  x={node.cx} y={node.cy + 20 + li * 10}
                  textAnchor="middle"
                  fontFamily="'DM Sans', sans-serif"
                  fontSize={li === 0 ? 9 : 8}
                  fill="white"
                  opacity={hov ? (li === 0 ? 1 : 0.5) : (li === 0 ? 0.65 : 0.35)}
                  letterSpacing="0.08em"
                  style={{ transition: 'opacity 0.25s ease', userSelect: 'none' }}
                >
                  {ln}
                </text>
              ))}
              {lines.length === 1 && (
                <text
                  x={node.cx} y={node.cy + 29}
                  textAnchor="middle"
                  fontFamily="'DM Sans', sans-serif" fontSize="8"
                  fill="white" opacity={hov ? 0.5 : 0.35}
                  letterSpacing="0.08em"
                  style={{ transition: 'opacity 0.25s ease', userSelect: 'none' }}
                >
                  Screens
                </text>
              )}

              {/* Tooltip */}
              {hov && (
                <foreignObject x={ttX} y={ttY} width={ttW} height="36" style={{ overflow: 'visible' }}>
                  <div style={{
                    background: 'rgba(13,10,11,0.92)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: '1px solid rgba(242,167,196,0.15)',
                    borderRadius: '8px',
                    padding: '7px 12px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '10px',
                    color: 'white',
                    whiteSpace: 'nowrap',
                    textAlign: 'center' as const,
                  }}>
                    {node.tooltip}
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function CaseStudyPage({ project, onClose }: CaseStudyPageProps) {
  const [phonePositions, setPhonePositions] = useState<('left' | 'center' | 'right')[]>(['left', 'center', 'right']);
  const [poppedScreen, setPoppedScreen] = useState<number | null>(null);
  const [nudgeStates, setNudgeStates] = useState<Record<number, boolean>>({});
  
  // Gamification State
  const [collectedCards, setCollectedCards] = useState<number[]>([]);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);

  // Refs for scroll performance (prevents glitchy re-renders on every scroll tick)
  const progressBarRef = useRef<HTMLDivElement>(null);
  const mobileProgressBarRef = useRef<HTMLDivElement>(null);
  const xpTextRef = useRef<HTMLSpanElement>(null);
  const collectedCardsRef = useRef<number[]>([]);
  const scrollTrackerRef = useRef(0);
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const isNavScrolledRef = useRef(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    collectedCardsRef.current = collectedCards;
  }, [collectedCards]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    // Calculate scroll percentage (0 to 100)
    const scrollMax = target.scrollHeight - target.clientHeight;
    // Add small buffer in case scrollHeight is miscalculated slightly
    let progress = scrollMax > 0 ? (target.scrollTop / scrollMax) * 100 : 0;
    if (progress > 98) progress = 100;
    if (progress < 0) progress = 0;
    
    scrollTrackerRef.current = progress;
    
    // Update DOM directly for performance
    if (progressBarRef.current && xpTextRef.current) {
        progressBarRef.current.style.height = `${progress}%`;
        xpTextRef.current.innerText = `${Math.round(progress)}%`;
    }
    if (mobileProgressBarRef.current) {
        mobileProgressBarRef.current.style.width = `${progress}%`;
    }

    if (progress > 2 && !isNavScrolledRef.current) {
      isNavScrolledRef.current = true;
      setIsNavScrolled(true);
    } else if (progress <= 2 && isNavScrolledRef.current) {
      isNavScrolledRef.current = false;
      setIsNavScrolled(false);
    }

    if (progress > 95 && !hasReachedEnd) {
      setHasReachedEnd(true);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePhoneClick = (idx: number) => {
    const mySlot = phonePositions[idx];
    if (mySlot === 'center') return;
    const centerIdx = phonePositions.indexOf('center');
    const newPositions = [...phonePositions] as ('left' | 'center' | 'right')[];
    newPositions[idx] = 'center';
    newPositions[centerIdx] = mySlot;
    setPhonePositions(newPositions);
  };

  const handleCollect = (id: number) => {
    if (!collectedCards.includes(id)) {
      setCollectedCards(prev => [...prev, id]);
      setNudgeStates(prev => ({...prev, [id]: true}));
      setTimeout(() => {
        setNudgeStates(prev => ({...prev, [id]: false}));
      }, 4000);
    }
  };

  const nudgeMessages = [
    "Take your time.",
    "There's no rush.",
    "Breathe.",
    "Enjoy the details.",
    "Almost there."
  ];

  const unlockAll = () => {
    setCollectedCards([1, 2, 3, 4, 5]);
    setHasReachedEnd(true);
    setTimeout(() => scrollToSection('messy-middle'), 100);
  };

  // Redesigned Square Collectible Card
  const Collectible = ({ id, style }: { id: number, style?: React.CSSProperties }) => {
    const isCollected = collectedCards.includes(id);
    const showNudge = nudgeStates[id];

    return (
      <div className="absolute z-[80] flex justify-center items-center" style={style}>
        <AnimatePresence mode="wait">
          {!isCollected ? (
            <motion.div
              key="card"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, y: [0, -3, 0] }}
              exit={{ opacity: 0, scale: 0.5, y: -300, x: 200 }} 
              transition={{ duration: 0.5, y: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
              className="cursor-pointer group"
              onClick={(e) => { e.stopPropagation(); handleCollect(id); }}
              title="Collect me!"
            >
              <div className="w-16 h-20 bg-[#FAFFC7] backdrop-blur-md border border-[#FAFFC7] rounded-xl shadow-[0_0_15px_rgba(250,255,199,0.35)] flex flex-col items-center justify-center transition-all duration-300 text-center px-1">
                <div className="relative flex justify-center items-center">
                  <Star className="w-6 h-6 text-[#B78494] relative z-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)] transition-transform duration-300 scale-100 group-hover:scale-110" fill="currentColor" />
                </div>
              </div>
            </motion.div>
          ) : showNudge ? (
            <motion.div
              key="nudge"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-[#FAFFC7] font-serif italic text-sm pointer-events-none whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] bg-[#121212]/80 px-4 py-2 rounded-full backdrop-blur-md border border-[#333] shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
            >
              "{nudgeMessages[id - 1]}"
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    );
  };

  const getPhoneStyle = (idx: number) => {
    const slot = phonePositions[idx];
    const base = {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      aspectRatio: '9 / 19',
      border: '4px solid #333',
      borderRadius: '1.75rem',
      overflow: 'hidden' as const,
      backgroundColor: '#121212',
      display: 'flex',
      flexDirection: 'column' as const,
      transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), height 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease',
    };
    if (slot === 'center') {
      return {
        ...base,
        height: '88%',
        transform: 'translate(-50%, -50%) scale(1)',
        zIndex: 20,
        opacity: 1,
        cursor: 'default' as const,
        boxShadow: '0 0 40px rgba(242,167,196,0.15), 0 8px 32px rgba(0,0,0,0.8)',
        border: '4px solid #444',
      };
    }
    if (slot === 'left') {
      return {
        ...base,
        height: '74%',
        transform: 'translate(calc(-50% - 195px), -50%) scale(0.95)',
        zIndex: 10,
        opacity: 0.6,
        cursor: 'pointer' as const,
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      };
    }
    // right
    return {
      ...base,
      height: '74%',
      transform: 'translate(calc(-50% + 195px), -50%) scale(0.95)',
      zIndex: 10,
      opacity: 0.6,
      cursor: 'pointer' as const,
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    };
  };

  const fadeUpConfig = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-[#000000] text-white overflow-y-auto hide-scrollbar" 
      data-lenis-prevent
      onScroll={handleScroll}
    >
      
      {/* Noise Overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-[110] opacity-[0.04]" 
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
      ></div>

      {/* Floating HUD Navbar */}
      {/* Floating HUD Navbar */}
      <motion.nav 
        initial={false}
        animate={{
          scale: isNavScrolled ? 0.95 : 1,
          backgroundColor: isNavScrolled ? 'rgba(18, 18, 18, 0.6)' : 'rgba(18, 18, 18, 0.8)',
          backdropFilter: isNavScrolled ? 'blur(24px)' : 'blur(16px)',
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[120] border border-[#333] rounded-full px-4 py-2 flex items-center justify-between gap-4 shadow-[0_4px_24px_rgba(0,0,0,0.5)] origin-top w-[calc(100%-2rem)] max-w-[600px]"
      >
        <button
          onClick={onClose}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1E1E1E] text-white hover:bg-[#F2A7C4] hover:text-[#000] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <ul className="flex gap-4 list-none m-0 p-0 items-center">
          {[
            { id: 'problem', label: 'Problem' },
            { id: 'users', label: 'Users' },
            { id: 'solution', label: 'Solution' },
          ].map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className="text-[10px] font-semibold text-gray-400 hover:text-[#FAFFC7] transition-colors tracking-[0.15em] uppercase"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* HUD Cards Tracker */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-6 bg-[#FAFFC7] border border-[#FAFFC7] rounded shadow-[0_0_10px_rgba(250,255,199,0.4)] flex items-center justify-center">
            <Star className="w-3 h-3 text-[#F2A7C4] drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]" fill="currentColor" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">
            <span className={collectedCards.length === 5 ? "text-[#FAFFC7]" : "text-[#F2A7C4]"}>{collectedCards.length}</span>/5
          </span>
        </div>

        <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#1E1E1E] flex items-center justify-center hover:bg-[#FAFFC7] transition-colors group">
          <img src={FavoriteLogo} alt="Logo" className="w-5 h-5 group-hover:invert" />
        </button>
      </motion.nav>

      {/* Mobile top progress bar */}
      <div className="fixed top-[4.5rem] left-0 right-0 z-[120] h-0.5 bg-[#1E1E1E] md:hidden pointer-events-none">
        <div
          ref={mobileProgressBarRef}
          className="h-full bg-gradient-to-r from-[#FAFFC7] to-[#F2A7C4]"
          style={{ width: '0%', transition: 'width 0.3s ease' }}
        />
      </div>

      {/* Right side Vertical XP/Progress Bar */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[120] h-[40vh] flex-col items-center gap-4 hidden md:flex pointer-events-none">
        <span ref={xpTextRef} className="text-[9px] font-bold tracking-[0.2em] text-gray-500 uppercase h-10 flex justify-center items-center" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>0%</span>
        <div className="w-1.5 flex-1 bg-[#1E1E1E] border border-[#333] rounded-full overflow-hidden relative flex flex-col justify-start">
          <div 
            ref={progressBarRef}
            className="w-full bg-gradient-to-b from-[#FAFFC7] to-[#F2A7C4] transition-all duration-300"
            style={{ height: `0%` }}
          />
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-[160px] pb-24 border-b border-[#333] relative">
        <Collectible id={1} style={{ top: '20%', right: '15%' }} />
        
        <motion.div className="max-w-[960px] mx-auto px-8" {...fadeUpConfig}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#F2A7C4]"></div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#F2A7C4]">
              Case Study
            </span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl leading-[1.1] tracking-tight text-[#FAFFC7] mb-10">
            {project.title}
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8 p-6 rounded-2xl bg-[#121212]/50 border border-[#222]">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500">Role</span>
              <span className="text-sm font-medium text-gray-200">Product Designer / UX Researcher</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500">Timeline</span>
              <span className="text-sm font-medium text-gray-200">Jan – April 2026</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500">Platform</span>
              <span className="text-sm font-medium text-gray-200">Web, Mobile & Community</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 mb-16 p-6 rounded-2xl bg-[#121212]/50 border border-[#222]">
            <div className="flex flex-col gap-4 flex-1">
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500">Tools</span>
              <div className="flex gap-2 flex-wrap">
                {project.tools?.map((t, idx) => (
                  <span key={idx} className="border border-white/10 bg-white/5 text-gray-300 text-xs rounded-full px-3 py-1">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500">Deliverables</span>
              <div className="flex gap-2 flex-wrap">
                {project.deliverables?.map((t, idx) => (
                  <span key={idx} className="bg-[#F2A7C4]/10 text-[#F2A7C4] border border-[#F2A7C4]/30 font-semibold text-xs rounded-full px-3 py-1">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="text-gray-400 text-lg leading-relaxed max-w-[620px] mb-16 font-light">
            MARGDARSHAN is a welfare guidance platform designed to help low-income families easily find and apply for government schemes through simplified steps and guided support.
          </p>

          <div className="w-full h-[520px] rounded-3xl relative overflow-hidden bg-[#121212] border border-[#333] group">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(242,167,196,0.1)_0%,transparent_60%)] opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
            {heroPhones.map((phone, idx) => (
              <div
                key={idx}
                onClick={() => handlePhoneClick(idx)}
                style={getPhoneStyle(idx)}
                title={phonePositions[idx] !== 'center' ? `View ${phone.alt}` : undefined}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10 }}>
                  <div style={{ width: '33%', height: '16px', background: '#000', borderRadius: '0 0 12px 12px' }} />
                </div>
                <img src={phone.src} alt={phone.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {phonePositions[idx] !== 'center' && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', borderRadius: 'inherit', pointerEvents: 'none' }} />
                )}
              </div>
            ))}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#000]/60 backdrop-blur-md border border-[#333] px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FAFFC7] animate-pulse"></span>
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#FAFFC7]">Interactive Prototype</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* The Problem */}
      <section id="problem" className="py-32 border-b border-[#333] relative">
        <Collectible id={2} style={{ bottom: '20%', left: '10%' }} />

        <motion.div className="max-w-[960px] mx-auto px-8" {...fadeUpConfig}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#FAFFC7]"></div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#FAFFC7]">
              01 — The Problem
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight text-white mb-8">
            What was broken<br />and why it mattered
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-[620px] mb-12 font-light">
            {project.situation}
          </p>

          <div className="grid md:grid-cols-3 gap-6 my-16">
            {[
              { stat: "94 Crore", desc: "Indians are covered by at least one welfare scheme." },
              { stat: "57.8%", desc: "Of those covered never use the schemes they qualify for." },
              { stat: "42 Crore", desc: "People are aware of a scheme but take no action." },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-[#121212] border border-[#333] rounded-2xl p-8 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,255,199,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <strong className="font-serif text-4xl text-[#FAFFC7] block mb-3">{item.stat}</strong>
                <span className="text-sm text-gray-400 leading-relaxed block">{item.desc}</span>
              </motion.div>
            ))}
          </div>

          <div className="bg-[#121212] border border-[#F2A7C4]/30 rounded-3xl p-12 relative overflow-hidden group hover:border-[#F2A7C4]/60 transition-colors duration-500">
            <div className="absolute top-[-60px] left-8 font-serif text-[240px] leading-none text-[#F2A7C4]/5 select-none transition-transform duration-700 group-hover:translate-x-4">
              "
            </div>
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#F2A7C4] mb-6 relative">
              Problem Statement
            </div>
            <p className="font-serif text-2xl md:text-4xl leading-relaxed text-white relative max-w-4xl">
              How might we help low-income families navigate welfare schemes easily so that awareness turns into action and more people receive the support they are entitled to?
            </p>
          </div>
        </motion.div>
      </section>

      {/* Understanding the Users */}
      <section id="users" className="py-32 border-b border-[#333] relative">
        <Collectible id={3} style={{ top: '40%', right: '10%' }} />

        <motion.div className="max-w-[960px] mx-auto px-8" {...fadeUpConfig}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#F2A7C4]"></div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#F2A7C4]">
              02 — Understanding Users
            </span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl leading-tight text-white mb-8">
            Who I was<br />designing for
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {[
              { icon: Lightbulb, title: 'Key Discovery', description: "Awareness wasn't the problem. People knew schemes existed but never applied because the process felt confusing and risky." },
              { icon: Search, title: 'User Behavior', description: 'Daily WhatsApp and UPI users — yet avoided government portals entirely because they felt high-stakes and opaque.' },
              { icon: Zap, title: 'Critical Insight', description: "The real stress wasn't today's expenses. It was future uncertainty making welfare an emotional need, not just financial." },
            ].map((insight, idx) => {
              const IconComponent = insight.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="bg-[#121212] border border-[#333] rounded-2xl p-8 hover:border-[#F2A7C4]/50 transition-colors duration-300"
                >
                  <div className="w-12 h-12 bg-[#F2A7C4]/10 rounded-xl flex items-center justify-center mb-6">
                    <IconComponent className="w-6 h-6 text-[#F2A7C4]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">
                    {insight.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {insight.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <h3 className="text-xl font-serif text-white mb-8">Persona</h3>
          <div className="bg-[#121212] border border-[#333] rounded-3xl p-10 grid md:grid-cols-[200px_1fr] gap-12 items-center">
            <div className="w-full aspect-square bg-[#1E1E1E] rounded-2xl overflow-hidden border border-[#444]">
              <img src={margdarshakPersona} alt="User Persona" className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
            </div>
            <div>
              <div className="font-serif text-4xl text-white mb-2">Salmo, 36</div>
              <div className="text-[10px] text-[#FAFFC7] font-bold tracking-[0.2em] uppercase mb-6">
                Homemaker · Urban (Delhi)
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Low digital exposure', 'Financially dependent'].map((tag) => (
                  <span key={tag} className="text-[10px] font-bold tracking-wider bg-[#333] text-gray-300 px-3 py-1.5 rounded-full uppercase">{tag}</span>
                ))}
              </div>
              <p className="text-base text-gray-300 italic mb-8 border-l-2 border-[#F2A7C4] pl-4 py-1">
                "Every week I just think… will we have enough for food, rent, and medicines?"
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Mapping the Experience */}
      <section id="mapping" className="py-32 border-b border-[#333] overflow-hidden relative">
        <Collectible id={4} style={{ bottom: '15%', right: '15%' }} />

        <motion.div className="max-w-[960px] mx-auto px-8" {...fadeUpConfig}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#FAFFC7]"></div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#FAFFC7]">
              03 — Mapping the Experience
            </span>
          </div>

          <div className="mb-12">
            <h2 className="font-serif text-4xl md:text-5xl leading-tight text-white">
              Where the pain<br />really lived
            </h2>
          </div>

          <div 
            className="overflow-x-auto pb-12 -mx-8 px-8 premium-horizontal-scroll"
            style={{ 
              maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', 
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' 
            }}
          >
            <div className="flex gap-4 min-w-max">
              {[
                { stage: 'Awareness', item: 'Hears about schemes', pain: "Doesn't know what applies.", icon: AlertCircle },
                { stage: 'Exploration', item: 'Tries to understand rules.', pain: 'Overwhelmed by forms.', icon: Search },
                { stage: 'Decision', item: 'Weighs effort vs risk.', pain: 'Fear of mistakes.', icon: XCircle },
                { stage: 'Usage', item: 'Attempts application.', pain: 'Gets stuck in docs.', icon: RotateCw },
                { stage: 'Outcome', item: 'Receives support / Abandons.', pain: 'Drops off entirely.', icon: TrendingUp },
              ].map((stage, idx) => {
                const IconComponent = stage.icon;
                return (
                  <motion.div 
                    key={idx} 
                    whileHover={{ y: -5 }}
                    className="w-[240px] bg-[#121212] border border-[#333] rounded-2xl flex flex-col overflow-hidden group"
                  >
                    <div className="bg-[#1E1E1E] border-b border-[#333] px-5 py-4 text-[10px] font-bold tracking-[0.2em] uppercase text-white group-hover:text-[#FAFFC7] transition-colors">
                      0{idx + 1} — {stage.stage}
                    </div>
                    <div className="p-5 flex flex-col justify-between flex-1 gap-6">
                      <div className="text-sm text-gray-400 font-light leading-relaxed">{stage.item}</div>
                      <div className="bg-[#1E1E1E] rounded-xl px-4 py-3 text-xs text-[#F2A7C4] flex items-center gap-3">
                        <IconComponent className="w-4 h-4 flex-shrink-0" />
                        <span className="leading-tight">{stage.pain}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end mt-4 px-2">
            <div className="flex items-center gap-3 text-gray-500">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Scroll to explore</span>
              <motion.div 
                animate={{ x: [0, 8, 0] }} 
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center bg-[#1E1E1E]"
              >
                <ArrowRight className="w-3 h-3 text-[#F2A7C4]" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Designing the Solution */}
      <section id="solution" className="py-32 border-b border-[#333] relative">
        <Collectible id={5} style={{ top: '30%', left: '8%' }} />

        <motion.div className="max-w-[960px] mx-auto px-8" {...fadeUpConfig}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#F2A7C4]"></div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#F2A7C4]">
              04 — Designing the Solution
            </span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl leading-tight text-white mb-8">
            How I solved it
          </h2>

          <p className="text-gray-400 text-lg leading-relaxed max-w-[620px] mb-16 font-light">
            {project.task}
          </p>

          {/* ── Information Architecture ── */}
          <h3 className="text-lg font-semibold text-[#FAFFC7] mb-2">Information Architecture</h3>
          <p className="text-sm text-gray-400 leading-relaxed max-w-[620px] mb-10">
            Structured around clarity and trust. Seven screen categories mapped before the first wireframe was drawn — reducing decision fatigue at every stage of the user journey.
          </p>

          <IAConstellation />

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#6B7280', textAlign: 'center', letterSpacing: '0.08em', marginTop: 12, marginBottom: 40 }}>
            7 screen categories · Mapped before first wireframe
          </p>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(242,167,196,0.2)', margin: '40px 0' }} />

          {/* Prototype CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 48 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F2A7C4', opacity: 0.7, marginBottom: 8 }}>
              See it in action
            </span>
            <a
              href="https://www.figma.com/proto/oKryn0vKJGZ8oZw63x1drX/Margdarshak?node-id=2285-32311&p=f&t=08OH4pGyXfe9PhPq-1&scaling=scale-down&content-scaling=fixed&page-id=1972%3A1741&starting-point-node-id=2285%3A32298&show-proto-sidebar=1"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#6D1F2A',
                border: '1px solid rgba(242,167,196,0.55)',
                color: 'white',
                padding: '14px 32px',
                borderRadius: 11,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                letterSpacing: '0.06em',
                textDecoration: 'none',
                transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.boxShadow = '0 0 28px rgba(242,167,196,0.3)';
                el.style.borderColor = 'rgba(242,167,196,0.8)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.boxShadow = 'none';
                el.style.borderColor = 'rgba(242,167,196,0.55)';
              }}
            >
              Try the Prototype <ExternalLink style={{ width: 14, height: 14, opacity: 0.7 }} />
            </a>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#9CA3AF', textAlign: 'center', marginTop: 8, letterSpacing: '0.08em' }}>
              Opens in Figma · No login required
            </span>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(242,167,196,0.2)', margin: '0 0 40px' }} />

          <h3 className="text-xl font-serif text-white mb-4">Hi-Fi Screens</h3>
          <p className="text-gray-400 text-base leading-relaxed max-w-[620px] mb-12">
            The final interface — clean, focused, and built around the user's core jobs to be done.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { src: homeFrame, alt: "Home Frame", label: "Home Screen" },
              { src: schemesFrame, alt: "Schemes Frame", label: "Schemes Screen" },
              { src: guideFrame, alt: "Guide Frame", label: "Guide Screen" },
            ].map((screen, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02, y: -10 }}
                className="bg-[#121212] rounded-3xl aspect-[9/16] flex items-center justify-center relative overflow-hidden border border-[#333] group cursor-pointer"
                onClick={() => setPoppedScreen(i)}
              >
                <div className="absolute inset-0 bg-[#F2A7C4]/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
                <img src={screen.src} alt={screen.alt} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#000]/80 backdrop-blur-md border border-[#333] text-white text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full z-20 whitespace-nowrap">
                  {screen.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Secret Level — The Unprocessed Files */}
      <section style={{ background: '#0D0A0B', position: 'relative', overflow: 'hidden' }}>
        {collectedCards.length === 5 && hasReachedEnd ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '100px 32px' }}>

              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 10, letterSpacing: '0.28em',
                textTransform: 'uppercase' as const, color: '#F2A7C4', opacity: 0.6,
                textAlign: 'center', marginBottom: 16,
              }}>
                ✦ CLASSIFIED
              </div>

              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
                fontSize: 'clamp(2rem, 3.5vw, 3.2rem)',
                color: 'white', textAlign: 'center', lineHeight: 1.1, margin: '0 0 12px',
              }}>
                The Unprocessed Files
              </h2>

              <p style={{
                fontFamily: "'Cormorant Garamond', serif", fontWeight: 400,
                fontStyle: 'italic', fontSize: 18,
                color: 'rgba(255,255,255,0.28)', textAlign: 'center', margin: '0 0 64px',
              }}>
                Raw data from the field. Hover to develop.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {SECRET_CARDS.slice(0, 3).map((card, i) => (
                  <SecretLevelCard key={i} {...card} />
                ))}
                <div className="col-span-1 md:col-span-3 flex flex-col md:flex-row md:justify-center gap-5">
                  {SECRET_CARDS.slice(3).map((card, i) => (
                    <div key={i} className="w-full md:w-[320px]">
                      <SecretLevelCard {...card} />
                    </div>
                  ))}
                </div>
              </div>

              <p style={{
                fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 16,
                color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: 48,
              }}>
                Some files are never fully processed. That's research.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(242,167,196,0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onClose('contact')}
                  className="inline-flex items-center gap-3 bg-[#F2A7C4] text-[#000] text-sm font-bold tracking-[0.2em] uppercase px-12 py-5 rounded-full shadow-[0_0_20px_rgba(242,167,196,0.25)] transition-all cursor-pointer"
                >
                  Hire Me <MoveRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="max-w-[960px] mx-auto px-8">
            <div className="text-center py-20 opacity-40">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#333] mb-4">
                <Star className="w-5 h-5 text-gray-600" />
              </div>
              <h3 className="font-serif text-2xl text-white mb-2">Secret Level Locked</h3>
              <p className="text-[10px] tracking-widest uppercase text-gray-500">
                Find {5 - collectedCards.length} more cards and reach the end
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Footer CTA */}
      <section className="py-24">
        <motion.div className="max-w-[960px] mx-auto px-8 text-center" {...fadeUpConfig}>
          <p className="font-serif text-2xl text-gray-300 mb-8">
            Want to see more of my work?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onClose('about')}
            className="inline-flex items-center gap-2 bg-transparent text-[#F2A7C4] border border-[#F2A7C4] text-xs font-bold tracking-[0.2em] uppercase px-8 py-4 rounded-full hover:bg-[#F2A7C4] hover:text-[#000] transition-colors duration-300"
          >
            Back to Portfolio
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}
