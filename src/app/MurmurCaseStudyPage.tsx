import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, Lightbulb, Search, Zap, TrendingUp, AlertCircle, XCircle, RotateCw, Star, MoveRight, Shield, Heart, Brain, Mic, Watch, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import murmurBannerUrl from '../imports/Murmur/banner.png';

interface MurmurCaseStudyPageProps {
  onClose: (scrollTo?: string) => void;
}

// ── Collectible Card ─────────────────────────────────────────────────────────

const NUDGE_MESSAGES = [
  "Take your time.",
  "There's no rush.",
  "Breathe.",
  "Enjoy the details.",
  "Almost there."
];

const cardVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  exit: (target: { x: number; y: number }) => ({
    opacity: 0, scale: 0.25, x: target.x, y: target.y,
    transition: { duration: 0.55, ease: [0.4, 0, 1, 1] },
  }),
};

interface CollectibleCardProps {
  id: number;
  style?: React.CSSProperties;
  isCollected: boolean;
  showNudge: boolean;
  onCollect: (id: number) => void;
  counterRef: React.RefObject<HTMLDivElement>;
}

function CollectibleCard({ id, style, isCollected, showNudge, onCollect, counterRef }: CollectibleCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [exitTarget, setExitTarget] = useState({ x: 0, y: -300 });

  return (
    <div className="absolute z-[80] flex justify-center items-center" style={style}>
      <AnimatePresence mode="wait">
        {!isCollected ? (
          <motion.div
            key="card"
            ref={cardRef}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            custom={exitTarget}
            className="cursor-pointer group"
            onClick={(e) => {
              e.stopPropagation();
              if (cardRef.current && counterRef.current) {
                const cardRect = cardRef.current.getBoundingClientRect();
                const counterRect = counterRef.current.getBoundingClientRect();
                setExitTarget({
                  x: counterRect.left + counterRect.width / 2 - cardRect.left - cardRect.width / 2,
                  y: counterRect.top + counterRect.height / 2 - cardRect.top - cardRect.height / 2,
                });
              }
              onCollect(id);
            }}
          >
            <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
              <motion.div
                animate={{ x: [0, -3, 3, -3, 3, -2, 2, 0], rotate: [0, -1.5, 1.5, -1.5, 1.5, -1, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.45, repeatDelay: 1 + (id - 1) * 0.5, ease: "easeInOut" }}
              >
                <div className="w-16 h-20 bg-[#FAFFC7] border border-[#FAFFC7] rounded-xl shadow-[0_0_15px_rgba(250,255,199,0.35)] flex flex-col items-center justify-center text-center px-1">
                  <Star className="w-6 h-6 text-[#B78494] group-hover:scale-110 transition-transform duration-300" fill="currentColor" />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : showNudge ? (
          <motion.div
            key="nudge"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-[#F2A7C4] font-serif italic text-sm pointer-events-none whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] bg-[#121212]/80 px-4 py-2 rounded-full border border-[#333] shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
          >
            "{NUDGE_MESSAGES[id - 1]}"
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// ── App Map Visualization ─────────────────────────────────────────────────────

function AppMapViz() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const categories = [
    { label: 'Meditation', count: 94, x: 120, y: 90, color: '#93C5FD', r: 38 },
    { label: 'Mood Tracking', count: 112, x: 280, y: 60, color: '#F2A7C4', r: 42 },
    { label: 'Therapy / CBT', count: 78, x: 440, y: 90, color: '#A78BFA', r: 34 },
    { label: 'Community', count: 65, x: 580, y: 75, color: '#6EE7B7', r: 30 },
    { label: 'Nutrition', count: 48, x: 700, y: 100, color: '#FAFFC7', r: 26 },
    { label: 'Postpartum', count: 88, x: 180, y: 200, color: '#FCA5A5', r: 36 },
    { label: 'Mindfulness', count: 102, x: 360, y: 195, color: '#93C5FD', r: 40 },
    { label: 'Partners', count: 0, x: 540, y: 200, color: '#444', r: 22 },
  ];

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg width="100%" viewBox="0 0 800 290" style={{ display: 'block', minWidth: 600 }}>
        <rect width="800" height="290" rx="16" fill="#0D0A0B" />
        {/* Faint grid */}
        {[100, 200, 300, 400, 500, 600, 700].map(x => (
          <line key={x} x1={x} y1="0" x2={x} y2="290" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        ))}
        {[100, 200].map(y => (
          <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        ))}

        {categories.map((cat) => {
          const isHov = hoveredCategory === cat.label;
          const isPartners = cat.label === 'Partners';
          return (
            <g key={cat.label}
              onMouseEnter={() => setHoveredCategory(cat.label)}
              onMouseLeave={() => setHoveredCategory(null)}
              style={{ cursor: 'default' }}
            >
              {/* Glow */}
              <circle cx={cat.x} cy={cat.y} r={cat.r + 12} fill={cat.color}
                opacity={isHov ? 0.12 : 0.04}
                style={{ filter: 'blur(8px)', transition: 'opacity 0.25s' }}
              />
              {/* Main circle */}
              <circle cx={cat.x} cy={cat.y} r={cat.r}
                fill={isPartners ? 'rgba(255,255,255,0.02)' : `${cat.color}18`}
                stroke={cat.color}
                strokeWidth={isPartners ? 1.5 : isHov ? 1.5 : 0.8}
                strokeDasharray={isPartners ? '4 3' : undefined}
                opacity={isHov ? 1 : 0.7}
                style={{ transition: 'all 0.25s' }}
              />
              {/* Count */}
              {!isPartners && (
                <text x={cat.x} y={cat.y - 4} textAnchor="middle"
                  fontFamily="'Cormorant Garamond', serif" fontSize={cat.r > 36 ? 18 : 15}
                  fill={cat.color} opacity={isHov ? 1 : 0.8}
                  style={{ transition: 'opacity 0.25s' }}
                >{cat.count}</text>
              )}
              {/* Label */}
              <text x={cat.x} y={isPartners ? cat.y + 5 : cat.y + 13} textAnchor="middle"
                fontFamily="'DM Sans', sans-serif" fontSize={isPartners ? 9 : 8}
                fill={isPartners ? '#666' : 'rgba(255,255,255,0.5)'}
                letterSpacing="0.05em"
                style={{ transition: 'opacity 0.25s' }}
              >{isPartners ? 'Partner Apps: 0' : cat.label}</text>
            </g>
          );
        })}

        {/* Zero zone callout */}
        <rect x="490" y="165" width="108" height="72" rx="8" fill="none" stroke="rgba(109,31,42,0.6)" strokeWidth="1" strokeDasharray="3 3" />
        <text x="544" y="248" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="8"
          fill="rgba(242,167,196,0.5)" letterSpacing="0.1em">ZERO COMPETITORS</text>
      </svg>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#6B7280', textAlign: 'center', letterSpacing: '0.08em', marginTop: 10 }}>
        587 apps mapped · 38 met criteria · Partner category = 0 apps
      </p>
    </div>
  );
}

// ── AI Pipeline Diagram ───────────────────────────────────────────────────────

function AIPipelineViz() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const inputs = [
    { id: 'voice', label: 'Her Voice', sub: 'Tone & sentiment', icon: Mic, color: '#F2A7C4' },
    { id: 'wearable', label: 'Wearables', sub: 'Sleep, HRV, activity', icon: Watch, color: '#93C5FD' },
    { id: 'mood', label: 'Mood Log', sub: 'Daily check-in', icon: Heart, color: '#FAFFC7' },
  ];

  const outputs = [
    { id: 'action', label: 'His Daily Action', sub: 'One specific, non-blaming task', color: '#6EE7B7' },
    { id: 'unlock', label: 'Both Must Join', sub: 'Couple lock mechanism', color: '#A78BFA' },
  ];

  return (
    <div style={{ background: '#0D0A0B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '32px 24px', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '24px', alignItems: 'center' }}>
        {/* Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>She signals</div>
          {inputs.map((inp) => {
            const Icon = inp.icon;
            const isHov = hoveredNode === inp.id;
            return (
              <motion.div key={inp.id}
                whileHover={{ x: 4 }}
                onMouseEnter={() => setHoveredNode(inp.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  background: isHov ? `${inp.color}12` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isHov ? inp.color + '55' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 12, padding: '12px 16px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  transition: 'all 0.2s ease', cursor: 'default',
                }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${inp.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon style={{ width: 15, height: 15, color: inp.color }} />
                </div>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{inp.label}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{inp.sub}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Center AI core */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(147,197,253,0.15) 0%, rgba(242,167,196,0.08) 60%, transparent 100%)',
              border: '1px solid rgba(147,197,253,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 40px rgba(147,197,253,0.12)',
            }}
          >
            <Brain style={{ width: 28, height: 28, color: '#93C5FD' }} />
          </motion.div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(147,197,253,0.6)' }}>Murmur AI</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[0, 1, 2].map(i => (
              <motion.div key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                style={{ width: 4, height: 4, borderRadius: '50%', background: '#93C5FD' }}
              />
            ))}
          </div>
        </div>

        {/* Outputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 4, textAlign: 'right' }}>He acts</div>
          {outputs.map((out) => {
            const isHov = hoveredNode === out.id;
            return (
              <motion.div key={out.id}
                whileHover={{ x: -4 }}
                onMouseEnter={() => setHoveredNode(out.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  background: isHov ? `${out.color}12` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isHov ? out.color + '55' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 12, padding: '12px 16px',
                  display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end',
                  transition: 'all 0.2s ease', cursor: 'default',
                }}
              >
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{out.label}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{out.sub}</div>
                </div>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${out.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {out.id === 'action' ? <Wifi style={{ width: 15, height: 15, color: out.color }} /> : <Shield style={{ width: 15, height: 15, color: out.color }} />}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Nudge Formula ─────────────────────────────────────────────────────────────

function NudgeFormula() {
  const parts = [
    { label: 'Context', desc: "What she's feeling right now", color: '#F2A7C4', example: '"She had a rough night — sleep score 3/10."' },
    { label: 'Action', desc: 'One specific thing he can do', color: '#93C5FD', example: '"Bring her a warm drink at 8pm. No conversation needed."' },
    { label: 'Frame', desc: 'Non-blaming, identity-safe language', color: '#FAFFC7', example: '"You\'re not fixing anything. You\'re just showing up."' },
    { label: 'Unlock', desc: 'Requires both partners to have joined', color: '#6EE7B7', example: '"Action unlocked because she logged in today."' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {parts.map((part, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          style={{
            display: 'flex', gap: 16, alignItems: 'flex-start',
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${part.color}22`,
            borderLeft: `3px solid ${part.color}`,
            borderRadius: 12, padding: '16px 20px',
          }}
        >
          <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: '50%', background: `${part.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 14, color: part.color }}>{i + 1}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: part.color }}>{part.label}</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{part.desc}</span>
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{part.example}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Insight Data ─────────────────────────────────────────────────────────────

const INSIGHT_GROUPS = [
  {
    id: 'she-signals',
    num: '01',
    label: 'She signals without words',
    tagline: 'She shows it in pace, silence, and timing — not sentences.',
    color: '#F2A7C4',
    insights: [
      {
        num: 1,
        title: 'Mothers express distress indirectly',
        metrics: ['94.4% text-based messages', '9–11 PM distress peak', 'Only 54% of family recognize PPD'],
        evidence: [
          { name: 'Pranali', text: 'Went to maika instead of asking for help' },
          { name: 'Monomayee', text: 'Feared asking — never stated her needs' },
          { name: 'Deepti', text: 'Used silence and crying as signals' },
        ],
        solution: 'Daily voice/text check-in reads tone, sentiment, and timing. AI detects patterns humans miss — no need for her to explain.',
        metric: '30-sec check-in · AI flags patterns before she can name them',
      },
      {
        num: 3,
        title: 'Emotional gap is the core problem',
        metrics: ['Partnership quality drops sharply postpartum', '"Tenderness" subscale most affected', 'Silence used to avoid conflict'],
        evidence: [
          { name: 'Pranali', text: 'Husband supported emotionally — she was still depressed' },
          { name: 'Monomayee', text: 'He was "extremely supportive" yet she still feared asking' },
          { name: 'Interview-2', text: 'Practical support ≠ emotional support' },
        ],
        solution: 'AI sits between them — reads her signals, translates to his language. Weekly letter shows both what they cannot see.',
        metric: 'AI-mediated translation · Weekly letter · No direct confrontation required',
      },
      {
        num: 7,
        title: 'No time. No energy. No margin.',
        metrics: ['10–15 min/day deemed "too demanding"', 'Prefer bite-sized interventions'],
        evidence: [
          { name: 'Deepti', text: 'Energy drained by end of day' },
          { name: 'Interview-1', text: '"No other option" — suppressed emotions to continue caregiving' },
          { name: 'Interview-2', text: '"Mental peace is very important"' },
        ],
        solution: '30-second check-in. One nudge. One identity task. All under 2 minutes total.',
        metric: 'Total daily interaction <2 min · Passive wearable data · One-card-one-action',
      },
    ],
  },
  {
    id: 'he-is-lost',
    num: '02',
    label: "He's present but lost",
    tagline: "He wants to help. Nobody told him how.",
    color: '#93C5FD',
    insights: [
      {
        num: 2,
        title: 'Partners feel helpless, not absent',
        metrics: ['80% of fathers feel "useless"', '90% find role demands overwhelming', '100% recruited via social media — not healthcare'],
        evidence: [
          { name: 'Yogesh', text: '"Now I feel it was my mistake"' },
          { name: 'Nikhil', text: 'Unsure what to do during health crises' },
          { name: 'Interview-3 husband', text: "\"Not sure when mother's health changes\"" },
        ],
        solution: 'One daily nudge: data anchor + universal fact + specific action + optional choice. No ambiguity. No blame.',
        metric: 'Single nudge format · Cause-effect framing · Autonomy preserved through choice',
      },
      {
        num: 5,
        title: 'Long-distance absence amplifies crisis',
        metrics: ['+89% severe anxiety when partner takes no leave'],
        evidence: [
          { name: 'Deepti', text: '"Husband in US... navigating alone"' },
          { name: 'Nalini', text: 'Husband on US shift 4 PM–3 AM, uninvolved' },
          { name: 'Yogesh', text: 'Visa absence — financial support only' },
        ],
        solution: 'Nudges create emotional presence without physical presence. Weekly letter keeps absent partner informed and connected.',
        metric: 'Async nudge timing · Weekly letter as connection bridge · No real-time presence required',
      },
    ],
  },
  {
    id: 'her-world',
    num: '03',
    label: "The world she's inside",
    tagline: 'Identity, family, and culture create invisible walls.',
    color: '#FAFFC7',
    insights: [
      {
        num: 4,
        title: 'Motherhood swallows identity',
        metrics: ['Only 47% feel prepared for self-care', '38% first-time mothers', '40% report isolation'],
        evidence: [
          { name: 'Interview-2', text: '"Why I am not earning?"' },
          { name: 'Radhamani', text: 'Left Cognizant job after birth' },
          { name: 'Monomayee', text: 'Professional identity clash postpartum' },
        ],
        solution: 'Daily identity task: under 2 minutes, reconnects to pre-motherhood self. No output required. Just a moment.',
        metric: '<2 min tasks · Zero output pressure · Identity restoration as daily micro-practice',
      },
      {
        num: 6,
        title: 'Joint family: support and stressor',
        metrics: ['Interference: significant stressor', 'Maika vs. sasural tension common', 'Privacy deprivation frequent'],
        evidence: [
          { name: 'Pranali', text: 'In-laws unsupportive — chose maika as sanctuary' },
          { name: 'Interview-1', text: 'In-laws expected housework during recovery' },
          { name: 'Sangeeta', text: 'Zero in-law support' },
        ],
        solution: 'Mother controls all data sharing. Privacy by design. AI understands maika as protective sanctuary, not failure.',
        metric: 'Mother-controlled visibility · Culturally aware AI · No judgment on family choices',
      },
    ],
  },
  {
    id: 'broken-tools',
    num: '04',
    label: 'The broken tools',
    tagline: 'Five apps open. Still alone.',
    color: '#6EE7B7',
    insights: [
      {
        num: 8,
        title: 'Every tool is solo — no couple layer',
        metrics: ['587 apps searched', '38 met criteria', '0 had partner features', '0 had paternal screening', '92% had no evidence base'],
        evidence: [
          { name: 'Deepti', text: 'PiyoLog + Cry Analyser — solo tools, no partner loop' },
          { name: 'Nikhil', text: 'Google + ChatGPT — stitching information alone' },
          { name: 'Interview-3 husband', text: 'Google + calling mother — no structured guidance' },
        ],
        solution: 'One app. Both partners. Shared data. Shared understanding. No more switching between 5 apps.',
        metric: '6 features total · 3 for her, 2 for him, 2 shared · Code-pair onboarding',
      },
      {
        num: 9,
        title: 'Medical trauma goes unacknowledged',
        metrics: ['Experiences routinely dismissed', 'No systemic follow-up or documentation'],
        evidence: [
          { name: 'Sangeeta', text: 'No anesthesia doctor present — hospital mistakes' },
          { name: 'Sucheta', text: 'Stillbirth — had heard similar cases before' },
          { name: 'Monomayee', text: '"Doctors normalized painful experiences"' },
          { name: 'Interview-1', text: '"To doctors everything is normal"' },
        ],
        solution: 'Doctor notes integration (with consent). Second-opinion guidance. Hospital-agnostic — works with any provider.',
        metric: 'Optional doctor note upload · AI empowers mother with her own data · No judgment',
      },
    ],
  },
];

const OUT_OF_SCOPE = {
  title: 'Financial stress intertwined with emotional health',
  metrics: ['Low income = documented PPD risk factor', 'Limited postpartum financial planning research'],
  evidence: [
    { name: 'Sangeeta', text: '"Financial problems... husband started new business"' },
    { name: 'Interview-2', text: 'Loss of income, hospital expenses' },
    { name: 'Deepti', text: 'Job searching while caregiving' },
    { name: 'Radhamani', text: 'Left full-time job at Cognizant' },
  ],
  v1: 'Acknowledged in AI check-in (stress detection) — but not solved by the app.',
  v2: 'V2+: API partnership with PhonePe, ET Money — not a built-in feature.',
};

// ── Main Component ────────────────────────────────────────────────────────────

export default function MurmurCaseStudyPage({ onClose }: MurmurCaseStudyPageProps) {
  const [collectedCards, setCollectedCards] = useState<number[]>([]);
  const [nudgeStates, setNudgeStates] = useState<Record<number, boolean>>({});
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [isNavScrolled, setIsNavScrolled] = useState(false);

  const counterRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const mobileProgressBarRef = useRef<HTMLDivElement>(null);
  const xpTextRef = useRef<HTMLSpanElement>(null);
  const isNavScrolledRef = useRef(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollMax = target.scrollHeight - target.clientHeight;
    let progress = scrollMax > 0 ? (target.scrollTop / scrollMax) * 100 : 0;
    if (progress > 98) progress = 100;

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

    if (progress > 95 && !hasReachedEnd) setHasReachedEnd(true);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCollect = (id: number) => {
    if (!collectedCards.includes(id)) {
      setCollectedCards(prev => [...prev, id]);
      setNudgeStates(prev => ({ ...prev, [id]: true }));
      setTimeout(() => setNudgeStates(prev => ({ ...prev, [id]: false })), 4000);
    }
  };

  const fadeUpConfig = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#000000] text-white overflow-y-auto hide-scrollbar"
      data-lenis-prevent
      onScroll={handleScroll}
    >
      {/* Noise overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[110] opacity-[0.04]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      {/* Floating nav */}
      <motion.nav
        initial={false}
        animate={{
          scale: isNavScrolled ? 0.95 : 1,
          backgroundColor: isNavScrolled ? 'rgba(18,18,18,0.6)' : 'rgba(18,18,18,0.8)',
          backdropFilter: isNavScrolled ? 'blur(24px)' : 'blur(16px)',
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
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
            { id: 'research', label: 'Research' },
            { id: 'solution', label: 'Solution' },
          ].map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className="text-[10px] font-semibold text-gray-400 hover:text-[#93C5FD] transition-colors tracking-[0.15em] uppercase"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <div ref={counterRef} className="w-5 h-6 bg-[#FAFFC7] border border-[#FAFFC7] rounded shadow-[0_0_10px_rgba(250,255,199,0.4)] flex items-center justify-center">
            <Star className="w-3 h-3 text-[#F2A7C4] drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]" fill="currentColor" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">
            <span className={collectedCards.length === 5 ? 'text-[#93C5FD]' : 'text-[#F2A7C4]'}>{collectedCards.length}</span>/5
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-[#1E1E1E] flex items-center justify-center hover:bg-[#93C5FD] transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 21.7C17.3 21.7 21.7 17.3 21.7 12C21.7 6.7 17.3 2.3 12 2.3C6.7 2.3 2.3 6.7 2.3 12C2.3 17.3 6.7 21.7 12 21.7Z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8.5 8.5C9.5 6.5 14.5 6.5 15.5 8.5C16.5 10.5 14.5 12.5 12 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="17" r="1" fill="currentColor" />
          </svg>
        </button>
      </motion.nav>

      {/* Mobile progress */}
      <div className="fixed top-[4.5rem] left-0 right-0 z-[120] h-0.5 bg-[#1E1E1E] md:hidden pointer-events-none">
        <div ref={mobileProgressBarRef} className="h-full bg-gradient-to-r from-[#93C5FD] to-[#F2A7C4]" style={{ width: '0%', transition: 'width 0.3s ease' }} />
      </div>

      {/* Vertical XP bar */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[120] h-[40vh] flex-col items-center gap-4 hidden md:flex pointer-events-none">
        <span ref={xpTextRef} className="text-[9px] font-bold tracking-[0.2em] text-gray-500 uppercase h-10 flex justify-center items-center" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>0%</span>
        <div className="w-1.5 flex-1 bg-[#1E1E1E] border border-[#333] rounded-full overflow-hidden">
          <div ref={progressBarRef} className="w-full bg-gradient-to-b from-[#93C5FD] to-[#F2A7C4]" style={{ height: '0%', transition: 'height 0.3s ease' }} />
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="pt-[160px] pb-24 border-b border-[#333] relative">
        <CollectibleCard id={1} style={{ top: '18%', right: '12%' }} isCollected={collectedCards.includes(1)} showNudge={!!nudgeStates[1]} onCollect={handleCollect} counterRef={counterRef} />

        <motion.div className="max-w-[960px] mx-auto px-8" {...fadeUpConfig}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#F2A7C4]" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#F2A7C4]">Case Study</span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl leading-[1.1] tracking-tight text-[#FAFFC7] mb-6">
            Murmur
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-[580px] mb-10 font-light">
            The first AI that bridges the emotional gap between new mothers and fathers — using her signals to give him one specific daily action. Together.
          </p>

          {/* Banner */}
          <div className="rounded-3xl overflow-hidden border border-[#333] mb-12" style={{ maxHeight: 440 }}>
            <img src={murmurBannerUrl} alt="Murmur" className="w-full h-full object-cover object-center block" style={{ maxHeight: 440 }} />
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-6 rounded-2xl bg-[#121212]/50 border border-[#222]">
            {[
              { label: 'Role', value: 'Lead Product Designer' },
              { label: 'Domain', value: 'Healthcare · AI' },
              { label: 'Research', value: '59 studies · 587 apps' },
              { label: 'Status', value: 'Concept — Blue Ocean' },
            ].map((m, i) => (
              <div key={i} className="flex flex-col gap-2">
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500">{m.label}</span>
                <span className="text-sm font-medium text-gray-200">{m.value}</span>
              </div>
            ))}
          </div>

          {/* Tools + deliverables */}
          <div className="flex flex-col md:flex-row gap-8 mb-16 p-6 rounded-2xl bg-[#121212]/50 border border-[#222]">
            <div className="flex flex-col gap-4 flex-1">
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500">Tools</span>
              <div className="flex gap-2 flex-wrap">
                {['Figma', 'FigJam', 'Perplexity', 'ChatGPT', 'Claude', 'Notion', 'Maze'].map((t) => (
                  <span key={t} className="border border-white/10 bg-white/5 text-gray-300 text-xs rounded-full px-3 py-1">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500">Deliverables</span>
              <div className="flex gap-2 flex-wrap">
                {['Research', 'Competitor Map', 'AI Pipeline', 'Design System', 'Prototype', 'Safety Spec'].map((t) => (
                  <span key={t} className="bg-[#F2A7C4]/10 text-[#F2A7C4] border border-[#F2A7C4]/30 font-semibold text-xs rounded-full px-3 py-1">{t}</span>
                ))}
              </div>
            </div>
          </div>

          <p className="font-serif text-xl text-white/50 italic text-center">
            One silence. Two people. Zero apps that bridged them.
          </p>
        </motion.div>
      </section>

      {/* ── From the Field ── */}
      <section id="problem" className="py-32 border-b border-[#333] relative">
        <CollectibleCard id={2} style={{ bottom: '22%', left: '8%' }} isCollected={collectedCards.includes(2)} showNudge={!!nudgeStates[2]} onCollect={handleCollect} counterRef={counterRef} />

        <motion.div className="max-w-[960px] mx-auto px-8" {...fadeUpConfig}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#93C5FD]" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#93C5FD]">02 — From the Field</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight text-white mb-8">
            9 interviews.<br />10 findings. 5 silences.
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-[620px] mb-20 font-light">
            Every insight below came from primary research — real names, real quotes, real pain. Each one pointed toward the same gap.
          </p>

          {/* Insight groups */}
          {INSIGHT_GROUPS.map((group, gIdx) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1], delay: gIdx * 0.04 }}
              className="mb-20"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-5 h-px" style={{ background: group.color }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: group.color }}>
                  Group {group.num}
                </span>
              </div>
              <h3 className="font-serif text-3xl text-white mb-2">{group.label}</h3>
              <p className="text-sm text-gray-500 mb-10">{group.tagline}</p>

              <div className={`grid gap-6 ${group.insights.length === 3 ? 'lg:grid-cols-3 md:grid-cols-2' : 'md:grid-cols-2'}`}>
                {group.insights.map((insight) => (
                  <motion.div
                    key={insight.num}
                    whileHover={{ y: -4 }}
                    style={{
                      background: '#0D0A0B',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderTop: `2px solid ${group.color}`,
                      borderRadius: 20,
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column' as const,
                      gap: 18,
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>
                        Insight {insight.num}
                      </div>
                      <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1.3, margin: 0 }}>
                        {insight.title}
                      </h4>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                      {insight.metrics.map((m, mi) => (
                        <span key={mi} style={{
                          background: `${group.color}10`,
                          border: `1px solid ${group.color}30`,
                          color: group.color,
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 9,
                          letterSpacing: '0.06em',
                          padding: '4px 10px',
                          borderRadius: 100,
                        }}>
                          {m}
                        </span>
                      ))}
                    </div>

                    <div style={{ borderLeft: `2px solid ${group.color}25`, paddingLeft: 14 }}>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.22)', marginBottom: 10 }}>
                        From the interviews
                      </div>
                      {insight.evidence.map((ev, ei) => (
                        <div key={ei} style={{ marginBottom: ei < insight.evidence.length - 1 ? 8 : 0 }}>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, color: group.color }}>{ev.name}</span>
                          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 13, color: 'rgba(255,255,255,0.42)', marginLeft: 6 }}>"{ev.text}"</span>
                        </div>
                      ))}
                    </div>

                    <div style={{
                      background: `${group.color}08`,
                      border: `1px solid ${group.color}20`,
                      borderRadius: 12,
                      padding: '14px 16px',
                      marginTop: 'auto',
                    }}>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: group.color, opacity: 0.8, marginBottom: 6 }}>
                        Murmur's answer
                      </div>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0 }}>{insight.solution}</p>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 6, letterSpacing: '0.04em' }}>{insight.metric}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Out of Scope — Insight 10 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-5 h-px bg-[#333]" />
              <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#444]">Group 05 — Deliberately Out of Scope</span>
            </div>
            <h3 className="font-serif text-2xl text-gray-600 mb-8">Financial stress</h3>

            <div style={{
              background: 'rgba(255,255,255,0.015)',
              border: '1px dashed rgba(255,255,255,0.1)',
              borderRadius: 20,
              padding: '28px 24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 24,
            }}>
              <div>
                <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.35)', marginBottom: 14, lineHeight: 1.3 }}>
                  {OUT_OF_SCOPE.title}
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                  {OUT_OF_SCOPE.metrics.map((m, mi) => (
                    <span key={mi} style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      color: 'rgba(255,255,255,0.28)',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 9,
                      padding: '4px 10px',
                      borderRadius: 100,
                      letterSpacing: '0.06em',
                    }}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.07)', paddingLeft: 24 }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.18)', marginBottom: 10 }}>
                  From the interviews
                </div>
                {OUT_OF_SCOPE.evidence.map((ev, ei) => (
                  <div key={ei} style={{ marginBottom: 8 }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.28)' }}>{ev.name}</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 13, color: 'rgba(255,255,255,0.22)', marginLeft: 6 }}>"{ev.text}"</span>
                  </div>
                ))}
              </div>
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.07)', paddingLeft: 24, display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.18)', marginBottom: 6 }}>V1 scope decision</div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.32)', lineHeight: 1.6, margin: 0 }}>{OUT_OF_SCOPE.v1}</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.12)', marginBottom: 6 }}>V2+ roadmap</div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.22)', lineHeight: 1.6, margin: 0 }}>{OUT_OF_SCOPE.v2}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* HMW */}
          <div className="bg-[#121212] border border-[#F2A7C4]/30 rounded-3xl p-10 md:p-12 relative overflow-hidden hover:border-[#F2A7C4]/60 transition-colors duration-500">
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#F2A7C4] mb-6">Problem Statement</div>
            <p className="font-serif text-2xl md:text-3xl leading-relaxed text-white max-w-4xl">
              How might we use AI to translate a mother's emotional state into a specific, non-blaming daily action for her partner — so support becomes consistent, concrete, and real?
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── Research ── */}
      <section id="research" className="py-32 border-b border-[#333] relative">
        <CollectibleCard id={3} style={{ top: '35%', right: '8%' }} isCollected={collectedCards.includes(3)} showNudge={!!nudgeStates[3]} onCollect={handleCollect} counterRef={counterRef} />

        <motion.div className="max-w-[960px] mx-auto px-8" {...fadeUpConfig}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#F2A7C4]" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#F2A7C4]">03 — Research</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight text-white mb-8">
            59 studies. 587 apps.<br />38 qualified. Zero with partner features.
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-[620px] mb-16 font-light">
            Before designing anything I mapped the entire landscape — academic literature and live products — to see if the gap was real or already being solved.
          </p>

          {/* Research stats strip */}
          <div className="bg-[#121212] border border-[#222] rounded-2xl p-8 mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { value: '59', label: 'Studies reviewed', color: '#93C5FD' },
                { value: '587', label: 'Apps mapped', color: '#93C5FD' },
                { value: '38', label: 'Met criteria', color: '#FAFFC7' },
                { value: '0', label: 'Had partner features', color: '#F2A7C4' },
              ].map((stat, idx) => (
                <div key={idx} className="text-center p-5 bg-[#0D0A0B] rounded-xl border border-[#2a2a2a]">
                  <div className="font-serif text-4xl mb-1" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-sm leading-relaxed font-light">
              I reviewed 59 peer-reviewed studies on postpartum depression, partner involvement, digital health interventions, and AI in mental health. Then I mapped 587 apps across 8 categories — 38 met inclusion criteria (active, relevant, &gt;10 reviews). Of those 38, zero had partner features. Zero had paternal screening.
            </p>
          </div>

          {/* Funnel */}
          <div className="mb-16">
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-6">The screening funnel</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' as const }}>
              {[
                { n: '587', label: 'Apps searched', color: '#93C5FD', width: 160 },
                { n: '38', label: 'Met criteria', color: '#FAFFC7', width: 120 },
                { n: '0', label: 'Partner features', color: '#F2A7C4', width: 80 },
                { n: '0', label: 'Paternal screening', color: '#F2A7C4', width: 80 },
              ].map((step, i, arr) => (
                <React.Fragment key={i}>
                  <div style={{
                    background: `${step.color}10`,
                    border: `1px solid ${step.color}30`,
                    borderRadius: 16,
                    padding: '20px 16px',
                    textAlign: 'center' as const,
                    minWidth: step.width,
                    flexShrink: 0,
                  }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 700, color: step.color, lineHeight: 1 }}>{step.n}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>{step.label}</div>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ color: 'rgba(255,255,255,0.15)', fontSize: 18, padding: '0 8px', flexShrink: 0 }}>→</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* App map */}
          <h3 className="font-serif text-2xl text-white mb-4">The 587 App Map</h3>
          <p className="text-sm text-gray-400 leading-relaxed max-w-[620px] mb-8">
            Every circle below represents a category of existing apps. The "Partners" circle — the only category that addresses the couple's emotional gap — contained zero products.
          </p>
          <AppMapViz />

          {/* Key findings */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 mb-16">
            {[
              { icon: Lightbulb, title: 'Key Discovery', description: "Fathers aren't absent by choice. They're absent by design. Every app is built for one user — the mother. There is no interface for what he's supposed to do.", color: '#F2A7C4' },
              { icon: Search, title: 'Behavioral Pattern', description: "When fathers get vague instructions ('just be there for her'), they disengage. When they get specific actions with a clear why, completion rates rise dramatically.", color: '#93C5FD' },
              { icon: Zap, title: 'Critical Insight', description: "The cultural context in India amplifies the gap. Joint family dynamics, stoic masculine norms, and silence around mental health make the design problem harder — and the market moat deeper.", color: '#FAFFC7' },
            ].map((insight, idx) => {
              const Icon = insight.icon;
              return (
                <motion.div key={idx} whileHover={{ y: -5 }}
                  className="bg-[#121212] border border-[#333] rounded-2xl p-8 hover:border-[#F2A7C4]/50 transition-colors duration-300"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: `${insight.color}18` }}>
                    <Icon className="w-6 h-6" style={{ color: insight.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{insight.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{insight.description}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Literature signal */}
          <div className="bg-[#121212] border border-[#93C5FD]/20 rounded-3xl p-10 md:p-12 relative overflow-hidden hover:border-[#93C5FD]/40 transition-colors duration-500">
            <div className="absolute top-[-60px] left-8 font-serif text-[200px] leading-none select-none pointer-events-none" style={{ color: 'rgba(147,197,253,0.05)' }}>"</div>
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#93C5FD] mb-6">Literature Signal</div>
            <p className="font-serif text-xl md:text-2xl leading-relaxed text-gray-200 relative max-w-3xl">
              Across 59 studies, one pattern repeated: when partners receive structured, specific daily tasks — not vague encouragement — maternal recovery outcomes improve measurably. The mechanism exists in the literature. No product had built it.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── Solution ── */}
      <section id="solution" className="py-32 border-b border-[#333] relative">
        <CollectibleCard id={4} style={{ bottom: '18%', right: '12%' }} isCollected={collectedCards.includes(4)} showNudge={!!nudgeStates[4]} onCollect={handleCollect} counterRef={counterRef} />

        <motion.div className="max-w-[960px] mx-auto px-8" {...fadeUpConfig}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#F2A7C4]" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#F2A7C4]">04 — Designing the Solution</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight text-white mb-8">
            How I solved it
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-[620px] mb-16 font-light">
            Build an AI that reads her voice, wearables, and mood — then gives him one specific, non-blaming daily action, unlocked only when both partners join.
          </p>

          {/* AI Pipeline */}
          <h3 className="font-serif text-2xl text-white mb-4">The Multi-Modal AI Pipeline</h3>
          <p className="text-sm text-gray-400 leading-relaxed max-w-[620px] mb-8">
            Murmur synthesizes three real-time signals from her to generate one specific, contextually-accurate action for him. The pipeline is designed to read subtle emotional states — not just what she says.
          </p>
          <AIPipelineViz />

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#6B7280', textAlign: 'center', letterSpacing: '0.08em', marginTop: 14, marginBottom: 56 }}>
            3 input modalities · 1 output action · Gated by couple participation
          </p>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(242,167,196,0.15)', margin: '0 0 56px' }} />

          {/* The Four-Part Nudge Formula */}
          <h3 className="font-serif text-2xl text-white mb-4">The Four-Part Nudge Formula</h3>
          <p className="text-sm text-gray-400 leading-relaxed max-w-[620px] mb-10">
            Generic advice produces generic inaction. Every nudge Murmur delivers is structured around four parts — context, action, frame, and unlock — to make each daily task feel specific, safe, and achievable.
          </p>
          <NudgeFormula />

          <hr style={{ border: 'none', borderTop: '1px solid rgba(242,167,196,0.15)', margin: '56px 0' }} />

          {/* Both-join mechanism */}
          <div className="bg-[#121212] border border-[#F2A7C4]/30 rounded-2xl p-10 md:p-12 relative overflow-hidden group hover:border-[#F2A7C4]/60 transition-colors duration-500 mb-16">
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#F2A7C4] mb-6">Core Mechanism</div>
            <h3 className="font-serif text-3xl md:text-4xl text-white mb-6">Both must join.</h3>
            <p className="text-sm text-gray-400 leading-relaxed max-w-[680px]">
              His daily action is locked until both partners have active accounts and she has logged her daily check-in. This isn't a restriction — it's a design principle. Support only works when both people are present. The lock creates accountability, builds a shared habit, and ensures the AI always has real-time data to generate accurate nudges. It also prevents the app from becoming a one-sided surveillance tool.
            </p>
          </div>

          {/* Safety guardrails */}
          <motion.div className="mt-4" {...fadeUpConfig}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-[#93C5FD]" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#93C5FD]">Safety Guardrails</span>
            </div>
            <h3 className="font-serif text-3xl md:text-4xl text-white mb-12">Built for a vulnerable population</h3>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: Shield, title: 'Crisis Escalation', desc: 'Voice tone analysis and Edinburgh Postnatal Depression Scale integration trigger immediate professional referral pathways. No AI substitutes clinical intervention.', color: '#93C5FD' },
                { icon: Heart, title: 'Non-Blaming Language', desc: "Every action suggestion is processed through a language model constraint that removes blame, urgency, and shame. 'Fix her' language is blocked at the generation level.", color: '#F2A7C4' },
                { icon: Zap, title: 'Identity Restoration', desc: "Mothers lose their identity in the postpartum period. Murmur tracks her non-mother interests and reintroduces them gradually — a 'remembering yourself' layer alongside the couple support.", color: '#FAFFC7' },
                { icon: Search, title: 'Data Minimalism', desc: "Voice analysis is on-device. Wearable data is anonymized and never stored beyond 7 days. The AI operates on aggregated signal, not raw biometrics — privacy-first from the architecture up.", color: '#6EE7B7' },
              ].map((g, idx) => {
                const Icon = g.icon;
                return (
                  <motion.div key={idx} whileHover={{ y: -5 }}
                    className="bg-[#121212] border border-[#333] rounded-2xl p-8 hover:border-[#F2A7C4]/50 transition-colors duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: `${g.color}18` }}>
                      <Icon className="w-6 h-6" style={{ color: g.color }} />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-3">{g.title}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{g.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Design principles */}
          <motion.div className="mt-24" {...fadeUpConfig}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-[#F2A7C4]" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#F2A7C4]">Design Principles</span>
            </div>
            <h3 className="font-serif text-3xl md:text-4xl text-white mb-12">What guided every decision</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Specificity over empathy', desc: "The design principle that broke every convention: don't tell him to 'be supportive.' Tell him to make tea at 9pm tonight. Specificity converts intention into action.", icon: Zap, color: '#FAFFC7' },
                { title: 'Relational design', desc: "Every screen, every data model, every AI output was designed for two users simultaneously. Single-user mental models were actively avoided from day one.", icon: Heart, color: '#F2A7C4' },
                { title: 'Cultural moat', desc: "India's joint family system, gendered domestic norms, and cultural silence around PPD required design patterns that global apps cannot simply translate and ship.", icon: Shield, color: '#93C5FD' },
              ].map((p, idx) => {
                const Icon = p.icon;
                return (
                  <motion.div key={idx} whileHover={{ y: -5 }}
                    className="bg-[#121212] border border-[#333] rounded-2xl p-8 hover:border-[#F2A7C4]/50 transition-colors duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: `${p.color}18` }}>
                      <Icon className="w-6 h-6" style={{ color: p.color }} />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-3">{p.title}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Results ── */}
      <section className="py-32 border-b border-[#333] relative">
        <CollectibleCard id={5} style={{ top: '25%', left: '8%' }} isCollected={collectedCards.includes(5)} showNudge={!!nudgeStates[5]} onCollect={handleCollect} counterRef={counterRef} />

        <motion.div className="max-w-[960px] mx-auto px-8" {...fadeUpConfig}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#93C5FD]" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#93C5FD]">04 — Results</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight text-white mb-16">
            Blue ocean.<br />Zero competitors.
          </h2>

          {/* Big number */}
          <div className="text-center mb-12">
            <div className="font-serif text-8xl md:text-9xl text-[#93C5FD] leading-none mb-3">0/587</div>
            <p className="text-sm text-gray-500 tracking-[0.06em]">apps in the space address the couple's emotional gap</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="bg-[#121212] border border-[#333] rounded-2xl p-8 flex flex-col gap-4">
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#93C5FD]">Market Opportunity</span>
              <p className="text-sm text-gray-400 leading-relaxed">India's 19-23.5% PPD rate across ~25 million annual births creates a 4.75-5.9 million affected mothers annually — each with a partner who has no product built for them. The addressable market exists, is large, and is completely unserved.</p>
            </div>
            <div className="bg-[#121212] border border-[#333] rounded-2xl p-8 flex flex-col gap-4">
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#F2A7C4]">Cultural Moats</span>
              <p className="text-sm text-gray-400 leading-relaxed">India's postpartum cultural context — joint family pressure, masculine stoicism, regional language complexity, religious rituals intersecting with recovery — creates design requirements so India-specific that no global app can replicate them by simply localizing existing content.</p>
            </div>
          </div>

          {/* What the research proved */}
          <div className="bg-[#121212] border border-[#F2A7C4]/20 rounded-3xl p-10 md:p-12 relative overflow-hidden group hover:border-[#F2A7C4]/40 transition-colors duration-500 mb-16">
            <div className="absolute top-[-60px] left-8 font-serif text-[200px] leading-none text-[#F2A7C4]/05 select-none pointer-events-none">"</div>
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#F2A7C4] mb-6 relative">Why this matters</div>
            <p className="font-serif text-xl md:text-2xl leading-relaxed text-gray-200 relative max-w-3xl">
              The research didn't just prove there was no competition. It proved the mechanism — specific partner actions improving maternal outcomes — is validated in literature and completely absent from product. This is not a feature gap. It's a category gap.
            </p>
          </div>

          {/* Journey map — pain → design response */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#F2A7C4]" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#F2A7C4]">Where the pain lived</span>
          </div>
          <div
            className="overflow-x-auto pb-12 -mx-8 px-8"
            style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}
          >
            <div className="flex gap-4 min-w-max">
              {[
                { stage: 'Diagnosis', item: 'Mother gets PPD diagnosis.', pain: 'Partner has no context or role.', icon: AlertCircle, response: 'Couple onboarding flow — he joins as an equal participant, not a bystander.' },
                { stage: 'Daily Signal', item: 'She logs mood + voice check-in.', pain: 'He doesn\'t know she\'s struggling.', icon: Mic, response: 'AI synthesizes her signals into one actionable nudge before he even has to ask.' },
                { stage: 'Nudge Delivery', item: 'He receives his daily action.', pain: 'Generic advice causes disengagement.', icon: XCircle, response: 'Four-part formula: context + action + frame + unlock. No guesswork, no blame.' },
                { stage: 'Safety Layer', item: 'Signals indicate crisis threshold.', pain: 'App could delay professional care.', icon: Shield, response: 'Automated escalation to emergency contact and clinical referral. AI steps back.' },
                { stage: 'Recovery', item: 'Consistent support pattern.', pain: 'Identity loss compounds depression.', icon: TrendingUp, response: 'Identity restoration module reintroduces her non-mother self alongside couple support.' },
              ].map((stage, idx) => {
                const Icon = stage.icon;
                return (
                  <motion.div key={idx} whileHover={{ y: -5 }}
                    className="w-[240px] bg-[#121212] border border-[#333] rounded-2xl flex flex-col overflow-hidden group"
                  >
                    <div className="bg-[#1E1E1E] border-b border-[#333] px-5 py-4 text-[10px] font-bold tracking-[0.2em] uppercase text-white group-hover:text-[#93C5FD] transition-colors">
                      0{idx + 1} — {stage.stage}
                    </div>
                    <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                      <div className="text-sm text-gray-400 font-light leading-relaxed">{stage.item}</div>
                      <div className="bg-[#1E1E1E] rounded-xl px-4 py-3 text-xs text-[#F2A7C4] flex items-center gap-3">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="leading-tight">{stage.pain}</span>
                      </div>
                      <div className="pt-3 border-t border-[#2a2a2a] flex flex-col gap-1.5">
                        <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-600">Design Response</span>
                        <div className="flex items-start gap-1.5">
                          <ArrowRight className="w-3 h-3 text-[#F2A7C4]/50 flex-shrink-0 mt-0.5" />
                          <span className="text-[11px] text-gray-500 leading-relaxed">{stage.response}</span>
                        </div>
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
              <motion.div animate={{ x: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center bg-[#1E1E1E]"
              >
                <ArrowRight className="w-3 h-3 text-[#F2A7C4]" />
              </motion.div>
            </div>
          </div>

          {/* Hindsight */}
          <motion.div className="mt-24" {...fadeUpConfig}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-[#F2A7C4]" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#F2A7C4]">Hindsight</span>
            </div>
            <h3 className="font-serif text-3xl md:text-4xl text-white mb-12">What I'd do differently</h3>
            <div className="flex flex-col gap-8">
              {[
                { num: '01', title: 'Primary interviews with fathers', desc: "The research was literature-heavy. A next phase would require direct ethnographic research with new fathers — not academic proxies — to test whether the nudge formula produces real behavior change in Indian households." },
                { num: '02', title: 'Clinical partnership from day one', desc: "PPD is a clinical condition. Designing an AI for it without a clinical co-designer risks building a product that feels safe without being safe. The next version requires a psychologist or psychiatrist as a design partner, not just as a reviewer." },
                { num: '03', title: 'Localized language testing', desc: "India has 22 official languages and dozens of dialects with different emotional vocabularies. The AI pipeline was designed in English. Real-world accuracy of voice sentiment analysis would degrade significantly in regional languages — this needs research before any launch." },
              ].map((item, idx) => (
                <motion.div key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1], delay: idx * 0.1 }}
                  className="flex gap-8 items-start"
                >
                  <div className="font-serif text-5xl text-[#F2A7C4] leading-none flex-shrink-0" style={{ opacity: 0.6 }}>{item.num}</div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-3">{item.title}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Closing ── */}
      <section className="py-24 border-b border-[#333]">
        <motion.div
          className="max-w-[960px] mx-auto px-8 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        >
          <h2 className="font-serif text-4xl md:text-5xl leading-tight text-white mb-6">
            Murmur is a blue ocean.
          </h2>
          <p className="font-serif text-2xl md:text-3xl leading-relaxed mb-8 max-w-[680px] mx-auto" style={{ color: 'rgba(250,255,199,0.55)' }}>
            Not because nobody cared about PPD. Because nobody had thought of the father as a design surface. Once you see it, you can't unsee it.
          </p>
          <p className="text-[11px] text-gray-600 italic">The gap was always there. The category just didn't exist yet.</p>

          {collectedCards.length === 5 && hasReachedEnd && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-12"
            >
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#F2A7C4', opacity: 0.6, marginBottom: 12 }}>
                ✦ All 5 cards collected
              </div>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(242,167,196,0.5)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onClose('contact')}
                className="inline-flex items-center gap-3 bg-[#F2A7C4] text-[#000] text-sm font-bold tracking-[0.2em] uppercase px-12 py-5 rounded-full shadow-[0_0_20px_rgba(242,167,196,0.25)] cursor-pointer"
              >
                Hire Me <MoveRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <section className="py-24">
        <motion.div className="max-w-[960px] mx-auto px-8 text-center" {...fadeUpConfig}>
          <p className="font-serif text-2xl text-gray-300 mb-8">Want to see more of my work?</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onClose('work')}
            className="inline-flex items-center gap-2 bg-transparent text-[#F2A7C4] border border-[#F2A7C4] text-xs font-bold tracking-[0.2em] uppercase px-8 py-4 rounded-full hover:bg-[#F2A7C4] hover:text-[#000] transition-colors duration-300"
          >
            Back to Portfolio
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}
