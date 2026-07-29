import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SectionRail } from './DesignerMind';

const LAYERS = [
  { name: 'SYSTEMIC',    question: 'Who, what, where, how?',        fp: 0.1 },
  { name: 'EMPATHETIC',  question: 'Who, why do they care?',        fp: 0.3 },
  { name: 'ROOTED',      question: 'Why (the real reason)?',        fp: 0.5 },
  { name: 'VALIDATED',   question: 'Does it work? How do we know?', fp: 0.7 },
  { name: 'SUSTAINABLE', question: 'What does it cost?',             fp: 0.9 },
];

// ── STARFIELD ─────────────────────────────────────────────────────────────────
function sr(s: number) { const x = Math.sin(s + 1) * 10000; return x - Math.floor(x); }

const STATIC_STARS = Array.from({ length: 100 }, (_, i) => ({
  x:   sr(i * 4)     * 1000,
  y:   sr(i * 4 + 1) * 1000,
  r:   sr(i * 4 + 2) * 1.2 + 0.4,
  op:  sr(i * 4 + 3) * 0.35 + 0.12,
}));

const BLINK_STARS = Array.from({ length: 100 }, (_, i) => ({
  x:   sr((i + 100) * 4)     * 1000,
  y:   sr((i + 100) * 4 + 1) * 1000,
  r:   sr((i + 100) * 4 + 2) * 1.5 + 0.5,
  dur: (sr((i + 100) * 4 + 3) * 3 + 2).toFixed(1),
  del: (sr((i + 100) * 4)     * 5).toFixed(1),
}));

const CONSTELLATIONS = [
  {
    stars: [{x:110,y:90},{x:145,y:115},{x:168,y:98},{x:195,y:118},{x:218,y:88}],
    lines: [[0,1],[1,2],[2,3],[3,4]],
  },
  {
    stars: [{x:820,y:165},{x:858,y:148},{x:892,y:172},{x:878,y:210},{x:842,y:218},{x:822,y:192}],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[1,4]],
  },
  {
    stars: [{x:380,y:810},{x:415,y:792},{x:448,y:808},{x:440,y:842},{x:408,y:855},{x:375,y:838}],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]],
  },
];

