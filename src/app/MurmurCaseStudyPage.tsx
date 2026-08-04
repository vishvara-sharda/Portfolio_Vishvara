import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import fullViewHer from '../imports/Murmur/full view.png';
import fullViewHim from '../imports/Murmur/full view man.png';
import pvw from '../imports/Murmur/pvw.png';
import pvm from '../imports/Murmur/pvm.png';
import pvwGlow from '../imports/Murmur/pvw glow red.png';
import pvmGlow from '../imports/Murmur/pvm glow red.png';
import murmurGif from '../imports/Murmur/gif.gif';
import f1 from '../imports/Murmur/story/f 1.png';
import f2 from '../imports/Murmur/story/f2.png';
import f3 from '../imports/Murmur/story/f3.png';
import story0 from '../imports/Murmur/story/0.png';
import story1 from '../imports/Murmur/story/1.png';
import story2 from '../imports/Murmur/story/2.png';
import story3 from '../imports/Murmur/story/3.png';
import story4 from '../imports/Murmur/story/4.png';
import story5 from '../imports/Murmur/story/5.png';
import story6 from '../imports/Murmur/story/6.png';
import story7 from '../imports/Murmur/story/7.png';
const storyImgs = [story0, story1, story2, story3, story4, story5, story6, story7];
import murmurGif2 from '../imports/Murmur/gif2.gif';
import technicalView from '../imports/Murmur/technical view.png';
import menTechnical from '../imports/Murmur/men techoncal.png';
import bellies from '../imports/Murmur/bellies.png';
import cable from '../imports/Murmur/cable.png';
import cable2 from '../imports/Murmur/cable 2.png';
import silicon from '../imports/Murmur/silicon.png';

interface MurmurCaseStudyPageProps {
  onClose: (scrollTo?: string) => void;
}

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] as const },
};

const ImgPH = ({ label, tall }: { label: string; tall?: boolean }) => (
  <div style={{
    width: '100%',
    minHeight: tall ? 360 : 220,
    border: '1px dashed rgba(232,228,201,0.2)',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(232,228,201,0.03)',
    color: 'rgba(232,228,201,0.35)',
    fontSize: 12,
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: '0.06em',
    padding: '24px 16px',
    textAlign: 'center',
  }}>
    [IMG: {label}]
  </div>
);

const TextPH = ({ children, large, muted }: { children: string; large?: boolean; muted?: boolean }) => (
  <span style={{
    display: 'block',
    background: 'rgba(232,228,201,0.07)',
    border: '1px dashed rgba(232,228,201,0.15)',
    borderRadius: 6,
    padding: '8px 14px',
    color: muted ? 'rgba(232,228,201,0.3)' : 'rgba(232,228,201,0.55)',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: large ? 22 : 13,
    lineHeight: 1.6,
    letterSpacing: large ? '-0.02em' : '0.01em',
    marginBottom: 8,
  }}>
    {children}
  </span>
);

const SectionLabel = ({ children }: { children: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
    <div style={{ width: 32, height: 1, background: 'var(--color-lemon)' }} />
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-lemon)', fontFamily: "'DM Sans', sans-serif" }}>
      {children}
    </span>
  </div>
);

const NOISE_SVG = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const NAV_SECTIONS = [
  { id: 'cs-story',     label: 'Story' },
  { id: 'cs-research',  label: 'Research' },
  { id: 'cs-solution',  label: 'Solution' },
  { id: 'cs-business',  label: 'Business' },
];

