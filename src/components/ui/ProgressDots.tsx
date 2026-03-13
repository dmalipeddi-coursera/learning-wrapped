import { motion } from 'framer-motion';

interface ProgressDotsProps {
  total: number;
  current: number;
}

export default function ProgressDots({ total, current }: ProgressDotsProps) {
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

        return (
          <div
            key={i}
            className="relative h-[3px] flex-1 overflow-hidden rounded-full"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.35)' }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
              initial={false}
              animate={{
                width: isComplete ? '100%' : isActive ? '100%' : '0%',
              }}
              transition={
                isActive
                  ? { duration: 0.4, ease: 'easeOut' }
                  : { duration: 0.15, ease: 'linear' }
              }
            />
          </div>
        );
      })}
    </div>
  );
}
