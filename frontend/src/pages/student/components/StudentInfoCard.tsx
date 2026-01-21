import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  className?: string;
}

export default function StudentInfoCard({ label, value, icon: Icon, variant = 'default', className }: InfoCardProps) {
  const variantClasses = {
    default: 'bg-card border border-border',
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    accent: 'bg-accent text-accent-foreground',
  };

  return (
    <div className={cn(
      'rounded-xl p-4 transition-all duration-200',
      variantClasses[variant],
      'animate-fade-in',
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className={cn(
            'text-sm font-medium mb-1',
            variant === 'default' ? 'text-muted-foreground' : 'opacity-80'
          )}>
            {label}
          </p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {Icon && (
          <div className={cn(
            'p-2 rounded-lg',
            variant === 'default' ? 'bg-primary/10' : 'bg-white/20'
          )}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
