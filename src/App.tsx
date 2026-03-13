import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StoryPlayer from './components/story/StoryPlayer';
import { demoProfile } from './data/demoProfiles';
import { storyCards } from './data/cardConfigs';

function CourseraLogo() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Coursera"
      role="img"
    >
      <path
        d="M24 4L6 14v20l18 10 18-10V14L24 4z"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M24 4L6 14l18 10 18-10L24 4z"
        fill="rgba(255,255,255,0.15)"
        stroke="white"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M6 14v20l18 10V24L6 14z"
        fill="rgba(255,255,255,0.08)"
      />
      <line
        x1="24"
        y1="24"
        x2="24"
        y2="44"
        stroke="white"
        strokeWidth="2"
      />
      <circle cx="24" cy="18" r="3" fill="white" />
    </svg>
  );
}

function CourseraWordmark() {
  return (
    <svg
      width="120"
      height="18"
      viewBox="0 0 120 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Coursera"
      role="img"
    >
      <text
        x="0"
        y="14"
        fill="rgba(255,255,255,0.4)"
        fontFamily="var(--cds-font-family)"
        fontSize="14"
        fontWeight="600"
        letterSpacing="0.08em"
      >
        COURSERA
      </text>
    </svg>
  );
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const floatAnimation = {
  y: [0, -8, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

export default function App() {
  const [started, setStarted] = useState(false);
  const storyRegionRef = useRef<HTMLDivElement>(null);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  const handleUnwrap = useCallback(() => {
    setStarted(true);
    setLiveAnnouncement('Learning story started. Use arrow keys to navigate between cards.');
  }, []);

  const handleExit = useCallback(() => {
    setStarted(false);
    setLiveAnnouncement('Returned to landing page.');
  }, []);

  const handleCardChange = useCallback((index: number, total: number) => {
    const cardType = storyCards[index]?.type ?? '';
    setLiveAnnouncement(
      `Card ${index + 1} of ${total}: ${cardType.replace(/-/g, ' ')}`
    );
  }, []);

  // Focus the story region when it mounts
  useEffect(() => {
    if (started && storyRegionRef.current) {
      storyRegionRef.current.focus();
    }
  }, [started]);

  return (
    <div className="h-full w-full">
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="skip-to-content"
      >
        Skip to content
      </a>

      {/* Screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {liveAnnouncement}
      </div>

      <AnimatePresence mode="wait">
        {!started ? (
          <motion.main
            key="landing"
            id="main-content"
            className="landing-bg flex h-full w-full items-center justify-center"
            style={{ backgroundColor: 'var(--cds-color-blue-700)' }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            role="main"
            aria-label="Learning Wrapped landing page"
          >
            <motion.div
              className="flex flex-col items-center gap-6 px-8 text-center"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={fadeUp}
                animate={floatAnimation}
              >
                <CourseraLogo />
              </motion.div>

              <motion.h1
                className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
                variants={fadeUp}
              >
                Hey, {demoProfile.name}
              </motion.h1>

              <motion.p
                className="text-lg text-white/70"
                variants={fadeUp}
              >
                Your {demoProfile.yearLabel} Learning Story
              </motion.p>

              <motion.p
                className="text-sm font-medium tracking-wide text-white/40"
                variants={fadeUp}
              >
                Learning Shouldn't Feel Like Work
              </motion.p>

              <motion.button
                variants={fadeUp}
                onClick={handleUnwrap}
                className="unwrap-btn mt-4 cursor-pointer rounded-full px-8 py-3 text-lg font-semibold"
                style={{ color: 'var(--cds-color-blue-700)' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Start your learning story"
              >
                Unwrap
              </motion.button>

              {/* Coursera wordmark at the bottom */}
              <motion.div
                className="mt-8 opacity-40"
                variants={fadeUp}
              >
                <CourseraWordmark />
              </motion.div>
            </motion.div>
          </motion.main>
        ) : (
          <motion.div
            key="story"
            id="main-content"
            className="h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            ref={storyRegionRef}
            tabIndex={-1}
            role="main"
            aria-label="Learning story player"
            style={{ outline: 'none' }}
          >
            <StoryPlayer
              profile={demoProfile}
              cards={storyCards}
              onExit={handleExit}
              onCardChange={handleCardChange}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
