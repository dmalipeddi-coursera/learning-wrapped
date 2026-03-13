import { motion, AnimatePresence } from 'framer-motion';
import { useStory } from '../../hooks/useStory';
import ProgressDots from '../ui/ProgressDots';
import TapZones from '../ui/TapZones';
import GradientBackground from '../ui/GradientBackground';
import StoryCard from './StoryCard';
import type { LearnerProfile, StoryCardConfig } from '../../types';

interface StoryPlayerProps {
  profile: LearnerProfile;
  cards: StoryCardConfig[];
  onExit?: () => void;
  onCardChange?: (index: number, total: number) => void;
}

const cardVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? 20 : -20,
  }),
  center: {
    opacity: 1,
    y: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? -20 : 20,
  }),
};

export default function StoryPlayer({ profile, cards, onExit, onCardChange }: StoryPlayerProps) {
  const {
    currentIndex,
    direction,
    totalCards,
    goNext,
    goPrev,
  } = useStory({ profile, cards, onExit, onCardChange });

  const currentCard = cards[currentIndex];

  return (
    <div className="flex h-full w-full items-center justify-center bg-black">
      <div
        className="relative flex h-full w-full flex-col overflow-hidden md:h-[90vh] md:max-h-[860px] md:max-w-[428px] md:rounded-[40px] md:shadow-2xl"
        role="region"
        aria-label="Learning story player"
        aria-roledescription="story"
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
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="h-full w-full"
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
