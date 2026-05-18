import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ShieldCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { RoleService } from '@/api/generated/client';
import { getApiErrorMessage } from '@/api/client';

const RolesList = () => {
  const { data: rolesResponse, isLoading, error } = useQuery({
    queryKey: ['roles'],
    queryFn: () => RoleService.getAllRolesList({ orderBys: ['name'] }),
  });

  const roles = rolesResponse?.result ?? [];

  return (
    <div>
      <PageHeader title="Roles" description="Permission tiers across Gear Vault." />
      <div className="p-6 lg:p-8">
        {isLoading && <div className="text-sm text-muted-foreground py-8 text-center">Loading roles...</div>}
        {error && <div className="text-sm text-destructive py-8 text-center">{getApiErrorMessage(error, 'Unable to load roles')}</div>}
        {!isLoading && !error && roles.length === 0 && <div className="text-sm text-muted-foreground py-8 text-center">No roles found.</div>}
        <div className="grid md:grid-cols-3 gap-5">
          {roles.map(r => (
            <Card key={r.id} className="hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <StatusBadge variant={r.isActive ? 'success' : 'neutral'}>{r.isActive ? 'Active' : 'Inactive'}</StatusBadge>
                </div>
                <h3 className="font-semibold text-charcoal">{r.name ?? 'Unnamed'}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{r.description || 'No description.'}</p>
                {r.isRegisterable && (
                  <div className="mt-4 text-xs text-muted-foreground">Self-registerable</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
export default RolesList;
