import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { LearnerProfile } from '../../types';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const distance = 80 + Math.random() * 140;
    const size = 4 + Math.random() * 7;
    const rotation = Math.random() * 360;
    // Alternate between blue and white
    const isBlue = i % 2 === 0;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size,
      delay: Math.random() * 0.3,
      rotation,
      color: isBlue
        ? 'var(--cds-color-blue-400, #5B9BF5)'
        : 'rgba(255, 255, 255, 0.85)',
    };
  });
}

export default function TotalHoursCard({ profile }: { profile: LearnerProfile }) {
  const { value, isComplete } = useAnimatedCounter(profile.totalHours, 2200, 300);
  const particles = useMemo(() => generateParticles(36), []);

  // Progress toward final number (0 to 1)
  const progress = profile.totalHours > 0 ? value / profile.totalHours : 0;

  // Intensifying glow while counting
  const countupGlowOpacity = isComplete ? 0.6 : progress * 0.8;
  const countupGlowBlur = isComplete ? 20 : 8 + progress * 24;

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full relative overflow-hidden"
      style={{ backgroundColor: 'var(--cds-color-grey-950, #1F1F1F)' }}
      role="region"
      aria-label={`You spent ${profile.totalHours} hours learning`}
    >
      {/* Blue glow ring/halo behind the number */}
      {isComplete && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 220,
            height: 220,
            border: '2px solid rgba(61, 130, 243, 0.3)',
            boxShadow: '0 0 40px rgba(61, 130, 243, 0.15), inset 0 0 40px rgba(61, 130, 243, 0.05)',
          }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: [0, 0.8, 0.5, 0.8],
            scale: [0.6, 1, 1.05, 1],
          }}
          transition={{
            opacity: {
              duration: 2.5,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            },
            scale: {
              duration: 2.5,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            },
          }}
        />
      )}

      {/* Particle burst - 2 colors, larger, with rotation */}
      {isComplete &&
        particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
            animate={{
              x: p.x,
              y: p.y,
              opacity: [1, 1, 0],
              scale: [0, 1.2, 0.4],
              rotate: p.rotation,
            }}
            transition={{
              duration: 1.6,
              delay: p.delay,
              ease: 'easeOut',
            }}
          />
        ))}

      {/* Animated number with countup glow */}
      <motion.span
        className="text-white font-black select-none relative z-10"
        style={{
          fontSize: 'clamp(120px, 20vw, 144px)',
          fontWeight: 900,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
          textShadow: `0 0 ${countupGlowBlur}px rgba(61, 130, 243, ${countupGlowOpacity})`,
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {value}
      </motion.span>

      {/* Label */}
      <motion.p
        className="relative z-10 mt-4 select-none"
        style={{
          fontSize: 20,
          color: 'var(--cds-color-blue-300, #79A8F7)',
          fontWeight: 500,
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        hours of learning
      </motion.p>

      {/* Relatable comparison - slides in from below with scale */}
      {isComplete && (
        <motion.p
          className="relative z-10 mt-6 text-center select-none px-8"
          style={{
            fontSize: 16,
            color: 'var(--cds-color-grey-300, #BDBDBD)',
            fontWeight: 400,
            lineHeight: 1.5,
          }}
          initial={{ opacity: 0, y: 24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
        >
          {profile.totalHours >= 100
            ? `That's ${Math.round(profile.totalHours / 24)} full days of growth. More time than most people spend on New Year's resolutions all year.`
            : profile.totalHours >= 40
              ? `That's ${Math.round(profile.totalHours / 2)} movies worth of learning. Except you actually remember what happened.`
              : `That's ${Math.round(profile.totalHours / 2)} flights from New York to LA, spent leveling up instead of watching seatback TV.`}
        </motion.p>
      )}
    </div>
  );
}
