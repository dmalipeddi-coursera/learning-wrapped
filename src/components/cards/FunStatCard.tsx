import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { LearnerProfile } from '../../types';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

/* ------------------------------------------------------------------ */
/*  Inject keyframes for orbit ring                                     */
/* ------------------------------------------------------------------ */

const orbitStyleId = 'funstat-orbit-style';
if (typeof document !== 'undefined' && !document.getElementById(orbitStyleId)) {
  const style = document.createElement('style');
  style.id = orbitStyleId;
  style.textContent = `
    @keyframes funstat-orbit {
      0% { transform: translate(-50%, -50%) rotate(0deg); }
      100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

/* ------------------------------------------------------------------ */
/*  Celebration Particles                                               */
/* ------------------------------------------------------------------ */

function CelebrationParticles({ active }: { active: boolean }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        color: ['#3B82F6', '#60A5FA', '#93C5FD', '#2563EB', '#BFDBFE'][i],
        angle: (i / 5) * 360,
        distance: 40 + Math.random() * 30,
        size: 4 + Math.random() * 4,
      })),
    []
  );

  if (!active) return null;

  return (
    <>
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.distance;
        const ty = Math.sin(rad) * p.distance;

        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              top: '50%',
              left: '50%',
              marginLeft: -p.size / 2,
              marginTop: -p.size / 2,
              pointerEvents: 'none',
              zIndex: 20,
            }}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{ opacity: 0, x: tx, y: ty - 20, scale: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Typewriter Text                                                     */
/* ------------------------------------------------------------------ */

function TypewriterText({ text, active }: { text: string; active: boolean }) {
  const [displayedLength, setDisplayedLength] = useState(0);

  useEffect(() => {
    if (!active) {
      setDisplayedLength(0);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedLength(i);
      if (i >= text.length) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, [active, text]);

  if (!active) return null;

  return (
    <span>
      {text.slice(0, displayedLength)}
      {displayedLength < text.length && (
        <span style={{ opacity: 0.6 }}>|</span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  FunStatCard                                                         */
/* ------------------------------------------------------------------ */

export default function FunStatCard({ profile }: { profile: LearnerProfile }) {
  const { value, isComplete } = useAnimatedCounter(profile.quizAnswers, 2200, 300);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (isComplete) {
      setShowParticles(true);
      const timer = setTimeout(() => setShowParticles(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full relative overflow-hidden"
      style={{ backgroundColor: 'var(--cds-color-grey-950, #0A0A0A)' }}
      role="region"
      aria-label={`You submitted ${profile.quizAnswers} quiz answers. ${profile.funComparison}`}
    >
      {/* Ambient glow behind number */}
      <div
        className="absolute"
        style={{
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(0,86,210,0.12) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -55%)',
          pointerEvents: 'none',
        }}
      />

      {/* Slow rotating orbit ring */}
      <div
        className="absolute"
        style={{
          width: 200,
          height: 200,
          top: '42%',
          left: '50%',
          animation: 'funstat-orbit 20s linear infinite',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
          <circle
            cx="100" cy="100" r="95"
            stroke="rgba(59, 130, 246, 0.12)"
            strokeWidth="1"
            strokeDasharray="6 8"
          />
        </svg>
      </div>

      {/* Big animated counter with gradient text */}
      <motion.div
        className="relative z-10 select-none tabular-nums"
        style={{
          fontSize: 96,
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: '-0.02em',
          background: 'linear-gradient(180deg, #3B82F6 0%, #93C5FD 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {value.toLocaleString()}

        {/* Celebration particles positioned relative to the number */}
        <CelebrationParticles active={showParticles} />
      </motion.div>

      {/* Label with animated brain emoji */}
      <motion.p
        className="relative z-10 mt-4 select-none"
        style={{
          fontSize: 20,
          color: 'var(--cds-color-blue-300, #90C2FF)',
          fontWeight: 500,
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' }}
      >
        {/* Brain emoji with bounce-spin when counter finishes */}
        <motion.span
          role="img"
          aria-label="brain"
          style={{ display: 'inline-block' }}
          animate={
            isComplete
              ? { rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.3, 1.3, 1.2, 1.1, 1] }
              : {}
          }
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          🧠
        </motion.span>{' '}
        quiz answers submitted
      </motion.p>

      {/* Fun comparison text with typewriter effect */}
      <motion.p
        className="relative z-10 mt-8 max-w-xs text-center select-none px-6"
        style={{
          fontSize: 18,
          color: 'var(--cds-color-grey-300, #BDBDBD)',
          lineHeight: 1.5,
          minHeight: '3em',
        }}
        initial={{ opacity: 0 }}
        animate={isComplete ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <TypewriterText text={profile.funComparison} active={isComplete} />
      </motion.p>
    </div>
  );
}
