import { lazy, Suspense } from 'react';
import type { StoryCardType, LearnerProfile } from '../../types';

const HookCard = lazy(() => import('../cards/HookCard'));
const TotalHoursCard = lazy(() => import('../cards/TotalHoursCard'));
const CoursesCard = lazy(() => import('../cards/CoursesCard'));
const PeakTimeCard = lazy(() => import('../cards/PeakTimeCard'));
const ConstellationCard = lazy(() => import('../cards/ConstellationCard'));
const PersonalityCard = lazy(() => import('../cards/PersonalityCard'));
const FunStatCard = lazy(() => import('../cards/FunStatCard'));
const StreakCard = lazy(() => import('../cards/StreakCard'));
const ShareCard = lazy(() => import('../cards/ShareCard'));

interface StoryCardProps {
  type: StoryCardType;
  profile: LearnerProfile;
}

const cardMap: Record<StoryCardType, React.LazyExoticComponent<React.ComponentType<{ profile: LearnerProfile }>>> = {
  hook: HookCard,
  'total-hours': TotalHoursCard,
  courses: CoursesCard,
  'peak-time': PeakTimeCard,
  constellation: ConstellationCard,
  personality: PersonalityCard,
  'fun-stat': FunStatCard,
  streak: StreakCard,
  share: ShareCard,
};

export default function StoryCard({ type, profile }: StoryCardProps) {
  const CardComponent = cardMap[type];

  if (!CardComponent) {
    return null;
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white"
            aria-label="Loading card"
          />
        </div>
      }
    >
      <CardComponent profile={profile} />
    </Suspense>
  );
}
