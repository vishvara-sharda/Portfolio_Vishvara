import React, { useRef, useEffect } from 'react';
import whaleGif from '../imports/whale.gif';

function owr(s: number) { const x = Math.sin(s + 3) * 10000; return x - Math.floor(x); }

const OW_STATIC = Array.from({ length: 200 }, (_, i) => ({
  x:  owr(i * 4)     * 100,
  y:  owr(i * 4 + 1) * 100,
  r:  owr(i * 4 + 2) * 1.6 + 0.3,
  op: owr(i * 4 + 3) * 0.4 + 0.08,
}));

const OW_BLINK = Array.from({ length: 100 }, (_, i) => ({
  x:   owr((i + 200) * 4)     * 100,
  y:   owr((i + 200) * 4 + 1) * 100,
  r:   owr((i + 200) * 4 + 2) * 1.8 + 0.5,
  dur: (owr((i + 200) * 4 + 3) * 3 + 2).toFixed(1),
  del: (owr((i + 200) * 4)     * 6).toFixed(1),
}));

function OWStarfield() {
  return (
    <>
      <style>{`
        @keyframes ow-blink { 0%,100%{opacity:0.05} 50%{opacity:0.7} }
        @media(prefers-reduced-motion:reduce){.ow-blink{animation:none!important;opacity:0.25}}
      `}</style>
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0 }}
      >
        {OW_STATIC.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r * 0.1} fill="#E8E4C9" opacity={s.op} />
        ))}
        {OW_BLINK.map((s, i) => (
          <circle
            key={i}
            className="ow-blink"
            cx={s.x} cy={s.y} r={s.r * 0.1}
            fill="#E8E4C9"
            style={{ animation: `ow-blink ${s.dur}s ease-in-out ${s.del}s infinite` }}
          />
        ))}
      </svg>
    </>
  );
}

const rawComicImages = import.meta.glob<string>(
  '../imports/japanese comic/*.jpg',
  { eager: true, import: 'default' }
);
const COMIC_IMAGES = Object.entries(rawComicImages)
  .sort(([a], [b]) => {
    const n = (s: string) => parseInt(s.match(/(\d+)\.jpg$/)?.[1] ?? '0');
    return n(a) - n(b);
  })
  .map(([, url]) => url);

const CREAM = '#E8E4C9';
const BORDER = `1px solid rgba(232,228,201,0.2)`;

const STOPS = [
  { p: 0.15, n: '01', title: 'Pottery',       trail: 'even though i make messes more' },
  { p: 0.5,  n: '02', title: 'Language',      trail: 'takes me 10 days to learn a japanese word and 10 seconds to forget' },
  { p: 0.85, n: '03', title: 'Illustrations', trail: 'even though i copy' },
];

function SpecTable({ rows }: { rows: [string, string][] }) {
  return (
    <table style={{ borderCollapse: 'collapse' }}>
      <tbody>
        {rows.map(([l, v]) => (
          <tr key={l}>
            <td style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: '0.18em', color: CREAM, opacity: 0.4, paddingRight: 24, paddingBlock: '5px', whiteSpace: 'nowrap', verticalAlign: 'top' }}>{l}</td>
            <td style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: CREAM, opacity: 0.8, verticalAlign: 'top' }}>{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Shared right-column (title + trail + spec table)
function TextCol({ id, n, title, trail, rows }: { id: string; n: string; title: string; trail: string; rows: [string,string][] }) {
  return (
    <div style={{ flex: '0 0 38%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: CREAM, opacity: 0.35 }}>{n}</span>
        <h2 id={id} style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3vw,2.6rem)', color: CREAM, margin: 0, lineHeight: 1.05 }}>{title}</h2>
      </div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: CREAM, opacity: 0.5, fontStyle: 'italic', margin: '0 0 32px' }}>— {trail}</p>
      <SpecTable rows={rows} />
    </div>
  );
}

const SW_STYLE: React.CSSProperties = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translateX(-50%) translateY(-50%)',
  width: 'min(820px, 92vw)',
};

const SECTION_BASE: React.CSSProperties = {
  opacity: 0,
  transition: 'opacity 0.35s ease',
  display: 'flex',
  flexDirection: 'row',
  gap: '6%',
  alignItems: 'center',
  position: 'relative',
  zIndex: 4,
};

