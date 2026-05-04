import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Props {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export const PageHeader = ({ title, description, actions, breadcrumbs }: Props) => {
  const { pathname } = useLocation();
  const crumbs: { label: string; href?: string }[] = breadcrumbs ?? pathname.split('/').filter(Boolean).map(s => ({ label: s.replace(/-/g, ' ') }));
  return (
    <div className="border-b bg-background">
      <div className="px-6 lg:px-8 py-5">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
          <Link to="/" className="hover:text-charcoal">Gear Vault</Link>
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1">
              <ChevronRight className="h-3 w-3" />
              {c.href ? <Link to={c.href} className="hover:text-charcoal capitalize">{c.label}</Link> : <span className="capitalize">{c.label}</span>}
            </span>
          ))}
        </nav>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-charcoal">{title}</h1>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
};
