import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { parts, appointments, customers, salesInvoices } from '@/data/mock';
import { formatRs } from '@/lib/format';
import { Package, Star, Building2, Mail, Phone, MapPin, Download } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const c = customers[0];

export const ServiceCenter = () => (
  <div>
    <PageHeader title="Service Center" description="About Gear Vault." />
    <div className="p-6 lg:p-8 grid lg:grid-cols-3 gap-5">
      <Card className="lg:col-span-2"><CardContent className="p-6">
        <h2 className="text-xl font-bold text-charcoal">Gear Vault Service Center</h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">A full-service automotive workshop and parts retailer. We specialize in OEM-grade replacements, preventive maintenance, and AI-driven diagnostics.</p>
        <div className="mt-5 grid sm:grid-cols-2 gap-3 text-sm">
          {['Engine diagnostics & service','Brake system overhaul','Tire rotation & alignment','Battery & electrical','AC service','Oil & lubricants'].map(s => (
            <div key={s} className="flex items-center gap-2 p-3 rounded-md bg-canvas border">
              <div className="h-2 w-2 rounded-full bg-primary" />{s}
            </div>
          ))}
        </div>
        <div className="mt-6 aspect-[16/7] rounded-lg bg-deep-navy flex items-center justify-center text-white/40 text-sm"><MapPin className="h-5 w-5 mr-2" />Map placeholder · Kathmandu, Nepal</div>
      </CardContent></Card>
      <Card><CardContent className="p-6 space-y-4 text-sm">
        <div className="flex items-center gap-3"><Building2 className="h-4 w-4 text-primary" /><div><div className="text-xs text-muted-foreground">Location</div><div className="font-medium">Balaju, Kathmandu</div></div></div>
        <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /><div><div className="text-xs text-muted-foreground">Phone</div><div className="font-mono">+977 014441111</div></div></div>
        <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /><div><div className="text-xs text-muted-foreground">Email</div><div>hello@gearvault.com</div></div></div>
        <div className="border-t pt-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Hours</div>
          <div className="space-y-1.5 text-sm"><div className="flex justify-between"><span>Mon – Fri</span><span className="tabular">8:00 – 19:00</span></div><div className="flex justify-between"><span>Saturday</span><span className="tabular">9:00 – 17:00</span></div><div className="flex justify-between"><span>Sunday</span><span className="text-muted-foreground">Closed</span></div></div>
        </div>
      </CardContent></Card>
    </div>
  </div>
);

