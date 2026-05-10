import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { customers, predictions, appointments } from '@/data/mock';
import { Sparkles, Calendar, Wrench, Car } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';

const c = customers[0];

const CustomerDashboard = () => {
  const myPredictions = predictions.filter(p => c.vehicles.some(v => v.id === p.vehicleId));
  const myAppts = appointments.filter(a => a.customerId === c.id);
  return (
    <div>
      <PageHeader title={`Welcome back, ${c.name.split(' ')[0]}`} description="Your garage at a glance." />
      <div className="p-6 lg:p-8 space-y-6">
        <Card className="bg-deep-navy text-white border-none"><CardContent className="p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-white/60">Loyalty progress</div>
            <div className="mt-1 text-2xl font-bold">{c.loyaltyPoints} pts</div>
            <div className="text-xs text-white/60 mt-1">355 pts to next tier · Gold</div>
          </div>
          <div className="w-64"><Progress value={78} className="h-2 bg-white/10" /></div>
          <Button asChild variant="secondary"><Link to="/customer/book">Book service</Link></Button>
        </CardContent></Card>

        <div className="grid lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2"><CardHeader className="flex-row items-center justify-between"><CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />AI Vehicle Health alerts</CardTitle><Link to="/customer/health" className="text-xs text-primary hover:underline">View all</Link></CardHeader>
            <CardContent className="space-y-3">
              {myPredictions.map(p => (
                <div key={p.id} className="p-4 rounded-md border bg-canvas">
                  <div className="flex items-center justify-between"><span className="font-medium">{p.part}</span>
                    <StatusBadge variant={p.severity === 'high' ? 'danger' : p.severity === 'medium' ? 'warning' : 'info'}>{p.severity}</StatusBadge></div>
                  <div className="text-xs text-muted-foreground mt-1">Predicted in ~{p.etaDays} days · {p.confidence}% confidence</div>
                  <div className="text-sm mt-2 text-charcoal">{p.recommendation}</div>
                </div>
              ))}
            </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4" />Upcoming</CardTitle></CardHeader>
            <CardContent className="space-y-3">{myAppts.map(a => (
              <div key={a.id} className="p-3 rounded-md border bg-canvas">
                <div className="text-sm font-medium">{a.service}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{a.vehicleLabel}</div>
                <div className="text-xs font-mono mt-1">{a.date} · {a.time}</div>
              </div>
            ))}</CardContent></Card>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Link to="/customer/vehicles"><Card className="hover:shadow-md transition-all"><CardContent className="p-5 flex items-center gap-3"><Car className="h-5 w-5 text-primary" /><div><div className="font-medium">My vehicles</div><div className="text-xs text-muted-foreground">{c.vehicles.length} registered</div></div></CardContent></Card></Link>
          <Link to="/customer/parts"><Card className="hover:shadow-md transition-all"><CardContent className="p-5 flex items-center gap-3"><Wrench className="h-5 w-5 text-primary" /><div><div className="font-medium">Browse parts</div><div className="text-xs text-muted-foreground">Shop OEM & aftermarket</div></div></CardContent></Card></Link>
          <Link to="/customer/invoices"><Card className="hover:shadow-md transition-all"><CardContent className="p-5 flex items-center gap-3"><Calendar className="h-5 w-5 text-primary" /><div><div className="font-medium">My invoices</div><div className="text-xs text-muted-foreground">Download anytime</div></div></CardContent></Card></Link>
        </div>
      </div>
    </div>
  );
};
export default CustomerDashboard;
