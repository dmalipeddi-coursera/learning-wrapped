import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { LearnerProfile } from '../../types';

/**
 * Generate plausible hourly activity data from monthlyBreakdown.
 * Creates a 24-element array representing relative activity per hour.
 * Peaks around profile.peakHour and distributes the rest naturally.
 */
function generateHourlyData(peakHour: number, monthlyBreakdown: number[]): number[] {
  const totalActivity = monthlyBreakdown.reduce((sum, v) => sum + v, 0) || 1;
  const hours = Array.from({ length: 24 }, (_, h) => {
    // Distance from peak hour (wrapping around 24h)
    const dist = Math.min(Math.abs(h - peakHour), 24 - Math.abs(h - peakHour));
    // Gaussian-like falloff centered on peak
    const base = Math.exp(-(dist * dist) / 18);
    // Add some noise for realism
    const noise = 0.1 + Math.random() * 0.15;
    return base + noise;
  });

  // Normalize to 0..1 range
  const max = Math.max(...hours);
  return hours.map((v) => v / max);
}

const CLOCK_RADIUS = 110;
const BAR_MIN = 4;
const BAR_MAX = 40;
const MARKER_RADIUS = CLOCK_RADIUS + 2;
const CENTER = 150;
const TOTAL_BAR_ANIM_DURATION = 1.5;

