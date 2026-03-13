import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LearnerProfile, LearningPersonality } from '../../types';
import { personalities } from '../../data/personality';

const DRAW_DURATION = 1.5;
const FILL_DELAY = DRAW_DURATION;
const FILL_DURATION = 0.3;
const FLASH_DELAY = FILL_DELAY + FILL_DURATION;

const strokeAnimation = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: DRAW_DURATION, ease: 'easeInOut' },
  },
};

const fillAnimation = {
  hidden: { fillOpacity: 0 },
  visible: {
    fillOpacity: 1,
    transition: { delay: FILL_DELAY, duration: FILL_DURATION, ease: 'easeOut' },
  },
};

/* ------------------------------------------------------------------ */
/*  Floating Particles                                                  */
/* ------------------------------------------------------------------ */

function FloatingParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 3,
    duration: 4 + Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ pointerEvents: 'none' }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: 'rgba(255,255,255,0.15)',
          }}
          animate={{
            y: [-10, -30, -10],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SVG Illustrations                                                   */
/* ------------------------------------------------------------------ */

function NightOwlSVG() {
  return (
    <svg viewBox="0 0 200 200" width="180" height="180" fill="none">
      {/* Head outline */}
      <motion.path
        d="M100 20 C55 20 25 60 25 105 C25 155 55 180 100 180 C145 180 175 155 175 105 C175 60 145 20 100 20Z"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        fill="white"
        variants={{ ...strokeAnimation, visible: { ...strokeAnimation.visible, ...fillAnimation.visible } }}
        initial="hidden"
        animate="visible"
      />
      {/* Ear tufts left */}
      <motion.path
        d="M55 45 L40 10 L70 35"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="white"
        variants={{ ...strokeAnimation, visible: { ...strokeAnimation.visible, ...fillAnimation.visible } }}
        initial="hidden"
        animate="visible"
      />
      {/* Ear tufts right */}
      <motion.path
        d="M145 45 L160 10 L130 35"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="white"
        variants={{ ...strokeAnimation, visible: { ...strokeAnimation.visible, ...fillAnimation.visible } }}
        initial="hidden"
        animate="visible"
      />
      {/* Left eye circle */}
      <motion.circle
        cx="75" cy="95" r="25"
        stroke="var(--cds-color-blue-700, #0056D2)"
        strokeWidth="3"
        fill="var(--cds-color-blue-700, #0056D2)"
        variants={{ ...strokeAnimation, visible: { ...strokeAnimation.visible, ...fillAnimation.visible } }}
        initial="hidden"
        animate="visible"
      />
      {/* Right eye circle */}
      <motion.circle
        cx="125" cy="95" r="25"
        stroke="var(--cds-color-blue-700, #0056D2)"
        strokeWidth="3"
        fill="var(--cds-color-blue-700, #0056D2)"
        variants={{ ...strokeAnimation, visible: { ...strokeAnimation.visible, ...fillAnimation.visible } }}
        initial="hidden"
        animate="visible"
      />
      {/* Left pupil */}
      <motion.circle
        cx="80" cy="92" r="10"
        stroke="white"
        strokeWidth="2"
        fill="white"
        variants={{ ...strokeAnimation, visible: { ...strokeAnimation.visible, ...fillAnimation.visible } }}
        initial="hidden"
        animate="visible"
      />
      {/* Right pupil */}
      <motion.circle
        cx="130" cy="92" r="10"
        stroke="white"
        strokeWidth="2"
        fill="white"
        variants={{ ...strokeAnimation, visible: { ...strokeAnimation.visible, ...fillAnimation.visible } }}
        initial="hidden"
        animate="visible"
      />
      {/* Beak */}
      <motion.path
        d="M92 120 L100 138 L108 120"
        stroke="var(--cds-color-blue-700, #0056D2)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="var(--cds-color-blue-700, #0056D2)"
        variants={{ ...strokeAnimation, visible: { ...strokeAnimation.visible, ...fillAnimation.visible } }}
        initial="hidden"
        animate="visible"
      />
    </svg>
  );
}

function EarlyBirdSVG() {
  return (
    <svg viewBox="0 0 200 200" width="180" height="180" fill="none">
      {/* Horizon line */}
      <motion.line
        x1="10" y1="130" x2="190" y2="130"
        stroke="white"
        strokeWidth="2.5"
        variants={strokeAnimation}
        initial="hidden"
        animate="visible"
      />
      {/* Sun half circle */}
      <motion.path
        d="M60 130 A40 40 0 0 1 140 130"
        stroke="white"
        strokeWidth="3"
        fill="white"
        variants={{ ...strokeAnimation, visible: { ...strokeAnimation.visible, ...fillAnimation.visible } }}
        initial="hidden"
        animate="visible"
      />
      {/* Rays */}
      {[
        'M100 75 L100 55',
        'M130 85 L145 70',
        'M145 105 L165 95',
        'M70 85 L55 70',
        'M55 105 L35 95',
        'M115 78 L125 60',
        'M85 78 L75 60',
      ].map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          variants={strokeAnimation}
          initial="hidden"
          animate="visible"
          transition={{ delay: i * 0.08, duration: DRAW_DURATION, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  );
}

function WeekendWarriorSVG() {
  return (
    <svg viewBox="0 0 200 200" width="180" height="180" fill="none">
      {/* Shield */}
      <motion.path
        d="M100 15 L170 50 L170 110 C170 150 140 175 100 190 C60 175 30 150 30 110 L30 50 Z"
        stroke="white"
        strokeWidth="3"
        strokeLinejoin="round"
        fill="white"
        variants={{ ...strokeAnimation, visible: { ...strokeAnimation.visible, ...fillAnimation.visible } }}
        initial="hidden"
        animate="visible"
      />
      {/* Star */}
      <motion.path
        d="M100 60 L112 90 L145 92 L120 112 L128 145 L100 128 L72 145 L80 112 L55 92 L88 90 Z"
        stroke="var(--cds-color-blue-700, #0056D2)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="var(--cds-color-blue-700, #0056D2)"
        variants={{ ...strokeAnimation, visible: { ...strokeAnimation.visible, ...fillAnimation.visible } }}
        initial="hidden"
        animate="visible"
      />
    </svg>
  );
}

function SprintMasterSVG() {
  return (
    <svg viewBox="0 0 200 200" width="180" height="180" fill="none">
      <motion.path
        d="M120 10 L80 90 L115 90 L75 190 L140 100 L105 100 Z"
        stroke="white"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="white"
        variants={{ ...strokeAnimation, visible: { ...strokeAnimation.visible, ...fillAnimation.visible } }}
        initial="hidden"
        animate="visible"
      />
    </svg>
  );
}

function TheExplorerSVG() {
  return (
    <svg viewBox="0 0 200 200" width="180" height="180" fill="none">
      {/* Outer circle */}
      <motion.circle
        cx="100" cy="100" r="85"
        stroke="white"
        strokeWidth="3"
        variants={strokeAnimation}
        initial="hidden"
        animate="visible"
      />
      {/* Inner circle */}
      <motion.circle
        cx="100" cy="100" r="60"
        stroke="white"
        strokeWidth="2"
        variants={strokeAnimation}
        initial="hidden"
        animate="visible"
      />
      {/* Diamond / cardinal points */}
      <motion.path
        d="M100 20 L120 80 L100 60 L80 80 Z"
        stroke="white" strokeWidth="2" fill="white"
        variants={{ ...strokeAnimation, visible: { ...strokeAnimation.visible, ...fillAnimation.visible } }}
        initial="hidden" animate="visible"
      />
      <motion.path
        d="M100 180 L120 120 L100 140 L80 120 Z"
        stroke="white" strokeWidth="2" fill="white"
        variants={{ ...strokeAnimation, visible: { ...strokeAnimation.visible, ...fillAnimation.visible } }}
        initial="hidden" animate="visible"
      />
      <motion.path
        d="M20 100 L80 80 L60 100 L80 120 Z"
        stroke="white" strokeWidth="2" fill="white"
        variants={{ ...strokeAnimation, visible: { ...strokeAnimation.visible, ...fillAnimation.visible } }}
        initial="hidden" animate="visible"
      />
      <motion.path
        d="M180 100 L120 80 L140 100 L120 120 Z"
        stroke="white" strokeWidth="2" fill="white"
        variants={{ ...strokeAnimation, visible: { ...strokeAnimation.visible, ...fillAnimation.visible } }}
        initial="hidden" animate="visible"
      />
      {/* Center dot */}
      <motion.circle
        cx="100" cy="100" r="5"
        stroke="white" strokeWidth="2" fill="white"
        variants={{ ...strokeAnimation, visible: { ...strokeAnimation.visible, ...fillAnimation.visible } }}
        initial="hidden" animate="visible"
      />
    </svg>
  );
}

function SteadyLearnerSVG() {
  return (
    <svg viewBox="0 0 200 200" width="180" height="180" fill="none">
      <motion.path
        d="M10 100 L30 100 L45 60 L55 140 L70 40 L80 160 L95 55 L105 130 L120 70 L135 110 L150 90 L170 100 L190 100"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={strokeAnimation}
        initial="hidden"
        animate="visible"
      />
    </svg>
  );
}

const personalitySVGs: Record<LearningPersonality, () => JSX.Element> = {
  'Night Owl': NightOwlSVG,
  'Early Bird': EarlyBirdSVG,
  'Weekend Warrior': WeekendWarriorSVG,
  'Sprint Master': SprintMasterSVG,
  'The Explorer': TheExplorerSVG,
  'Steady Learner': SteadyLearnerSVG,
};

const PERSONALITY_RARITY: Record<LearningPersonality, number> = {
  'Night Owl': 22,
  'Early Bird': 18,
  'Weekend Warrior': 12,
  'Sprint Master': 15,
  'The Explorer': 8,
  'Steady Learner': 25,
};

/* ------------------------------------------------------------------ */
/*  Shimmer keyframes (CSS injected once)                               */
/* ------------------------------------------------------------------ */

const shimmerStyleId = 'personality-shimmer-style';
if (typeof document !== 'undefined' && !document.getElementById(shimmerStyleId)) {
  const style = document.createElement('style');
  style.id = shimmerStyleId;
  style.textContent = `
    @keyframes personality-shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
  `;
  document.head.appendChild(style);
}

export default function PersonalityCard({ profile }: { profile: LearnerProfile }) {
  const personalityInfo = personalities[profile.personality];
  const SVGComponent = personalitySVGs[profile.personality];
  const rarityPercent = PERSONALITY_RARITY[profile.personality];

  const [showFlash, setShowFlash] = useState(false);
  const [drawComplete, setDrawComplete] = useState(false);

  useEffect(() => {
    const flashTimer = setTimeout(() => {
      setShowFlash(true);
      setDrawComplete(true);
    }, FLASH_DELAY * 1000);

    return () => clearTimeout(flashTimer);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, var(--cds-color-blue-700, #0056D2) 0%, #003D99 100%)',
      }}
      role="region"
      aria-label={`Your learning personality: ${profile.personality}. ${personalityInfo.description}`}
    >
      {/* Floating particles */}
      <FloatingParticles />

      {/* Subtle radial glow */}
      <div
        className="absolute"
        style={{
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -55%)',
          pointerEvents: 'none',
        }}
      />

      {/* Flash reveal effect */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            className="absolute inset-0 z-20"
            style={{ backgroundColor: 'rgba(255,255,255,0.6)', pointerEvents: 'none' }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* SVG illustration with gentle float after draw */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={
          drawComplete
            ? { opacity: 1, y: [0, -6, 0] }
            : { opacity: 1, y: 0 }
        }
        transition={
          drawComplete
            ? { y: { duration: 3, repeat: Infinity, ease: 'easeInOut' }, duration: 0.6, ease: 'easeOut' }
            : { duration: 0.6, ease: 'easeOut' }
        }
        className="relative z-10 mb-8"
      >
        <SVGComponent />
      </motion.div>

      {/* Personality name with scale-up badge reveal */}
      <motion.h2
        className="text-white text-center relative z-10 select-none"
        style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.3 }}
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          delay: DRAW_DURATION + FILL_DURATION,
          duration: 0.6,
          ease: [0.34, 1.56, 0.64, 1],
        }}
      >
        {profile.personality}
      </motion.h2>

      {/* Description */}
      <motion.p
        className="text-center relative z-10 mt-3 max-w-xs select-none px-6"
        style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: DRAW_DURATION + FILL_DURATION + 0.2, duration: 0.5, ease: 'easeOut' }}
      >
        {personalityInfo.description}
      </motion.p>

      {/* Rarity badge with shimmer */}
      <motion.div
        className="relative z-10 mt-5 select-none"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 14px',
          borderRadius: 20,
          backgroundColor: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(8px)',
          overflow: 'hidden',
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: DRAW_DURATION + FILL_DURATION + 0.5, duration: 0.4, ease: 'easeOut' }}
      >
        {/* Shimmer overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'personality-shimmer 3s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', position: 'relative' }}>
          You + {rarityPercent}% of learners
        </span>
      </motion.div>
    </div>
  );
}