export default function MurmurCaseStudyPage({ onClose }: MurmurCaseStudyPageProps) {
  const containerRef   = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const xpTextRef      = useRef<HTMLSpanElement>(null);
  const isNavScrolled  = useRef(false);
  const navRef         = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const pct = el.scrollTop / (el.scrollHeight - el.clientHeight);
      if (progressBarRef.current) progressBarRef.current.style.height = `${pct * 100}%`;
      if (xpTextRef.current) xpTextRef.current.textContent = `${Math.round(pct * 100)}%`;
      const scrolled = el.scrollTop > 40;
      if (scrolled !== isNavScrolled.current) {
        isNavScrolled.current = scrolled;
        if (navRef.current) {
          navRef.current.style.backgroundColor = scrolled ? 'rgba(18,18,18,0.6)' : 'rgba(18,18,18,0.8)';
          navRef.current.style.backdropFilter  = scrolled ? 'blur(24px)' : 'blur(16px)';
        }
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const target = containerRef.current?.querySelector(`#${id}`);
    target?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      ref={containerRef}
      className="hide-scrollbar"
      data-lenis-prevent
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#000', color: '#fff', overflowY: 'auto' }}
    >
      <style>{`
        @media (max-width: 480px) {
          .murmur-nav-links { gap: 8px !important; }
          .murmur-nav-links button { font-size: 8px !important; letter-spacing: 0.08em !important; }
          .murmur-progress { display: none !important; }
        }
      `}</style>

      {/* Noise overlay */}
      <div
        className="pointer-events-none"
        style={{ position: 'fixed', inset: 0, zIndex: 110, opacity: 0.04, backgroundImage: NOISE_SVG }}
      />

      {/* Floating nav */}
      <nav
        ref={navRef}
        style={{
          position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
          zIndex: 120, border: '1px solid #333', borderRadius: 9999,
          padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
          width: 'calc(100% - 2rem)', maxWidth: 600,
          backgroundColor: 'rgba(18,18,18,0.8)', backdropFilter: 'blur(16px)',
          transition: 'background-color 0.4s ease, backdrop-filter 0.4s ease',
        }}
      >
        <button
          onClick={() => onClose()}
          style={{ width: 32, height: 32, borderRadius: '50%', background: '#1E1E1E', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-lemon)'; (e.currentTarget as HTMLButtonElement).style.color = '#000'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#1E1E1E'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
        >
          <ArrowLeft size={14} />
        </button>

        <ul className="murmur-nav-links" style={{ display: 'flex', gap: 16, listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
          {NAV_SECTIONS.map(s => (
            <li key={s.id}>
              <button
                onClick={() => scrollTo(s.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", transition: 'color 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-lemon)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#6B7280'; }}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>

        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1E1E1E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-lemon)', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.05em' }}>M</span>
        </div>
      </nav>

      {/* Right progress bar */}
      <div className="murmur-progress" style={{ position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)', zIndex: 120, height: '40vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, pointerEvents: 'none' }}>
        <span ref={xpTextRef} style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: '#6B7280', textTransform: 'uppercase', writingMode: 'vertical-rl', transform: 'rotate(180deg)', height: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "'DM Sans', sans-serif" }}>0%</span>
        <div style={{ width: 6, flex: 1, background: '#1E1E1E', border: '1px solid #333', borderRadius: 999, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          <div ref={progressBarRef} style={{ width: '100%', height: '0%', background: 'linear-gradient(to bottom, var(--color-lemon), rgba(232,228,201,0.3))', transition: 'height 0.3s ease' }} />
        </div>
      </div>

      {/* ─── SECTION 1 — HEADER ─────────────────────────────────────── */}
      <section style={{ paddingTop: 160, paddingBottom: 96, borderBottom: '1px solid #222' }}>
        <motion.div style={{ maxWidth: 960, margin: '0 auto', padding: '0 clamp(16px, 5vw, 32px)' }} {...fadeUp}>
          <SectionLabel>Murmur — Case Study</SectionLabel>
          <TextPH large>[TEXT: PROJECT TITLE — one word or short phrase]</TextPH>
          <div style={{ height: 16 }} />
          <TextPH>[TEXT: ONE-LINE DESCRIPTION — max 15 words, says what the project is]</TextPH>
          <div style={{ height: 32 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1, background: '#222', border: '1px solid #222', borderRadius: 16, overflow: 'hidden' }}>
            {[['ROLE', '[TEXT: 3–6 words]'], ['SKILLS', '[TEXT: 4–6 items]'], ['TOOLS', '[TEXT: 4–6 items]']].map(([label, ph]) => (
              <div key={label} style={{ background: '#0a0a0a', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
                <span style={{ fontSize: 13, color: 'rgba(232,228,201,0.4)', fontFamily: "'DM Sans', sans-serif" }}>{ph}</span>
              </div>
            ))}
          </div>
          <div style={{ height: 32 }} />
          <img src={murmurGif} alt="Murmur" style={{ width: '100%', borderRadius: 16, display: 'block' }} />
          <div style={{ height: 16 }} />
          <img src={murmurGif2} alt="Murmur 2" style={{ width: '100%', borderRadius: 16, display: 'block' }} />
        </motion.div>
      </section>

      {/* ─── SECTION 2 — VIDEO ──────────────────────────────────────── */}
      <section style={{ padding: '96px clamp(16px, 5vw, 32px)', borderBottom: '1px solid #222', textAlign: 'center' }}>
        <motion.div style={{ maxWidth: 960, margin: '0 auto' }} {...fadeUp}>
          <SectionLabel>Video</SectionLabel>
          <div style={{ width: '100%', aspectRatio: '16/9', border: '1px dashed rgba(232,228,201,0.2)', borderRadius: 16, background: 'rgba(232,228,201,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(232,228,201,0.35)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.06em' }}>
            [VIDEO: PROJECT WALKTHROUGH — under 2 minutes]
          </div>
          <div style={{ height: 16 }} />
          <TextPH>[TEXT: VIDEO CAPTION — max 10 words]</TextPH>
        </motion.div>
      </section>

      {/* ─── SECTION 3 — THE STORYBOOK ──────────────────────────────── */}
      <section id="cs-story" style={{ padding: '96px 0', borderBottom: '1px solid #222' }}>
        <motion.div style={{ maxWidth: 960, margin: '0 auto', padding: '0 clamp(16px, 5vw, 32px)' }} {...fadeUp}>
          <SectionLabel>The Storybook</SectionLabel>
        </motion.div>

        {/* Slide strip */}
        <div
          style={{ display: 'flex', gap: 16, overflowX: 'auto', padding: '32px clamp(16px, 5vw, 32px)', scrollSnapType: 'x mandatory', cursor: 'grab', userSelect: 'none' }}
          className="hide-scrollbar"
          onMouseDown={e => {
            const el = e.currentTarget;
            const startX = e.pageX - el.offsetLeft;
            const startScroll = el.scrollLeft;
            el.style.cursor = 'grabbing';
            const onMove = (ev: MouseEvent) => { el.scrollLeft = startScroll - (ev.pageX - el.offsetLeft - startX); };
            const onUp = () => { el.style.cursor = 'grab'; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);
          }}
        >
          {[
            { type: 'illus', n: 1 }, { type: 'illus', n: 2 },
            { type: 'illus', n: 3 }, { type: 'illus', n: 4 }, { type: 'fact', n: 1, img: f1 },
            { type: 'illus', n: 5 },
            { type: 'illus', n: 6 }, { type: 'fact', n: 4, img: f3 }, { type: 'illus', n: 7 }, { type: 'illus', n: 8 }, { type: 'fact', n: 3, img: f2 },
            { type: 'statement', n: 0 },
          ].map((slide, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.04, ease: [0.25, 1, 0.5, 1] }}
              style={{
                flexShrink: 0, width: 320, scrollSnapAlign: 'start',
                border: '1px solid #222', borderRadius: 16, overflow: 'hidden',
                background: slide.type === 'fact' ? 'rgba(232,228,201,0.04)' : '#0a0a0a',
                display: 'flex', flexDirection: 'column', gap: 0,
              }}
            >
              {slide.type === 'illus' && (
                <>
                  <img
                    src={storyImgs[slide.n - 1]}
                    alt={`Scene ${slide.n}`}
                    style={{ width: '100%', height: 360, objectFit: 'cover', display: 'block', borderBottom: '1px solid #222' }}
                  />
                  <div style={{ padding: '14px 16px', color: 'rgba(232,228,201,0.4)', fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>[TEXT: CAPTION 0{slide.n}]</div>
                </>
              )}
              {slide.type === 'fact' && (
                'img' in slide && slide.img
                  ? <img src={slide.img} alt={`fact ${slide.n}`} style={{ width: '100%', height: 360, objectFit: 'cover', display: 'block' }} />
                  : <div style={{ height: 360, border: '1px dashed rgba(232,228,201,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(232,228,201,0.2)', fontSize: 10, fontFamily: "'DM Sans', sans-serif" }}>[IMG: IVORY BOTANICAL BACKGROUND]</div>
              )}
              {slide.type === 'statement' && (
                <div style={{ padding: 40, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 300, fontSize: 20, color: 'rgba(232,228,201,0.6)', textAlign: 'center', lineHeight: 1.5 }}>[TEXT: PROBLEM STATEMENT — 2 lines, large type]</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── SECTION 4 — TRANSITION ─────────────────────────────────── */}
      <section style={{ padding: '80px clamp(16px, 5vw, 32px)', borderBottom: '1px solid #222', textAlign: 'center' }}>
        <motion.p style={{ maxWidth: 640, margin: '0 auto', fontFamily: "'Sora', sans-serif", fontWeight: 300, fontSize: 18, color: 'rgba(232,228,201,0.4)', fontStyle: 'italic' }} {...fadeUp}>
          [TEXT: TRANSITION LINE — one sentence bridging story to research]
        </motion.p>
      </section>

      {/* ─── SECTION 5 — WHAT THE RESEARCH FOUND ───────────────────── */}
      <section id="cs-research" style={{ padding: '96px clamp(16px, 5vw, 32px)', borderBottom: '1px solid #222' }}>
        <motion.div style={{ maxWidth: 960, margin: '0 auto' }} {...fadeUp}>
          <SectionLabel>What the Research Found</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(420px, 100%), 1fr))', gap: 24 }}>
            {[1, 2, 3, 4].map(n => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: n * 0.08, ease: [0.25, 1, 0.5, 1] }}
                style={{ padding: 28, border: '1px solid #222', borderRadius: 16, background: '#0a0a0a', display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                <TextPH>[TEXT: FINDING HEADLINE {n} — max 10 words]</TextPH>
                <TextPH muted>[TEXT: FINDING BODY {n} — 1–2 sentences]</TextPH>
                <div style={{ borderLeft: '2px solid var(--color-lemon)', paddingLeft: 16, marginTop: 8 }}>
                  <span style={{ display: 'block', color: 'rgba(232,228,201,0.45)', fontSize: 13, fontFamily: "'Sora', sans-serif", fontStyle: 'italic', lineHeight: 1.6 }}>[QUOTE: PARTICIPANT QUOTE {n}]</span>
                  <span style={{ display: 'block', color: '#6B7280', fontSize: 11, marginTop: 6, fontFamily: "'DM Sans', sans-serif" }}>— [TEXT: ATTRIBUTION {n}]</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            style={{ marginTop: 32, padding: 32, border: '1px solid rgba(232,228,201,0.15)', borderRadius: 16, background: 'rgba(232,228,201,0.03)' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          >
            <TextPH>[TEXT: COUNTER-FINDING HEADLINE — the finding that cuts against the project]</TextPH>
            <TextPH muted>[TEXT: COUNTER-FINDING BODY — 2–3 sentences]</TextPH>
          </motion.div>

          <div style={{ marginTop: 32 }}>
            <ImgPH label="FINDINGS MATRIX or SPIRAL DIAGRAM" tall />
            <div style={{ height: 8 }} />
            <TextPH muted>[TEXT: DIAGRAM CAPTION — one line]</TextPH>
          </div>
        </motion.div>
      </section>

      {/* ─── SECTION 6 — RESEARCH PROCESS ──────────────────────────── */}
      <section style={{ padding: '96px clamp(16px, 5vw, 32px)', borderBottom: '1px solid #222' }}>
        <motion.div style={{ maxWidth: 960, margin: '0 auto' }} {...fadeUp}>
          <SectionLabel>Research Process</SectionLabel>
          <TextPH muted>[TEXT: SECTION INTRO — 2 lines on how the research was run]</TextPH>
          <div style={{ height: 32 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <ImgPH label="SCANNED HANDWRITTEN NOTES ×N" tall />
            <ImgPH label="INTERVIEW PHOTOS ×N — faces blurred or cropped" tall />
            <ImgPH label="SYNTHESIS / AFFINITY MAPPING ×N" tall />
          </div>
          <div style={{ height: 12 }} />
          <TextPH muted>[TEXT: CAPTIONS — one short line per image or image group]</TextPH>
        </motion.div>
      </section>

      {/* ─── SECTION 7 — IDEATION ───────────────────────────────────── */}
      <section style={{ padding: '96px clamp(16px, 5vw, 32px)', borderBottom: '1px solid #222' }}>
        <motion.div style={{ maxWidth: 960, margin: '0 auto' }} {...fadeUp}>
          <SectionLabel>Ideation</SectionLabel>
          <TextPH muted>[TEXT: IDEATION SUMMARY — exactly 2 lines]</TextPH>
          <div style={{ height: 32 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <ImgPH label="STICKY NOTES ×N" tall />
            <ImgPH label="SKETCHES ×N" tall />
            <ImgPH label="EARLY CONCEPTS ×N" tall />
          </div>
        </motion.div>
      </section>

      {/* ─── SECTION 8 — THE DESIGN QUESTION ───────────────────────── */}
      <section style={{ padding: '120px clamp(16px, 5vw, 32px)', borderBottom: '1px solid #222', textAlign: 'center' }}>
        <motion.p
          style={{ maxWidth: 720, margin: '0 auto', fontFamily: "'Sora', sans-serif", fontWeight: 300, fontSize: 28, color: 'rgba(232,228,201,0.55)', lineHeight: 1.45 }}
          {...fadeUp}
        >
          [TEXT: DESIGN QUESTION — one sentence]
        </motion.p>
      </section>

      {/* ─── SECTION 9 — THE SOLUTION ───────────────────────────────── */}
      <section id="cs-solution" style={{ padding: '96px clamp(16px, 5vw, 32px)', borderBottom: '1px solid #222' }}>
        <motion.div style={{ maxWidth: 960, margin: '0 auto' }} {...fadeUp}>
          <SectionLabel>The Solution</SectionLabel>

          {/* 9a — full shot: Her / Him */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
            {([
              { label: 'Her', glow: pvwGlow, pv: pvw,  pvPos: 'center center', full: fullViewHer, fullPos: 'center 40%' },
              { label: 'Him', glow: pvmGlow, pv: pvm,  pvPos: 'center center', full: fullViewHim, fullPos: 'center top' },
            ] as const).map(({ label, glow, pv, pvPos, full, fullPos }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 300, fontSize: 22, color: 'rgba(232,228,201,0.7)', marginBottom: 4, letterSpacing: '-0.02em' }}>
                  {label}
                </h3>
                {/* glow — visible immediately */}
                <div style={{ aspectRatio: '1 / 1', borderRadius: 16, overflow: 'hidden' }}>
                  <img src={glow} alt={`${label} glow`} style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', objectPosition: 'center center' }} />
                </div>
                {/* normal pv — fades in on scroll */}
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
                  style={{ aspectRatio: '1 / 1', borderRadius: 16, overflow: 'hidden' }}
                >
                  <img src={pv} alt={`${label} product view`} style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', objectPosition: pvPos }} />
                </motion.div>
                {/* full body */}
                <div style={{ aspectRatio: '1774 / 887', borderRadius: 16, overflow: 'hidden' }}>
                  <img src={full} alt={`${label} full view`} style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', objectPosition: fullPos }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ height: 48 }} />

          {/* 9b */}
          <TextPH>[TEXT: SOLUTION OVERVIEW — 2–3 sentences, high level, no technical detail]</TextPH>
          <div style={{ height: 48 }} />

          {/* 9c */}
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 300, fontSize: 20, color: 'rgba(232,228,201,0.5)', marginBottom: 24 }}>
            [TEXT: SUBSECTION HEADING — "I didn't forget the technicalities"]
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[technicalView, menTechnical].map((src, i) => (
              <img key={i} src={src} alt={`technical view ${i + 1}`} style={{ width: '100%', borderRadius: 16, display: 'block' }} />
            ))}
          </div>
          <div style={{ height: 40 }} />

          {[1, 2, 3, 4].map(n => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.05, ease: [0.25, 1, 0.5, 1] }}
              style={{ padding: '24px 28px', border: '1px solid #222', borderRadius: 12, marginBottom: 16, background: '#0a0a0a', display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(232,228,201,0.6)', fontFamily: "'DM Sans', sans-serif" }}>[TEXT: DECISION LABEL {n}]</span>
                <span style={{ color: '#444' }}>·</span>
                <em style={{ fontSize: 11, color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}>[TEXT: MECHANISM {n}]</em>
              </div>
              <TextPH muted>[TEXT: DECISION BODY {n} — 2 sentences, second one short]</TextPH>
              {n === 1
                ? <img src={bellies} alt="detail shot 1" style={{ width: '50%', borderRadius: 12, display: 'block', margin: '0 auto' }} />
                : n === 2
                ? <img src={cable2} alt="detail shot 2" style={{ width: '30%', borderRadius: 12, display: 'block', margin: '0 auto' }} />
                : n === 3
                ? <img src={cable} alt="detail shot 3" style={{ width: '30%', borderRadius: 12, display: 'block', margin: '0 auto' }} />
                : n === 4
                ? <img src={silicon} alt="detail shot 4" style={{ width: '50%', borderRadius: 12, display: 'block', margin: '0 auto' }} />
                : <ImgPH label={`DETAIL SHOT ${n} — optional`} />
              }
            </motion.div>
          ))}

          {/* 9d */}
          <div style={{ height: 48 }} />
          <TextPH>[TEXT: EMOTIONAL REASONING — 2–3 paragraphs on what the product refuses and why]</TextPH>
        </motion.div>
      </section>

      {/* ─── SECTION 10 — THE BUSINESS ──────────────────────────────── */}
      <section id="cs-business" style={{ padding: '96px clamp(16px, 5vw, 32px)', borderBottom: '1px solid #222' }}>
        <motion.div style={{ maxWidth: 960, margin: '0 auto' }} {...fadeUp}>
          <SectionLabel>The Business</SectionLabel>
          <TextPH>[TEXT: FRAMING LINE — one sentence: how this would work, and what would have to be true]</TextPH>
          <div style={{ height: 48 }} />

          {/* 10a */}
          <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 16 }}>Purchase and gifting</h3>
          <TextPH muted>[TEXT: PURCHASE BODY — 2–3 sentences]</TextPH>
          <div style={{ height: 16 }} />
          <ImgPH label="PURCHASE MOMENT VISUAL — optional" />
          <div style={{ height: 48 }} />


          {/* 10c */}
          <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 16 }}>The unit model</h3>
          <TextPH muted>[TEXT: UNIT MODEL — 2–3 sentences]</TextPH>
          <ImgPH label="UNIT MODEL DIAGRAM — optional" />
          <div style={{ height: 12 }} />
          <TextPH>[TEXT: THE TRADE — 1–2 sentences naming the cost of the choice, not just the benefit]</TextPH>
          <div style={{ height: 48 }} />

          {/* 10d */}
          <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 16 }}>Retention</h3>
          <TextPH muted>[TEXT: RETENTION MECHANISMS — 2–3 sentences]</TextPH>
          <TextPH muted>[TEXT: THE ENDING — 1 sentence on the product having a natural end]</TextPH>
          <div style={{ height: 48 }} />

          {/* 10e */}
          <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 16 }}>[TEXT: SECTION HEADING — What would have to be true]</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2, 3, 4].map(n => (
              <li key={n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', border: '1px solid #333', background: '#111', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}>{n}</span>
                <span style={{ color: 'rgba(232,228,201,0.35)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>[TEXT: UNTESTED ASSUMPTION {n}]</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* ─── SECTION 11 — PROTOTYPE ─────────────────────────────────── */}
      <section style={{ padding: '96px clamp(16px, 5vw, 32px)', borderBottom: '1px solid #222' }}>
        <motion.div style={{ maxWidth: 960, margin: '0 auto' }} {...fadeUp}>
          <SectionLabel>Prototype</SectionLabel>
          <TextPH muted>[TEXT: SECTION INTRO — 1–2 lines on what was built and why]</TextPH>
          <div style={{ height: 32 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {['full view — angle 1', 'full view — angle 2', 'full view — angle 3', 'detail crop — mechanism 1', 'detail crop — mechanism 2', 'full view — angle 4 (optional)'].map(label => (
              <ImgPH key={label} label={`PROTOTYPE — ${label}`} tall />
            ))}
          </div>
          <div style={{ height: 12 }} />
          <TextPH muted>[TEXT: CAPTIONS — one line each]</TextPH>
        </motion.div>
      </section>

      {/* ─── SECTION 12 — REACTIONS ─────────────────────────────────── */}
      <section style={{ padding: '96px clamp(16px, 5vw, 32px)', borderBottom: '1px solid #222' }}>
        <motion.div style={{ maxWidth: 960, margin: '0 auto' }} {...fadeUp}>
          <SectionLabel>Reactions</SectionLabel>
          <TextPH muted>[TEXT: FRAMING LINE — states plainly that this is first-response reactions, not a structured usability test]</TextPH>
          <div style={{ height: 32 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[1, 2, 3].map(n => (
              <div key={n}>
                <ImgPH label={`PERSON HOLDING PROTOTYPE ${n}`} tall />
                <div style={{ height: 8 }} />
                <div style={{ borderLeft: '2px solid var(--color-lemon)', paddingLeft: 12 }}>
                  <span style={{ display: 'block', color: 'rgba(232,228,201,0.4)', fontSize: 13, fontFamily: "'Sora', sans-serif", fontStyle: 'italic', lineHeight: 1.5 }}>[QUOTE: REACTION QUOTE {n}]</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── SECTION 13 — WHAT I WOULD DO DIFFERENTLY ──────────────── */}
      <section style={{ padding: '96px clamp(16px, 5vw, 32px)', borderBottom: '1px solid #222' }}>
        <motion.div style={{ maxWidth: 960, margin: '0 auto' }} {...fadeUp}>
          <SectionLabel>What I Would Do Differently</SectionLabel>
          <TextPH muted>[TEXT: SECTION HEADING]</TextPH>
          <div style={{ height: 24 }} />
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1, 2, 3, 4].map(n => (
              <motion.li
                key={n}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: n * 0.07, ease: [0.25, 1, 0.5, 1] }}
                style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}
              >
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, color: 'var(--color-lemon)', marginTop: 2, flexShrink: 0 }}>0{n}</span>
                <span style={{ color: 'rgba(232,228,201,0.35)', fontSize: 14, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>[TEXT: POINT 0{n} — one line{n > 2 ? ', optional' : ''}]</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* ─── SECTION 14 — FINAL THOUGHTS ────────────────────────────── */}
      {/* Plain text only — no imagery, no background */}
      <section style={{ padding: '160px clamp(16px, 5vw, 32px)' }}>
        <motion.p
          style={{ maxWidth: 600, margin: '0 auto', fontFamily: "'Sora', sans-serif", fontWeight: 300, fontSize: 22, color: 'rgba(232,228,201,0.45)', lineHeight: 1.6, textAlign: 'center', fontStyle: 'italic' }}
          {...fadeUp}
        >
          [TEXT: CLOSING REFLECTION — 1–2 sentences]
        </motion.p>
      </section>

    </div>
  );
}
