import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  status?: 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  className?: string;
}

export default function StudentProgressBar({ 
  value, 
  max = 100, 
  status = 'success', 
  showLabel = true,
  className 
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const statusClasses = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn('h-full rounded-full transition-all duration-500', statusClasses[status])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium min-w-[3rem] text-right">
          {percentage.toFixed(1)}%
        </span>
      )}
    </div>
  );
}
