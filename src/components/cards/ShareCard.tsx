import { useRef } from 'react';
import { motion } from 'framer-motion';
import type { LearnerProfile } from '../../types';
import { downloadShareCard, shareCard } from '../../utils/shareImage';
import { personalities } from '../../data/personality';

/* ------------------------------------------------------------------ */
/*  Mini SVG Icons                                                     */
/* ------------------------------------------------------------------ */

function GradCapIcon({ size = 20, color = '#0056D2' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3Z"
        fill={color}
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="var(--cds-color-blue-700, #0056D2)" strokeWidth="2" />
      <path d="M12 6V12L16 14" stroke="var(--cds-color-blue-700, #0056D2)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 4C4 4 5 3 8 3C11 3 12 4 12 4V20C12 20 11 19 8 19C5 19 4 20 4 20V4Z"
        stroke="var(--cds-color-blue-700, #0056D2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M20 4C20 4 19 3 16 3C13 3 12 4 12 4V20C12 20 13 19 16 19C19 19 20 20 20 20V4Z"
        stroke="var(--cds-color-blue-700, #0056D2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function FireIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C12 2 7 8 7 13C7 16.87 9.24 19 12 19C14.76 19 17 16.87 17 13C17 8 12 2 12 2Z"
        stroke="var(--cds-color-blue-700, #0056D2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M8 21H16M12 17V21M6 4H18V8C18 11.31 15.31 14 12 14C8.69 14 6 11.31 6 8V4Z"
        stroke="var(--cds-color-blue-700, #0056D2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path d="M6 8H4C4 10.21 5.79 12 8 12" stroke="var(--cds-color-blue-700, #0056D2)" strokeWidth="2" />
      <path d="M18 8H20C20 10.21 18.21 12 16 12" stroke="var(--cds-color-blue-700, #0056D2)" strokeWidth="2" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Mini Constellation for card footer                                 */
/* ------------------------------------------------------------------ */

function MiniConstellation() {
  const dots = [
    { x: 60, y: 20 },
    { x: 140, y: 35 },
    { x: 200, y: 15 },
    { x: 100, y: 55 },
  ];
  const lines = [
    [0, 1],
    [1, 2],
    [0, 3],
    [1, 3],
  ];

  return (
    <svg width="260" height="70" viewBox="0 0 260 70" fill="none" className="mx-auto">
      {lines.map(([a, b], i) => (
        <line
          key={i}
          x1={dots[a].x} y1={dots[a].y}
          x2={dots[b].x} y2={dots[b].y}
          stroke="var(--cds-color-blue-700, #0056D2)"
          strokeWidth="1"
          opacity="0.3"
        />
      ))}
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x} cy={d.y} r="3"
          fill="var(--cds-color-blue-700, #0056D2)"
          opacity="0.5"
        />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat Item                                                          */
/* ------------------------------------------------------------------ */

interface StatItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  delay: number;
}

function StatItem({ icon, value, label, delay }: StatItemProps) {
  return (
    <motion.div
      className="flex flex-col items-center gap-1 py-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
    >
      <div className="mb-1">{icon}</div>
      <span
        className="font-bold"
        style={{ fontSize: 18, color: 'var(--cds-color-blue-700, #0056D2)' }}
      >
        {value}
      </span>
      <span style={{ fontSize: 12, color: 'var(--cds-color-grey-500, #757575)' }}>
        {label}
      </span>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Share Card Component                                               */
/* ------------------------------------------------------------------ */

export default function ShareCard({ profile }: { profile: LearnerProfile }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const personalityInfo = personalities[profile.personality];

  const handleDownload = async () => {
    if (cardRef.current) {
      await downloadShareCard(cardRef.current);
    }
  };

  const handleShare = async () => {
    if (cardRef.current) {
      await shareCard(cardRef.current);
    }
  };

  const statDelay = 0.6;
  const statStagger = 0.1;

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full relative overflow-hidden"
      style={{ backgroundColor: 'var(--cds-color-grey-950, #0A0A0A)' }}
      role="region"
      aria-label="Your Learning Wrapped share card. Download or share your results."
    >
      {/* The capturable share card */}
      <motion.div
        ref={cardRef}
        id="share-card"
        className="relative overflow-hidden flex flex-col"
        style={{
          width: 320,
          height: 480,
          borderRadius: 16,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 8px 20px rgba(0,86,210,0.15)',
        }}
        initial={{ opacity: 0, y: 40, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header */}
        <motion.div
          className="flex items-center gap-2 px-5 pt-5 pb-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <GradCapIcon size={22} />
          <span
            className="font-semibold"
            style={{ fontSize: 14, color: 'var(--cds-color-blue-700, #0056D2)' }}
          >
            Learning Wrapped {profile.yearLabel}
          </span>
        </motion.div>

        {/* User info */}
        <motion.div
          className="px-5 pb-4"
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
        >
          <h2
            className="font-bold"
            style={{ fontSize: 22, color: '#1A1A1A', lineHeight: 1.2 }}
          >
            {profile.name}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'var(--cds-color-blue-700, #0056D2)',
              }}
            />
            <span style={{ fontSize: 13, color: 'var(--cds-color-grey-500, #757575)' }}>
              {personalityInfo.type}
            </span>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="mx-5" style={{ height: 1, backgroundColor: '#F0F0F0' }} />

        {/* 2x2 Stats Grid */}
        <div className="grid grid-cols-2 gap-0 px-3 py-2 flex-1">
          <StatItem
            icon={<ClockIcon />}
            value={`${profile.totalHours}`}
            label="hours"
            delay={statDelay}
          />
          <StatItem
            icon={<BookIcon />}
            value={`${profile.coursesCompleted}`}
            label="courses"
            delay={statDelay + statStagger}
          />
          <StatItem
            icon={<FireIcon />}
            value={`${profile.learningStreak} day`}
            label="streak"
            delay={statDelay + statStagger * 2}
          />
          <StatItem
            icon={<TrophyIcon />}
            value={`Top ${profile.percentile}%`}
            label="of learners"
            delay={statDelay + statStagger * 3}
          />
        </div>

        {/* Mini constellation */}
        <motion.div
          className="px-5 pb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <MiniConstellation />
        </motion.div>

        {/* Footer */}
        <motion.div
          className="px-5 pb-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.4 }}
        >
          <span style={{ fontSize: 12, color: 'var(--cds-color-grey-400, #9E9E9E)' }}>
            coursera.org
          </span>
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="flex items-center gap-3 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.5, ease: 'easeOut' }}
      >
        <motion.button
          className="flex items-center justify-center rounded-lg cursor-pointer font-semibold"
          style={{
            width: 140,
            height: 48,
            border: '2px solid var(--cds-color-blue-700, #0056D2)',
            color: 'var(--cds-color-blue-700, #0056D2)',
            backgroundColor: 'transparent',
            fontSize: 15,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
        >
          Download
        </motion.button>
        <motion.button
          className="flex items-center justify-center rounded-lg cursor-pointer font-semibold"
          style={{
            width: 140,
            height: 48,
            border: 'none',
            backgroundColor: 'var(--cds-color-blue-700, #0056D2)',
            color: '#FFFFFF',
            fontSize: 15,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
        >
          Share
        </motion.button>
      </motion.div>
    </div>
  );
}