export default function PeakTimeCard({ profile }: { profile: LearnerProfile }) {
  const [barsComplete, setBarsComplete] = useState(false);

  const hourlyData = useMemo(
    () => generateHourlyData(profile.peakHour, profile.monthlyBreakdown),
    [profile.peakHour, profile.monthlyBreakdown]
  );

  const bars = useMemo(() => {
    return hourlyData.map((value, hour) => {
      const angle = (hour / 24) * Math.PI * 2 - Math.PI / 2; // Start from top (12 o'clock)
      const barLength = BAR_MIN + value * BAR_MAX;
      const isPeak = hour === profile.peakHour;

      const x1 = CENTER + Math.cos(angle) * (CLOCK_RADIUS + 6);
      const y1 = CENTER + Math.sin(angle) * (CLOCK_RADIUS + 6);
      const x2 = CENTER + Math.cos(angle) * (CLOCK_RADIUS + 6 + barLength);
      const y2 = CENTER + Math.sin(angle) * (CLOCK_RADIUS + 6 + barLength);

      return { hour, x1, y1, x2, y2, isPeak, value };
    });
  }, [hourlyData, profile.peakHour]);

  const hourMarkers = useMemo(() => {
    return [0, 3, 6, 9, 12, 15, 18, 21].map((hour) => {
      const angle = (hour / 24) * Math.PI * 2 - Math.PI / 2;
      const x = CENTER + Math.cos(angle) * (MARKER_RADIUS + BAR_MAX + 18);
      const y = CENTER + Math.sin(angle) * (MARKER_RADIUS + BAR_MAX + 18);
      const labels: Record<number, string> = {
        0: '12a', 3: '3a', 6: '6a', 9: '9a',
        12: '12p', 15: '3p', 18: '6p', 21: '9p',
      };
      const isMajor = hour % 6 === 0;
      return { hour, x, y, label: labels[hour], isMajor };
    });
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full px-6 overflow-hidden"
      style={{ backgroundColor: 'var(--cds-color-grey-950, #1F1F1F)' }}
      role="region"
      aria-label={`Your peak learning time is ${profile.peakHourLabel}. You're a ${profile.personality}.`}
    >
      {/* Radial clock SVG */}
      <svg
        viewBox="0 0 300 300"
        className="w-full max-w-[280px] mx-auto"
        aria-hidden="true"
      >
        {/* Base circle */}
        <motion.circle
          cx={CENTER}
          cy={CENTER}
          r={CLOCK_RADIUS}
          fill="none"
          stroke="var(--cds-color-grey-800, #424242)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {/* Tick marks for each hour - major ticks at 0,6,12,18 */}
        {Array.from({ length: 24 }, (_, h) => {
          const angle = (h / 24) * Math.PI * 2 - Math.PI / 2;
          const isMajor = h % 6 === 0;
          const innerR = CLOCK_RADIUS - (isMajor ? 8 : 4);
          const outerR = CLOCK_RADIUS;
          return (
            <line
              key={`tick-${h}`}
              x1={CENTER + Math.cos(angle) * innerR}
              y1={CENTER + Math.sin(angle) * innerR}
              x2={CENTER + Math.cos(angle) * outerR}
              y2={CENTER + Math.sin(angle) * outerR}
              stroke={isMajor ? 'var(--cds-color-grey-400, #9E9E9E)' : 'var(--cds-color-grey-600, #757575)'}
              strokeWidth={isMajor ? 1.5 : 1}
            />
          );
        })}

        {/* Activity bars */}
        {bars.map((bar) => {
          const staggerDelay = (bar.hour / 24) * TOTAL_BAR_ANIM_DURATION;
          const isLast = bar.hour === 23;

          return (
            <motion.line
              key={`bar-${bar.hour}`}
              x1={bar.x1}
              y1={bar.y1}
              x2={bar.x2}
              y2={bar.y2}
              stroke={
                bar.isPeak
                  ? 'var(--cds-color-blue-400, #5B9BF5)'
                  : bar.value > 0.5
                    ? 'var(--cds-color-grey-500, #9E9E9E)'
                    : 'var(--cds-color-grey-600, #757575)'
              }
              strokeWidth={bar.isPeak ? 4.5 : 3}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: 0.5 + staggerDelay,
                ease: 'easeOut',
              }}
              onAnimationComplete={
                isLast ? () => setBarsComplete(true) : undefined
              }
            />
          );
        })}

        {/* Hour labels */}
        {hourMarkers.map((marker) => (
          <text
            key={`label-${marker.hour}`}
            x={marker.x}
            y={marker.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill={marker.isMajor ? 'var(--cds-color-grey-300, #BDBDBD)' : 'var(--cds-color-grey-500, #9E9E9E)'}
            fontSize={marker.isMajor ? '11' : '9'}
            fontWeight={marker.isMajor ? '600' : '400'}
          >
            {marker.label}
          </text>
        ))}

        {/* Glow filter for peak indicator */}
        <defs>
          <filter id="peak-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Peak indicator dot with glow */}
        {(() => {
          const angle = (profile.peakHour / 24) * Math.PI * 2 - Math.PI / 2;
          const barLength = BAR_MIN + (hourlyData[profile.peakHour] ?? 0) * BAR_MAX;
          const cx = CENTER + Math.cos(angle) * (CLOCK_RADIUS + 6 + barLength + 6);
          const cy = CENTER + Math.sin(angle) * (CLOCK_RADIUS + 6 + barLength + 6);
          return (
            <motion.circle
              cx={cx}
              cy={cy}
              r="5"
              fill="var(--cds-color-blue-400, #5B9BF5)"
              filter="url(#peak-glow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.3, 1], opacity: 1 }}
              transition={{
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5 + TOTAL_BAR_ANIM_DURATION + 0.1,
                },
                opacity: {
                  duration: 0.3,
                  delay: 0.5 + TOTAL_BAR_ANIM_DURATION + 0.1,
                },
              }}
            />
          );
        })()}
      </svg>

      {/* Description text */}
      <motion.p
        className="text-center mt-8 select-none px-4"
        style={{
          fontSize: 20,
          color: 'white',
          fontWeight: 500,
          lineHeight: 1.5,
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={barsComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        You&apos;re a{' '}
        <span style={{ color: 'var(--cds-color-blue-300, #79A8F7)' }}>
          {profile.personality}
        </span>
        . Most active at{' '}
        <span style={{ color: 'var(--cds-color-blue-300, #79A8F7)' }}>
          {profile.peakHourLabel}
        </span>
        .
      </motion.p>
    </div>
  );
}
