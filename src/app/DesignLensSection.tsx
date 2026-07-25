import React, { useState } from "react";

const CX = 310;
const CY = 310;

const rings = [
  { label: "SYSTEMIC",    sub: "Who, What, Where, How?",        desc: "You look at the whole ecosystem before designing anything — all the stakeholders, the context, how the parts connect.", r: 278, textR: 262, fill: true,  swing: 3, dur: "9s"  },
  { label: "EMPATHETIC",  sub: "Who, Why do they care?",        desc: "You dig into who the person really is and how they experience the problem emotionally, not just functionally.",         r: 214, textR: 198, fill: false, swing: 4, dur: "7s"  },
  { label: "ROOTED",      sub: "Why (the real reason)?",        desc: "You don't design around symptoms — you keep asking why until you hit the actual cause.",                               r: 154, textR: 138, fill: true,  swing: 5, dur: "11s" },
  { label: "VALIDATED",   sub: "Does it work? How do we know?", desc: "You don't trust an idea until you've tested it and seen evidence it works.",                                           r: 98,  textR: 82,  fill: false, swing: 3, dur: "6s"  },
  { label: "SUSTAINABLE", sub: "Will it last?",                 desc: "You design for the solution to actually last — adoption, business viability, long-term use — not just a clever concept.", r: 48, textR: 34, fill: true,  swing: 6, dur: "5s"  },
];

function circularPath(cx: number, cy: number, r: number) {
  return `M ${cx - r},${cy} a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 ${-r * 2},0`;
}

function donutPath(cx: number, cy: number, outerR: number, innerR: number) {
  const outer = `M ${cx - outerR},${cy} a ${outerR},${outerR} 0 1,1 ${outerR * 2},0 a ${outerR},${outerR} 0 1,1 ${-outerR * 2},0`;
  if (innerR <= 0) return outer;
  const inner = `M ${cx - innerR},${cy} a ${innerR},${innerR} 0 1,0 ${innerR * 2},0 a ${innerR},${innerR} 0 1,0 ${-innerR * 2},0`;
  return `${outer} ${inner}`;
}

