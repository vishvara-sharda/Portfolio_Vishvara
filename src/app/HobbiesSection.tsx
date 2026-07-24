import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import whaleGif from '../imports/whale.gif';

const rawComicImages = import.meta.glob<string>(
  '../imports/japanese comic/*.jpg',
  { eager: true, import: 'default' }
);

const COMIC_IMAGES = Object.entries(rawComicImages)
  .sort(([a], [b]) => {
    const n = (s: string) => parseInt(s.match(/(\d+)\.jpg$/)?.[1] ?? '0');
    return n(a) - n(b);
  })
  .map(([path, url]) => ({
    url,
    num: parseInt(path.match(/(\d+)\.jpg$/)?.[1] ?? '0'),
  }));

const TABS = [
  { id: 'hint',          label: 'click the tabs', url: 'vishvara://new-tab',       accent: '#FAFFC7' },
  { id: 'pottery',       label: 'pottery',         url: 'vishvara://pottery',       accent: '#FAFFC7' },
  { id: 'japanese',      label: '日本語',           url: 'vishvara://nihongo',       accent: '#93C5FD' },
  { id: 'illustrations', label: 'illustrations',   url: 'vishvara://illustrations', accent: '#F2A7C4' },
];

function WaveSkeleton({ width = '100%', height = '380px', radius = '6px' }: { width?: string; height?: string; radius?: string }) {
  return <div className="wave-skeleton" style={{ width, height, borderRadius: radius, flexShrink: 0 }} />;
}

function PotteryContent({ accent }: { accent: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ position: 'relative', minHeight: '460px', borderRadius: '10px', overflow: 'hidden', background: '#0a0a0a' }}>
      {!loaded && <WaveSkeleton width="100%" height="460px" radius="10px" />}
      <img
        src={whaleGif}
        alt="my clay whale"
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          display: 'block', position: 'absolute', inset: 0,
          opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease',
        }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
      <h3 style={{
        position: 'absolute', bottom: '28px', left: '32px',
        fontFamily: "'Space Grotesk', sans-serif", fontSize: '42px', fontWeight: 700,
        color: accent, margin: 0, lineHeight: 1,
        textShadow: `0 0 30px ${accent}60`,
      }}>
        my Clay Whale
      </h3>
    </div>
  );
}

