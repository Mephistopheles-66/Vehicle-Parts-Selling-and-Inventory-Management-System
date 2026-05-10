import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, Link } from 'react-router-dom';
import { customers, salesInvoices, appointments } from '@/data/mock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatRs } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Plus, Car, Edit } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';

const CustomerDetails = () => {
  const { id } = useParams();
  const c = customers.find(x => x.id === id) ?? customers[0];
  const invoices = salesInvoices.filter(i => i.customerId === c.id);
  const appts = appointments.filter(a => a.customerId === c.id);

  return (
    <div>
      <PageHeader title={c.name} description={c.phone}
        actions={<Button asChild><Link to={`/staff/customers/${c.id}/edit`}><Edit className="h-4 w-4 mr-2" />Edit</Link></Button>} />
      <div className="p-6 lg:p-8 space-y-5">
        <div className="grid md:grid-cols-3 gap-4">
          <Card><CardContent className="p-5"><div className="text-xs text-muted-foreground">Total spent</div><div className="text-2xl font-bold tabular text-charcoal mt-1">{formatRs(c.totalSpent)}</div></CardContent></Card>
          <Card><CardContent className="p-5"><div className="text-xs text-muted-foreground">Loyalty points</div><div className="text-2xl font-bold tabular text-primary mt-1">{c.loyaltyPoints}</div></CardContent></Card>
          <Card><CardContent className="p-5"><div className="text-xs text-muted-foreground">Pending credit</div><div className={`text-2xl font-bold tabular mt-1 ${c.pendingCredit > 0 ? 'text-destructive' : 'text-charcoal'}`}>{formatRs(c.pendingCredit)}</div></CardContent></Card>
        </div>

        <Tabs defaultValue="vehicles">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="mt-5"><Card><CardContent className="p-6 space-y-3 text-sm">
            <div><div className="text-xs text-muted-foreground">Email</div><div>{c.email}</div></div>
            <div><div className="text-xs text-muted-foreground">Phone</div><div className="font-mono">{c.phone}</div></div>
            <div><div className="text-xs text-muted-foreground">Customer since</div><div>{c.joinedAt}</div></div>
          </CardContent></Card></TabsContent>
          <TabsContent value="vehicles" className="mt-5">
            <div className="grid md:grid-cols-2 gap-4">
              {c.vehicles.map(v => (
                <Card key={v.id}><CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center"><Car className="h-5 w-5" /></div>
                    <div className="flex-1">
                      <div className="font-semibold">{v.make} {v.model} <span className="text-muted-foreground font-normal">{v.year}</span></div>
                      <div className="text-xs font-mono text-muted-foreground mt-0.5">{v.plate}</div>
                      <div className="mt-3 flex items-center gap-3 text-xs">
                        <span className="text-muted-foreground">Mileage <span className="text-charcoal font-medium tabular">{v.mileage.toLocaleString()} km</span></span>
                        <span className="text-muted-foreground">Health <span className={`font-medium ${v.healthScore > 80 ? 'text-success' : v.healthScore > 60 ? 'text-warning' : 'text-destructive'}`}>{v.healthScore}/100</span></span>
                      </div>
                    </div>
                  </div>
                </CardContent></Card>
              ))}
              <Card className="border-dashed"><CardContent className="p-5 flex items-center justify-center">
                <Button variant="ghost"><Plus className="h-4 w-4 mr-2" />Add vehicle</Button>
              </CardContent></Card>
            </div>
          </TabsContent>
          <TabsContent value="purchases" className="mt-5"><Card><CardContent className="p-0">
            <table className="w-full text-sm"><tbody>{invoices.map(i => (
              <tr key={i.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-mono text-xs">{i.id}</td>
                <td className="px-4 py-3">{i.date}</td>
                <td className="px-4 py-3 tabular font-medium">{formatRs(i.total)}</td>
                <td className="px-4 py-3"><StatusBadge variant={i.status === 'paid' ? 'success' : 'warning'}>{i.status}</StatusBadge></td>
              </tr>))}</tbody></table>
          </CardContent></Card></TabsContent>
          <TabsContent value="services" className="mt-5"><Card><CardContent className="p-0">
            <table className="w-full text-sm"><tbody>{appts.map(a => (
              <tr key={a.id} className="border-b last:border-0">
                <td className="px-4 py-3">{a.date} · {a.time}</td>
                <td className="px-4 py-3">{a.vehicleLabel}</td>
                <td className="px-4 py-3 text-muted-foreground">{a.service}</td>
                <td className="px-4 py-3"><StatusBadge variant={a.status === 'completed' ? 'success' : 'info'}>{a.status}</StatusBadge></td>
              </tr>))}</tbody></table>
          </CardContent></Card></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
export default CustomerDetails;
