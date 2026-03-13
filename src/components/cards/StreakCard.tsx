import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { LearnerProfile } from '../../types';

const COLS = 12;
const ROWS = 7;
const CELL_SIZE = 18;
const CELL_GAP = 2;
const CELL_RADIUS = 6;
const WAVE_DELAY_MS = 30;

const LEVEL_COLORS: Record<number, string> = {
  0: 'var(--cds-color-grey-800, #1F1F1F)',
  1: 'rgba(0, 86, 210, 0.25)',
  2: 'rgba(0, 86, 210, 0.5)',
  3: 'rgba(0, 86, 210, 0.75)',
  4: 'var(--cds-color-blue-700, #0056D2)',
};

const LEGEND_COLORS = [
  LEVEL_COLORS[0],
  LEVEL_COLORS[1],
  LEVEL_COLORS[2],
  LEVEL_COLORS[3],
  LEVEL_COLORS[4],
];

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function StreakCard({ profile }: { profile: LearnerProfile }) {
  const calendar = profile.streakCalendar;

  // Find the most active day of the week
  const mostActiveDay = useMemo(() => {
    const dayTotals = [0, 0, 0, 0, 0, 0, 0];
    calendar.forEach((day) => {
      const date = new Date(day.date);
      dayTotals[date.getDay()] += day.level;
    });
    let maxIdx = 0;
    dayTotals.forEach((total, i) => {
      if (total > dayTotals[maxIdx]) maxIdx = i;
    });
    return DAY_NAMES[maxIdx];
  }, [calendar]);

  // Build grid: columns first (weeks), then rows (days of week)
  // Data is 84 items (12 weeks x 7 days), laid out column-by-column
  const gridWidth = COLS * (CELL_SIZE + CELL_GAP) - CELL_GAP;
  const gridHeight = ROWS * (CELL_SIZE + CELL_GAP) - CELL_GAP;

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full relative overflow-hidden"
      style={{ backgroundColor: 'var(--cds-color-grey-950, #0A0A0A)' }}
      role="region"
      aria-label={`Activity heatmap showing 84 days. Your longest streak: ${profile.learningStreak} days`}
    >
      {/* Heatmap grid */}
      <div
        className="relative"
        style={{ width: gridWidth, height: gridHeight }}
      >
        {calendar.map((day, index) => {
          // index 0..83: column = floor(index/7), row = index % 7
          const col = Math.floor(index / ROWS);
          const row = index % ROWS;
          const x = col * (CELL_SIZE + CELL_GAP);
          const y = row * (CELL_SIZE + CELL_GAP);
          // Wave delay: top-left to bottom-right diagonal
          const diagonalIndex = col + row;
          const delay = diagonalIndex * (WAVE_DELAY_MS / 1000);

          return (
            <motion.div
              key={day.date}
              className="absolute"
              style={{
                left: x,
                top: y,
                width: CELL_SIZE,
                height: CELL_SIZE,
                borderRadius: CELL_RADIUS,
                backgroundColor: LEVEL_COLORS[day.level],
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.3 + delay,
                duration: 0.25,
                ease: [0.34, 1.56, 0.64, 1], // spring-like overshoot
              }}
            />
          );
        })}
      </div>

      {/* Streak callout */}
      <motion.p
        className="mt-8 text-white select-none text-center"
        style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.4 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.5, ease: 'easeOut' }}
      >
        Your longest streak:{' '}
        <span style={{ fontWeight: 700 }}>
          {profile.learningStreak} days
        </span>{' '}
        <span role="img" aria-label="fire">🔥</span>
      </motion.p>

      {/* Most active day insight */}
      <motion.p
        className="mt-3 select-none text-center"
        style={{
          fontSize: 14,
          color: 'var(--cds-color-blue-300, #79A8F7)',
          fontWeight: 400,
        }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.1, duration: 0.5, ease: 'easeOut' }}
      >
        Your most active day: <span style={{ fontWeight: 600 }}>{mostActiveDay}</span>
      </motion.p>

      {/* Legend */}
      <motion.div
        className="flex items-center gap-1.5 mt-5 select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.4 }}
      >
        <span
          style={{
            fontSize: 12,
            color: 'var(--cds-color-grey-400, #9E9E9E)',
          }}
        >
          Less
        </span>
        {LEGEND_COLORS.map((color, i) => (
          <div
            key={i}
            style={{
              width: 12,
              height: 12,
              borderRadius: 4,
              backgroundColor: color,
            }}
          />
        ))}
        <span
          style={{
            fontSize: 12,
            color: 'var(--cds-color-grey-400, #9E9E9E)',
          }}
        >
          More
        </span>
      </motion.div>
    </div>
  );
}
