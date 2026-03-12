import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface ParticleBurstProps {
  trigger: boolean;
}

export default function ParticleBurst({ trigger }: ParticleBurstProps) {
  const hasFired = useRef(false);

  useEffect(() => {
    if (trigger && !hasFired.current) {
      hasFired.current = true;

      const duration = 2000;
      const end = Date.now() + duration;

      const colors = ['#0056D2', '#FFFFFF', '#FFC107'];

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors,
          disableForReducedMotion: true,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors,
          disableForReducedMotion: true,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }

    if (!trigger) {
      hasFired.current = false;
    }
  }, [trigger]);

  return null;
}
