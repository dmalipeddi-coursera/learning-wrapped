import { useState, useCallback, useEffect } from 'react';
import type { StoryState, LearnerProfile, StoryCardConfig } from '../types';

interface UseStoryOptions {
  profile: LearnerProfile;
  cards: StoryCardConfig[];
}

export function useStory({ profile, cards }: UseStoryOptions) {
  const [state, setState] = useState<StoryState>({
    currentIndex: 0,
    direction: 1,
    profile,
    cards,
    isComplete: false,
  });

  const totalCards = cards.length;

  const goNext = useCallback(() => {
    setState((prev) => {
      if (prev.currentIndex >= totalCards - 1) {
        return { ...prev, isComplete: true };
      }
      return {
        ...prev,
        currentIndex: prev.currentIndex + 1,
        direction: 1,
      };
    });
  }, [totalCards]);

  const goPrev = useCallback(() => {
    setState((prev) => {
      if (prev.currentIndex <= 0) return prev;
      return {
        ...prev,
        currentIndex: prev.currentIndex - 1,
        direction: -1,
      };
    });
  }, []);

  const goTo = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.max(0, Math.min(index, totalCards - 1)),
      direction: index > prev.currentIndex ? 1 : -1,
    }));
  }, [totalCards]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  return {
    ...state,
    totalCards,
    goNext,
    goPrev,
    goTo,
    progress: (state.currentIndex + 1) / totalCards,
  };
}