function DLStarfield() {
  return (
    <>
      <style>{`
        @keyframes dl-blink { 0%,100%{opacity:0.06} 50%{opacity:0.72} }
        @media(prefers-reduced-motion:reduce){.dl-blink{animation:none!important;opacity:0.3}}
      `}</style>
      <svg
        aria-hidden
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0 }}
      >
        <defs>
          {/* edge-on galaxy blur */}
          <filter id="dl-gal-blur" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          {/* soft wide blur for spirals / ellipticals */}
          <filter id="dl-soft-blur" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          {/* tight core blur */}
          <filter id="dl-core-blur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <radialGradient id="dl-gal-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#E8E4C9" stopOpacity="0.9" />
            <stop offset="35%"  stopColor="#C9C4B8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#C9C4B8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="dl-elliptical" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#E8E4C9" stopOpacity="0.7" />
            <stop offset="50%"  stopColor="#C9C4B8" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#C9C4B8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="dl-spiral-disk" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#E8E4C9" stopOpacity="0.55" />
            <stop offset="60%"  stopColor="#C9C4B8" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#C9C4B8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Galaxy 1 — edge-on lenticular (original, far away) */}
        <g transform="translate(762,228) rotate(-22)" opacity="0.22">
          <ellipse cx="0" cy="0" rx="95" ry="26" fill="url(#dl-gal-core)" filter="url(#dl-gal-blur)" />
          <ellipse cx="0" cy="0" rx="42" ry="10" fill="#E8E4C9" opacity="0.55" filter="url(#dl-gal-blur)" />
          <circle  cx="0" cy="0" r="2.5" fill="#E8E4C9" opacity="0.95" />
        </g>

        {/* Galaxy 2 — face-on two-arm spiral (top-left) */}
        <g transform="translate(168,640)" opacity="0.26">
          {/* disk glow */}
          <ellipse cx="0" cy="0" rx="62" ry="58" fill="url(#dl-spiral-disk)" filter="url(#dl-soft-blur)" />
          {/* spiral arm A */}
          <path d="M 0 0 Q 30 -18 48 2 Q 58 18 40 38 Q 22 52 0 44"
            stroke="#E8E4C9" strokeWidth="5" fill="none" strokeLinecap="round"
            opacity="0.18" filter="url(#dl-core-blur)" />
          {/* spiral arm B (opposite) */}
          <path d="M 0 0 Q -30 18 -48 -2 Q -58 -18 -40 -38 Q -22 -52 0 -44"
            stroke="#E8E4C9" strokeWidth="5" fill="none" strokeLinecap="round"
            opacity="0.18" filter="url(#dl-core-blur)" />
          {/* bright core */}
          <circle cx="0" cy="0" r="6" fill="#E8E4C9" opacity="0.7" filter="url(#dl-core-blur)" />
          <circle cx="0" cy="0" r="2" fill="#E8E4C9" opacity="0.95" />
        </g>

        {/* Galaxy 3 — barred spiral (bottom-right) */}
        <g transform="translate(860,780) rotate(35)" opacity="0.24">
          {/* outer disk */}
          <ellipse cx="0" cy="0" rx="70" ry="65" fill="url(#dl-spiral-disk)" filter="url(#dl-soft-blur)" />
          {/* central bar */}
          <ellipse cx="0" cy="0" rx="38" ry="8" fill="#E8E4C9" opacity="0.22" filter="url(#dl-core-blur)" />
          {/* arm from bar-left */}
          <path d="M -38 0 Q -55 -28 -42 -52 Q -28 -62 -8 -55"
            stroke="#E8E4C9" strokeWidth="4" fill="none" strokeLinecap="round"
            opacity="0.16" filter="url(#dl-core-blur)" />
          {/* arm from bar-right */}
          <path d="M 38 0 Q 55 28 42 52 Q 28 62 8 55"
            stroke="#E8E4C9" strokeWidth="4" fill="none" strokeLinecap="round"
            opacity="0.16" filter="url(#dl-core-blur)" />
          {/* bright core */}
          <circle cx="0" cy="0" r="5" fill="#E8E4C9" opacity="0.75" filter="url(#dl-core-blur)" />
          <circle cx="0" cy="0" r="1.8" fill="#E8E4C9" opacity="0.95" />
        </g>

        {/* Galaxy 4 — soft elliptical / E-type (top-right) */}
        <g transform="translate(920,440) rotate(12)" opacity="0.2">
          <ellipse cx="0" cy="0" rx="55" ry="38" fill="url(#dl-elliptical)" filter="url(#dl-soft-blur)" />
          <ellipse cx="0" cy="0" rx="22" ry="14" fill="#E8E4C9" opacity="0.3" filter="url(#dl-core-blur)" />
          <circle  cx="0" cy="0" r="2" fill="#E8E4C9" opacity="0.9" />
        </g>

        {/* Constellations */}
        {CONSTELLATIONS.map((c, ci) => (
          <g key={ci}>
            {c.lines.map(([a, b], li) => (
              <line key={li}
                x1={c.stars[a].x} y1={c.stars[a].y}
                x2={c.stars[b].x} y2={c.stars[b].y}
                stroke="rgba(232,228,201,0.18)" strokeWidth="0.6"
              />
            ))}
            {c.stars.map((s, si) => (
              <circle key={si} cx={s.x} cy={s.y} r="1.8" fill="#E8E4C9" opacity="0.55" />
            ))}
          </g>
        ))}

        {/* 100 static stars */}
        {STATIC_STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#E8E4C9" opacity={s.op} />
        ))}

        {/* 100 blinking stars */}
        {BLINK_STARS.map((s, i) => (
          <circle
            key={i}
            className="dl-blink"
            cx={s.x} cy={s.y} r={s.r}
            fill="#E8E4C9"
            style={{ animation: `dl-blink ${s.dur}s ease-in-out ${s.del}s infinite` }}
          />
        ))}
      </svg>
    </>
  );
}

