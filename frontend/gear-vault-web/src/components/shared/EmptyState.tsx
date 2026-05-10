import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props { icon: LucideIcon; title: string; description?: string; action?: ReactNode; }

export const EmptyState = ({ icon: Icon, title, description, action }: Props) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-muted-foreground" />
    </div>
    <h3 className="text-base font-semibold text-charcoal">{title}</h3>
    {description && <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);
