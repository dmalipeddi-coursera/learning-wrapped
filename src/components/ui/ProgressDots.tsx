import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ProgressDotsProps {
  total: number;
  current: number;
  /** Duration in seconds for the fill animation. Default: 8 */
  fillDuration?: number;
}

export default function ProgressDots({ total, current, fillDuration = 8 }: ProgressDotsProps) {
  const prefersReducedMotion = useReducedMotion();

  // Track the fill progress of the active segment (0-100)
  const [fillPercent, setFillPercent] = useState(0);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  // When `current` changes, reset and start a new fill
  useEffect(() => {
    if (prefersReducedMotion) {
      setFillPercent(100);
      return;
    }

    setFillPercent(0);
    startTimeRef.current = performance.now();

    const durationMs = fillDuration * 1000;

    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / durationMs, 1) * 100;
      setFillPercent(progress);
      if (progress < 100) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [current, fillDuration, prefersReducedMotion]);

  return (
    <div
      className="flex w-full gap-[3px] px-1 pt-4 pb-2"
      role="progressbar"
      aria-valuenow={current + 1}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Story progress: ${current + 1} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => {
        const isComplete = i < current;
        const isActive = i === current;

        // Completed segments: 100%. Active: animated fill. Future: 0%.
        let width: string;
        if (isComplete) {
          width = '100%';
        } else if (isActive) {
          width = `${fillPercent}%`;
        } else {
          width = '0%';
        }

        return (
          <div
            key={i}
            className="relative h-[3px] flex-1 overflow-hidden rounded-full"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.35)' }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                width,
                // Subtle glow on active segment
                boxShadow: isActive
                  ? '0 0 6px 1px rgba(255, 255, 255, 0.35)'
                  : 'none',
              }}
              initial={false}
              // Use Framer for completed/future instant transitions
              animate={
                isActive
                  ? undefined // width driven by inline style via rAF
                  : { width }
              }
              transition={{ duration: 0.15, ease: 'linear' }}
            />
          </div>
        );
      })}
    </div>
  );
}
