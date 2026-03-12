export interface LearnerProfile {
  name: string;
  totalHours: number;
  coursesCompleted: number;
  topCourses: { name: string; category: string; hours: number }[];
  topSkills: { name: string; hours: number; color: string }[];
  learningStreak: number;
  peakHour: number;
  peakHourLabel: string;
  personality: LearningPersonality;
  percentile: number;
  topCategory: string;
  certificatesEarned: number;
  quizAnswers: number;
  monthlyBreakdown: number[];
  streakCalendar: DayActivity[];
  topicConnections: TopicNode[];
  funComparison: string;
  yearLabel: string;
}

export interface DayActivity {
  date: string;
  hours: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface TopicNode {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  connections: string[];
}

export type LearningPersonality =
  | 'Night Owl'
  | 'Early Bird'
  | 'Weekend Warrior'
  | 'Steady Learner'
  | 'Sprint Master'
  | 'The Explorer';

export interface PersonalityInfo {
  type: LearningPersonality;
  description: string;
  icon: string;
}

export type StoryCardType =
  | 'intro'
  | 'hook'
  | 'total-hours'
  | 'courses'
  | 'peak-time'
  | 'constellation'
  | 'personality'
  | 'fun-stat'
  | 'streak'
  | 'share';

export interface StoryCardConfig {
  type: StoryCardType;
  background: string;
  duration?: number;
}

export interface StoryState {
  currentIndex: number;
  direction: 1 | -1;
  profile: LearnerProfile;
  cards: StoryCardConfig[];
  isComplete: boolean;
}
