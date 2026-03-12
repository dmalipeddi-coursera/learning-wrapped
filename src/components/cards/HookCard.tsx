import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LearnerProfile } from '../../types';

const TEXT = "You've been busy.";
const CHAR_DELAY_MS = 50;

export default function HookCard({ profile }: { profile: LearnerProfile }) {
  const [visibleChars, setVisibleChars] = useState(0);
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    if (visibleChars < TEXT.length) {
      const timer = setTimeout(() => {
        setVisibleChars((prev) => prev + 1);
      }, CHAR_DELAY_MS);
      return () => clearTimeout(timer);
    } else {
      setTypingDone(true);
    }
  }, [visibleChars]);

  return (
    <div
      className="flex items-center justify-center w-full h-full relative overflow-hidden"
      style={{ backgroundColor: 'var(--cds-color-grey-950, #1F1F1F)' }}
      role="region"
      aria-label={`Welcome, ${profile.name}. ${TEXT}`}
    >
      {/* Glow effect behind text */}
      <AnimatePresence>
        {typingDone && (
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 320,
              height: 120,
              background:
                'radial-gradient(ellipse at center, rgba(61,130,243,0.15) 0%, rgba(61,130,243,0) 70%)',
              filter: 'blur(40px)',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Typewriter text + cursor */}
      <div className="relative z-10 flex items-center">
        <h1
          className="text-white font-bold select-none"
          style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2 }}
        >
          {TEXT.slice(0, visibleChars)}
        </h1>

        {/* Blinking cursor */}
        {!typingDone ? (
          /* Steady cursor while typing */
          <span
            className="inline-block ml-0.5"
            style={{
              width: 2,
              height: 36,
              backgroundColor: 'white',
            }}
          />
        ) : (
          /* After typing: blink twice then fade out */
          <motion.span
            className="inline-block ml-0.5"
            style={{
              width: 2,
              height: 36,
              backgroundColor: 'white',
            }}
            animate={{
              opacity: [1, 0, 1, 0, 1, 0],
            }}
            transition={{
              duration: 2.4,
              times: [0, 0.15, 0.3, 0.45, 0.6, 1],
              ease: 'linear',
            }}
          />
        )}
      </div>
    </div>
  );
}
