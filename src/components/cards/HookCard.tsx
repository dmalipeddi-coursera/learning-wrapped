import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LearnerProfile } from '../../types';

const CHAR_DELAY_MS = 60;

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

function AmbientParticles() {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      size: 2 + Math.random() * 2,
      duration: 4 + Math.random() * 3,
      delay: Math.random() * 2,
    }));
  }, []);

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: 'rgba(91, 155, 245, 0.4)',
          }}
          animate={{
            y: [0, -12, 0, 8, 0],
            x: [0, 6, -4, 2, 0],
            opacity: [0.2, 0.5, 0.3, 0.5, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  );
}

export default function HookCard({ profile }: { profile: LearnerProfile }) {
  const TEXT = `${profile.name}, you showed up.`;
  const [visibleChars, setVisibleChars] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);

  const subtitleWords = 'And that changed everything.'.split(' ');

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
      {/* Ambient floating particles */}
      <AmbientParticles />

      {/* Glow effect behind text with breathing pulse after typing */}
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
            animate={{
              opacity: [0, 1, 0.7, 1],
              scale: [0.8, 1, 0.95, 1.05, 1],
            }}
            transition={{
              opacity: {
                duration: 1.2,
                ease: 'easeOut',
                times: [0, 0.4, 0.7, 1],
              },
              scale: {
                duration: 3,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
              },
            }}
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

        {/* Blinking cursor - thicker and blue-tinted */}
        {!typingDone ? (
          <span
            className="inline-block ml-0.5"
            style={{
              width: 3,
              height: 36,
              backgroundColor: 'rgba(91, 155, 245, 0.9)',
              borderRadius: 1,
            }}
          />
        ) : (
          <motion.span
            className="inline-block ml-0.5"
            style={{
              width: 3,
              height: 36,
              backgroundColor: 'rgba(91, 155, 245, 0.9)',
              borderRadius: 1,
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

      {/* Subtitle fade-in word by word */}
      <AnimatePresence>
        {showSubtitle && (
          <div
            className="relative z-10 mt-4 select-none text-center px-8 flex flex-wrap justify-center gap-x-1.5"
          >
            {subtitleWords.map((word, i) => (
              <motion.span
                key={i}
                style={{
                  fontSize: 18,
                  color: 'var(--cds-color-blue-300, #79A8F7)',
                  fontWeight: 400,
                  lineHeight: 1.5,
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.18,
                  ease: 'easeOut',
                }}
              >
                {word}
              </motion.span>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
