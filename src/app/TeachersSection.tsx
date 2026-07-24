import React from 'react';
import { motion } from 'motion/react';

const HOLE_TOP = 10;
const HOLE_SIZE = 12;
const HOLE_CENTER_Y = HOLE_TOP + HOLE_SIZE / 2; // rotation pivot = thread Y

const TEACHERS = [
  { id: 1, name: "Don Norman",                   accent: "#F2A7C4" },
  { id: 2, name: "Ansh Mehra",                   accent: "#93C5FD" },
  { id: 3, name: "DR K",                         accent: "#FAFFC7" },
  { id: 4, name: "Saptarshi Prakash",            accent: "#F2A7C4" },
  { id: 5, name: "The Science of Product",       accent: "#93C5FD" },
  { id: 6, name: "Donella H Meadows",            accent: "#FAFFC7" },
  { id: 7, name: "Tim Brown",                    accent: "#F2A7C4" },
  { id: 8, name: "Dan Ariely",                   accent: "#93C5FD" },
];

export default function TeachersSection() {
  return (
    <section style={{
      padding: '100px clamp(24px, 5vw, 80px)',
      background: '#0a0a0a',
      overflow: 'hidden',
    }}>
      <h2 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 'clamp(32px, 5vw, 52px)',
        color: '#f5f5f5',
        fontWeight: 300,
        letterSpacing: '0.04em',
        margin: '0 0 72px',
        textAlign: 'center',
      }}>
        teachers i've never met
      </h2>

      {/* Thread + bookmarks */}
      <div style={{ position: 'relative' }}>

        {/* Thread — full viewport width, breaks out of section padding */}
        <div style={{
          position: 'absolute',
          top: HOLE_CENTER_Y,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100vw',
          height: '1.5px',
          background: 'rgba(210,190,160,0.5)',
          zIndex: 3,
          pointerEvents: 'none',
        }} />

        {/* Bookmarks row */}
        <div style={{
          display: 'flex',
          gap: 'clamp(24px, 3vw, 48px)',
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflowX: 'auto',
          paddingBottom: 40,
        }}>
          {TEACHERS.map((t, i) => {
            const duration   = 3.0 + (i % 4) * 0.55;
            const amplitude  = 2.5 + (i % 3) * 1.2;
            const delay      = i * 0.42;

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
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 'clamp(15px, 1.6vw, 20px)',
                    fontWeight: 700,
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
