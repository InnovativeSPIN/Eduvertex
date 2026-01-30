import { cn } from '@/pages/student/lib/utils';
import { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export default function SectionCard({ title, subtitle, children, actions, className }: SectionCardProps) {
  return (
    <div className={cn('section-card animate-fade-in', className)}>
      <div className="section-header flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold font-display">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

