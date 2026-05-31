import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import heartUrl from '../imports/logo/heart.svg';
import starUrl from '../imports/logo/star.svg';

export default function LoadingScreen({ onStart }: { onStart: () => void }) {
  const [showHeart, setShowHeart] = useState(true);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [exiting, setExiting] = useState(false);

  // Rapid icon toggle
  useEffect(() => {
    const interval = setInterval(() => setShowHeart(v => !v), 400);
    return () => clearInterval(interval);
  }, []);

  // Progress fill over 3 seconds
  useEffect(() => {
    const duration = 3000;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleStart = () => setExiting(true);

  const radius = 74;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);
  const ringColor = showHeart ? '#F2A7C4' : '#FAFFC7';

  return createPortal(
    <motion.div
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.55, ease: 'easeInOut' }}
      onAnimationComplete={() => { if (exiting) onStart(); }}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0A0409',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '44px',
      }}
    >
      {/* Subtle grain */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.04,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Icon + circular progress ring */}
      <div style={{ position: 'relative', width: 172, height: 172 }}>
        <svg
          width="172" height="172"
          style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
        >
          {/* Track */}
          <circle
            cx="86" cy="86" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="2.5"
          />
          {/* Progress arc */}
          <circle
            cx="86" cy="86" r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke 0.12s ease, stroke-dashoffset 0.05s linear' }}
          />
        </svg>

        {/* Icon */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img
            src={showHeart ? heartUrl : starUrl}
            alt=""
            style={{ width: 100, height: 100, objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* Start button */}
      <AnimatePresence>
        {done && (
          <motion.button
            key="start-btn"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            onClick={handleStart}
            onMouseOver={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#FAFFC7';
              (e.currentTarget as HTMLButtonElement).style.color = '#fff';
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(250,255,199,0.25)';
              (e.currentTarget as HTMLButtonElement).style.color = '#FAFFC7';
            }}
            style={{
              background: 'transparent',
              border: '1px solid rgba(250,255,199,0.25)',
              color: '#FAFFC7',
              padding: '13px 52px',
              borderRadius: '8px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '10px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'border-color 0.3s ease, color 0.3s ease',
            }}
          >
            Start
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>,
    document.body
  );
}
