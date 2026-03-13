import type { LearnerProfile, DayActivity, TopicNode } from '../types';

function generateStreakCalendar(): DayActivity[] {
  const days: DayActivity[] = [];
  const now = new Date(2026, 2, 13);
  for (let i = 83; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const random = Math.random();
    let level: 0 | 1 | 2 | 3 | 4;
    if (random < 0.15) level = 0;
    else if (random < 0.35) level = 1;
    else if (random < 0.6) level = 2;
    else if (random < 0.8) level = 3;
    else level = 4;
    if (isWeekend && random < 0.3) level = Math.min(level + 1, 4) as 0 | 1 | 2 | 3 | 4;
    days.push({
      date: date.toISOString().split('T')[0],
      hours: level * 0.75,
      level,
    });
  }
  return days;
}

const constellationNodes: TopicNode[] = [
  { id: 'python', label: 'Python', x: 0.15, y: 0.3, size: 1.4, connections: ['data-analysis', 'ml'] },
  { id: 'data-analysis', label: 'Data Analysis', x: 0.4, y: 0.15, size: 1.2, connections: ['ml', 'stats'] },
  { id: 'stats', label: 'Statistics', x: 0.65, y: 0.25, size: 1.0, connections: ['ml'] },
  { id: 'ml', label: 'Machine Learning', x: 0.5, y: 0.5, size: 1.6, connections: ['deep-learning'] },
  { id: 'deep-learning', label: 'Deep Learning', x: 0.75, y: 0.65, size: 1.1, connections: [] },
  { id: 'sql', label: 'SQL', x: 0.2, y: 0.65, size: 0.9, connections: ['data-analysis'] },
];

export const demoProfile: LearnerProfile = {
  name: 'Diwakar',
  totalHours: 147,
  coursesCompleted: 9,
  topCourses: [
    { name: 'Machine Learning Specialization', category: 'AI & ML', hours: 32 },
    { name: 'Python for Everybody', category: 'Programming', hours: 24 },
    { name: 'Google Data Analytics', category: 'Data Science', hours: 28 },
    { name: 'Deep Learning Specialization', category: 'AI & ML', hours: 18 },
    { name: 'Statistics with Python', category: 'Data Science', hours: 14 },
    { name: 'SQL for Data Science', category: 'Databases', hours: 10 },
    { name: 'Data Visualization with Tableau', category: 'Data Science', hours: 8 },
    { name: 'AWS Cloud Practitioner', category: 'Cloud', hours: 7 },
    { name: 'Agile Project Management', category: 'Management', hours: 6 },
  ],
  topSkills: [
    { name: 'Machine Learning', hours: 50, color: '#3D82F3' },
    { name: 'Python', hours: 42, color: '#1F6BEB' },
    { name: 'Data Analysis', hours: 38, color: '#0056D2' },
    { name: 'Statistics', hours: 22, color: '#7B1FA2' },
    { name: 'Deep Learning', hours: 18, color: '#00796B' },
  ],
  learningStreak: 14,
  peakHour: 22,
  peakHourLabel: '10 PM',
  personality: 'Night Owl',
  percentile: 92,
  topCategory: 'AI & Machine Learning',
  certificatesEarned: 5,
  quizAnswers: 2847,
  monthlyBreakdown: [8, 12, 15, 18, 22, 14, 10, 16, 20, 8, 4, 0],
  streakCalendar: generateStreakCalendar(),
  topicConnections: constellationNodes,
  funComparison: "That's more clicks than a drummer in a jazz band. Your brain barely broke a sweat.",
  yearLabel: '2026',
};

export const profiles: Record<string, LearnerProfile> = {
  default: demoProfile,
};
