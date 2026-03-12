import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { LearnerProfile } from '../../types';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const distance = 80 + Math.random() * 120;
    const size = 3 + Math.random() * 5;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size,
      delay: Math.random() * 0.3,
    };
  });
}

export default function TotalHoursCard({ profile }: { profile: LearnerProfile }) {
  const { value, isComplete } = useAnimatedCounter(profile.totalHours, 2200, 300);
  const particles = useMemo(() => generateParticles(30), []);

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full relative overflow-hidden"
      style={{ backgroundColor: 'var(--cds-color-grey-950, #1F1F1F)' }}
      role="region"
      aria-label={`You spent ${profile.totalHours} hours learning`}
    >
      {/* Particle burst */}
      {isComplete &&
        particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: 'var(--cds-color-blue-500, #3D82F3)',
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{
              x: p.x,
              y: p.y,
              opacity: [1, 1, 0],
              scale: [0, 1, 0.5],
            }}
            transition={{
              duration: 1.4,
              delay: p.delay,
              ease: 'easeOut',
            }}
          />
        ))}

      {/* Animated number */}
      <motion.span
        className="text-white font-black select-none relative z-10"
        style={{
          fontSize: 'clamp(120px, 20vw, 144px)',
          fontWeight: 900,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
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
    </div>
  );
}
