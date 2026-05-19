import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Calendar, Wrench, Car, Receipt } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useQuery } from '@tanstack/react-query';
import { AppointmentsService, SalesInvoiceService, VehiclesService } from '@/api/generated/client';
import { unwrapApiResult } from '@/api/client';
import { useAuth } from '@/hooks/use-auth';
import { formatRs } from '@/lib/format';

const CustomerDashboard = () => {
  const { user } = useAuth();

  const { data: vehicles = [] } = useQuery({
    queryKey: ['my-vehicles'],
    queryFn: async () => unwrapApiResult(await VehiclesService.getMyVehicles(), []),
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: async () => unwrapApiResult(await AppointmentsService.getMyAppointments(), []),
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ['my-invoices'],
    queryFn: async () => unwrapApiResult(await SalesInvoiceService.getMyInvoices(), []),
  });

  const upcoming = appointments
    .filter(a => a.status === 'Scheduled' || a.status === 'InProgress')
    .sort((a, b) => new Date(a.scheduledAt ?? 0).getTime() - new Date(b.scheduledAt ?? 0).getTime())
    .slice(0, 4);

  const totalSpent = invoices.reduce((s, i) => s + (i.totalAmount ?? 0), 0);
  const firstName = (user?.name ?? '').split(' ')[0] || 'there';

  const apptStatusVariant = (s?: string | null) => {
    if (s === 'Completed') return 'success';
    if (s === 'Cancelled') return 'danger';
    if (s === 'InProgress') return 'info';
    return 'neutral';
  };

  const invoiceStatusVariant = (s?: string) => {
    if (s === 'Paid') return 'success';
    if (s === 'Overdue') return 'danger';
    return 'warning';
  };

  return (
    <div>
      <PageHeader title={`Welcome back, ${firstName}`} description="Your garage at a glance." />
      <div className="p-6 lg:p-8 space-y-6">
        <div className="grid sm:grid-cols-3 gap-5">
          <Card><CardContent className="p-5 flex items-center gap-3">
            <Car className="h-5 w-5 text-primary" />
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Vehicles</div>
              <div className="text-2xl font-bold tabular">{vehicles.length}</div>
            </div>
          </CardContent></Card>
          <Card><CardContent className="p-5 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Appointments</div>
              <div className="text-2xl font-bold tabular">{appointments.length}</div>
            </div>
          </CardContent></Card>
          <Card><CardContent className="p-5 flex items-center gap-3">
            <Receipt className="h-5 w-5 text-primary" />
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Total spent</div>
              <div className="text-2xl font-bold tabular">{formatRs(totalSpent)}</div>
            </div>
          </CardContent></Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4" />Upcoming appointments</CardTitle>
              <Link to="/customer/appointments" className="text-xs text-primary hover:underline">View all</Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcoming.length === 0 && <div className="text-sm text-muted-foreground">No upcoming appointments.</div>}
              {upcoming.map(a => (
                <div key={a.id} className="p-3 rounded-md border bg-canvas">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{a.vehicleMake} {a.vehicleModel}</div>
                    <StatusBadge variant={apptStatusVariant(a.status)}>{a.status}</StatusBadge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{a.vehicleNumber}</div>
                  <div className="text-xs font-mono mt-1">{a.scheduledAt ? new Date(a.scheduledAt).toLocaleString() : '—'}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><Receipt className="h-4 w-4" />Recent invoices</CardTitle>
              <Link to="/customer/invoices" className="text-xs text-primary hover:underline">View all</Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {invoices.length === 0 && <div className="text-sm text-muted-foreground">No invoices yet.</div>}
              {invoices.slice(0, 4).map(inv => (
                <div key={inv.id} className="p-3 rounded-md border bg-canvas flex items-center justify-between">
                  <div>
                    <div className="font-mono text-xs font-semibold">{inv.invoiceNumber ?? inv.id}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : '—'}</div>
                  </div>
                  <div className="text-right">
                    <div className="tabular font-medium text-sm">{formatRs(inv.totalAmount ?? 0)}</div>
                    <StatusBadge variant={invoiceStatusVariant(inv.paymentStatus)}>{inv.paymentStatus}</StatusBadge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Link to="/customer/vehicles"><Card className="hover:shadow-md transition-all"><CardContent className="p-5 flex items-center gap-3"><Car className="h-5 w-5 text-primary" /><div><div className="font-medium">My vehicles</div><div className="text-xs text-muted-foreground">{vehicles.length} registered</div></div></CardContent></Card></Link>
          <Link to="/customer/parts"><Card className="hover:shadow-md transition-all"><CardContent className="p-5 flex items-center gap-3"><Wrench className="h-5 w-5 text-primary" /><div><div className="font-medium">Browse parts</div><div className="text-xs text-muted-foreground">Shop OEM & aftermarket</div></div></CardContent></Card></Link>
          <Link to="/customer/book"><Card className="hover:shadow-md transition-all"><CardContent className="p-5 flex items-center gap-3"><Calendar className="h-5 w-5 text-primary" /><div><div className="font-medium">Book service</div><div className="text-xs text-muted-foreground">Schedule an appointment</div></div></CardContent></Card></Link>
        </div>
      </div>
    </div>
  );
};
export default CustomerDashboard;
