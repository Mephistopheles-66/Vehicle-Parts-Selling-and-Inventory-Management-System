import { PageHeader } from '@/components/shared/PageHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, Users, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { formatRs } from '@/lib/format';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useQuery } from '@tanstack/react-query';
import { AppointmentsService, SalesInvoiceService, UserService } from '@/api/generated/client';
import { unwrapApiResult } from '@/api/client';
import type { AppointmentDto, SalesInvoiceDto, UserDtoListResponseDto } from '@/api/generated/client';

const apptStatusVariant = (s?: string | null) => {
  const status = s?.toUpperCase();
  if (status === 'COMPLETED') return 'success';
  if (status === 'CANCELLED') return 'danger';
  if (status === 'CONFIRMED') return 'info';
  return 'neutral';
};

const invoiceStatusVariant = (s?: string | null) => {
  if (s === 'Paid') return 'success';
  if (s === 'Overdue') return 'danger';
  return 'warning';
};

const isToday = (dateStr?: string | null) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
};

const StaffDashboard = () => {
  const { data: appointments = [] } = useQuery({
    queryKey: ['all-appointments'],
    queryFn: async () => unwrapApiResult(await AppointmentsService.getAllAppointments(), []),
  });

  const { data: invoicesPage } = useQuery({
    queryKey: ['all-invoices-dashboard'],
    queryFn: async () => await SalesInvoiceService.getAllInvoices({ pageSize: 10 }),
  });

  const { data: usersPage } = useQuery<UserDtoListResponseDto>({
    queryKey: ['all-users-list'],
    queryFn: async () => await UserService.getAllUsersList({ isActive: [true] }),
  });

  const recentInvoices: SalesInvoiceDto[] = invoicesPage?.result ?? [];
  const todaysAppointments: AppointmentDto[] = appointments.filter(
    (a: AppointmentDto) => isToday(a.scheduledAt)
  );
  const todaySales = recentInvoices
    .filter(i => isToday(i.createdAt))
    .reduce((s, i) => s + (i.totalAmount ?? 0), 0);
  const activeCustomers = usersPage?.result?.length ?? 0;

  return (
    <div>
      <PageHeader title="Staff Dashboard" description="Today at a glance."
        actions={<Button asChild><Link to="/staff/invoices/new"><Plus className="h-4 w-4 mr-2" />New invoice</Link></Button>} />
      <div className="p-6 lg:p-8 space-y-6">
        <div className="grid sm:grid-cols-3 gap-5">
          <KpiCard label="Today's sales" value={formatRs(todaySales)} icon={Receipt} accent="success" />
          <KpiCard label="Active users" value={String(activeCustomers)} icon={Users} accent="navy" />
          <KpiCard label="Today's appointments" value={String(todaysAppointments.length)} icon={Calendar} accent="warning" />
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          <Card>
            <CardHeader><CardTitle className="text-base">Recent invoices</CardTitle></CardHeader>
            <CardContent className="p-0">
              {recentInvoices.length === 0
                ? <div className="px-4 py-6 text-sm text-muted-foreground">No invoices yet.</div>
                : <table className="w-full text-sm">
                  <tbody>{recentInvoices.map(i => (
                    <tr key={i.id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-mono text-xs">{i.invoiceNumber ?? i.id}</td>
                      <td className="px-4 py-3 font-medium">{i.customer?.name ?? '—'}</td>
                      <td className="px-4 py-3 tabular">{formatRs(i.totalAmount ?? 0)}</td>
                      <td className="px-4 py-3"><StatusBadge variant={invoiceStatusVariant(i.paymentStatus)}>{String(i.paymentStatus ?? '—')}</StatusBadge></td>
                    </tr>
                  ))}</tbody>
                </table>
              }
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Today's appointments</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {todaysAppointments.length === 0
                ? <div className="text-sm text-muted-foreground">No appointments today.</div>
                : todaysAppointments.map((a: AppointmentDto) => {
                  const time = a.scheduledAt
                    ? new Date(a.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '—';
                  return (
                    <div key={a.id} className="flex items-center justify-between p-3 rounded-md border bg-canvas">
                      <div>
                        <div className="font-medium text-sm">{a.customerName || '—'}</div>
                        <div className="text-xs text-muted-foreground">
                          {[a.vehicleMake, a.vehicleModel].filter(Boolean).join(' ') || a.vehicleNumber || '—'}
                          {a.notes && ` · ${a.notes}`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm">{time}</div>
                        <StatusBadge variant={apptStatusVariant(a.status)}>{a.status ?? '—'}</StatusBadge>
                      </div>
                    </div>
                  );
                })
              }
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default StaffDashboard;
