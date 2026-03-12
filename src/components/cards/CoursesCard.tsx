import { motion } from 'framer-motion';
import type { LearnerProfile } from '../../types';

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

export default function CoursesCard({ profile }: { profile: LearnerProfile }) {
  const courses = profile.topCourses.slice(0, 6);

  return (
    <div
      className="flex flex-col w-full h-full px-6 py-12 overflow-hidden"
      style={{ backgroundColor: 'var(--cds-color-grey-950, #1F1F1F)' }}
      role="region"
      aria-label={`${profile.coursesCompleted} courses completed`}
    >
      {/* Header */}
      <motion.p
        className="mb-8 select-none"
        style={{
          fontSize: 20,
          color: 'var(--cds-color-blue-300, #79A8F7)',
          fontWeight: 500,
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {profile.coursesCompleted} courses completed
      </motion.p>

      {/* Course list */}
      <div className="flex flex-col gap-4 flex-1 justify-center">
        {courses.map((course, i) => {
          const slideDelay = i * 0.15;
          const checkDelay = slideDelay + 0.4;

          return (
            <motion.div
              key={course.name}
              className="flex items-center gap-3"
              initial={{ x: 120, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
                delay: slideDelay,
              }}
            >
              <CheckmarkIcon delay={checkDelay} />

              <div className="flex items-baseline gap-3 min-w-0 flex-1">
                <span
                  className="text-white truncate"
                  style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.4 }}
                >
                  {course.name}
                </span>

                <span
                  className="shrink-0 whitespace-nowrap"
                  style={{
                    fontSize: 12,
                    color: 'var(--cds-color-grey-400, #9E9E9E)',
                    fontWeight: 400,
                  }}
                >
                  {course.category}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