// Piecewise linear interpolation across d = -0.25 → 0 → +0.25
function interp(d: number, neg: number, zero: number, pos: number): number {
  const t = Math.max(-1, Math.min(1, d / 0.25));
  return t <= 0 ? neg + (zero - neg) * (t + 1) : zero + (pos - zero) * t;
}

const forceMotion = new URLSearchParams(location.search).has('motion');

const CYCLE_MS = 9000; // 5 layers × 1.8 s each

// Circular distance so the loop from layer 4 → layer 0 cross-fades smoothly
function circD(p: number, fp: number): number {
  let d = p - fp;
  if (d > 0.5) d -= 1;
  if (d < -0.5) d += 1;
  return d;
}

// ── ANIMATED STAGE (scroll-driven) ───────────────────────────────────────────
function AnimatedStage() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const layerRefs  = useRef<(HTMLDivElement       | null)[]>([]);
  const nameRefs   = useRef<(HTMLHeadingElement   | null)[]>([]);
  const qRefs      = useRef<(HTMLParagraphElement | null)[]>([]);
  const tickRefs   = useRef<(HTMLDivElement       | null)[]>([]);

  const scrollToLayer = useCallback((i: number) => {
    const el = wrapperRef.current;
    if (!el) return;
    const top   = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + LAYERS[i].fp * range, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const update = () => {
      const top   = wrapper.getBoundingClientRect().top + window.scrollY;
      const range = wrapper.offsetHeight - window.innerHeight;
      if (range <= 0) return;

      const p = Math.max(0, Math.min(1, (window.scrollY - top) / range));

      let bestI = 0, bestDist = Infinity;

      LAYERS.forEach((layer, i) => {
        const d       = p - layer.fp;
        const scale   = interp(d, 0.45,  1.0,   1.9);
        const opacity = interp(d, 0.10,  1.00,  0.00);
        const ls      = interp(d, 0.34,  0.02, -0.01);
        const ty      = interp(d, -90,   0,     120);

        const el   = layerRefs.current[i];
        const name = nameRefs.current[i];

        if (el) {
          el.style.transform = `translateY(calc(-50% + ${ty}px))`;
          el.style.opacity   = String(opacity);
        }
        if (name) {
          name.style.transform     = `scale(${scale})`;
          name.style.letterSpacing = `${ls}em`;
        }

        const absd = Math.abs(d);
        if (absd < bestDist) { bestDist = absd; bestI = i; }
      });

      tickRefs.current.forEach((tick, i) => {
        if (!tick) return;
        tick.style.opacity = i === bestI ? '1' : '0.25';
        tick.style.width   = i === bestI ? '16px' : '10px';
      });

    };

    let pending = false;
    const onScroll = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => { pending = false; update(); });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update,   { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
    };
  }, []);

  // Remove will-change when section is off-screen
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const obs = new IntersectionObserver(([entry]) => {
      const wc = entry.isIntersecting ? 'transform' : 'auto';
      layerRefs.current.forEach(el => { if (el) el.style.willChange = wc; });
    });
    obs.observe(wrapper);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .dl-name:focus-visible {
          outline: 2px solid rgba(242,237,203,0.85);
          outline-offset: 8px;
          border-radius: 2px;
        }
      `}</style>

      <div ref={wrapperRef} style={{ height: '360vh', position: 'relative' }}>
        <div style={{
          position: 'sticky', top: 0, height: '100vh',
          overflow: 'visible', zIndex: 10,
        }}>
          <DLStarfield />
          <SectionRail label="DESIGN LENS" />

          {/* Section label */}
          <div style={{ position: 'absolute', top: 40, left: 0, right: 0, textAlign: 'center', fontFamily: "'Sora', sans-serif", fontWeight: 300, fontSize: 28, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9C4B8', opacity: 0.35, pointerEvents: 'none', userSelect: 'none', zIndex: 20 }}>
            The lens I use in life and in products
          </div>

          {/* Focal plane reticle — fixed instrument, never moves */}
          <div aria-hidden="true" style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 380, height: 120,
            pointerEvents: 'none', zIndex: 15,
          }}>
            <div style={{ position: 'absolute', top: 0,    left: 0,  width: 18, height: 18, borderTop:    '1px solid rgba(242,237,203,0.5)', borderLeft:   '1px solid rgba(242,237,203,0.5)' }} />
            <div style={{ position: 'absolute', top: 0,    right: 0, width: 18, height: 18, borderTop:    '1px solid rgba(242,237,203,0.5)', borderRight:  '1px solid rgba(242,237,203,0.5)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0,  width: 18, height: 18, borderBottom: '1px solid rgba(242,237,203,0.5)', borderLeft:   '1px solid rgba(242,237,203,0.5)' }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 18, height: 18, borderBottom: '1px solid rgba(242,237,203,0.5)', borderRight:  '1px solid rgba(242,237,203,0.5)' }} />
          </div>

          {/* Five depth layers — all in DOM for a11y, JS drives transforms */}
          {LAYERS.map((layer, i) => (
            <div
              key={i}
              ref={el => { layerRefs.current[i] = el; }}
              style={{
                position: 'absolute', top: '50%', left: 0, right: 0,
                textAlign: 'center',
                transform: 'translateY(-50%)',
                opacity: 0.10,
                willChange: 'transform',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            >
              {layer.question && <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                color: 'rgba(242,237,203,0.55)', margin: '0 auto 8px',
                pointerEvents: 'none', userSelect: 'none',
                lineHeight: 1.4,
              }}>
                {layer.question}
              </p>}
              <h3
                ref={el => { nameRefs.current[i] = el; }}
                className="dl-name"
                tabIndex={0}
                onFocus={() => scrollToLayer(i)}
                style={{
                  fontFamily: "'Sora', sans-serif", fontWeight: 700,
                  fontSize: 'clamp(28px, 5vw, 64px)', color: '#F2EDCB',
                  textTransform: 'uppercase', letterSpacing: '0.34em',
                  margin: 0, display: 'inline-block',
                  transform: 'scale(0.45)', transformOrigin: 'center center',
                  pointerEvents: 'auto', cursor: 'default', lineHeight: 1,
                  background: 'none', border: 'none',
                }}
              >
                {layer.name}
              </h3>
            </div>
          ))}

          {/* Progress ticks — right edge, aria-hidden */}
          <div aria-hidden="true" style={{
            position: 'absolute', right: 24, top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex', flexDirection: 'column', gap: 12, zIndex: 30,
          }}>
            {LAYERS.map((_, i) => (
              <div
                key={i}
                ref={el => { tickRefs.current[i] = el; }}
                style={{
                  height: 1, width: 10, background: '#F2EDCB', opacity: 0.25,
                  transition: 'width 0.25s cubic-bezier(0.22,1,0.36,1), opacity 0.25s cubic-bezier(0.22,1,0.36,1)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

    </>
  );
}

// ── STATIC LIST (mobile + reduced-motion) ─────────────────────────────────────
export function StaticList() {
  return (
    <div style={{
      position: 'relative', display: 'flex', flexDirection: 'column',
      padding: 'clamp(60px, 10vw, 100px) clamp(24px, 6vw, 80px)',
    }}>
      <DLStarfield />
      <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 300, fontSize: 28, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9C4B8', opacity: 0.35, marginBottom: 48, userSelect: 'none', textAlign: 'center' }}>
        The lens I use in life and in products
      </div>
      {LAYERS.map((layer, i) => (
        <div key={i}>
          {i > 0 && <hr style={{ border: 'none', borderTop: '1px solid rgba(242,237,203,0.12)', margin: 0 }} />}
          <div style={{ padding: '32px 0' }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 14,
              color: 'rgba(242,237,203,0.55)', margin: '0 0 6px', lineHeight: 1.55,
            }}>
              {layer.question}
            </p>
            <h3 style={{
              fontFamily: "'Sora', sans-serif", fontWeight: 700,
              fontSize: 'clamp(22px, 5vw, 36px)', color: '#F2EDCB',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              margin: 0, lineHeight: 1.1,
            }}>
              {layer.name}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── ANIMATED STAGE (timer-driven, for horizontal-scroll panel) ───────────────
export function AnimatedStageAuto() {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRefs    = useRef<(HTMLDivElement       | null)[]>([]);
  const nameRefs     = useRef<(HTMLHeadingElement   | null)[]>([]);
  const qRefs        = useRef<(HTMLParagraphElement | null)[]>([]);
  const tickRefs     = useRef<(HTMLDivElement       | null)[]>([]);
  const elapsedRef   = useRef(0);
  const lastRef      = useRef(performance.now());
  const pausedRef    = useRef(false);
  const rafRef       = useRef(0);

  const jumpTo = useCallback((i: number) => {
    elapsedRef.current = LAYERS[i].fp * CYCLE_MS;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tick = (now: number) => {
      if (!pausedRef.current) elapsedRef.current += now - lastRef.current;
      lastRef.current = now;

      const p = (elapsedRef.current % CYCLE_MS) / CYCLE_MS;
      let bestI = 0, bestDist = Infinity;

      LAYERS.forEach((layer, i) => {
        const d       = circD(p, layer.fp);
        const scale   = interp(d, 0.45,  1.0,   1.9);
        const opacity = interp(d, 0.10,  1.00,  0.00);
        const ls      = interp(d, 0.34,  0.02, -0.01);
        const ty      = interp(d, -90,   0,     120);
        const qOp     = Math.max(0, 1 - Math.abs(d) / 0.06);

        const el   = layerRefs.current[i];
        const name = nameRefs.current[i];
        const q    = qRefs.current[i];
        if (el) {
          el.style.transform = `translateY(calc(-50% + ${ty}px))`;
          el.style.opacity   = String(opacity);
        }
        if (name) {
          name.style.transform     = `scale(${scale})`;
          name.style.letterSpacing = `${ls}em`;
        }
        if (q) q.style.opacity = String(qOp);

        const absd = Math.abs(d);
        if (absd < bestDist) { bestDist = absd; bestI = i; }
      });

      tickRefs.current.forEach((t, i) => {
        if (!t) return;
        t.style.opacity = i === bestI ? '1' : '0.25';
        t.style.width   = i === bestI ? '16px' : '10px';
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    const obs = new IntersectionObserver(([entry]) => {
      pausedRef.current = !entry.isIntersecting;
      if (entry.isIntersecting) lastRef.current = performance.now();
      layerRefs.current.forEach(el => {
        if (el) el.style.willChange = entry.isIntersecting ? 'transform' : 'auto';
      });
    }, { threshold: 0.1 });
    obs.observe(container);

    return () => {
      cancelAnimationFrame(rafRef.current);
      obs.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <style>{`.dl-name:focus-visible { outline: 2px solid rgba(242,237,203,0.85); outline-offset: 8px; border-radius: 2px; }`}</style>

      {/* Rail — left edge of panel (no overflow in horizontal track) */}
      <div aria-hidden style={{
        position: 'absolute', left: 0, top: '50%',
        transform: 'translateY(-50%) rotate(180deg)', writingMode: 'vertical-rl',
        fontFamily: "'Sora', sans-serif", fontWeight: 300, fontSize: 28,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: '#C9C4B8', opacity: 0.35, zIndex: 50,
        pointerEvents: 'none', userSelect: 'none',
      }}>DESIGN LENS</div>

      {/* Focal plane reticle */}
      <div aria-hidden style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 380, height: 120, pointerEvents: 'none', zIndex: 15 }}>
        <div style={{ position: 'absolute', top: 0,    left: 0,  width: 18, height: 18, borderTop:    '1px solid rgba(242,237,203,0.5)', borderLeft:   '1px solid rgba(242,237,203,0.5)' }} />
        <div style={{ position: 'absolute', top: 0,    right: 0, width: 18, height: 18, borderTop:    '1px solid rgba(242,237,203,0.5)', borderRight:  '1px solid rgba(242,237,203,0.5)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0,  width: 18, height: 18, borderBottom: '1px solid rgba(242,237,203,0.5)', borderLeft:   '1px solid rgba(242,237,203,0.5)' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 18, height: 18, borderBottom: '1px solid rgba(242,237,203,0.5)', borderRight:  '1px solid rgba(242,237,203,0.5)' }} />
      </div>

      {/* Five depth layers */}
      {LAYERS.map((layer, i) => (
        <div key={i} ref={el => { layerRefs.current[i] = el; }} style={{
          position: 'absolute', top: '50%', left: 0, right: 0,
          textAlign: 'center', transform: 'translateY(-50%)',
          opacity: 0.10, willChange: 'transform', zIndex: 10, pointerEvents: 'none',
        }}>
          <h3
            ref={el => { nameRefs.current[i] = el; }}
            className="dl-name"
            tabIndex={0}
            onFocus={() => jumpTo(i)}
            style={{
              fontFamily: "'Sora', sans-serif", fontWeight: 700,
              fontSize: 'clamp(28px, 5vw, 64px)', color: '#F2EDCB',
              textTransform: 'uppercase', letterSpacing: '0.34em',
              margin: 0, display: 'inline-block',
              transform: 'scale(0.45)', transformOrigin: 'center center',
              pointerEvents: 'auto', cursor: 'default', lineHeight: 1,
              background: 'none', border: 'none',
            }}
          >{layer.name}</h3>
          <p ref={el => { qRefs.current[i] = el; }} style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 14,
            color: 'rgba(242,237,203,0.55)', margin: '28px auto 0',
            opacity: 0, pointerEvents: 'none', userSelect: 'none',
            lineHeight: 1.4, maxWidth: '60ch',
          }}>{layer.question}</p>
        </div>
      ))}

      {/* Progress ticks */}
      <div aria-hidden style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 12, zIndex: 30 }}>
        {LAYERS.map((_, i) => (
          <div key={i} ref={el => { tickRefs.current[i] = el; }} style={{
            height: 1, width: 10, background: '#F2EDCB', opacity: 0.25,
            transition: 'width 0.25s cubic-bezier(0.22,1,0.36,1), opacity 0.25s cubic-bezier(0.22,1,0.36,1)',
          }} />
        ))}
      </div>
    </div>
  );
}

// ── COMPACT (hero phase preview) ──────────────────────────────────────────────
export function DesignLensCompact() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '12px 0' }}>
      {LAYERS.map((l, i) => (
        <div key={i}>
          <div style={{
            fontFamily: "'Sora', sans-serif", fontWeight: 700,
            fontSize: 'clamp(14px, 2vw, 22px)', color: '#F2EDCB',
            letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4,
          }}>
            {l.name}
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 12,
            color: 'rgba(242,237,203,0.50)', lineHeight: 1.4,
          }}>
            {l.question}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── EXPORT ────────────────────────────────────────────────────────────────────
export default function DesignLensSection() {
  const [reduced, setReduced] = useState(() =>
    !forceMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 900);

  // React to OS-level toggle mid-session
  useEffect(() => {
    if (forceMotion) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  const showStatic = reduced || isMobile;


  return (
    <section aria-label="Design Lens" style={{ position: 'relative' }}>
      {showStatic ? <StaticList /> : <AnimatedStage />}
    </section>
  );
}
