import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LearnerProfile } from '../../types';

const CHAR_DELAY_MS = 50;

export default function HookCard({ profile }: { profile: LearnerProfile }) {
  const TEXT = `${profile.name}, you showed up.`;
  const [visibleChars, setVisibleChars] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);

  useEffect(() => {
    if (visibleChars < TEXT.length) {
      const timer = setTimeout(() => {
        setVisibleChars((prev) => prev + 1);
      }, CHAR_DELAY_MS);
      return () => clearTimeout(timer);
    } else {
      setTypingDone(true);
      const subtitleTimer = setTimeout(() => setShowSubtitle(true), 800);
      return () => clearTimeout(subtitleTimer);
    }
  }, [visibleChars, TEXT.length]);

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full relative overflow-hidden"
      style={{ backgroundColor: 'var(--cds-color-grey-950, #1F1F1F)' }}
      role="region"
      aria-label={`Welcome, ${profile.name}. You showed up. And that changed everything.`}
    >
      {/* Glow effect behind text */}
      <AnimatePresence>
        {typingDone && (
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 320,
              height: 160,
              background:
                'radial-gradient(ellipse at center, rgba(61,130,243,0.18) 0%, rgba(61,130,243,0) 70%)',
              filter: 'blur(40px)',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Typewriter text + cursor */}
      <div className="relative z-10 flex items-center px-6">
        <h1
          className="text-white font-bold select-none"
          style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2 }}
        >
          {TEXT.slice(0, visibleChars)}
        </h1>

        {/* Blinking cursor */}
        {!typingDone ? (
          <span
            className="inline-block ml-0.5"
            style={{
              width: 2,
              height: 36,
              backgroundColor: 'white',
            }}
          />
        ) : (
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

      {/* Subtitle fade-in */}
      <AnimatePresence>
        {showSubtitle && (
          <motion.p
            className="relative z-10 mt-4 select-none text-center px-8"
            style={{
              fontSize: 18,
              color: 'var(--cds-color-blue-300, #79A8F7)',
              fontWeight: 400,
              lineHeight: 1.5,
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            And that changed everything.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
