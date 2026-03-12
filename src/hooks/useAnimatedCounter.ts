import { useEffect, useRef, useState } from 'react';

export function useAnimatedCounter(
  target: number,
  duration: number = 2000,
  delay: number = 0,
  startOnMount: boolean = true
): { value: number; start: () => void; isComplete: boolean } {
  const [value, setValue] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const start = () => {
    setIsComplete(false);
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setValue(target);
        setIsComplete(true);
      }
    };

    setTimeout(() => {
      rafRef.current = requestAnimationFrame(animate);
    }, delay);
  };

  useEffect(() => {
    if (startOnMount) start();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, delay, startOnMount]);

  return { value, start, isComplete };
}
