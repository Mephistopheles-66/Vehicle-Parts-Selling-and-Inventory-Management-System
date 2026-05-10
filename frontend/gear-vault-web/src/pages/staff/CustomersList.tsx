import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { customers } from '@/data/mock';
import { useState } from 'react';
import { formatRs } from '@/lib/format';
import { StatusBadge } from '@/components/shared/StatusBadge';

const CustomersList = () => {
  const [q, setQ] = useState('');
  const [chip, setChip] = useState<'all' | 'pending' | 'loyal'>('all');
  let list = customers.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase()) ||
    c.phone.includes(q) || c.id.includes(q) ||
    c.vehicles.some(v => v.plate.toLowerCase().includes(q.toLowerCase()))
  );
  if (chip === 'pending') list = list.filter(c => c.pendingCredit > 0);
  if (chip === 'loyal') list = list.filter(c => c.totalSpent > 100000);

  return (
    <div>
      <PageHeader title="Customers" description="Search by name, phone, ID, or vehicle plate."
        actions={<Button asChild><Link to="/staff/customers/new"><Plus className="h-4 w-4 mr-2" />Register customer</Link></Button>} />
      <div className="p-6 lg:p-8 space-y-5">
        <Card><CardContent className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search customers, phone, plate…" className="pl-9 h-11" />
          </div>
          <div className="flex gap-2">
            {(['all','pending','loyal'] as const).map(c => (
              <button key={c} onClick={() => setChip(c)} className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${chip === c ? 'bg-primary text-primary-foreground' : 'bg-secondary text-charcoal hover:bg-secondary/70'}`}>
                {c === 'all' ? 'All' : c === 'pending' ? 'Pending credit' : 'High spenders'}
              </button>
            ))}
          </div>
        </CardContent></Card>

        <Card><CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-deep-navy text-white"><tr>{['Customer','Phone','Vehicles','Total spent','Credit',''].map(h=><th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody>{list.map((c, i) => (
              <tr key={c.id} className={`border-b hover:bg-secondary/40 ${i%2?'bg-canvas':''}`}>
                <td className="px-4 py-3"><Link to={`/staff/customers/${c.id}`} className="font-medium text-charcoal hover:text-primary">{c.name}</Link></td>
                <td className="px-4 py-3 font-mono text-xs">{c.phone}</td>
                <td className="px-4 py-3"><StatusBadge variant="info">{c.vehicles.length}</StatusBadge></td>
                <td className="px-4 py-3 tabular font-medium">{formatRs(c.totalSpent)}</td>
                <td className="px-4 py-3 tabular">{c.pendingCredit > 0 ? <span className="text-destructive font-medium">{formatRs(c.pendingCredit)}</span> : <span className="text-muted-foreground">—</span>}</td>
                <td className="px-4 py-3"><Button variant="ghost" size="sm" asChild><Link to={`/staff/customers/${c.id}`}>View</Link></Button></td>
              </tr>
            ))}</tbody>
          </table>
        </CardContent></Card>
      </div>
    </div>
  );
};
export default CustomersList;
