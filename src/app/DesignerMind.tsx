import React, { useState, useMemo, useRef, useCallback, useEffect, memo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';

const VW = 1000;
const VH = 700;
const IMPACT = { cx: 500, cy: 340 };

const CLUSTERS = [
  {
    id: 'human_understanding', idx: 0,
    label: 'Human Understanding', cx: 135, cy: 130, color: '#F2A7C4',
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
    label: 'Research', cx: 400, cy: 100, color: '#FAFFC7',
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
    c:  'creativity',          f: 'future',
  };
  return map[nodeId.split('_')[0]] || '';
}

// All node IDs ordered by cluster — for idle sequential glow
const ALL_NODE_IDS: string[] = CLUSTERS.reduce<string[]>((acc, c) => {
  c.nodes.forEach(n => acc.push(n.id));
  return acc;
}, []);

// Deterministic background stars
const BG_STARS = Array.from({ length: 60 }, (_, i) => ({
  x: (Math.abs(Math.sin(i * 127.1 + 1) * 43758.5)) % 100,
  y: (Math.abs(Math.sin(i * 311.7 + 2) * 43758.5)) % 100,
  r: 0.3 + (Math.abs(Math.sin(i * 53.9)) * 0.7),
  opacity: 0.08 + (Math.abs(Math.sin(i * 79.3)) * 0.12),
}));

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
      <stop offset="0%"   stopColor="#F2A7C4" stopOpacity="0.28" />
      <stop offset="100%" stopColor="#F2A7C4" stopOpacity="0" />
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
    @keyframes dm-spoke-pulse  { 0%,100%{opacity:.18} 50%{opacity:.40} }
    @keyframes dm-bridge-pulse { 0%,100%{opacity:.26} 50%{opacity:.50} }
    .dm-svg{width:100%;height:700px;overflow:visible}
    @media(max-width:768px){
      .dm-svg{height:500px;pointer-events:none}
      .dm-section{padding:60px 0 60px 0 !important}
      .dm-header-sub{margin-bottom:32px !important}
    }
    @media(prefers-reduced-motion:reduce){
      .dm-float-0,.dm-float-1,.dm-float-2,.dm-float-3,
      .dm-float-4,.dm-float-5,.dm-float-6,.dm-float-7{animation:none!important}
    }
    @keyframes dm-pulse-core {
      0%, 100% { r: 6px; opacity: 1; }
      50% { r: 8px; opacity: 0.55; }
    }
    .dm-pulse-core {
      animation: dm-pulse-core 3s ease-in-out infinite;
    }
  `}</style>
));
DesignerMindStyles.displayName = 'DesignerMindStyles';

export default function DesignerMind() {
  const svgRef = useRef<SVGSVGElement>(null);

  const [hoveredCluster,   setHoveredCluster]   = useState<string | null>(null);
  const [hoveredNode,      setHoveredNode]       = useState<HoveredNode | null>(null);
  const [hoveredLine,      setHoveredLine]       = useState<HoveredLine | null>(null);
  const [impactActive,     setImpactActive]      = useState(false);
  const [activePhilosophy, setActivePhilosophy]  = useState<typeof CLUSTERS[0] | null>(null);
  const [cardPos,          setCardPos]           = useState({ x: 0, y: 0 });

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
    <section className="dm-section" style={{ position: 'relative', backgroundColor: 'transparent', overflow: 'hidden', padding: '120px 0 100px 0' }}>

      <DesignerMindStyles />

      {/* Background stars */}
      <BackgroundStars />

      {/* Header */}
      <div style={{ position:'relative', zIndex:1, padding:'0 20px' }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'10px', letterSpacing:'0.28em', textTransform:'uppercase', color:'#F2A7C4', opacity:0.72, textAlign:'center', margin:'0 0 16px 0' }}>
          The Designer's Mind
        </p>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:700, fontSize:'clamp(2.2rem,4vw,3.8rem)', color:'#FFF', textAlign:'center', lineHeight:1.08, margin:'0 0 16px 0' }}>
          Connecting worlds, not just dots.
        </h2>
        <div className="dm-header-sub" style={{ textAlign:'center', maxWidth:'520px', margin:'0 auto 80px auto', fontFamily:"'DM Sans',sans-serif", fontSize:'15px', lineHeight:1.9, color:'rgba(255,255,255,0.42)' }}>
          <p style={{ margin:0 }}>I don't think in isolated skills.</p>
          <p style={{ margin:0 }}>I connect people, research, systems, creativity, technology, and impact into one cohesive understanding.</p>
          <p style={{ margin:0 }}>Every project is a journey across these worlds.</p>
        </div>
      </div>

      {/* SVG */}
      <div style={{ position:'relative', zIndex:1 }}>
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
                  style={{ transition:'opacity .3s ease', pointerEvents:'none' }}>
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
                          filter: glow ? `drop-shadow(0 0 5px ${cluster.color})` : undefined,
                        }} />

                      {/* Label */}
                      <text x={nx} y={ny + node.r + 11} textAnchor="middle"
                        fill={cluster.color} fontSize="7.5"
                        fontFamily="DM Sans,sans-serif" opacity="0.55"
                        style={{ pointerEvents:'none' }}>
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
                fill="none" stroke="#FAFFC7" strokeWidth="1.5" opacity="0.4"
                style={{
                  filter: 'drop-shadow(0 0 8px #FAFFC7)',
                }} />
            )}

            {/* Middle ring */}
            <circle cx={IMPACT.cx} cy={IMPACT.cy} r={11}
              fill="none" stroke="#FAFFC7" strokeWidth="1"
              opacity={impactActive ? 0.6 : 0.32} style={{ transition:'opacity .3s ease' }} />

            {/* Pulsing core */}
            <circle cx={IMPACT.cx} cy={IMPACT.cy} fill="#FAFFC7"
              className="dm-pulse-core"
              style={{
                filter: impactActive ? 'drop-shadow(0 0 8px #FAFFC7)' : undefined,
                transition: 'filter 0.3s ease',
              }}
            />

            {/* Label */}
            <text x={IMPACT.cx} y={IMPACT.cy + 30} textAnchor="middle"
              fill="#FAFFC7" fontSize="13"
              fontFamily="Cormorant Garamond,serif" letterSpacing="1.3"
              opacity={impactActive ? 1 : 0.85}
              style={{ pointerEvents:'none', transition:'opacity .3s ease' }}>
              Meaningful Impact
            </text>
          </g>
        </svg>

        {/* Insight card */}
        {hoveredNode && (
          <div style={{
            position:'fixed', left: cardPos.x + 20, top: Math.max(cardPos.y - 52, 8),
            background:'rgba(20,12,16,0.92)', backdropFilter:'blur(12px)',
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
                onPointerDown={(e) => {
                  const startY = e.clientY;
                  const startX = e.clientX;
                  const onUp = (upE: PointerEvent) => {
                    const moved = Math.abs(upE.clientY - startY) > 8 || Math.abs(upE.clientX - startX) > 8;
                    if (!moved) setActivePhilosophy(null);
                    window.removeEventListener('pointerup', onUp);
                  };
                  window.addEventListener('pointerup', onUp);
                }}
                style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:50 }} />
              <motion.div
                initial={{ y:'100%' }} animate={{ y:0 }} exit={{ y:'100%' }}
                transition={{ type:'spring', damping:26, stiffness:200 }}
                style={{
                  position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)',
                  width:'100%', maxWidth:'600px', background:'rgba(20,12,16,0.97)',
                  borderTop:'1px solid rgba(242,167,196,0.15)', borderRadius:'20px 20px 0 0',
                  padding:'32px', zIndex:60, boxShadow:'0 -20px 40px rgba(0,0,0,0.5)',
                }}>
                <button onClick={() => setActivePhilosophy(null)} style={{
                  position:'absolute', top:'20px', right:'20px', background:'none',
                  border:'1px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.5)',
                  borderRadius:'6px', width:'32px', height:'32px', fontSize:'18px', lineHeight:1,
                  cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                }}>&times;</button>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'28px', color:activePhilosophy.color, margin:'0 0 16px 0', fontWeight:700 }}>
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
