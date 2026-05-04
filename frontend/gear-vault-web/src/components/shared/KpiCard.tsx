import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  label: string;
  value: string;
  delta?: number;
  icon: LucideIcon;
  accent?: 'navy' | 'success' | 'warning' | 'danger';
}

const accents: Record<string, string> = {
  navy: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-destructive/10 text-destructive',
};

export const KpiCard = ({ label, value, delta, icon: Icon, accent = 'navy' }: Props) => (
  <Card className="hover:shadow-md transition-all duration-200">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <p className="mt-2 text-2xl font-bold tabular text-charcoal">{value}</p>
          {delta !== undefined && (
            <div className={cn('mt-2 inline-flex items-center gap-1 text-xs font-medium',
              delta >= 0 ? 'text-success' : 'text-destructive')}>
              {delta >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {Math.abs(delta)}% vs last month
            </div>
          )}
        </div>
        <div className={cn('h-11 w-11 rounded-lg flex items-center justify-center', accents[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </CardContent>
  </Card>
);
