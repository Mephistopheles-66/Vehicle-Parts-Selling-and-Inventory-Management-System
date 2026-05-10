import { PageHeader } from '@/components/shared/PageHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, AlertTriangle, Clock, Users } from 'lucide-react';
import { revenueSeries, topPartsSeries, recentActivity, parts, customers, salesInvoices } from '@/data/mock';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { formatRs } from '@/lib/format';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const lowStock = parts.filter(p => p.stock < 10).length;
  const pendingCredits = customers.reduce((s, c) => s + c.pendingCredit, 0);
  const revenue = salesInvoices.reduce((s, i) => s + i.total, 0);

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description="Pulse of the entire Gear Vault operation."
        actions={<Button asChild><Link to="/admin/reports">View reports</Link></Button>}
      />
      <div className="p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <KpiCard label="Revenue (this month)" value={formatRs(845000)} delta={20.4} icon={DollarSign} accent="success" />
          <KpiCard label="Low stock items" value={String(lowStock)} delta={-12} icon={AlertTriangle} accent="warning" />
          <KpiCard label="Pending credits" value={formatRs(pendingCredits)} delta={3.1} icon={Clock} accent="danger" />
          <KpiCard label="Total customers" value={String(customers.length * 80)} delta={8.5} icon={Users} accent="navy" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Revenue vs Purchases</CardTitle>
              <span className="text-xs text-muted-foreground">Last 6 months</span>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer>
                <AreaChart data={revenueSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="pur" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9CA3AF" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#9CA3AF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => (v/1000)+'k'} />
                  <Tooltip contentStyle={{ background: '#0D1B2A', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }} formatter={(v: number) => formatRs(v)} />
                  <Area type="monotone" dataKey="purchases" stroke="#9CA3AF" strokeWidth={2} fill="url(#pur)" />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#rev)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Top-selling parts</CardTitle></CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer>
                <BarChart data={topPartsSeries} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} width={75} />
                  <Tooltip contentStyle={{ background: '#0D1B2A', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                  <Bar dataKey="units" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Recent activity</CardTitle></CardHeader>
          <CardContent>
            <ul className="divide-y">
              {recentActivity.map(a => (
                <li key={a.id} className="py-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <StatusBadge variant={a.who === 'System' ? 'warning' : 'info'}>{a.who}</StatusBadge>
                    <span className="text-charcoal">{a.action}</span>
                    <span className="text-muted-foreground">— {a.target}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{a.when}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
