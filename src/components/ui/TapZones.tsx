import { useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface TapZonesProps {
  onNext: () => void;
  onPrev: () => void;
}

let rippleIdCounter = 0;

export default function TapZones({ onNext, onPrev }: TapZonesProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const prefersReducedMotion = useReducedMotion();

  const spawnRipple = useCallback(
    (e: React.MouseEvent) => {
      if (prefersReducedMotion) return;

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = ++rippleIdCounter;

      setRipples((prev) => [...prev, { id, x, y }]);

      // Clean up after animation completes
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 400);
    },
    [prefersReducedMotion],
  );

  const handlePrevClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      spawnRipple(e);
      onPrev();
    },
    [spawnRipple, onPrev],
  );

  const handleNextClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      spawnRipple(e);
      onNext();
    },
    [spawnRipple, onNext],
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      {/* Previous zone */}
      <button
        onClick={handlePrevClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onPrev();
          }
        }}
        className="pointer-events-auto absolute top-0 left-0 h-full w-[30%] cursor-pointer appearance-none border-0 bg-transparent p-0 outline-none focus-visible:bg-white/5"
        style={{ border: 'none', outline: 'none', WebkitAppearance: 'none' }}
        aria-label="Previous story"
        tabIndex={0}
      />

      {/* Next zone */}
      <button
        onClick={handleNextClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onNext();
          }
        }}
        className="pointer-events-auto absolute top-0 right-0 h-full w-[70%] cursor-pointer appearance-none border-0 bg-transparent p-0 outline-none focus-visible:bg-white/5"
        style={{ border: 'none', outline: 'none', WebkitAppearance: 'none' }}
        aria-label="Next story"
        tabIndex={0}
      />

      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.12 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="pointer-events-none absolute rounded-full bg-white"
            style={{
              left: ripple.x - 30,
              top: ripple.y - 30,
              width: 60,
              height: 60,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