function IllustrationsContent({ accent }: { accent: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const stripReady = loadedCount > 0;

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = 'grabbing';
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = scrollLeftRef.current - (x - startX.current) * 1.4;
  };

  const onMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  };

  return (
    <div>
      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '28px', color: accent, margin: '0 0 6px 0', fontWeight: 700 }}>
        thinking out loud
      </h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: 'rgba(255,255,255,0.35)', margin: '0 0 20px 0' }}>
        a japanese comic I made — panels, characters, all of it
      </p>

      <div style={{ position: 'relative' }}>
        <div aria-hidden style={{ position: 'absolute', left: 0, top: 0, bottom: 16, width: 48, background: 'linear-gradient(to right, rgba(14,14,14,0.95), transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', right: 0, top: 0, bottom: 16, width: 48, background: 'linear-gradient(to left, rgba(14,14,14,0.95), transparent)', zIndex: 2, pointerEvents: 'none' }} />

        {!stripReady && (
          <div style={{ display: 'flex', gap: '8px', overflow: 'hidden', paddingBottom: '10px' }}>
            {[260, 200, 280, 220, 260, 200].map((w, i) => (
              <WaveSkeleton key={i} width={`${w}px`} height="380px" />
            ))}
          </div>
        )}

        <div
          ref={scrollRef}
          className="comic-strip-scroll"
          style={{
            display: stripReady ? 'flex' : 'none',
            gap: '8px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            cursor: 'grab',
            paddingBottom: '10px',
            userSelect: 'none',
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {COMIC_IMAGES.map(({ url, num }) => (
            <div
              key={num}
              style={{
                flexShrink: 0, height: '380px', borderRadius: '6px',
                overflow: 'hidden', border: '1px solid rgba(255,255,255,0.09)',
                background: '#0a0a0a', position: 'relative',
              }}
            >
              <img
                src={url}
                alt={`page ${num}`}
                draggable={false}
                onLoad={() => setLoadedCount(c => c + 1)}
                style={{ height: '100%', width: 'auto', display: 'block', objectFit: 'cover', pointerEvents: 'none' }}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '18px 8px 6px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)',
                fontFamily: "'DM Sans', sans-serif", fontSize: '9px',
                letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', textAlign: 'right',
              }}>
                {String(num).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.15)', margin: '8px 0 0 0', textAlign: 'center', fontStyle: 'italic' }}>
        drag to scroll · not for portfolio · just for me
      </p>
    </div>
  );
}

function TabContent({ id, accent, onSelect }: { id: string; accent: string; onSelect: (idx: number) => void }) {
  if (id === 'hint') {
    const items = [
      { n: '01', label: 'Pottery',       sub: 'even though i make messes more',                                     tabIdx: 1, accent: '#FAFFC7' },
      { n: '02', label: 'Language',      sub: 'takes me 10 days to learn a japanese word and 10 seconds to forget', tabIdx: 2, accent: '#93C5FD' },
      { n: '03', label: 'Illustrations', sub: 'even though i copy',                                                 tabIdx: 3, accent: '#F2A7C4' },
    ];
    return (
      <div style={{ minHeight: '460px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '8px 0' }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#F2A7C4', opacity: 0.7, margin: '0 0 18px 0' }}>
          MY HOBBIES
        </p>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {items.map((item, i) => {
            const glowClass = ['hobby-glow-yellow', 'hobby-glow-blue', 'hobby-glow-pink'][i % 3];
            return (
              <button
                key={item.n}
                onClick={() => onSelect(item.tabIdx)}
                className={`hobby-list-item ${glowClass}`}
                style={{
                  display: 'flex', alignItems: 'baseline', gap: '20px',
                  padding: '16px 12px', background: 'none', border: '1px solid transparent',
                  borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'left',
                  width: '100%', borderRadius: '10px',
                }}
              >
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.1em', flexShrink: 0, transition: 'color 0.2s' }}>
                  {item.n}
                </span>
                <span className="hobby-list-label" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '32px', fontWeight: 600, color: 'rgba(255,255,255,0.82)', lineHeight: 1, flexShrink: 0, transition: 'color 0.2s' }}>
                  {item.label}
                </span>
                {item.sub && (
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.25)', fontStyle: 'italic', lineHeight: 1.4, transition: 'color 0.2s' }}>
                    — {item.sub}
                  </span>
                )}
                <span className="hobby-list-arrow" style={{ marginLeft: 'auto', fontFamily: "'DM Sans', sans-serif", fontSize: '16px', color: 'rgba(255,255,255,0.1)', flexShrink: 0, transition: 'color 0.2s, transform 0.2s' }}>
                  →
                </span>
              </button>
            );
          })}
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.12)', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '20px 0 0 0' }}>
          click any to go deeper
        </p>
      </div>
    );
  }

  if (id === 'pottery') return <PotteryContent accent={accent} />;

  if (id === 'japanese') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <div>
          <div style={{ fontFamily: 'serif', fontSize: 'clamp(36px, 6vw, 72px)', color: accent, lineHeight: 1.3, marginBottom: '16px', filter: `drop-shadow(0 0 24px ${accent}55)` }}>
            こんにちは、<br />はじめまして。<br />私はヴィシュヴァラです。
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#F2A7C4', fontStyle: 'italic', lineHeight: 1.6 }}>
            Hi, nice to meet you. I am Vishvara.
          </div>
        </div>
        <div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '34px', color: accent, margin: '0 0 6px 0', fontWeight: 700 }}>
            日本語の勉強中
          </h3>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: 'rgba(255,255,255,0.35)', margin: '0 0 26px 0', lineHeight: 1.7 }}>
            learning how a new language structures thought
          </p>
          {[
            { label: 'LEVEL',          value: 'N5 (slowly)' },
            { label: 'METHOD',         value: 'youtube lectures + cause i can' },
            { label: 'STREAK',         value: 'too inconsistent to track' },
            { label: 'FAVOURITE WORD', value: '命 — inochi (life)' },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', gap: '16px', marginBottom: '14px', alignItems: 'baseline' }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', letterSpacing: '0.18em', color: accent, opacity: 0.65, textTransform: 'uppercase', minWidth: '110px' }}>{r.label}</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (id === 'illustrations') return <IllustrationsContent accent={accent} />;

  return null;
}