export default function DesignLensSection() {
  const [active, setActive] = useState<number | null>(null);
  const [locked, setLocked]  = useState<number | null>(null);

  const displayed = locked ?? active;

  function handleEnter(i: number) { setActive(i); }
  function handleLeave()          { setActive(null); }
  function handleClick(i: number) {
    setLocked(prev => {
      const next = prev === i ? null : i;
      setActive(next); // reset hover too so state is clean
      return next;
    });
  }

  return (
    <section className="section" style={{ background: "transparent", overflow: "hidden" }} onClick={() => { setLocked(null); setActive(null); }}>
      <style>{`
        .dl-ring { transition: opacity 0.3s ease; }
        .dl-desc-enter { animation: dl-fade-in 0.3s ease forwards; }
        @keyframes dl-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shadow-orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", letterSpacing: "0.25em", color: "#888", textTransform: "uppercase", margin: "0 0 12px" }}>
          how i see design
        </p>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "clamp(2.2rem, 4vw, 3.8rem)", color: "var(--color-lemon)", margin: 0, lineHeight: 1.1 }}>
          Design Lens
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "40px" }}>
        {/* barrel rim — the cylinder edge that gives depth */}
        <div style={{ position: "relative", width: "min(900px, 92vw)", height: "min(900px, 92vw)" }}>
          {/* cast shadow — orbits the lens center */}
          <div style={{ position: "absolute", inset: 0, animation: "shadow-orbit 8s linear infinite", zIndex: 0 }}>
            <div style={{
              position: "absolute",
              width: "84%", height: "22%",
              bottom: "-2%", left: "8%",
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(0,0,0,0.95) 0%, transparent 70%)",
              filter: "blur(36px)",
            }} />
          </div>
          {/* barrel wall — conic gradient wraps the cylinder rim, bright where light hits, dark underneath */}
          <div style={{
            position: "absolute", inset: "1.5%",
            borderRadius: "50%",
            background: "conic-gradient(from 208deg, rgba(255,255,255,0.30) 0deg, rgba(200,200,230,0.12) 50deg, rgba(0,0,0,0.04) 110deg, rgba(0,0,0,0.26) 190deg, rgba(0,0,0,0.58) 275deg, rgba(140,140,175,0.15) 330deg, rgba(255,255,255,0.30) 360deg)",
            animation: "shadow-orbit 8s linear infinite",
            zIndex: 1,
            pointerEvents: "none",
          }} />
          {/* front rim bevel — the step where the barrel wall meets the glass face */}
          <div style={{
            position: "absolute", inset: "4%",
            borderRadius: "50%",
            background: "transparent",
            boxShadow: "inset 0 -6px 24px rgba(0,0,0,0.9), inset 0 4px 14px rgba(255,255,255,0.15), 0 0 0 2px rgba(255,255,255,0.24), 0 3px 0 2px rgba(0,0,0,0.7)",
            zIndex: 2,
            pointerEvents: "none",
          }} />
        <svg
          viewBox="0 0 620 620"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            filter: "drop-shadow(0 -4px 12px rgba(255,255,255,0.08))",
            zIndex: 3,
          }}
          aria-hidden="true"
          onMouseLeave={handleLeave}
          onClick={e => e.stopPropagation()}
        >
          <defs>
            {rings.map((ring, i) => (
              <path key={i} id={`ring-path-${i}`} d={circularPath(CX, CY, ring.textR)} />
            ))}
            <radialGradient id="lens-bg" cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#2a2a3e" />
              <stop offset="60%" stopColor="#0f0d1a" />
              <stop offset="100%" stopColor="#050308" />
            </radialGradient>
          </defs>

          {/* background + reset click */}
          <circle cx={CX} cy={CY} r={284} fill="url(#lens-bg)" stroke="rgba(255,255,255,0.06)" strokeWidth={1} onClick={() => { setLocked(null); setActive(null); }} style={{ cursor: "default" }} />

          {/* tick marks */}
          {Array.from({ length: 72 }).map((_, i) => {
            const angle = (i * 5 * Math.PI) / 180;
            const isMajor = i % 9 === 0;
            const inner = 284 - (isMajor ? 10 : 5);
            return <line key={i} x1={CX + Math.cos(angle) * inner} y1={CY + Math.sin(angle) * inner} x2={CX + Math.cos(angle) * 283} y2={CY + Math.sin(angle) * 283} stroke="rgba(255,255,255,0.2)" strokeWidth={isMajor ? 1.5 : 0.75} />;
          })}

          {/* rings rendered back-to-front */}
          {[...rings].reverse().map((ring, ri) => {
            const i = rings.length - 1 - ri;
            const isActive = displayed === i;
            const fontSize = ring.r > 200 ? 13 : ring.r > 130 ? 11 : ring.r > 80 ? 9 : 8;
            const subSize  = ring.r > 200 ? 11 : ring.r > 130 ? 9  : ring.r > 80 ? 8  : 7;
            return (
              <g key={i} className="dl-ring" style={{ opacity: displayed === null || isActive ? 1 : 0.2 }}>
                <animateTransform
                  attributeName="transform" type="rotate"
                  values={`0 ${CX} ${CY}; ${ring.swing} ${CX} ${CY}; 0 ${CX} ${CY}; -${ring.swing} ${CX} ${CY}; 0 ${CX} ${CY}`}
                  dur={ring.dur} repeatCount="indefinite" calcMode="spline"
                  keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
                />
                <circle
                  cx={CX} cy={CY} r={ring.r}
                  fill={ring.fill ? "rgba(255,255,255,0.04)" : "none"}
                  stroke={isActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)"}
                  strokeWidth={isActive ? 2 : 0.75}
                  style={{ filter: isActive ? "drop-shadow(0 0 8px rgba(255,255,255,0.5))" : "none", transition: "all 0.3s ease" }}
                />
                <text textAnchor="middle" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: fontSize, fontWeight: 700, letterSpacing: "0.2em", fill: isActive ? "#fff" : "rgba(255,255,255,0.7)" }}>
                  <textPath href={`#ring-path-${i}`} startOffset="25%">{ring.label}</textPath>
                </text>
                {ring.r > 60 && (
                  <text textAnchor="middle" style={{ fontFamily: "'Sora', sans-serif", fontSize: subSize, fontWeight: 400, fontStyle: "italic", letterSpacing: "0.06em", fill: isActive ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)" }}>
                    <textPath href={`#ring-path-${i}`} startOffset="75%">{ring.sub}</textPath>
                  </text>
                )}
              </g>
            );
          })}

          <circle cx={CX} cy={CY} r={14} fill="var(--color-bg)" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
          <circle cx={CX} cy={CY} r={4}  fill="rgba(255,255,255,0.3)" />

          {/* donut hit areas */}
          {rings.map((ring, i) => (
            <path
              key={i}
              d={donutPath(CX, CY, ring.r, rings[i + 1]?.r ?? 0)}
              fill="transparent"
              fillRule="evenodd"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
              onClick={() => handleClick(i)}
            />
          ))}
        </svg>
          {/* rim highlight — top-left crescent where light source hits the raised front face */}
          <div style={{
            position: "absolute", inset: "4%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at 26% 16%, rgba(255,255,255,0.22) 0%, var(--color-border-glass) 32%, transparent 58%)",
            zIndex: 4,
            pointerEvents: "none",
          }} />
        </div>

      </div>
    </section>
  );
}

