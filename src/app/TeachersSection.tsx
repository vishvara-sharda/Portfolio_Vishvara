import React from 'react';
import { motion } from 'motion/react';

const HOLE_TOP = 10;
const HOLE_SIZE = 12;
const HOLE_CENTER_Y = HOLE_TOP + HOLE_SIZE / 2; // rotation pivot = thread Y

const TEACHERS = [
  { id: 1, name: "Don Norman",                   accent: "var(--color-pink)" },
  { id: 2, name: "Ansh Mehra",                   accent: "var(--color-sky)" },
  { id: 3, name: "DR K",                         accent: "var(--color-lemon)" },
  { id: 4, name: "Saptarshi Prakash",            accent: "var(--color-pink)" },
  { id: 5, name: "The Science of Product",       accent: "var(--color-sky)" },
  { id: 6, name: "Donella H Meadows",            accent: "var(--color-lemon)" },
  { id: 7, name: "Tim Brown",                    accent: "var(--color-pink)" },
  { id: 8, name: "Dan Ariely",                   accent: "var(--color-sky)" },
];

export default function TeachersSection() {
  // no .section on outer — background:#0a0a0a must bleed full-width; .section lives on the inner div
  return (
    <section style={{ background: '#0a0a0a', overflow: 'hidden' }}>

      {/* Heading — constrained to .section width/padding */}
      <div className="section" style={{ paddingBlockEnd: 0 }}>
        <h2 style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 'clamp(2.2rem, 4vw, 3.8rem)',
          color: '#f5f5f5',
          fontWeight: 700,
          letterSpacing: '0.04em',
          margin: '0 0 72px',
          textAlign: 'center',
        }}>
          teachers i've never met
        </h2>
      </div>

      {/* Thread + bookmarks — full viewport width, bleeds off both edges */}
      <div style={{ position: 'relative', paddingBottom: 80 }}>

        {/* Thread spans the full section width */}
        <div style={{
          position: 'absolute',
          top: HOLE_CENTER_Y,
          left: 0,
          width: '100%',
          height: '1.5px',
          background: 'rgba(210,190,160,0.5)',
          zIndex: 3,
          pointerEvents: 'none',
        }} />

        {/* Bookmarks — centered, no scroll, overflow clipped by outer section */}
        <div style={{
          display: 'flex',
          gap: 'clamp(24px, 3vw, 48px)',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}>
          {TEACHERS.map((t, i) => {
            const duration  = 3.0 + (i % 4) * 0.55;
            const amplitude = 2.5 + (i % 3) * 1.2;
            const delay     = i * 0.42;

            return (
              <motion.div
                key={t.id}
                style={{
                  position: 'relative',
                  transformOrigin: `50% ${HOLE_CENTER_Y}px`,
                  flexShrink: 0,
                }}
                animate={{ rotate: [-amplitude, amplitude] }}
                transition={{
                  duration,
                  delay,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                }}
                whileHover={{
                  rotate: 0,
                  transition: { duration: 0.35, ease: 'easeOut' },
                }}
              >
                {/* Hole */}
                <div style={{
                  position: 'absolute',
                  top: HOLE_TOP,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: HOLE_SIZE,
                  height: HOLE_SIZE,
                  borderRadius: '50%',
                  background: '#0a0a0a',
                  border: '1.5px solid rgba(255,255,255,0.18)',
                  zIndex: 5,
                }} />

                {/* Bookmark body */}
                <div style={{
                  width: 'clamp(90px, 9vw, 120px)',
                  height: 'clamp(220px, 26vw, 320px)',
                  background: t.accent,
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 92%, 0% 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 8,
                }}>
                  <span style={{
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 'clamp(15px, 1.6vw, 20px)',
                    fontWeight: 500,
                    color: 'rgba(10,10,10,0.75)',
                    letterSpacing: '0.1em',
                    userSelect: 'none',
                  }}>
                    {t.name}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
