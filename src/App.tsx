import { useState } from 'react';
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

export default function App() {
  const [started, setStarted] = useState(false);

  return (
    <div className="h-full w-full">
      <AnimatePresence mode="wait">
        {!started ? (
          <motion.div
            key="landing"
            className="flex h-full w-full items-center justify-center"
            style={{ backgroundColor: 'var(--cds-color-blue-700)' }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="flex flex-col items-center gap-6 px-8 text-center"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeUp}>
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

              <motion.button
                variants={fadeUp}
                onClick={() => setStarted(true)}
                className="mt-4 cursor-pointer rounded-full bg-white px-8 py-3 text-lg font-semibold transition-transform hover:scale-105 active:scale-95"
                style={{ color: 'var(--cds-color-blue-700)' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Start your learning story"
              >
                Unwrap
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="story"
            className="h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StoryPlayer profile={demoProfile} cards={storyCards} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