export default function HobbiesSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeTab = TABS[activeIdx];

  return (
    <section style={{ padding: '100px clamp(24px, 5vw, 80px)', position: 'relative', zIndex: 10 }}>
      <style>{`
        @keyframes wave-shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .wave-skeleton {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% 100%;
          animation: wave-shimmer 1.6s ease-in-out infinite;
        }
        .hobby-tab-bar::-webkit-scrollbar { display: none; }
        .comic-strip-scroll::-webkit-scrollbar { display: none; }
        .hobby-tab-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          border-radius: 99px;
          padding: 9px 22px;
          white-space: nowrap;
          transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
          letter-spacing: 0.05em;
          font-weight: 500;
        }
        .hobby-list-item {
          cursor: pointer;
          transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }
        .hobby-list-item:hover { background: rgba(255,255,255,0.03) !important; }
        .hobby-list-item:hover .hobby-list-arrow { color: rgba(255,255,255,0.55) !important; transform: translateX(4px); }
        .hobby-glow-yellow:hover { border-color: #FAFFC7 !important; box-shadow: 0 0 16px rgba(250,255,199,0.25), inset 0 0 10px rgba(250,255,199,0.05) !important; }
        .hobby-glow-blue:hover   { border-color: #93C5FD !important; box-shadow: 0 0 16px rgba(147,197,253,0.25), inset 0 0 10px rgba(147,197,253,0.05) !important; }
        .hobby-glow-pink:hover   { border-color: #F2A7C4 !important; box-shadow: 0 0 16px rgba(242,167,196,0.25), inset 0 0 10px rgba(242,167,196,0.05) !important; }
        .hobby-glow-yellow:hover .hobby-list-label { color: #FAFFC7 !important; }
        .hobby-glow-blue:hover   .hobby-list-label { color: #93C5FD !important; }
        .hobby-glow-pink:hover   .hobby-list-label { color: #F2A7C4 !important; }
      `}</style>

      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
<h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(2.2rem, 4vw, 3.8rem)', color: '#FAFFC7', lineHeight: 1.08, margin: '0 0 16px 0' }}>
          Outside Work
        </h2>
      </div>

      {/* Browser window */}
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        background: 'rgba(14,14,14,0.88)',
        backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)',
        border: '1px solid rgba(255,255,255,0.09)', borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.04)',
      }}>

        {/* Chrome bar */}
        <div style={{
          height: '54px', background: 'rgba(22,22,22,0.98)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', padding: '0 20px',
        }}>
          <div style={{ display: 'flex', gap: '8px', marginRight: '20px', flexShrink: 0 }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#FF5F57' }} />
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#FFBD2E' }} />
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#28C840' }} />
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '7px', padding: '7px 18px', width: '100%', maxWidth: '440px', overflow: 'hidden',
            }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeTab.url}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: '12px',
                    color: 'rgba(255,255,255,0.22)', display: 'block', textAlign: 'center',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}
                >
                  {activeTab.url}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div
          className="hobby-tab-bar"
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(18,18,18,0.98)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            padding: '12px 20px', overflowX: 'auto', scrollbarWidth: 'none',
          }}
        >
          {TABS.map((tab, i) => {
            const isActive = activeIdx === i;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveIdx(i)}
                className="hobby-tab-btn"
                style={{
                  color: isActive ? tab.accent : 'rgba(255,255,255,0.38)',
                  background: isActive ? `${tab.accent}1A` : 'rgba(255,255,255,0.04)',
                  border: isActive ? `1px solid ${tab.accent}55` : '1px solid rgba(255,255,255,0.09)',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content area */}
        <div style={{ padding: 'clamp(32px, 4vw, 56px)', minHeight: '500px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <TabContent id={activeTab.id} accent={activeTab.accent} onSelect={setActiveIdx} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
