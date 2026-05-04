import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  className?: string;
}

const styles: Record<string, string> = {
  default:  'bg-secondary text-secondary-foreground',
  success:  'bg-success/10 text-success',
  warning:  'bg-warning/10 text-warning',
  danger:   'bg-destructive/10 text-destructive',
  info:     'bg-primary/10 text-primary',
  neutral:  'bg-muted text-muted-foreground',
};

export const StatusBadge = ({ children, variant = 'default', className }: Props) => (
  <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', styles[variant], className)}>
    {children}
  </span>
);
