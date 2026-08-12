import React, { useState, useMemo, useRef, useCallback, useEffect, memo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';

const VW = 1000;
const VH = 700;
const IMPACT = { cx: 500, cy: 340 };

const CLUSTERS = [
  {
    id: 'human_understanding', idx: 0,
    label: 'Human Understanding', cx: 135, cy: 130, color: 'var(--color-pink)',
    nodes: [
      { id: 'hu_main',      label: 'Human Understanding', dx: 0,   dy: 0,   r: 5,   primary: true,  desc: '' },
      { id: 'hu_curiosity', label: 'Curiosity',           dx: -35, dy: -45, r: 3.5, primary: false, desc: 'The starting point of every good question' },
      { id: 'hu_obs',       label: 'Observation',         dx: 45,  dy: -20, r: 3,   primary: false, desc: 'Observation — part of how I think and connect' },
      { id: 'hu_empathy',   label: 'Empathy',             dx: 25,  dy: 40,  r: 3.5, primary: false, desc: 'Understanding before assuming' },
      { id: 'hu_psych',     label: 'Psychology',          dx: -30, dy: 30,  r: 3.5, primary: false, desc: 'The bridge between behavior and design' },
      { id: 'hu_behavior',  label: 'Human Behavior',      dx: 55,  dy: 22,  r: 3,   primary: false, desc: 'Human Behavior — part of how I think and connect' },
    ],
    internalEdges: [['hu_main','hu_curiosity'],['hu_main','hu_obs'],['hu_main','hu_empathy'],['hu_main','hu_psych'],['hu_empathy','hu_behavior'],['hu_obs','hu_behavior']],
    philosophy: "This is where everything starts for me. Before I open Figma or write a research plan, I try to understand who I'm designing for at a human level — their values, their fears, their context.",
    animClass: 'dm-float-0',
  },
  {
    id: 'research', idx: 1,
    label: 'Research', cx: 400, cy: 100, color: 'var(--color-lemon)',
    nodes: [
      { id: 'r_main',      label: 'Research',            dx: 0,   dy: 0,   r: 5,   primary: true,  desc: '' },
      { id: 'r_uxr',       label: 'UX Research',         dx: -40, dy: 30,  r: 3.5, primary: false, desc: 'Finding the truth behind what users say' },
      { id: 'r_interview', label: 'User Interviews',     dx: 30,  dy: 45,  r: 3,   primary: false, desc: 'User Interviews — part of how I think and connect' },
      { id: 'r_surveys',   label: 'Surveys',             dx: 45,  dy: -15, r: 3,   primary: false, desc: 'Surveys — part of how I think and connect' },
      { id: 'r_insight',   label: 'Insight Generation',  dx: -20, dy: -40, r: 3.5, primary: false, desc: 'Insight Generation — part of how I think and connect' },
      { id: 'r_pattern',   label: 'Pattern Recognition', dx: -55, dy: -10, r: 3.5, primary: false, desc: 'Connecting dots others miss' },
    ],
    internalEdges: [['r_main','r_uxr'],['r_main','r_surveys'],['r_main','r_insight'],['r_uxr','r_interview'],['r_insight','r_pattern'],['r_surveys','r_interview']],
    philosophy: "Research is not a phase. It's a mindset I carry through the entire project. I'm always looking for the gap between what people say, what they do, and what they actually need.",
    animClass: 'dm-float-1',
  },
  {
    id: 'strategy', idx: 2,
    label: 'Strategy', cx: 668, cy: 118, color: '#E8E0D0',
    nodes: [
      { id: 's_main',     label: 'Strategy',            dx: 0,   dy: 0,   r: 5,   primary: true,  desc: '' },
      { id: 's_systems',  label: 'Systems Thinking',    dx: -45, dy: -25, r: 3.5, primary: false, desc: 'Seeing the whole before the parts' },
      { id: 's_strat',    label: 'Strategic Thinking',  dx: 35,  dy: -35, r: 3,   primary: false, desc: 'Strategic Thinking — part of how I think and connect' },
      { id: 's_product',  label: 'Product Thinking',    dx: 50,  dy: 20,  r: 3,   primary: false, desc: 'Product Thinking — part of how I think and connect' },
      { id: 's_root',     label: 'Root Cause Analysis', dx: -25, dy: 45,  r: 3,   primary: false, desc: 'Root Cause Analysis — part of how I think and connect' },
      { id: 's_decision', label: 'Decision Making',     dx: 15,  dy: 50,  r: 3.5, primary: false, desc: 'Decision Making — part of how I think and connect' },
    ],
    internalEdges: [['s_main','s_systems'],['s_main','s_strat'],['s_main','s_product'],['s_main','s_decision'],['s_decision','s_root'],['s_systems','s_root']],
    philosophy: "Good strategy is just clear thinking. I try to understand root causes before jumping to solutions, and I always ask what success actually looks like before we start designing it.",
    animClass: 'dm-float-2',
  },
  {
    id: 'behavioral_design', idx: 3,
    label: 'Behavioral Design', cx: 875, cy: 260, color: '#E8D5A3',
    nodes: [
      { id: 'bd_main', label: 'Behavioral Design',     dx: 0,   dy: 0,   r: 5,   primary: true,  desc: '' },
      { id: 'bd_core', label: 'Behavioral Design',     dx: -40, dy: -30, r: 3.5, primary: false, desc: 'Designing the path, not just the destination' },
      { id: 'bd_mot',  label: 'Motivation',            dx: 30,  dy: -40, r: 3,   primary: false, desc: 'Motivation — part of how I think and connect' },
      { id: 'bd_hab',  label: 'Habits',                dx: 48,  dy: 10,  r: 3.5, primary: false, desc: 'Habits — part of how I think and connect' },
      { id: 'bd_fric', label: 'Friction Reduction',    dx: 15,  dy: 45,  r: 3.5, primary: false, desc: 'Removing the effort between intent and action' },
      { id: 'bd_arch', label: 'Decision Architecture', dx: -35, dy: 35,  r: 3,   primary: false, desc: 'Decision Architecture — part of how I think and connect' },
    ],
    internalEdges: [['bd_main','bd_core'],['bd_main','bd_mot'],['bd_main','bd_fric'],['bd_core','bd_arch'],['bd_fric','bd_arch'],['bd_mot','bd_hab']],
    philosophy: "People don't always do what they intend to. I design for the gap between intention and action — reducing friction, building in gentle nudges, making the right choice the easy one.",
    animClass: 'dm-float-3',
  },
  {
    id: 'design', idx: 4,
    label: 'Design', cx: 822, cy: 472, color: '#B8C4E8',
    nodes: [
      { id: 'd_main',  label: 'Design',                   dx: 0,   dy: 0,   r: 5,   primary: true,  desc: '' },
      { id: 'd_ux',    label: 'UX Design',                dx: -45, dy: -20, r: 3.5, primary: false, desc: 'UX Design — part of how I think and connect' },
      { id: 'd_int',   label: 'Interaction Design',       dx: 35,  dy: -35, r: 3,   primary: false, desc: 'Interaction Design — part of how I think and connect' },
      { id: 'd_ia',    label: 'Information Architecture', dx: 45,  dy: 25,  r: 3.5, primary: false, desc: 'Making complexity feel simple' },
      { id: 'd_flows', label: 'User Flows',               dx: -20, dy: 45,  r: 3,   primary: false, desc: 'User Flows — part of how I think and connect' },
      { id: 'd_proto', label: 'Prototyping',              dx: 10,  dy: 55,  r: 3,   primary: false, desc: 'Prototyping — part of how I think and connect' },
    ],
    internalEdges: [['d_main','d_ux'],['d_main','d_int'],['d_main','d_ia'],['d_main','d_flows'],['d_ia','d_proto'],['d_flows','d_proto']],
    philosophy: "Design is the last step, not the first. By the time I open a design tool, most of the hard thinking is already done. The interface is just where that thinking becomes visible.",
    animClass: 'dm-float-4',
  },
  {
    id: 'storytelling', idx: 5,
    label: 'Storytelling', cx: 300, cy: 555, color: '#C4A8B8',
    nodes: [
      { id: 'st_main',  label: 'Storytelling',  dx: 0,   dy: 0,   r: 5,   primary: true,  desc: '' },
      { id: 'st_story', label: 'Storytelling',  dx: -35, dy: -40, r: 3.5, primary: false, desc: 'How insights become decisions' },
      { id: 'st_comm',  label: 'Communication', dx: 40,  dy: -25, r: 3,   primary: false, desc: 'Communication — part of how I think and connect' },
      { id: 'st_acc',   label: 'Accessibility', dx: 30,  dy: 40,  r: 3.5, primary: false, desc: 'Design that includes, not excludes' },
      { id: 'st_incl',  label: 'Inclusion',     dx: -15, dy: 50,  r: 3,   primary: false, desc: 'Inclusion — part of how I think and connect' },
      { id: 'st_adv',   label: 'Advocacy',      dx: -45, dy: 20,  r: 3,   primary: false, desc: 'Advocacy — part of how I think and connect' },
    ],
    internalEdges: [['st_main','st_story'],['st_main','st_comm'],['st_main','st_acc'],['st_main','st_adv'],['st_acc','st_incl'],['st_adv','st_incl']],
    philosophy: "Insights that can't be communicated don't exist. I spend as much time crafting how I present research as I do conducting it — because the story is what moves people to act.",
    animClass: 'dm-float-5',
  },
  {
    id: 'creativity', idx: 6,
    label: 'Creativity', cx: 90, cy: 490, color: '#D4A0B0',
    nodes: [
      { id: 'c_main',  label: 'Creativity',       dx: 0,   dy: 0,   r: 5,   primary: true,  desc: '' },
      { id: 'c_art',   label: 'Art',              dx: -28, dy: -35, r: 3,   primary: false, desc: 'Art — part of how I think and connect' },
      { id: 'c_creat', label: 'Creativity',       dx: 45,  dy: -18, r: 3.5, primary: false, desc: 'Where logic loosens its grip' },
      { id: 'c_vis',   label: 'Visual Design',    dx: 20,  dy: 40,  r: 3,   primary: false, desc: 'Visual Design — part of how I think and connect' },
      { id: 'c_emo',   label: 'Emotional Design', dx: -38, dy: 25,  r: 3.5, primary: false, desc: 'Emotional Design — part of how I think and connect' },
    ],
    internalEdges: [['c_main','c_art'],['c_main','c_creat'],['c_main','c_vis'],['c_main','c_emo'],['c_art','c_emo'],['c_creat','c_vis']],
    philosophy: "I keep a sketchbook. I do pottery. I fail at photography. Not everything needs to be productive — creativity needs room to breathe without a brief.",
    animClass: 'dm-float-6',
  },
  {
    id: 'business_metrics', idx: 8,
    label: 'Business Metrics', cx: 110, cy: 315, color: '#A8C4B0',
    nodes: [
      { id: 'bm_main', label: 'Business Metrics', dx: 0,   dy: 0,   r: 5,   primary: true,  desc: '' },
      { id: 'bm_kpi',  label: 'KPIs',             dx: 42,  dy: -28, r: 3.5, primary: false, desc: 'Knowing what to measure before you ship' },
      { id: 'bm_conv', label: 'Conversion',        dx: 45,  dy: 20,  r: 3,   primary: false, desc: 'Where intent becomes action' },
      { id: 'bm_ret',  label: 'Retention',         dx: -32, dy: -38, r: 3,   primary: false, desc: 'The real test of whether design works' },
      { id: 'bm_nps',  label: 'NPS',               dx: -38, dy: 28,  r: 3,   primary: false, desc: 'Sentiment as a signal, not a score' },
      { id: 'bm_rev',  label: 'Revenue Impact',    dx: 12,  dy: 48,  r: 3.5, primary: false, desc: 'Design decisions always have a business cost or return' },
    ],
    internalEdges: [['bm_main','bm_kpi'],['bm_main','bm_conv'],['bm_main','bm_ret'],['bm_main','bm_nps'],['bm_kpi','bm_rev'],['bm_conv','bm_rev']],
    philosophy: "Good design isn't separate from business outcomes — it IS the business outcome. I try to speak the language of metrics not because I'm chasing numbers, but because it's how I make the case for putting people first.",
    animClass: 'dm-float-8',
  },
  {
    id: 'future', idx: 7,
    label: 'Future & Exploration', cx: 632, cy: 572, color: '#B8C4E8',
    nodes: [
      { id: 'f_main',  label: 'Future & Expl.',  dx: 0,   dy: 0,   r: 5,   primary: true,  desc: '' },
      { id: 'f_tech',  label: 'Technology',      dx: -35, dy: -30, r: 3,   primary: false, desc: 'Technology — part of how I think and connect' },
      { id: 'f_ai',    label: 'AI',              dx: 40,  dy: -35, r: 3.5, primary: false, desc: 'A collaborator, not a replacement' },
      { id: 'f_innov', label: 'Innovation',      dx: 50,  dy: 20,  r: 3,   primary: false, desc: 'Innovation — part of how I think and connect' },
      { id: 'f_space', label: 'Space',           dx: -10, dy: 45,  r: 3.5, primary: false, desc: 'The original inspiration for curiosity' },
      { id: 'f_expl',  label: 'Exploration',     dx: -45, dy: 15,  r: 3,   primary: false, desc: 'Exploration — part of how I think and connect' },
    ],
    internalEdges: [['f_main','f_tech'],['f_main','f_ai'],['f_main','f_space'],['f_main','f_expl'],['f_tech','f_expl'],['f_ai','f_innov'],['f_innov','f_space']],
    philosophy: "I'm genuinely curious about where technology and human behaviour are heading. Not to predict it, but to design thoughtfully for it — especially in AI and how it changes the way people make decisions.",
    animClass: 'dm-float-7',
  },
];

const BRIDGES = [
  { source: 'hu_main',  target: 'r_main'  },
  { source: 'r_main',   target: 's_main'  },
  { source: 'r_main',   target: 'st_main' },
  { source: 's_main',   target: 'bd_main' },
  { source: 's_main',   target: 'd_main'  },
  { source: 's_main',   target: 'f_main'  },
  { source: 'hu_psych', target: 'bd_main' },
  { source: 'd_main',   target: 'st_main' },
  { source: 'st_main',  target: 'c_main'  },
  { source: 'c_main',   target: 'f_main'  },
  { source: 'bm_main',  target: 's_main'  },
  { source: 'bm_main',  target: 'hu_main' },
];

// Flat nodeId → absolute SVG position
const NODE_POS: Record<string, { cx: number; cy: number }> = {};
CLUSTERS.forEach(c => c.nodes.forEach(n => {
  NODE_POS[n.id] = { cx: c.cx + n.dx, cy: c.cy + n.dy };
}));
NODE_POS['impact'] = IMPACT;

function nodeClusterId(nodeId: string): string {
  const map: Record<string, string> = {
    hu: 'human_understanding', r: 'research',  s: 'strategy',
    bd: 'behavioral_design',   d: 'design',    st: 'storytelling',
    c:  'creativity',          f: 'future',    bm: 'business_metrics',
  };
  return map[nodeId.split('_')[0]] || '';
}

// All node IDs ordered by cluster — for idle sequential glow
const ALL_NODE_IDS: string[] = CLUSTERS.reduce<string[]>((acc, c) => {
  c.nodes.forEach(n => acc.push(n.id));
  return acc;
}, []);


type HoveredNode = { id: string; label: string; desc: string; r: number; primary: boolean; clusterColor: string };
type HoveredLine  = { kind: 'spoke'; clusterId: string } | { kind: 'bridge'; idx: number };

// ─── Memoized sub-components to prevent re-renders ───

const BackgroundStars = memo(() => (
  <div style={{ position:'absolute', inset:0, zIndex:0, pointerEvents:'none' }} aria-hidden="true">
    <svg width="100%" height="100%">
      {BG_STARS.map((s, i) => (
        <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="#FFF" opacity={s.opacity} />
      ))}
    </svg>
  </div>
));
BackgroundStars.displayName = 'BackgroundStars';

const SvgDefs = memo(() => (
  <defs>
    <radialGradient id="dm-impact-grad" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stopColor="var(--color-pink)" stopOpacity="0.28" />
      <stop offset="100%" stopColor="var(--color-pink)" stopOpacity="0" />
    </radialGradient>
    {CLUSTERS.map(c => (
      <radialGradient key={c.id} id={`sphere-${c.id}`} cx="30%" cy="25%" r="85%">
        <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.90" />
        <stop offset="58%"  stopColor={c.color}  stopOpacity="0"   />
        <stop offset="100%" stopColor="#000000"  stopOpacity="0.48" />
      </radialGradient>
    ))}
    <radialGradient id="sphere-impact" cx="30%" cy="25%" r="85%">
      <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.92" />
      <stop offset="55%"  stopColor="var(--color-lemon)"  stopOpacity="0"   />
      <stop offset="100%" stopColor="#000000"  stopOpacity="0.52" />
    </radialGradient>
  </defs>
));
SvgDefs.displayName = 'SvgDefs';

const DesignerMindStyles = memo(() => (
  <style>{`
    @keyframes dm-float-A { 0%,100%{transform:translate3d(0,0,0)} 28%{transform:translate3d(0,-6px,0)} 72%{transform:translate3d(0,4px,0)} }
    @keyframes dm-float-B { 0%,100%{transform:translate3d(0,0,0)} 22%{transform:translate3d(0,-5px,0)} 68%{transform:translate3d(0,3px,0)} }
    @keyframes dm-float-C { 0%,100%{transform:translate3d(0,0,0)} 35%{transform:translate3d(0,-4px,0)} 78%{transform:translate3d(0,5px,0)} }
    @keyframes dm-float-D { 0%,100%{transform:translate3d(0,0,0)} 45%{transform:translate3d(0,-6px,0)} 80%{transform:translate3d(0,2px,0)} }
    .dm-float-0{animation:dm-float-A 10s ease-in-out infinite 0s; will-change: transform; transform: translate3d(0,0,0); backface-visibility: hidden;}
    .dm-float-1{animation:dm-float-B 12s ease-in-out infinite 2s; will-change: transform; transform: translate3d(0,0,0); backface-visibility: hidden;}
    .dm-float-2{animation:dm-float-C 14s ease-in-out infinite 4s; will-change: transform; transform: translate3d(0,0,0); backface-visibility: hidden;}
    .dm-float-3{animation:dm-float-D 11s ease-in-out infinite 1s; will-change: transform; transform: translate3d(0,0,0); backface-visibility: hidden;}
    .dm-float-4{animation:dm-float-A  9s ease-in-out infinite 3s; will-change: transform; transform: translate3d(0,0,0); backface-visibility: hidden;}
    .dm-float-5{animation:dm-float-B 13s ease-in-out infinite 5s; will-change: transform; transform: translate3d(0,0,0); backface-visibility: hidden;}
    .dm-float-6{animation:dm-float-C 15s ease-in-out infinite 6s; will-change: transform; transform: translate3d(0,0,0); backface-visibility: hidden;}
    .dm-float-7{animation:dm-float-D  8s ease-in-out infinite 7s; will-change: transform; transform: translate3d(0,0,0); backface-visibility: hidden;}
    .dm-float-8{animation:dm-float-B 13s ease-in-out infinite 9s; will-change: transform; transform: translate3d(0,0,0); backface-visibility: hidden;}
    @keyframes dm-spoke-pulse  { 0%,100%{opacity:.18} 50%{opacity:.40} }
    @keyframes dm-bridge-pulse { 0%,100%{opacity:.26} 50%{opacity:.50} }
    .dm-svg{width:100%;height:1000px;overflow:visible}
    @media(max-width:768px){
      .dm-svg{height:640px;pointer-events:none}
      .dm-svg-wrap{display:none !important}
      .dm-header-sub{margin-bottom:32px !important}
      .dm-mobile-grid{display:grid !important}
    }
    @media(min-width:769px){
      .dm-mobile-grid{display:none !important}
    }
    @media(prefers-reduced-motion:reduce){
      .dm-float-0,.dm-float-1,.dm-float-2,.dm-float-3,
      .dm-float-4,.dm-float-5,.dm-float-6,.dm-float-7{animation:none!important}
    }
    @keyframes dm-pulse-core {
      0%, 100% { r: 6px; opacity: 1; }
      50% { r: 8px; opacity: 0.55; }
    }
    .dm-pulse-core { animation: dm-pulse-core 3s ease-in-out infinite; }
    @keyframes dm-pulse-sphere {
      0%, 100% { r: 14px; }
      50% { r: 16px; }
    }
  `}</style>
));
DesignerMindStyles.displayName = 'DesignerMindStyles';

export function SectionRail({ label }: { label: string }) {
  return (
    <div style={{ position: "absolute", left: -200, top: "50%", transform: "translateY(-50%) rotate(180deg)", writingMode: "vertical-rl" as const, fontFamily: "'Sora', sans-serif", fontWeight: 300, fontSize: 28, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#C9C4B8", opacity: 0.35, zIndex: 50, pointerEvents: "none", userSelect: "none" as const }}>
      {label}
    </div>
  );
}

// ── DM STARFIELD ──────────────────────────────────────────────────────────────
function dmr(s: number) { const x = Math.sin(s + 7) * 10000; return x - Math.floor(x); }

const DM_STATIC = Array.from({ length: 150 }, (_, i) => ({
  x: dmr(i * 4)     * 1200,
  y: dmr(i * 4 + 1) * 1200,
  r: dmr(i * 4 + 2) * 1.3 + 0.4,
  op: dmr(i * 4 + 3) * 0.35 + 0.1,
}));

const DM_BLINK = Array.from({ length: 150 }, (_, i) => ({
  x:   dmr((i + 150) * 4)     * 1200,
  y:   dmr((i + 150) * 4 + 1) * 1200,
  r:   dmr((i + 150) * 4 + 2) * 1.5 + 0.5,
  dur: (dmr((i + 150) * 4 + 3) * 3 + 2).toFixed(1),
  del: (dmr((i + 150) * 4)     * 6).toFixed(1),
}));

function DMStarfield() {
  return (
    <>
      <style>{`
        @keyframes dm-star-blink { 0%,100%{opacity:0.05} 50%{opacity:0.65} }
        @media(prefers-reduced-motion:reduce){.dm-star-blink{animation:none!important;opacity:0.25}}
      `}</style>
      <svg
        aria-hidden
        viewBox="0 0 1200 1200"
        preserveAspectRatio="xMidYMid slice"
        style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0 }}
      >
        <defs>
          {/* galaxy halo — soft disk glow */}
          <filter id="dm-halo"  x="-80%"  y="-80%"  width="260%" height="260%"><feGaussianBlur stdDeviation="6"/></filter>
          {/* galaxy arms — almost sharp so structure shows */}
          <filter id="dm-arm"   x="-30%"  y="-30%"  width="160%" height="160%"><feGaussianBlur stdDeviation="1.8"/></filter>
          {/* galaxy core — tight glow */}
          <filter id="dm-core"  x="-60%"  y="-60%"  width="220%" height="220%"><feGaussianBlur stdDeviation="3"/></filter>
          {/* nebula outer wisp */}
          <filter id="dm-nw"    x="-60%"  y="-60%"  width="220%" height="220%"><feGaussianBlur stdDeviation="18"/></filter>
          {/* nebula inner dense cloud */}
          <filter id="dm-nd"    x="-40%"  y="-40%"  width="180%" height="180%"><feGaussianBlur stdDeviation="8"/></filter>
          {/* nebula bright knots */}
          <filter id="dm-nk"    x="-60%"  y="-60%"  width="220%" height="220%"><feGaussianBlur stdDeviation="3"/></filter>

          <radialGradient id="dm-gal-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#E8E4C9" stopOpacity="0.9"/>
            <stop offset="35%"  stopColor="#C9C4B8" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#C9C4B8" stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* ══ NEBULAE ══ */}

        {/* Warm emission nebula — top-center. Three lobes at different angles. */}
        <g transform="translate(575,175) scale(0.45) translate(-575,-175)" opacity="0.22">
          {/* outer wisp */}
          <ellipse cx="570" cy="175" rx="180" ry="110" fill="#C9A96E" fillOpacity="0.07" filter="url(#dm-nw)"/>
          {/* lobe A */}
          <ellipse cx="555" cy="160" rx="90"  ry="55"  fill="#F2EDCB" fillOpacity="0.13" filter="url(#dm-nd)" transform="rotate(-15,555,160)"/>
          {/* lobe B offset */}
          <ellipse cx="620" cy="190" rx="70"  ry="42"  fill="#F2EDCB" fillOpacity="0.11" filter="url(#dm-nd)" transform="rotate(20,620,190)"/>
          {/* lobe C — smaller, tilted */}
          <ellipse cx="535" cy="210" rx="50"  ry="28"  fill="#F2EDCB" fillOpacity="0.1"  filter="url(#dm-nd)" transform="rotate(-40,535,210)"/>
          {/* emission knots */}
          <circle cx="572" cy="158" r="18" fill="#F5F0D8" fillOpacity="0.28" filter="url(#dm-nk)"/>
          <circle cx="608" cy="182" r="12" fill="#F5F0D8" fillOpacity="0.22" filter="url(#dm-nk)"/>
          <circle cx="545" cy="198" r="9"  fill="#F5F0D8" fillOpacity="0.18" filter="url(#dm-nk)"/>
          {/* embedded stars */}
          <circle cx="574" cy="156" r="1.2" fill="#fff" opacity="0.9"/>
          <circle cx="609" cy="180" r="0.9" fill="#fff" opacity="0.8"/>
          <circle cx="548" cy="200" r="0.8" fill="#fff" opacity="0.7"/>
        </g>

        {/* Cool reflection nebula — bottom-left. Elongated wisps. */}
        <g transform="translate(195,948) scale(0.45) translate(-195,-948)" opacity="0.2">
          <ellipse cx="195" cy="948" rx="200" ry="120" fill="#8BA0B8" fillOpacity="0.06" filter="url(#dm-nw)"/>
          <ellipse cx="185" cy="935" rx="95"  ry="50"  fill="#B8C4D8" fillOpacity="0.12" filter="url(#dm-nd)" transform="rotate(-25,185,935)"/>
          <ellipse cx="230" cy="968" rx="75"  ry="38"  fill="#B8C4D8" fillOpacity="0.1"  filter="url(#dm-nd)" transform="rotate(10,230,968)"/>
          <ellipse cx="155" cy="960" rx="55"  ry="30"  fill="#B8C4D8" fillOpacity="0.09" filter="url(#dm-nd)" transform="rotate(-50,155,960)"/>
          <circle cx="188" cy="932" r="16" fill="#C8D4E4" fillOpacity="0.24" filter="url(#dm-nk)"/>
          <circle cx="232" cy="966" r="10" fill="#C8D4E4" fillOpacity="0.18" filter="url(#dm-nk)"/>
          <circle cx="192" cy="932" r="1.1" fill="#D8E8F8" opacity="0.85"/>
          <circle cx="234" cy="965" r="0.8" fill="#D8E8F8" opacity="0.75"/>
        </g>

        {/* Violet nebula — right. Tall irregular cloud. */}
        <g transform="translate(1105,575) scale(0.45) translate(-1105,-575)" opacity="0.18">
          <ellipse cx="1105" cy="575" rx="140" ry="200" fill="#9878B8" fillOpacity="0.06" filter="url(#dm-nw)"/>
          <ellipse cx="1095" cy="555" rx="65"  ry="95"  fill="#C8B4D8" fillOpacity="0.12" filter="url(#dm-nd)" transform="rotate(-12,1095,555)"/>
          <ellipse cx="1120" cy="610" rx="50"  ry="70"  fill="#C8B4D8" fillOpacity="0.1"  filter="url(#dm-nd)" transform="rotate(18,1120,610)"/>
          <ellipse cx="1080" cy="540" rx="40"  ry="55"  fill="#C8B4D8" fillOpacity="0.09" filter="url(#dm-nd)" transform="rotate(-30,1080,540)"/>
          <circle cx="1097" cy="552" r="14" fill="#D8C8E8" fillOpacity="0.26" filter="url(#dm-nk)"/>
          <circle cx="1122" cy="608" r="9"  fill="#D8C8E8" fillOpacity="0.2"  filter="url(#dm-nk)"/>
          <circle cx="1099" cy="550" r="1.0" fill="#E8D8F8" opacity="0.85"/>
          <circle cx="1124" cy="607" r="0.7" fill="#E8D8F8" opacity="0.72"/>
        </g>

        {/* ══ GALAXIES ══ */}

        {/* Edge-on lenticular — top-right. Thin lens with dust lane. */}
        <g transform="translate(1020,128) rotate(-18) scale(0.4)" opacity="0.2">
          {/* outer halo */}
          <ellipse cx="0" cy="0" rx="88" ry="18" fill="url(#dm-gal-g)" filter="url(#dm-halo)"/>
          {/* bright disk */}
          <ellipse cx="0" cy="0" rx="70" ry="8"  fill="#E8E4C9" fillOpacity="0.45" filter="url(#dm-arm)"/>
          {/* dust lane — dark strip across mid */}
          <ellipse cx="0" cy="0" rx="55" ry="2"  fill="#0a0a0a" fillOpacity="0.5"/>
          {/* inner bright bulge */}
          <ellipse cx="0" cy="0" rx="22" ry="6"  fill="#F2EDCB" fillOpacity="0.65" filter="url(#dm-core)"/>
          {/* star-like core */}
          <circle cx="0" cy="0" r="1.8" fill="#fff" opacity="0.98"/>
          {/* scattered foreground stars */}
          <circle cx="38"  cy="-3"  r="0.7" fill="#E8E4C9" opacity="0.6"/>
          <circle cx="-42" cy="2"   r="0.6" fill="#E8E4C9" opacity="0.5"/>
          <circle cx="18"  cy="4"   r="0.5" fill="#E8E4C9" opacity="0.55"/>
        </g>

        {/* Face-on two-arm spiral — bottom-right. Visible arms + star clusters. */}
        <g transform="translate(1048,952) scale(0.4)" opacity="0.22">
          {/* outer disk halo */}
          <ellipse cx="0" cy="0" rx="62" ry="58" fill="url(#dm-gal-g)" filter="url(#dm-halo)"/>
          {/* arm A */}
          <path d="M4 -8 Q22 -28 46 -18 Q60 -8 56 12 Q50 28 36 38"
            stroke="#E8E4C9" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.55" filter="url(#dm-arm)"/>
          {/* arm B (opposite) */}
          <path d="M-4 8 Q-22 28 -46 18 Q-60 8 -56 -12 Q-50 -28 -36 -38"
            stroke="#E8E4C9" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.55" filter="url(#dm-arm)"/>
          {/* inner disk */}
          <circle cx="0" cy="0" r="16" fill="#E8E4C9" fillOpacity="0.22" filter="url(#dm-core)"/>
          {/* bulge */}
          <circle cx="0" cy="0" r="7"  fill="#F2EDCB" fillOpacity="0.55" filter="url(#dm-core)"/>
          {/* core */}
          <circle cx="0" cy="0" r="2"  fill="#fff"    opacity="0.96"/>
          {/* star clusters on arms */}
          <circle cx="40"  cy="-15" r="1.2" fill="#E8E4C9" opacity="0.75"/>
          <circle cx="52"  cy="4"   r="0.9" fill="#E8E4C9" opacity="0.65"/>
          <circle cx="-40" cy="15"  r="1.2" fill="#E8E4C9" opacity="0.75"/>
          <circle cx="-52" cy="-4"  r="0.9" fill="#E8E4C9" opacity="0.65"/>
          <circle cx="24"  cy="-26" r="0.8" fill="#E8E4C9" opacity="0.6"/>
          <circle cx="-24" cy="26"  r="0.8" fill="#E8E4C9" opacity="0.6"/>
        </g>

        {/* Barred spiral — bottom-center. Clear bar + bent arms. */}
        <g transform="translate(318,1060) rotate(22) scale(0.4)" opacity="0.2">
          <ellipse cx="0" cy="0" rx="65" ry="60" fill="url(#dm-gal-g)" filter="url(#dm-halo)"/>
          {/* bar */}
          <ellipse cx="0" cy="0" rx="34" ry="5"  fill="#E8E4C9" fillOpacity="0.55" filter="url(#dm-arm)"/>
          {/* arm from right end of bar — curves up */}
          <path d="M34 0 Q50 -20 44 -44 Q38 -58 22 -58"
            stroke="#E8E4C9" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" filter="url(#dm-arm)"/>
          {/* arm from left end — curves down */}
          <path d="M-34 0 Q-50 20 -44 44 Q-38 58 -22 58"
            stroke="#E8E4C9" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" filter="url(#dm-arm)"/>
          {/* core */}
          <circle cx="0" cy="0" r="8"  fill="#F2EDCB" fillOpacity="0.5"  filter="url(#dm-core)"/>
          <circle cx="0" cy="0" r="2"  fill="#fff"    opacity="0.95"/>
          {/* bar-end star clusters */}
          <circle cx="34"  cy="0"   r="1.1" fill="#E8E4C9" opacity="0.7"/>
          <circle cx="-34" cy="0"   r="1.1" fill="#E8E4C9" opacity="0.7"/>
          <circle cx="42"  cy="-30" r="0.9" fill="#E8E4C9" opacity="0.6"/>
          <circle cx="-42" cy="30"  r="0.9" fill="#E8E4C9" opacity="0.6"/>
        </g>

        {/* Compact elliptical — left-mid. Smooth gradient, no arms. */}
        <g transform="translate(68,558) rotate(14) scale(0.4)" opacity="0.18">
          <ellipse cx="0" cy="0" rx="48" ry="33" fill="url(#dm-gal-g)" filter="url(#dm-halo)"/>
          <ellipse cx="0" cy="0" rx="28" ry="18" fill="#E8E4C9" fillOpacity="0.35" filter="url(#dm-core)"/>
          <ellipse cx="0" cy="0" rx="12" ry="8"  fill="#F2EDCB" fillOpacity="0.55" filter="url(#dm-core)"/>
          <circle  cx="0" cy="0" r="1.8" fill="#fff" opacity="0.95"/>
          <circle  cx="18" cy="-8"  r="0.7" fill="#E8E4C9" opacity="0.55"/>
          <circle  cx="-20" cy="9"  r="0.6" fill="#E8E4C9" opacity="0.5"/>
        </g>

        {/* ── Stars ── */}
        {DM_STATIC.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#E8E4C9" opacity={s.op} />
        ))}
        {DM_BLINK.map((s, i) => (
          <circle
            key={i}
            cx={s.x} cy={s.y} r={s.r}
            fill="#E8E4C9"
            style={{ animation: `dm-star-blink ${s.dur}s ease-in-out ${s.del}s infinite` }}
          />
        ))}
      </svg>
    </>
  );
}

export default function DesignerMind() {
  const svgRef = useRef<SVGSVGElement>(null);

  const [hoveredCluster,   setHoveredCluster]   = useState<string | null>(null);
  const [hoveredNode,      setHoveredNode]       = useState<HoveredNode | null>(null);
  const [hoveredLine,      setHoveredLine]       = useState<HoveredLine | null>(null);
  const [impactActive,     setImpactActive]      = useState(false);
  const [activePhilosophy, setActivePhilosophy]  = useState<typeof CLUSTERS[0] | null>(null);
  const [cardPos,          setCardPos]           = useState({ x: 0, y: 0 });
  const lastScrollRef = useRef(0);

  // Close drawer on scroll
  useEffect(() => {
    if (!activePhilosophy) return;
    const onScroll = () => setActivePhilosophy(null);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [activePhilosophy]);

  // ─── Idle glow via direct DOM manipulation (no re-renders) ───
  const idleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idleIndexRef = useRef(0);
  const prevIdleRef = useRef<{ dot: SVGCircleElement | null; ring: SVGCircleElement | null }>({ dot: null, ring: null });

  const isInteracting = !!(hoveredCluster || hoveredNode || impactActive);

  useEffect(() => {
    if (idleTimerRef.current) {
      clearInterval(idleTimerRef.current);
      idleTimerRef.current = null;
    }

    // Clean up previous idle highlight
    const cleanup = () => {
      if (prevIdleRef.current.dot) {
        prevIdleRef.current.dot.style.filter = '';
        prevIdleRef.current.dot.setAttribute('r', prevIdleRef.current.dot.dataset.baseR || '3');
        prevIdleRef.current.dot = null;
      }
      if (prevIdleRef.current.ring) {
        prevIdleRef.current.ring.remove();
        prevIdleRef.current.ring = null;
      }
    };

    if (isInteracting) {
      cleanup();
      return;
    }

    const svg = svgRef.current;
    if (!svg) return;

    idleTimerRef.current = setInterval(() => {
      // Remove previous idle glow
      cleanup();

      idleIndexRef.current = (idleIndexRef.current + 1) % ALL_NODE_IDS.length;
      const nodeId = ALL_NODE_IDS[idleIndexRef.current];

      const dot = svg.querySelector(`[data-node-id="${nodeId}"]`) as SVGCircleElement | null;
      if (!dot) return;

      const clusterId = nodeClusterId(nodeId);
      const cluster = CLUSTERS.find(c => c.id === clusterId);
      if (!cluster) return;

      // Enlarge the dot
      const baseR = parseFloat(dot.dataset.baseR || '3');
      dot.setAttribute('r', String(baseR + 1.5));
      dot.style.filter = `drop-shadow(0 0 5px ${cluster.color})`;
      prevIdleRef.current.dot = dot;

      // Create a pulse ring via raw SVG (no React re-render)
      const cx = parseFloat(dot.getAttribute('cx') || '0');
      const cy = parseFloat(dot.getAttribute('cy') || '0');
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ring.setAttribute('cx', String(cx));
      ring.setAttribute('cy', String(cy));
      ring.setAttribute('fill', 'none');
      ring.setAttribute('stroke', cluster.color);
      ring.setAttribute('stroke-width', '1.5');
      ring.setAttribute('opacity', '0.7');

      const animR = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animR.setAttribute('attributeName', 'r');
      animR.setAttribute('values', `${baseR};${baseR + 10};${baseR + 10}`);
      animR.setAttribute('dur', '0.65s');
      animR.setAttribute('fill', 'freeze');

      const animO = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animO.setAttribute('attributeName', 'opacity');
      animO.setAttribute('values', '0.7;0;0');
      animO.setAttribute('dur', '0.65s');
      animO.setAttribute('fill', 'freeze');

      ring.appendChild(animR);
      ring.appendChild(animO);
      dot.parentElement?.appendChild(ring);
      prevIdleRef.current.ring = ring;
    }, 650);

    return () => {
      cleanup();
      if (idleTimerRef.current) {
        clearInterval(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInteracting]);

  // Nodes connected to the currently hovered node
  const connectedNodes = useMemo(() => {
    if (!hoveredNode) return new Set<string>();
    const set = new Set<string>();
    const nid = hoveredNode.id;
    CLUSTERS.forEach(c => c.internalEdges.forEach(([s, t]) => {
      if (s === nid) set.add(t);
      if (t === nid) set.add(s);
    }));
    BRIDGES.forEach(b => {
      if (b.source === nid) set.add(b.target);
      if (b.target === nid) set.add(b.source);
    });
    return set;
  }, [hoveredNode]);

  // Clusters bridged to the hovered cluster
  const adjacentClusters = useMemo(() => {
    if (!hoveredCluster) return new Set<string>();
    const set = new Set<string>();
    BRIDGES.forEach(b => {
      const sc = nodeClusterId(b.source), tc = nodeClusterId(b.target);
      if (sc === hoveredCluster) set.add(tc);
      if (tc === hoveredCluster) set.add(sc);
    });
    return set;
  }, [hoveredCluster]);

  const handleNodeEnter = useCallback((
    node: typeof CLUSTERS[0]['nodes'][0],
    cluster: typeof CLUSTERS[0],
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setHoveredCluster(cluster.id);
    setHoveredNode({ ...node, clusterColor: cluster.color });
    setHoveredLine(null);
    if (svgRef.current) {
      const rect  = svgRef.current.getBoundingClientRect();
      const scale = Math.min(rect.width / VW, rect.height / VH);
      const ox    = (rect.width  - VW * scale) / 2;
      const oy    = (rect.height - VH * scale) / 2;
      setCardPos({
        x: rect.left + ox + (cluster.cx + node.dx) * scale,
        y: rect.top  + oy + (cluster.cy + node.dy) * scale,
      });
    }
  }, []);

  const handleLeave = useCallback(() => {
    setHoveredCluster(null);
    setHoveredNode(null);
    setHoveredLine(null);
  }, []);

  const handleLineEnter = useCallback((line: HoveredLine) => {
    setHoveredLine(line);
    setHoveredCluster(null);
    setHoveredNode(null);
  }, []);

  return (
    <section style={{ position: 'relative', background: 'transparent', overflow: 'visible' }}>

      <DMStarfield />
      <DesignerMindStyles />

      <SectionRail label="I think in systems" />

      {/* ── Mobile map of system headings (hidden on desktop) ── */}
      <div className="dm-mobile-grid section" style={{ display: 'none', padding: '0 20px 60px' }}>
        <svg viewBox="0 0 320 540" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
          {/* Lines */}
          <g stroke="rgba(232,228,201,0.2)" strokeWidth="1.5" strokeDasharray="4 6">
            <line x1="160" y1="40" x2="70" y2="120" />
            <line x1="160" y1="40" x2="250" y2="120" />
            <line x1="70" y1="120" x2="160" y2="200" />
            <line x1="250" y1="120" x2="160" y2="200" />
            <line x1="160" y1="200" x2="70" y2="280" />
            <line x1="160" y1="200" x2="250" y2="280" />
            <line x1="70" y1="280" x2="160" y2="360" />
            <line x1="250" y1="280" x2="160" y2="360" />
            <line x1="160" y1="360" x2="70" y2="440" />
            <line x1="160" y1="360" x2="250" y2="440" />
          </g>

          {/* Nodes */}
          {(() => {
            const positions = [
              { cx: 160, cy: 40, align: 'middle' as const }, // Human Understanding
              { cx: 70, cy: 120, align: 'start' as const }, // Research
              { cx: 160, cy: 200, align: 'middle' as const }, // Strategy
              { cx: 70, cy: 280, align: 'start' as const }, // Behavioral Design
              { cx: 250, cy: 280, align: 'end' as const }, // Design
              { cx: 160, cy: 360, align: 'middle' as const }, // Storytelling
              { cx: 70, cy: 440, align: 'start' as const }, // Creativity
              { cx: 250, cy: 440, align: 'end' as const }, // Future
              { cx: 250, cy: 120, align: 'end' as const }, // Business Metrics
            ];
            
            return CLUSTERS.map((c, i) => {
              const pos = positions[i];
              if (!pos) return null;
              
              // Text offset based on alignment
              const textYOffset = 24;
              const textXOffset = pos.align === 'start' ? -30 : pos.align === 'end' ? 30 : 0;
              const actualAlign = pos.align === 'start' ? 'start' : pos.align === 'end' ? 'end' : 'middle';
              
              return (
                <g key={c.id}>
                  {/* Glow */}
                  <circle cx={pos.cx} cy={pos.cy} r="16" fill={c.color} opacity="0.15" />
                  {/* Core */}
                  <circle cx={pos.cx} cy={pos.cy} r="6" fill={c.color} />
                  <circle cx={pos.cx} cy={pos.cy} r="2" fill="#FFF" />
                  
                  {/* Label */}
                  <text
                    x={pos.cx + textXOffset}
                    y={pos.cy + textYOffset}
                    textAnchor={actualAlign}
                    fill="#E8E4C9"
                    fontSize="12"
                    fontFamily="'Sora', sans-serif"
                    fontWeight="500"
                    style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
                  >
                    {c.label}
                  </text>
                </g>
              );
            });
          })()}
        </svg>
      </div>

      {/* SVG — hidden on mobile */}
      <div className="dm-svg-wrap" style={{ position:'relative', zIndex:1, marginLeft:0, marginRight:'auto', maxWidth:1200, padding:'0 clamp(16px,4vw,60px)' }}>
        <svg
          ref={svgRef}
          className="dm-svg"
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <SvgDefs />

          {/* Dismiss-impact background tap target */}
          <rect x={0} y={0} width={VW} height={VH} fill="transparent"
            onClick={() => setImpactActive(false)} />

          {/* ── LAYER 0: Cluster background circles (behind all lines) ── */}
          {CLUSTERS.map(cluster => (
            <circle key={`bg-${cluster.id}`} cx={cluster.cx} cy={cluster.cy} r={68} fill="black" opacity={1} />
          ))}

          {/* ── LAYER 1: Impact spokes (Impact → each cluster, straight lines) ── */}
          {CLUSTERS.map((c, i) => {
            const spokeHov  = hoveredLine?.kind === 'spoke' && hoveredLine.clusterId === c.id;
            const clustHov  = hoveredCluster === c.id;
            const lit       = impactActive || clustHov || spokeHov;
            return (
              <g key={`spoke-${c.id}`}>
                {/* Visual line */}
                <line
                  x1={IMPACT.cx} y1={IMPACT.cy} x2={c.cx} y2={c.cy}
                  stroke={lit ? c.color : '#FFF'}
                  strokeWidth={lit ? 1.7 : 0.9}
                  strokeDasharray={lit ? undefined : '6 9'}
                  pointerEvents="none"
                  style={{
                    opacity: lit ? 0.82 : undefined,
                    filter: lit ? `drop-shadow(0 0 5px ${c.color})` : undefined,
                    transition: 'stroke .3s ease, stroke-width .3s ease, opacity .3s ease, filter .3s ease',
                    animation: lit ? undefined : `dm-spoke-pulse ${4 + (i % 4) * 0.45}s ease-in-out infinite ${(i * 0.38).toFixed(1)}s`,
                  }}
                />
                {/* Fat transparent hit area */}
                <line
                  x1={IMPACT.cx} y1={IMPACT.cy} x2={c.cx} y2={c.cy}
                  stroke="transparent" strokeWidth={20}
                  style={{ cursor:'crosshair' }}
                  onMouseEnter={() => handleLineEnter({ kind:'spoke', clusterId: c.id })}
                  onMouseLeave={() => setHoveredLine(null)}
                />
              </g>
            );
          })}

          {/* ── LAYER 2: Bridge lines (cluster ↔ cluster) ── */}
          {BRIDGES.map((bridge, i) => {
            const src = NODE_POS[bridge.source];
            const tgt = NODE_POS[bridge.target];
            const sc  = nodeClusterId(bridge.source);
            const tc  = nodeClusterId(bridge.target);
            const srcC = CLUSTERS.find(c => c.id === sc);
            const tgtC = CLUSTERS.find(c => c.id === tc);

            const bridgeHov  = hoveredLine?.kind === 'bridge' && hoveredLine.idx === i;
            const clustActive = hoveredCluster === sc || hoveredCluster === tc;
            const nodeActive  = !!(hoveredNode && (bridge.source === hoveredNode.id || bridge.target === hoveredNode.id));
            const lit         = bridgeHov || clustActive || nodeActive;

            const litColor =
              hoveredCluster === sc ? (srcC?.color ?? '#FFF') :
              hoveredCluster === tc ? (tgtC?.color ?? '#FFF') :
              bridgeHov              ? (srcC?.color ?? '#FFF') : '#FFF';

            const glowClusterId = hoveredCluster === tc ? tc : sc;

            // Gentle quadratic curve
            const mx  = (src.cx + tgt.cx) / 2;
            const my  = (src.cy + tgt.cy) / 2;
            const cpx = mx + (i % 2 === 0 ? 24 : -24);
            const cpy = my + (i % 3 === 0 ? -28 : 16);
            const d   = `M ${src.cx} ${src.cy} Q ${cpx} ${cpy} ${tgt.cx} ${tgt.cy}`;

            return (
              <g key={`bridge-${i}`}>
                {/* Visual path */}
                <path d={d} fill="none"
                  stroke={lit ? litColor : '#FFF'}
                  strokeWidth={lit ? 1.6 : 0.85}
                  strokeDasharray={lit ? undefined : '5 7'}
                  pointerEvents="none"
                  style={{
                    opacity: lit ? 0.78 : undefined,
                    filter: (lit && glowClusterId) ? `drop-shadow(0 0 5px ${litColor})` : undefined,
                    transition: 'stroke .3s ease, stroke-width .3s ease, opacity .3s ease, filter .3s ease',
                    animation: lit ? undefined : `dm-bridge-pulse ${3 + (i % 3) * 0.6}s ease-in-out infinite ${(i * 0.42).toFixed(1)}s`,
                  }}
                />

                {/* Fat transparent hit area */}
                <path d={d} fill="none" stroke="transparent" strokeWidth={18}
                  style={{ cursor:'crosshair' }}
                  onMouseEnter={() => handleLineEnter({ kind:'bridge', idx: i })}
                  onMouseLeave={() => setHoveredLine(null)}
                />
              </g>
            );
          })}

          {/* ── LAYER 3: Cluster groups ── */}
          {CLUSTERS.map(cluster => {
            const isActive   = hoveredCluster === cluster.id;
            const isAdjacent = adjacentClusters.has(cluster.id);
            const groupOpacity =
              hoveredCluster && !isActive ? (isAdjacent ? 0.62 : 0.28) : 1;

            const labelY = cluster.cy < 360 ? cluster.cy - 76 : cluster.cy + 80;

            return (
              <g
                key={cluster.id}
                className={cluster.animClass}
                style={{ opacity: groupOpacity, transition: 'opacity .4s ease' }}
                onMouseEnter={() => { setHoveredCluster(cluster.id); setHoveredLine(null); }}
                onMouseLeave={handleLeave}
              >
                <circle cx={cluster.cx} cy={cluster.cy} r={84} fill="transparent" />

                <text x={cluster.cx} y={labelY} textAnchor="middle"
                  fill={cluster.color} fontSize="9" letterSpacing="2.6"
                  fontFamily="DM Sans,sans-serif" fontWeight="600"
                  opacity={isActive ? 1 : 0.6}
                  style={{
                    transition: 'opacity .3s ease, filter .3s ease',
                    pointerEvents: 'none',
                    filter: isActive
                      ? `drop-shadow(0 0 8px ${cluster.color}) drop-shadow(0 1px 4px rgba(0,0,0,0.95))`
                      : `drop-shadow(0 1px 4px rgba(0,0,0,0.95))`,
                  }}>
                  {cluster.label.toUpperCase()}
                </text>

                {/* Internal edges */}
                {cluster.internalEdges.map(([sid, tid]) => {
                  const sn  = cluster.nodes.find(n => n.id === sid)!;
                  const tn  = cluster.nodes.find(n => n.id === tid)!;
                  const lit = isActive || !!(hoveredNode && (hoveredNode.id === sid || hoveredNode.id === tid));
                  return (
                    <line key={`${sid}-${tid}`}
                      x1={cluster.cx + sn.dx} y1={cluster.cy + sn.dy}
                      x2={cluster.cx + tn.dx} y2={cluster.cy + tn.dy}
                      stroke={cluster.color} strokeWidth={lit ? 1 : 0.5}
                      opacity={lit ? 0.82 : 0.22}
                      style={{ transition:'all .3s ease', pointerEvents:'none' }} />
                  );
                })}

                {/* Nodes */}
                {cluster.nodes.map(node => {
                  const nx     = cluster.cx + node.dx;
                  const ny     = cluster.cy + node.dy;
                  const isThis  = hoveredNode?.id === node.id;
                  const isLinked = connectedNodes.has(node.id);
                  const glow    = isActive || isThis || isLinked;
                  const dotR    = node.r + (isThis ? 2.5 : isActive ? 1.5 : 0);

                  return (
                    <g key={node.id}
                      onMouseEnter={e => handleNodeEnter(node, cluster, e)}
                      onMouseLeave={handleLeave}
                      onClick={() => node.primary && setActivePhilosophy(cluster)}
                      style={{ cursor: node.primary ? 'pointer' : 'default' }}
                      aria-label={node.label}
                    >
                      {/* Hit area */}
                      <circle cx={nx} cy={ny} r={16} fill="transparent" />

                      {/* Main dot — data attributes for idle DOM manipulation */}
                      <circle
                        data-node-id={node.id}
                        data-base-r={String(dotR)}
                        cx={nx} cy={ny} r={dotR} fill={cluster.color}
                        style={{
                          transition: 'r .3s ease, filter .3s ease',
                          filter: glow
                            ? `drop-shadow(0 0 6px ${cluster.color}) drop-shadow(1px 2px 3px rgba(0,0,0,0.7))`
                            : 'drop-shadow(1px 2px 3px rgba(0,0,0,0.7))',
                        }} />
                      {/* sphere highlight overlay — white→transparent→dark gives the 3D pop */}
                      <circle cx={nx} cy={ny} r={dotR} fill={`url(#sphere-${cluster.id})`}
                        style={{ pointerEvents: 'none', transition: 'r .3s ease' }} />

                      {/* Label */}
                      <text x={nx} y={ny + node.r + 11} textAnchor="middle"
                        fill={cluster.color} fontSize="7.5"
                        fontFamily="DM Sans,sans-serif" opacity="0.72"
                        style={{
                          pointerEvents: 'none',
                          filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.95))',
                        }}>
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* ── LAYER 4: Meaningful Impact (center, always on top) ── */}
          <g
            onClick={e => { e.stopPropagation(); setImpactActive(v => !v); }}
            style={{ cursor:'pointer' }}
          >
            {/* Outer ambient glow */}
            <circle cx={IMPACT.cx} cy={IMPACT.cy} r={44}
              fill="url(#dm-impact-grad)"
              style={{ filter: 'blur(14px)' }} />

            {/* Active ring */}
            {impactActive && (
              <circle cx={IMPACT.cx} cy={IMPACT.cy} r={22}
                fill="none" stroke="var(--color-lemon)" strokeWidth="1.5" opacity="0.4"
                style={{
                  filter: 'drop-shadow(0 0 8px var(--color-lemon))',
                }} />
            )}

            {/* 3D sphere base */}
            <circle cx={IMPACT.cx} cy={IMPACT.cy} r={14} fill="var(--color-lemon)"
              style={{
                animation: 'dm-pulse-sphere 3s ease-in-out infinite',
                filter: impactActive
                  ? 'drop-shadow(0 0 12px var(--color-lemon)) drop-shadow(1px 2px 4px rgba(0,0,0,0.85))'
                  : 'drop-shadow(1px 2px 4px rgba(0,0,0,0.85))',
                transition: 'filter 0.3s ease',
              }} />
            {/* sphere highlight overlay */}
            <circle cx={IMPACT.cx} cy={IMPACT.cy} r={14} fill="url(#sphere-impact)"
              style={{ pointerEvents: 'none', animation: 'dm-pulse-sphere 3s ease-in-out infinite' }} />
            {/* specular dot — offset toward light source */}
            <circle cx={IMPACT.cx - 4} cy={IMPACT.cy - 4} r={2.5}
              fill="rgba(255,255,255,0.88)" style={{ pointerEvents: 'none' }} />

            {/* Label */}
            <text x={IMPACT.cx} y={IMPACT.cy + 30} textAnchor="middle"
              fill="var(--color-lemon)" fontSize="13"
              fontFamily="Sora,sans-serif" letterSpacing="1.3"
              opacity={impactActive ? 1 : 0.85}
              style={{
                pointerEvents: 'none',
                transition: 'opacity .3s ease, filter .3s ease',
                filter: impactActive
                  ? 'drop-shadow(0 0 9px var(--color-lemon)) drop-shadow(0 1px 4px rgba(0,0,0,0.95))'
                  : 'drop-shadow(0 1px 4px rgba(0,0,0,0.95))',
              }}>
              Meaningful Impact
            </text>
          </g>
        </svg>

        {/* Insight card */}
        {hoveredNode && (
          <div style={{
            position:'fixed', left: cardPos.x + 20, top: Math.max(cardPos.y - 52, 8),
            background:'var(--color-surface-flat)', backdropFilter:'blur(12px)',
            WebkitBackdropFilter:'blur(12px)',
            border:'1px solid rgba(242,167,196,0.18)', borderRadius:'12px',
            padding:'12px 16px', maxWidth:'185px', pointerEvents:'none',
            zIndex:100, boxShadow:'0 16px 36px rgba(0,0,0,0.55)',
          }}>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', fontWeight:500, color:hoveredNode.clusterColor }}>
              {hoveredNode.label}
            </div>
            {hoveredNode.desc && (
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'10px', color:'rgba(255,255,255,0.45)', lineHeight:1.6, marginTop:'4px' }}>
                {hoveredNode.desc}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Philosophy drawer — portalled to body to escape willChange:transform ancestor */}
      {createPortal(
        <AnimatePresence>
          {activePhilosophy && (
            <>
              <motion.div
                initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                onClick={() => {
                  if (Date.now() - lastScrollRef.current > 400) setActivePhilosophy(null);
                }}
                onWheel={() => { lastScrollRef.current = Date.now(); }}
                onTouchMove={() => { lastScrollRef.current = Date.now(); }}
                style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:50 }} />
              <motion.div
                initial={{ y:'100%' }} animate={{ y:0 }} exit={{ y:'100%' }}
                transition={{ type:'spring', damping:26, stiffness:200 }}
                style={{
                  position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)',
                  width:'100%', maxWidth:'600px', background:'rgba(20,12,16,0.97)',
                  borderTop:'1px solid var(--color-border-flat)', borderRadius:'20px 20px 0 0',
                  padding:'32px', zIndex:60, boxShadow:'0 -20px 40px rgba(0,0,0,0.5)',
                }}>
                <button onClick={() => setActivePhilosophy(null)} style={{
                  position:'absolute', top:'20px', right:'20px', background:'none',
                  border:'1px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.5)',
                  borderRadius:'6px', width:'32px', height:'32px', fontSize:'18px', lineHeight:1,
                  cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                }}>&times;</button>
                <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:'28px', color:activePhilosophy.color, margin:'0 0 16px 0', fontWeight:500 }}>
                  {activePhilosophy.label}
                </h3>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'15px', color:'rgba(255,255,255,0.7)', lineHeight:1.8, margin:0 }}>
                  {activePhilosophy.philosophy}
                </p>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}

