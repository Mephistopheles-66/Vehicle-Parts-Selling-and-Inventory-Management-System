import { PageHeader } from '@/components/shared/PageHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, Users, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { salesInvoices, customers, appointments } from '@/data/mock';
import { formatRs } from '@/lib/format';
import { StatusBadge } from '@/components/shared/StatusBadge';

const StaffDashboard = () => {
  const todayTotal = salesInvoices.reduce((s, i) => s + i.total, 0);
  return (
    <div>
      <PageHeader title="Staff Dashboard" description="Today at a glance."
        actions={<Button asChild><Link to="/staff/invoices/new"><Plus className="h-4 w-4 mr-2" />New invoice</Link></Button>} />
      <div className="p-6 lg:p-8 space-y-6">
        <div className="grid sm:grid-cols-3 gap-5">
          <KpiCard label="Today's sales" value={formatRs(todayTotal)} delta={14.2} icon={Receipt} accent="success" />
          <KpiCard label="Active customers" value={String(customers.length)} icon={Users} accent="navy" />
          <KpiCard label="Today's appointments" value={String(appointments.length)} icon={Calendar} accent="warning" />
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          <Card>
            <CardHeader><CardTitle className="text-base">Recent invoices</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <tbody>{salesInvoices.map(i => (
                  <tr key={i.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-mono text-xs">{i.id}</td>
                    <td className="px-4 py-3 font-medium">{i.customerName}</td>
                    <td className="px-4 py-3 tabular">{formatRs(i.total)}</td>
                    <td className="px-4 py-3"><StatusBadge variant={i.status === 'paid' ? 'success' : i.status === 'overdue' ? 'danger' : 'warning'}>{i.status}</StatusBadge></td>
                  </tr>
                ))}</tbody>
              </table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Today's appointments</CardTitle></CardHeader>
            <CardContent className="space-y-3">{appointments.map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-md border bg-canvas">
                <div>
                  <div className="font-medium text-sm">{a.customerName}</div>
                  <div className="text-xs text-muted-foreground">{a.vehicleLabel} · {a.service}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm">{a.time}</div>
                  <StatusBadge variant={a.status === 'completed' ? 'success' : a.status === 'in-progress' ? 'info' : 'neutral'}>{a.status}</StatusBadge>
                </div>
              </div>
            ))}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default StaffDashboard;
