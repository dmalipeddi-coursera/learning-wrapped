import { useState, useCallback, useEffect, useMemo } from 'react';
import type { StoryState, LearnerProfile, StoryCardConfig } from '../types';

interface UseStoryOptions {
  profile: LearnerProfile;
  cards: StoryCardConfig[];
  onExit?: () => void;
  onCardChange?: (index: number, total: number) => void;
}

/**
 * Check if the user prefers reduced motion.
 * Returns true if the user has enabled reduced motion in their OS settings.
 */
function getPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
}

export function useStory({ profile, cards, onExit, onCardChange }: UseStoryOptions) {
  const [state, setState] = useState<StoryState>({
    currentIndex: 0,
    direction: 1,
    profile,
    cards,
    isComplete: false,
  });

  const prefersReducedMotion = useMemo(() => getPrefersReducedMotion(), []);

  const totalCards = cards.length;

  const goNext = useCallback(() => {
    setState((prev) => {
      if (prev.currentIndex >= totalCards - 1) {
        return { ...prev, isComplete: true };
      }
      const nextIndex = prev.currentIndex + 1;
      return {
        ...prev,
        currentIndex: nextIndex,
        direction: 1,
      };
    });
  }, [totalCards]);

  const goPrev = useCallback(() => {
    setState((prev) => {
      if (prev.currentIndex <= 0) return prev;
      const nextIndex = prev.currentIndex - 1;
      return {
        ...prev,
        currentIndex: nextIndex,
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

  // Notify parent when card changes
  useEffect(() => {
    onCardChange?.(state.currentIndex, totalCards);
  }, [state.currentIndex, totalCards, onCardChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onExit?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, onExit]);

  return {
    ...state,
    totalCards,
    goNext,
    goPrev,
    goTo,
    prefersReducedMotion,
    progress: (state.currentIndex + 1) / totalCards,
  };
}
