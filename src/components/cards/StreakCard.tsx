import { useMemo, useState, useEffect } from 'react';
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
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* ------------------------------------------------------------------ */
/*  Inject keyframes for glow pulse and shimmer                         */
/* ------------------------------------------------------------------ */

const streakStyleId = 'streak-card-style';
if (typeof document !== 'undefined' && !document.getElementById(streakStyleId)) {
  const style = document.createElement('style');
  style.id = streakStyleId;
  style.textContent = `
    @keyframes streak-glow-pulse {
      0%, 100% { box-shadow: 0 0 4px rgba(0, 86, 210, 0.4), 0 0 8px rgba(0, 86, 210, 0.2); }
      50% { box-shadow: 0 0 8px rgba(0, 86, 210, 0.7), 0 0 16px rgba(0, 86, 210, 0.35); }
    }
    @keyframes streak-shimmer {
      0% { opacity: 0; }
      50% { opacity: 0.6; }
      100% { opacity: 0; }
    }
    @keyframes fire-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }
  `;
  document.head.appendChild(style);
}

export default function StreakCard({ profile }: { profile: LearnerProfile }) {
  const calendar = profile.streakCalendar;
  const [gridRendered, setGridRendered] = useState(false);

  // Total animation time for the grid
  const maxDiag = (COLS - 1) + (ROWS - 1);
  const totalGridTime = 0.3 + maxDiag * (WAVE_DELAY_MS / 1000) + 0.25;

  useEffect(() => {
    const timer = setTimeout(() => setGridRendered(true), totalGridTime * 1000);
    return () => clearTimeout(timer);
  }, [totalGridTime]);

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

  // Determine which month labels to show (based on first date in each column's week)
  const monthLabels = useMemo(() => {
    const labels: { col: number; label: string }[] = [];
    let lastMonth = -1;
    for (let col = 0; col < COLS; col++) {
      const dayIndex = col * ROWS; // first day of this column
      if (dayIndex < calendar.length) {
        const date = new Date(calendar[dayIndex].date);
        const month = date.getMonth();
        if (month !== lastMonth) {
          labels.push({ col, label: MONTH_LABELS[month] });
          lastMonth = month;
        }
      }
    }
    return labels;
  }, [calendar]);

  // Build grid: columns first (weeks), then rows (days of week)
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
          const col = Math.floor(index / ROWS);
          const row = index % ROWS;
          const x = col * (CELL_SIZE + CELL_GAP);
          const y = row * (CELL_SIZE + CELL_GAP);
          const diagonalIndex = col + row;
          const delay = diagonalIndex * (WAVE_DELAY_MS / 1000);

          const isHighLevel = day.level >= 3;
          const isLevel4 = day.level === 4;

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
                ...(gridRendered && isLevel4
                  ? { animation: 'streak-glow-pulse 2.5s ease-in-out infinite' }
                  : {}),
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.3 + delay,
                duration: 0.25,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              {/* Shimmer on level 3-4 cells after grid renders */}
              {gridRendered && isHighLevel && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: CELL_RADIUS,
                    background:
                      'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                    backgroundSize: '200% 200%',
                    animation: `streak-shimmer ${2 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite`,
                    pointerEvents: 'none',
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Month labels */}
      <motion.div
        className="relative select-none"
        style={{ width: gridWidth, marginTop: 4, height: 16 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.4 }}
      >
        {monthLabels.map(({ col, label }) => (
          <span
            key={`${col}-${label}`}
            style={{
              position: 'absolute',
              left: col * (CELL_SIZE + CELL_GAP),
              fontSize: 10,
              color: 'var(--cds-color-grey-500, #757575)',
              fontWeight: 500,
            }}
          >
            {label}
          </span>
        ))}
      </motion.div>

      {/* Streak callout with gradient number */}
      <motion.p
        className="mt-6 text-white select-none text-center"
        style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.4 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.5, ease: 'easeOut' }}
      >
        Your longest streak:{' '}
        <span
          style={{
            fontWeight: 800,
            fontSize: 24,
            background: 'linear-gradient(135deg, #3B82F6 0%, #93C5FD 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {profile.learningStreak} days
        </span>{' '}
        <span
          role="img"
          aria-label="fire"
          style={{
            display: 'inline-block',
            animation: 'fire-pulse 1.5s ease-in-out infinite',
          }}
        >
          🔥
        </span>
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

      {/* Legend with "Activity Level" label */}
      <motion.div
        className="flex items-center gap-2 mt-5 select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.4 }}
      >
        <span
          style={{
            fontSize: 11,
            color: 'var(--cds-color-grey-500, #9E9E9E)',
            fontWeight: 500,
            marginRight: 4,
          }}
        >
          Activity Level
        </span>
        <span
          style={{
            fontSize: 11,
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
            fontSize: 11,
            color: 'var(--cds-color-grey-400, #9E9E9E)',
          }}
        >
          More
        </span>
      </motion.div>
    </div>
  );
}
