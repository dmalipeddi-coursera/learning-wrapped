import { motion } from 'framer-motion';
import type { LearnerProfile } from '../../types';

const CATEGORY_COLORS: Record<string, string> = {
  'AI & ML': '#3D82F3',
  'Programming': '#00897B',
  'Data Science': '#7B1FA2',
  'Databases': '#E65100',
  'Cloud': '#0097A7',
  'Management': '#558B2F',
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || 'var(--cds-color-blue-500, #3D82F3)';
}

function CheckmarkIcon({ delay }: { delay: number }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className="shrink-0"
      aria-hidden="true"
    >
      <motion.path
        d="M4 9.5L7.5 13L14 5"
        stroke="var(--cds-color-blue-400, #5B9BF5)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 0.4, delay, ease: 'easeOut' },
          opacity: { duration: 0.01, delay },
        }}
      />
    </svg>
  );
}

function CompletionBadge({ completed, total }: { completed: number; total: number }) {
  const progress = total > 0 ? completed / total : 1;
  const radius = 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <motion.div
      className="flex items-center gap-1.5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <circle
          cx="9"
          cy="9"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
        />
        <motion.circle
          cx="9"
          cy="9"
          r={radius}
          fill="none"
          stroke="var(--cds-color-blue-400, #5B9BF5)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '9px 9px' }}
        />
      </svg>
      <span
        style={{
          fontSize: 12,
          color: 'var(--cds-color-grey-400, #9E9E9E)',
          fontWeight: 500,
        }}
      >
        {completed} of {total} completed
      </span>
    </motion.div>
  );
}

export default function CoursesCard({ profile }: { profile: LearnerProfile }) {
  const courses = profile.topCourses.slice(0, 6);

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full px-6 overflow-hidden"
      style={{ backgroundColor: 'var(--cds-color-grey-950, #1F1F1F)' }}
      role="region"
      aria-label={`${profile.coursesCompleted} courses completed`}
    >
      {/* Header */}
      <motion.div
        className="mb-8 self-start select-none"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p
          style={{
            fontSize: 26,
            fontWeight: 700,
            lineHeight: 1.3,
            background: 'linear-gradient(180deg, #FFFFFF 30%, #79A8F7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Look what you built
        </p>
        <div className="flex items-center gap-3 mt-1.5">
          <p
            style={{
              fontSize: 15,
              color: 'var(--cds-color-blue-300, #79A8F7)',
              fontWeight: 400,
            }}
          >
            {profile.coursesCompleted} courses completed this year
          </p>
          <CompletionBadge
            completed={profile.coursesCompleted}
            total={profile.coursesCompleted}
          />
        </div>
      </motion.div>

      {/* Course list */}
      <div className="flex flex-col w-full">
        {courses.map((course, i) => {
          const slideDelay = i * 0.15;
          const checkDelay = slideDelay + 0.4;
          const categoryColor = getCategoryColor(course.category);
          const isLast = i === courses.length - 1;

          return (
            <div key={course.name}>
              <motion.div
                className="flex items-center gap-3 relative py-3"
                initial={{ x: 120, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                  delay: slideDelay,
                }}
              >
                {/* Left edge glow on reveal */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
                  style={{ backgroundColor: 'var(--cds-color-blue-500, #3D82F3)' }}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: [0, 0.7, 0], scaleY: [0, 1, 1] }}
                  transition={{
                    duration: 0.8,
                    delay: slideDelay + 0.1,
                    ease: 'easeOut',
                  }}
                />

                <CheckmarkIcon delay={checkDelay} />

                <div className="flex flex-col min-w-0 flex-1 gap-1">
                  <span
                    className="text-white truncate"
                    style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.3 }}
                  >
                    {course.name}
                  </span>

                  {/* Category pill with shimmer */}
                  <motion.span
                    className="self-start shrink-0 whitespace-nowrap relative overflow-hidden"
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: categoryColor,
                      backgroundColor: `${categoryColor}18`,
                      padding: '2px 8px',
                      borderRadius: 10,
                      lineHeight: 1.4,
                    }}
                  >
                    {course.category}
                    {/* Shimmer overlay */}
                    <motion.span
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                        borderRadius: 10,
                      }}
                      initial={{ x: '-100%' }}
                      animate={{ x: '200%' }}
                      transition={{
                        duration: 1.2,
                        delay: slideDelay + 0.8,
                        ease: 'easeInOut',
                      }}
                    />
                  </motion.span>
                </div>
              </motion.div>

              {/* Gradient divider between courses */}
              {!isLast && (
                <motion.div
                  className="w-full"
                  style={{
                    height: 1,
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(91,155,245,0.15) 30%, rgba(91,155,245,0.15) 70%, transparent 100%)',
                  }}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: slideDelay + 0.3,
                    ease: 'easeOut',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
