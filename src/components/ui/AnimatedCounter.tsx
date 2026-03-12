import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function AnimatedCounter({
  value,
  duration = 2000,
  delay = 0,
  prefix = '',
  suffix = '',
  className = '',
}: AnimatedCounterProps) {
  const { value: animatedValue } = useAnimatedCounter(value, duration, delay);

  return (
    <span
      className={className}
      style={{ fontFeatureSettings: '"tnum"' }}
      aria-label={`${prefix}${value.toLocaleString()}${suffix}`}
    >
      {prefix}
      {animatedValue.toLocaleString()}
      {suffix}
    </span>
  );
}
