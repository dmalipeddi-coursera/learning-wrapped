import { motion } from 'framer-motion';
import type { LearnerProfile } from '../../types';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

export default function FunStatCard({ profile }: { profile: LearnerProfile }) {
  const { value, isComplete } = useAnimatedCounter(profile.quizAnswers, 2200, 300);

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

      {/* Big animated counter */}
      <motion.div
        className="relative z-10 text-white select-none tabular-nums"
        style={{
          fontSize: 96,
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {value.toLocaleString()}
      </motion.div>

      {/* Label with emoji */}
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
        <span role="img" aria-label="brain">🧠</span> quiz answers submitted
      </motion.p>

      {/* Fun comparison text */}
      <motion.p
        className="relative z-10 mt-8 max-w-xs text-center select-none px-6"
        style={{
          fontSize: 18,
          color: 'var(--cds-color-grey-300, #BDBDBD)',
          lineHeight: 1.5,
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={
          isComplete
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.95 }
        }
        transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
      >
        {profile.funComparison}
      </motion.p>
    </div>
  );
}
