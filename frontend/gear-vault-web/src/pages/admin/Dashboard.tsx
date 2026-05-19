import { PageHeader } from '@/components/shared/PageHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, AlertTriangle, Package, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PartsService, UserService } from '@/api/generated/client';
import { formatRs } from '@/lib/format';

const AdminDashboard = () => {
  const { data: partsRes } = useQuery({ queryKey: ['parts'], queryFn: () => PartsService.getAllParts() });
  const { data: usersRes } = useQuery({ queryKey: ['users'], queryFn: () => UserService.getAllUsersList({}) });

  const parts = partsRes?.result ?? [];
  const users = usersRes?.result ?? [];
  const lowStock = parts.filter(p => (p.stockQuantity ?? 0) < (p.reorderLevel ?? 10)).length;

  return (
    <div>
      <PageHeader
        title="Super Admin Dashboard"
        description="Pulse of the entire Gear Vault operation."
        actions={<Button asChild><Link to="/admin/reports">View reports</Link></Button>}
      />
      <div className="p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <KpiCard label="Total parts" value={String(parts.length)} icon={Package} accent="success" />
          <KpiCard label="Low stock items" value={String(lowStock)} icon={AlertTriangle} accent="warning" />
          <KpiCard label="Total users" value={String(users.length)} icon={Users} accent="navy" />
          <KpiCard label="Stock value" value={formatRs(parts.reduce((s, p) => s + (p.sellingPrice ?? 0) * (p.stockQuantity ?? 0), 0))} icon={DollarSign} accent="danger" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <CardHeader><CardTitle className="text-base">Low stock items</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-deep-navy text-white">
                  <tr>{['Part', 'Stock', 'Reorder Level'].map(h => <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {parts.filter(p => (p.stockQuantity ?? 0) < (p.reorderLevel ?? 10)).slice(0, 5).map((p, i) => (
                    <tr key={p.id} className={`border-b ${i % 2 ? 'bg-canvas' : ''}`}>
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3 tabular text-destructive font-bold">{p.stockQuantity}</td>
                      <td className="px-4 py-3 tabular text-muted-foreground">{p.reorderLevel}</td>
                    </tr>
                  ))}
                  {lowStock === 0 && <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">No low stock items.</td></tr>}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Recent users</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-deep-navy text-white">
                  <tr>{['Name', 'Email', 'Role'].map(h => <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {users.slice(0, 5).map((u, i) => (
                    <tr key={u.id} className={`border-b ${i % 2 ? 'bg-canvas' : ''}`}>
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{u.emailAddress}</td>
                      <td className="px-4 py-3 text-muted-foreground">{u.role?.name ?? '-'}</td>
                    </tr>
                  ))}
                  {users.length === 0 && <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">No users found.</td></tr>}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
