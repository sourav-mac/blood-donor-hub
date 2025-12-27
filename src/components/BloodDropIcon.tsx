import { cn } from '@/lib/utils';

interface BloodDropIconProps {
  className?: string;
  animated?: boolean;
}

export function BloodDropIcon({ className, animated = false }: BloodDropIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn(animated && 'animate-pulse-blood', className)}
    >
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}
