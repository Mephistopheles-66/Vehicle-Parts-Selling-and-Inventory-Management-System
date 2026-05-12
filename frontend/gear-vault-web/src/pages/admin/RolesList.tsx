import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

const roles = [
  { name: 'Super Admin', desc: 'Full system access. Manages users, parts, vendors, reports.', perms: 12 },
  { name: 'Staff', desc: 'POS, customers, appointments, sales invoices.', perms: 7 },
  { name: 'Customer', desc: 'Self-service portal: vehicles, bookings, invoices, AI health.', perms: 5 },
];

const RolesList = () => (
  <div>
    <PageHeader title="Roles" description="Permission tiers across Gear Vault." />
    <div className="p-6 lg:p-8 grid md:grid-cols-3 gap-5">
      {roles.map(r => (
        <Card key={r.name} className="hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-4"><ShieldCheck className="h-5 w-5" /></div>
            <h3 className="font-semibold text-charcoal">{r.name}</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{r.desc}</p>
            <div className="mt-4 text-xs text-muted-foreground">{r.perms} permissions enabled</div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);
export default RolesList;
