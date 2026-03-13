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
            fontSize: 22,
            color: 'white',
            fontWeight: 700,
            lineHeight: 1.3,
          }}
        >
          Look what you built
        </p>
        <p
          style={{
            fontSize: 15,
            color: 'var(--cds-color-blue-300, #79A8F7)',
            fontWeight: 400,
            marginTop: 4,
          }}
        >
          {profile.coursesCompleted} courses completed this year
        </p>
      </motion.div>

      {/* Course list */}
      <div className="flex flex-col gap-4 w-full">
        {courses.map((course, i) => {
          const slideDelay = i * 0.15;
          const checkDelay = slideDelay + 0.4;
          const categoryColor = getCategoryColor(course.category);

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

              <div className="flex flex-col min-w-0 flex-1 gap-1">
                <span
                  className="text-white truncate"
                  style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.3 }}
                >
                  {course.name}
                </span>

                <span
                  className="self-start shrink-0 whitespace-nowrap"
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
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
