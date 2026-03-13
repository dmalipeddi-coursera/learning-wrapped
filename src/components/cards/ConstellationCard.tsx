import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { LearnerProfile } from '../../types';

const NODE_BASE_RADIUS = 16;
const SVG_PADDING = 40;

interface ConnectionLine {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
}

interface StarDot {
  id: number;
  cx: number;
  cy: number;
  r: number;
  twinkle: boolean;
  twinkleDelay: number;
  twinkleDuration: number;
}

export default function ConstellationCard({ profile }: { profile: LearnerProfile }) {
  const nodes = profile.topicConnections;
  const [linesComplete, setLinesComplete] = useState(false);

  // Background star dots
  const starDots = useMemo<StarDot[]>(() => {
    const twinkleIndices = new Set<number>();
    while (twinkleIndices.size < 3) {
      twinkleIndices.add(Math.floor(Math.random() * 14));
    }

    return Array.from({ length: 14 }, (_, i) => ({
      id: i,
      cx: 5 + Math.random() * (100 + SVG_PADDING * 2 - 10),
      cy: 5 + Math.random() * (100 + SVG_PADDING * 2 - 10),
      r: 0.3 + Math.random() * 0.5,
      twinkle: twinkleIndices.has(i),
      twinkleDelay: Math.random() * 3,
      twinkleDuration: 2 + Math.random() * 2,
    }));
  }, []);

  // Build unique connection lines
  const connections = useMemo(() => {
    const lines: ConnectionLine[] = [];
    const seen = new Set<string>();
    let lineIndex = 0;

    nodes.forEach((node) => {
      node.connections.forEach((targetId) => {
        const key = [node.id, targetId].sort().join('-');
        if (seen.has(key)) return;
        seen.add(key);

        const target = nodes.find((n) => n.id === targetId);
        if (!target) return;

        lines.push({
          id: key,
          x1: node.x,
          y1: node.y,
          x2: target.x,
          y2: target.y,
          delay: lineIndex * 0.4,
        });
        lineIndex++;
      });
    });

    return lines;
  }, [nodes]);

  const totalNodeAnimDuration = nodes.length * 0.2;
  const totalLineAnimDuration = connections.length * 0.4 + 0.4;
  const lineStartDelay = totalNodeAnimDuration + 0.3;

  // Find the largest node for pulse animation
  const largestNodeId = useMemo(() => {
    let maxSize = 0;
    let id = nodes[0]?.id ?? '';
    nodes.forEach((n) => {
      if (n.size > maxSize) {
        maxSize = n.size;
        id = n.id;
      }
    });
    return id;
  }, [nodes]);

  // Build a readable journey string from first 3 nodes, split into words for stagger
  const journeyText = useMemo(() => {
    const labels = nodes.slice(0, 3).map((n) => n.label);
    if (labels.length < 3) return `Every skill you learned connects to the next.`;
    return `${labels[0]} led to ${labels[1]}, which unlocked ${labels[2]}. Every skill connects.`;
  }, [nodes]);

  const journeyWords = journeyText.split(' ');

  // Pick the first connection for the comet trail effect
  const cometConnection = connections.length > 0 ? connections[0] : null;

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full px-6 pt-16 pb-8 overflow-hidden relative"
      style={{
        background:
          'radial-gradient(ellipse at center, var(--cds-color-grey-900, #2A2A2A) 0%, var(--cds-color-grey-950, #1F1F1F) 70%)',
      }}
      role="region"
      aria-label={`Your knowledge constellation: ${nodes.map((n) => n.label).join(', ')}`}
    >
      {/* Title */}
      <motion.h2
        className="text-white text-center mb-4 select-none"
        style={{ fontSize: 22, fontWeight: 700 }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Knowledge Constellation
      </motion.h2>

      {/* Constellation SVG */}
      <svg
        viewBox={`0 0 ${100 + SVG_PADDING * 2} ${100 + SVG_PADDING * 2}`}
        className="w-full flex-1"
        style={{ maxHeight: '50vh' }}
        aria-hidden="true"
      >
        <defs>
          {/* Text glow filter for node labels */}
          <filter id="text-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background star dots */}
        {starDots.map((star) =>
          star.twinkle ? (
            <motion.circle
              key={`star-${star.id}`}
              cx={star.cx}
              cy={star.cy}
              r={star.r}
              fill="rgba(255, 255, 255, 0.5)"
              animate={{
                opacity: [0.3, 0.8, 0.3],
                r: [star.r, star.r * 1.5, star.r],
              }}
              transition={{
                duration: star.twinkleDuration,
                delay: star.twinkleDelay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ) : (
            <circle
              key={`star-${star.id}`}
              cx={star.cx}
              cy={star.cy}
              r={star.r}
              fill="rgba(255, 255, 255, 0.3)"
            />
          )
        )}

        {/* Connection lines */}
        {connections.map((conn, i) => {
          const isLast = i === connections.length - 1;
          const x1 = conn.x1 * 100 + SVG_PADDING;
          const y1 = conn.y1 * 100 + SVG_PADDING;
          const x2 = conn.x2 * 100 + SVG_PADDING;
          const y2 = conn.y2 * 100 + SVG_PADDING;
          const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

          return (
            <motion.line
              key={conn.id}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--cds-color-grey-600, #757575)"
              strokeWidth="0.5"
              strokeDasharray={length}
              initial={{ strokeDashoffset: length, opacity: 0 }}
              animate={{ strokeDashoffset: 0, opacity: 0.6 }}
              transition={{
                strokeDashoffset: {
                  duration: 0.4,
                  delay: lineStartDelay + conn.delay,
                  ease: 'easeInOut',
                },
                opacity: {
                  duration: 0.05,
                  delay: lineStartDelay + conn.delay,
                },
              }}
              onAnimationComplete={
                isLast ? () => setLinesComplete(true) : undefined
              }
            />
          );
        })}

        {/* Comet trail on the first connection line */}
        {cometConnection && linesComplete && (() => {
          const x1 = cometConnection.x1 * 100 + SVG_PADDING;
          const y1 = cometConnection.y1 * 100 + SVG_PADDING;
          const x2 = cometConnection.x2 * 100 + SVG_PADDING;
          const y2 = cometConnection.y2 * 100 + SVG_PADDING;

          return (
            <motion.circle
              cx={x1}
              cy={y1}
              r="1.5"
              fill="rgba(91, 155, 245, 0.8)"
              animate={{
                cx: [x1, x2, x1],
                cy: [y1, y2, y1],
                opacity: [0, 0.9, 0.9, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                repeatDelay: 1,
              }}
            />
          );
        })()}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const cx = node.x * 100 + SVG_PADDING;
          const cy = node.y * 100 + SVG_PADDING;
          const r = NODE_BASE_RADIUS * node.size * 0.08;
          const nodeDelay = i * 0.2;
          const floatDelay = i * 0.5;
          const isLargest = node.id === largestNodeId;

          return (
            <g key={node.id}>
              {/* Pulse ring for largest node */}
              {isLargest && linesComplete && (
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke="var(--cds-color-blue-400, #5B9BF5)"
                  strokeWidth="0.6"
                  initial={{ opacity: 0.6, scale: 1 }}
                  animate={{ opacity: 0, scale: 2.5 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
              )}

              {/* Node circle */}
              <motion.circle
                cx={cx}
                cy={cy}
                r={r}
                fill="var(--cds-color-blue-500, #3D82F3)"
                initial={{ scale: 0, opacity: 0 }}
                animate={
                  linesComplete
                    ? {
                        scale: 1,
                        opacity: 1,
                        cx: [cx, cx + 2, cx - 1, cx + 1, cx],
                        cy: [cy, cy - 2, cy + 1.5, cy - 1, cy],
                      }
                    : { scale: 1, opacity: 1 }
                }
                transition={
                  linesComplete
                    ? {
                        cx: {
                          duration: 6 + floatDelay * 0.3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        },
                        cy: {
                          duration: 7 + floatDelay * 0.3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        },
                        scale: { duration: 0.3, delay: nodeDelay },
                        opacity: { duration: 0.3, delay: nodeDelay },
                      }
                    : {
                        scale: { duration: 0.3, delay: nodeDelay },
                        opacity: { duration: 0.3, delay: nodeDelay },
                      }
                }
              />

              {/* Glow around node */}
              <motion.circle
                cx={cx}
                cy={cy}
                r={r + 3}
                fill="none"
                stroke="var(--cds-color-blue-500, #3D82F3)"
                strokeWidth="0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 0.4, delay: nodeDelay + 0.2 }}
              />

              {/* Node label with text glow */}
              <motion.text
                x={cx}
                y={cy + r + 7}
                textAnchor="middle"
                dominantBaseline="hanging"
                fill="white"
                fontSize="4.5"
                fontWeight="500"
                filter="url(#text-glow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: nodeDelay + 0.15 }}
              >
                {node.label}
              </motion.text>
            </g>
          );
        })}
      </svg>

      {/* Journey text - word by word fade in */}
      <div
        className="text-center mt-6 select-none px-4 flex flex-wrap justify-center gap-x-1"
        style={{ lineHeight: 1.6 }}
      >
        {journeyWords.map((word, i) => (
          <motion.span
            key={i}
            style={{
              fontSize: 16,
              color: 'var(--cds-color-blue-300, #79A8F7)',
              fontWeight: 400,
            }}
            initial={{ opacity: 0, y: 6 }}
            animate={
              linesComplete
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 6 }
            }
            transition={{
              duration: 0.4,
              delay: i * 0.1,
              ease: 'easeOut',
            }}
          >
            {word}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
