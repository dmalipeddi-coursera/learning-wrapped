import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface GradientBackgroundProps {
  gradient: string;
  particles?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  driftX: number;
  driftY: number;
  duration: number;
  delay: number;
}

export default function GradientBackground({
  gradient,
  particles = false,
}: GradientBackgroundProps) {
  const particleData = useMemo<Particle[]>(() => {
    if (!particles) return [];
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.1 + 0.1,
      driftX: (Math.random() - 0.5) * 30,
      driftY: (Math.random() - 0.5) * 30,
      duration: Math.random() * 8 + 12,
      delay: Math.random() * 5,
    }));
  }, [particles]);

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden="true">
      <div className="absolute inset-0 rounded-[inherit]" style={{ background: gradient }} />
      {particles &&
        particleData.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: p.opacity,
            }}
            animate={{
              x: [0, p.driftX, -p.driftX * 0.5, 0],
              y: [0, p.driftY, -p.driftY * 0.5, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
    </div>
  );
}