export default function OutsideWork() {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const stickyRef  = useRef<HTMLDivElement>(null);
  const stopRefs   = useRef<(HTMLElement | null)[]>([null, null, null]);
  const dotRefs    = useRef<(HTMLDivElement | null)[]>([null, null, null]);

  const focusStop = (idx: number) => {
    const wrap   = wrapRef.current;
    const sticky = stickyRef.current;
    if (!wrap || !sticky) return;
    const wrapTop     = wrap.getBoundingClientRect().top + window.scrollY;
    const scrollRange = wrap.offsetHeight - sticky.offsetHeight;
    window.scrollTo({ top: wrapTop + STOPS[idx].p * scrollRange, behavior: 'smooth' });
  };

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(max-width: 900px)').matches) return;

    const wrap   = wrapRef.current;
    const sticky = stickyRef.current;
    if (!wrap || !sticky) return;

    let raf = 0;
    const mid01 = (STOPS[0].p + STOPS[1].p) / 2;
    const mid12 = (STOPS[1].p + STOPS[2].p) / 2;

    const tick = () => {
      const wrapTop     = wrap.getBoundingClientRect().top + window.scrollY;
      const scrollRange = wrap.offsetHeight - sticky.offsetHeight;
      const p = Math.max(0, Math.min(1, (window.scrollY - wrapTop) / scrollRange));

      const activeIdx = p < mid01 ? 0 : p < mid12 ? 1 : 2;

      STOPS.forEach((_stop, i) => {
        const el  = stopRefs.current[i];
        const dot = dotRefs.current[i];
        const active = i === activeIdx;
        if (el) {
          el.style.opacity       = active ? '1' : '0';
          el.style.transform     = 'translateY(0)';
          el.style.pointerEvents = active ? 'auto' : 'none';
        }
        if (dot) dot.style.opacity = active ? '1' : '0.25';
      });
    };

    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <style>{`
        @media (max-width: 900px), (prefers-reduced-motion: reduce) {
          .ow-wrap   { height: auto !important; }
          .ow-sticky { position: relative !important; height: auto !important; overflow: visible !important; }
          .ow-host   { position: relative !important; display: flex !important; flex-direction: column !important; gap: 80px !important; padding: 80px 24px 100px !important; }
          .ow-sw     { position: relative !important; top: auto !important; left: auto !important; transform: none !important; width: 100% !important; max-width: 580px !important; margin: 0 auto; }
          .ow-si     { opacity: 1 !important; transform: none !important; pointer-events: auto !important; flex-direction: column !important; gap: 24px !important; }

          .ow-dots   { display: none !important; }
        }
        .ow-comic::-webkit-scrollbar { display: none; }
      `}</style>

      <div ref={wrapRef} className="ow-wrap" style={{ height: '280vh', position: 'relative' }}>

        <div
          ref={stickyRef}
          className="ow-sticky"
          style={{ position: 'sticky', top: 0, height: '100vh', zIndex: 2 }}
        >
          <OWStarfield />


          <div className="ow-host" style={{ position: 'absolute', inset: 0 }}>

            {/* Section heading */}
            <div style={{
              position: 'absolute', left: 24, top: '50%',
              transform: 'translateY(-50%) rotate(-90deg)',
              transformOrigin: 'center center',
              fontFamily: "'Sora',sans-serif", fontWeight: 300,
              fontSize: 22.4, letterSpacing: '0.22em',
              color: '#C9C4B8', opacity: 0.35,
              whiteSpace: 'nowrap', zIndex: 5, pointerEvents: 'none',
              textTransform: 'uppercase' as const,
            }}>OFF DUTY</div>

            {/* ── Stop 01: Pottery ── */}
            <div className="ow-sw" style={SW_STYLE}>

              <section
                ref={el => { stopRefs.current[0] = el; }}
                aria-labelledby="ow-h0"
                className="ow-si"
                tabIndex={0}
                onFocus={() => focusStop(0)}
                style={SECTION_BASE}
              >
                {/* LEFT — media frame */}
                <div style={{ flex: '0 0 56%', border: BORDER, borderRadius: 10, overflow: 'hidden', background: 'rgba(8,6,12,0.6)', aspectRatio: '4/3' }}>
                  <img
                    src={whaleGif}
                    alt="Clay whale — my best and only good piece"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                  />
                </div>
                {/* RIGHT — text */}
                <TextCol id="ow-h0" n="01" title="Pottery" trail="even though i make messes more"
                  rows={[['MEDIUM','air-dry clay'],['MADE','1 piece'],['BEST ONE','the whale'],['WORST','they are hidden']]} />
              </section>
            </div>

            {/* ── Stop 02: Language ── */}
            <div className="ow-sw" style={SW_STYLE}>

              <section
                ref={el => { stopRefs.current[1] = el; }}
                aria-labelledby="ow-h1"
                className="ow-si"
                tabIndex={0}
                onFocus={() => focusStop(1)}
                style={SECTION_BASE}
              >
                {/* LEFT — Japanese text block as media */}
                <div style={{ flex: '0 0 56%', border: BORDER, borderRadius: 10, overflow: 'hidden', background: 'rgba(8,6,12,0.6)', padding: '32px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div lang="ja" style={{ fontFamily: "'Noto Serif JP',serif", fontSize: 'clamp(22px,2.8vw,38px)', color: CREAM, lineHeight: 1.65, marginBottom: 12 }}>
                    こんにちは、<br />はじめまして。<br />私はヴィシュヴァラです。
                  </div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: CREAM, opacity: 0.45, fontStyle: 'italic' }}>
                    Hi, nice to meet you. I am Vishvara.
                  </div>
                </div>
                {/* RIGHT — text */}
                <TextCol id="ow-h1" n="02" title="Language" trail="takes me 10 days to learn a japanese word and 10 seconds to forget"
                  rows={[['LEVEL','N5 (slowly)'],['METHOD','youtube lectures + cause i can'],['STREAK','too inconsistent to track'],['FAVOURITE WORD','命 — inochi (life)']]} />
              </section>
            </div>

            {/* ── Stop 03: Illustrations ── */}
            <div className="ow-sw" style={SW_STYLE}>

              <section
                ref={el => { stopRefs.current[2] = el; }}
                aria-labelledby="ow-h2"
                className="ow-si"
                tabIndex={0}
                onFocus={() => focusStop(2)}
                style={SECTION_BASE}
              >
                {/* LEFT — comic strip as media */}
                <div style={{ flex: '0 0 56%', border: BORDER, borderRadius: 10, overflow: 'hidden', background: '#0A0409', display: 'flex', flexDirection: 'column', padding: '12px 12px 0' }}>
                  <div
                    role="region"
                    aria-label="KI &amp; VISH comic strip — drag to scroll"
                    className="ow-comic"
                    style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', cursor: 'grab', userSelect: 'none' }}
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
                    {COMIC_IMAGES.map((url, i) => (
                      <div key={i} style={{ flexShrink: 0, height: 160, borderRadius: 4, overflow: 'hidden' }}>
                        <img src={url} alt={`KI & VISH comic panel ${i + 1}`} draggable={false} style={{ height: '100%', width: 'auto', display: 'block', pointerEvents: 'none' }} />
                      </div>
                    ))}
                  </div>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: CREAM, opacity: 0.35, margin: '8px 0 12px', textAlign: 'center', fontStyle: 'italic', flexShrink: 0 }}>drag to scroll · not for portfolio · just for me</p>
                </div>
                {/* RIGHT — text */}
                <TextCol id="ow-h2" n="03" title="Illustrations" trail="even though i copy"
                  rows={[['TOOL','canva'],['PANELS','12 so far'],['CAST','Ki & Vish'],['WHY','thinking out loud']]} />
              </section>
            </div>

          </div>{/* end stops host */}

          {/* Progress dots — above hills */}
          <div className="ow-dots" aria-hidden style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 5 }}>
            {STOPS.map((_, i) => (
              <div key={i} ref={el => { dotRefs.current[i] = el; }} style={{ width: 5, height: 5, borderRadius: '50%', background: CREAM, opacity: 0.25 }} />
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