export const BookAppointment = () => (
  <div>
    <PageHeader title="Book Appointment" />
    <form onSubmit={e => { e.preventDefault(); toast.success('Appointment booked'); }} className="p-6 lg:p-8 max-w-xl">
      <Card><CardContent className="p-6 space-y-4">
        <div><Label>Vehicle</Label>
          <Select defaultValue={c.vehicles[0].id}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>{c.vehicles.map(v => <SelectItem key={v.id} value={v.id}>{v.make} {v.model} · {v.plate}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Service type</Label>
          <Select defaultValue="full"><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="full">Full Service</SelectItem><SelectItem value="brakes">Brake Inspection</SelectItem><SelectItem value="oil">Oil Change</SelectItem><SelectItem value="tires">Tire Rotation</SelectItem></SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Date</Label><Input type="date" className="mt-1.5" defaultValue="2026-05-10" /></div>
          <div><Label>Time</Label><Input type="time" className="mt-1.5" defaultValue="10:00" /></div>
        </div>
        <div><Label>Notes</Label><Textarea className="mt-1.5" rows={3} placeholder="Anything we should know?" /></div>
        <Button type="submit" className="w-full">Book appointment</Button>
      </CardContent></Card>
    </form>
  </div>
);

export const MyAppointments = () => {
  const my = appointments.filter(a => a.customerId === c.id);
  return (
    <div><PageHeader title="My Appointments" />
      <div className="p-6 lg:p-8 space-y-3">
        {my.map(a => (
          <Card key={a.id}><CardContent className="p-5 flex items-center justify-between">
            <div><div className="font-semibold">{a.service}</div><div className="text-xs text-muted-foreground mt-0.5">{a.vehicleLabel}</div><div className="text-xs font-mono mt-1">{a.date} · {a.time}</div></div>
            <StatusBadge variant={a.status === 'completed' ? 'success' : 'info'}>{a.status}</StatusBadge>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
};

export const BrowseParts = () => {
  const [q, setQ] = useState('');
  const list = parts.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div><PageHeader title="Browse Parts" />
      <div className="p-6 lg:p-8 space-y-5">
        <Card><CardContent className="p-4 flex gap-3"><Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search parts…" /><Button variant="outline">Filters</Button></CardContent></Card>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {list.map(p => (
            <Card key={p.id} className="hover:shadow-md transition-all"><CardContent className="p-4">
              <div className="aspect-square rounded-md bg-secondary flex items-center justify-center"><Package className="h-10 w-10 text-muted-foreground" /></div>
              <div className="mt-3"><div className="font-medium text-sm leading-snug">{p.name}</div><div className="text-xs font-mono text-muted-foreground mt-1">{p.sku}</div>
                <div className="mt-3 flex items-center justify-between"><span className="font-bold tabular">{formatRs(p.price)}</span><Button size="sm">Add</Button></div></div>
            </CardContent></Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export const RequestPart = () => (
  <div><PageHeader title="Request a Part" description="Can't find it? We'll source it for you." />
    <form onSubmit={e => { e.preventDefault(); toast.success('Request submitted'); }} className="p-6 lg:p-8 max-w-xl">
      <Card><CardContent className="p-6 space-y-4">
        <div><Label>Part name</Label><Input className="mt-1.5" placeholder="e.g. Timing belt for Honda Civic 2019" /></div>
        <div><Label>Vehicle</Label>
          <Select defaultValue={c.vehicles[0].id}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>{c.vehicles.map(v => <SelectItem key={v.id} value={v.id}>{v.make} {v.model}</SelectItem>)}</SelectContent></Select>
        </div>
        <div><Label>Notes</Label><Textarea className="mt-1.5" rows={4} placeholder="OEM preferred, color, etc." /></div>
        <Button type="submit" className="w-full">Submit request</Button>
      </CardContent></Card>
    </form>
  </div>
);

export const PurchaseHistory = () => {
  const my = salesInvoices.filter(i => i.customerId === c.id);
  return (
    <div><PageHeader title="Purchase History" />
      <div className="p-6 lg:p-8"><Card><CardContent className="p-0">
        <table className="w-full text-sm"><thead className="bg-deep-navy text-white"><tr>{['Invoice','Date','Items','Total','Status'].map(h=><th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider">{h}</th>)}</tr></thead>
          <tbody>{my.map((i, idx) => (
            <tr key={i.id} className={`border-b ${idx%2?'bg-canvas':''}`}>
              <td className="px-4 py-3 font-mono text-xs"><Link to={`/customer/invoices/${i.id}`} className="text-primary">{i.id}</Link></td>
              <td className="px-4 py-3">{i.date}</td><td className="px-4 py-3">{i.items.length}</td>
              <td className="px-4 py-3 tabular font-medium">{formatRs(i.total)}</td>
              <td className="px-4 py-3"><StatusBadge variant={i.status === 'paid' ? 'success' : 'warning'}>{i.status}</StatusBadge></td>
            </tr>))}</tbody>
        </table>
      </CardContent></Card></div>
    </div>
  );
};

export const MyInvoices = () => {
  const my = salesInvoices.filter(i => i.customerId === c.id);
  return (
    <div><PageHeader title="My Invoices" />
      <div className="p-6 lg:p-8 space-y-3">
        {my.map(i => (
          <Card key={i.id}><CardContent className="p-5 flex items-center justify-between gap-4">
            <div><div className="font-mono text-sm font-semibold">{i.id}</div><div className="text-xs text-muted-foreground mt-0.5">{i.date} · {i.items.length} items</div></div>
            <div className="flex items-center gap-3"><span className="tabular font-bold">{formatRs(i.total)}</span><StatusBadge variant={i.status === 'paid' ? 'success' : 'warning'}>{i.status}</StatusBadge>
            <Button size="sm" variant="outline"><Download className="h-4 w-4 mr-1" />PDF</Button></div>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
};

export const Reviews = () => (
  <div><PageHeader title="My Reviews" actions={<Button>Write a review</Button>} />
    <div className="p-6 lg:p-8 space-y-3">
      {[1,2].map(i => (
        <Card key={i}><CardContent className="p-5">
          <div className="flex items-center gap-1">{[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-warning text-warning" />)}</div>
          <div className="font-semibold mt-2">Excellent service</div>
          <div className="text-sm text-muted-foreground mt-1">Quick brake pad replacement, fair pricing, and the AI alerts caught an issue I didn't know about.</div>
          <div className="text-xs text-muted-foreground mt-3">2 weeks ago</div>
        </CardContent></Card>
      ))}
    </div>
  </div>
);
