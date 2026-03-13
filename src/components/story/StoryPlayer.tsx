import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useStory } from '../../hooks/useStory';
import ProgressDots from '../ui/ProgressDots';
import TapZones from '../ui/TapZones';
import GradientBackground from '../ui/GradientBackground';
import StoryCard from './StoryCard';
import type { LearnerProfile, StoryCardConfig, StoryCardType } from '../../types';

interface StoryPlayerProps {
  profile: LearnerProfile;
  cards: StoryCardConfig[];
  onExit?: () => void;
  onCardChange?: (index: number, total: number) => void;
}

// ── Per-card-type transition variants ────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MotionVal = Record<string, any>;

interface CardTransitionDef {
  enter: (dir: number) => MotionVal;
  center: MotionVal;
  exit: (dir: number) => MotionVal;
  transition: MotionVal;
}

const transitionMap: Record<StoryCardType, CardTransitionDef> = {
  // Hook: cinematic fade only
  hook: {
    enter: () => ({ opacity: 0 }),
    center: { opacity: 1 },
    exit: () => ({ opacity: 0 }),
    transition: { duration: 0.5, ease: 'easeInOut' },
  },

  // Intro: default slide (same as original)
  intro: {
    enter: (dir) => ({ opacity: 0, y: dir > 0 ? 20 : -20 }),
    center: { opacity: 1, y: 0 },
    exit: (dir) => ({ opacity: 0, y: dir > 0 ? -20 : 20 }),
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },

  // Total hours: scale up from 0.95 + fade (impact)
  'total-hours': {
    enter: () => ({ opacity: 0, scale: 0.95 }),
    center: { opacity: 1, scale: 1 },
    exit: () => ({ opacity: 0, scale: 0.95 }),
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  },

  // Courses: slide from right + fade (list reveal)
  courses: {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },

  // Peak time: zoom in from center (scale 0.9) + fade
  'peak-time': {
    enter: () => ({ opacity: 0, scale: 0.9 }),
    center: { opacity: 1, scale: 1 },
    exit: () => ({ opacity: 0, scale: 0.9 }),
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  },

  // Constellation: slow fade with slight blur clear
  constellation: {
    enter: () => ({ opacity: 0, filter: 'blur(6px)' }),
    center: { opacity: 1, filter: 'blur(0px)' },
    exit: () => ({ opacity: 0, filter: 'blur(6px)' }),
    transition: { duration: 0.6, ease: 'easeInOut' },
  },

  // Personality: slide up + fade (reveal moment)
  personality: {
    enter: () => ({ opacity: 0, y: 40 }),
    center: { opacity: 1, y: 0 },
    exit: () => ({ opacity: 0, y: -40 }),
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  },

  // Fun stat: bounce in (spring physics)
  'fun-stat': {
    enter: () => ({ opacity: 0, scale: 0.85, y: 20 }),
    center: { opacity: 1, scale: 1, y: 0 },
    exit: () => ({ opacity: 0, scale: 0.85, y: -20 }),
    transition: { type: 'spring', stiffness: 350, damping: 25, mass: 0.8 },
  },

  // Streak: slide from left + fade (reverse direction)
  streak: {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },

  // Share: scale down from 1.05 + fade (settling)
  share: {
    enter: () => ({ opacity: 0, scale: 1.05 }),
    center: { opacity: 1, scale: 1 },
    exit: () => ({ opacity: 0, scale: 1.05 }),
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// Reduced-motion fallback: simple fade
const reducedMotionDef: CardTransitionDef = {
  enter: () => ({ opacity: 0 }),
  center: { opacity: 1 },
  exit: () => ({ opacity: 0 }),
  transition: { duration: 0.15 },
};

// ── Swipe gesture constants ──────────────────────────────────────────
const SWIPE_THRESHOLD = 50;
const SWIPE_MAX_OFFSET = 120;

export default function StoryPlayer({ profile, cards, onExit, onCardChange }: StoryPlayerProps) {
  const {
    currentIndex,
    direction,
    totalCards,
    goNext,
    goPrev,
  } = useStory({ profile, cards, onExit, onCardChange });

  const prefersReducedMotion = useReducedMotion();
  const currentCard = cards[currentIndex];

  // ── Swipe state ──────────────────────────────────────────────────
  const [swipeOffsetX, setSwipeOffsetX] = useState(0);
  const pointerStart = useRef<{ x: number; y: number; id: number } | null>(null);
  const swiping = useRef(false);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    swiping.current = false;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!pointerStart.current) return;
    const dx = e.clientX - pointerStart.current.x;
    const dy = e.clientY - pointerStart.current.y;

    // Only start swiping if horizontal movement dominates
    if (!swiping.current) {
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
        swiping.current = true;
      } else if (Math.abs(dy) > 10) {
        // Vertical scroll; cancel swipe tracking
        pointerStart.current = null;
        setSwipeOffsetX(0);
        return;
      } else {
        return;
      }
    }

    // Clamp the visual offset
    const clamped = Math.max(-SWIPE_MAX_OFFSET, Math.min(SWIPE_MAX_OFFSET, dx));
    setSwipeOffsetX(clamped);
  }, []);

  const handlePointerUp = useCallback(() => {
    if (swiping.current && Math.abs(swipeOffsetX) >= SWIPE_THRESHOLD) {
      if (swipeOffsetX < 0) {
        goNext();
      } else {
        goPrev();
      }
    }
    pointerStart.current = null;
    swiping.current = false;
    setSwipeOffsetX(0);
  }, [swipeOffsetX, goNext, goPrev]);

  const handlePointerCancel = useCallback(() => {
    pointerStart.current = null;
    swiping.current = false;
    setSwipeOffsetX(0);
  }, []);

  // ── Select transition variant for current card type ────────────
  const def = prefersReducedMotion ? reducedMotionDef : transitionMap[currentCard.type];

  const variants = {
    enter: def.enter,
    center: def.center,
    exit: def.exit,
  };

  return (
    <div className="flex h-full w-full items-center justify-center bg-black">
      <div
        className="noise-overlay phone-frame relative flex h-full w-full flex-col overflow-hidden md:h-[90vh] md:max-h-[860px] md:max-w-[428px] md:rounded-[40px]"
        role="region"
        aria-label="Learning story player"
        aria-roledescription="story"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        style={{ touchAction: 'pan-y' }}
      >
        {/* Background layer - fills entire container */}
        <div className="absolute inset-0 z-0">
          <GradientBackground
            gradient={currentCard.background}
            particles={currentCard.type === 'personality' || currentCard.type === 'share'}
          />
        </div>

        {/* Progress bar - safe area padding + inner padding to clear rounded corners */}
        <div className="relative z-20 shrink-0 px-4 pt-[max(16px,env(safe-area-inset-top))]">
          <ProgressDots total={totalCards} current={currentIndex} />
        </div>

        {/* Card content area - fills remaining space below progress bar */}
        <div className="relative z-10 min-h-0 flex-1 pb-6">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={def.transition}
              className="h-full w-full"
              style={{
                x: swipeOffsetX,
                willChange: swipeOffsetX !== 0 ? 'transform' : undefined,
              }}
            >
              <StoryCard type={currentCard.type} profile={profile} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Tap zones - cover full container for navigation */}
        <TapZones onNext={goNext} onPrev={goPrev} />
      </div>
    </div>
  );
}
