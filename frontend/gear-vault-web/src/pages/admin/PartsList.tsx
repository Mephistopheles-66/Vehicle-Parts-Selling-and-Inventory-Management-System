import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { parts, vendors } from '@/data/mock';
import { formatRs } from '@/lib/format';
import { Plus, Search, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const PartsList = () => {
  const [q, setQ] = useState('');
  const filtered = parts.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase()));
  const vMap = Object.fromEntries(vendors.map(v => [v.id, v.name]));

  return (
    <div>
      <PageHeader title="Parts" description="Every component, locked and tracked."
        actions={<Button asChild><Link to="/admin/parts/new"><Plus className="h-4 w-4 mr-2" />Add part</Link></Button>} />
      <div className="p-6 lg:p-8 space-y-5">
        <Card>
          <CardContent className="p-4 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or SKU…" className="pl-9" />
            </div>
            <Button variant="outline" size="sm">Category</Button>
            <Button variant="outline" size="sm">Vendor</Button>
            <Button variant="outline" size="sm">Stock</Button>
          </CardContent>
        </Card>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-deep-navy text-white sticky top-0">
                <tr className="text-left">
                  {['Part','SKU','Category','Stock','Price','Vendor','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 font-medium text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} className={`border-b hover:bg-secondary/40 transition-colors ${i % 2 ? 'bg-canvas' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-md bg-secondary flex items-center justify-center"><Package className="h-4 w-4 text-muted-foreground" /></div>
                        <Link to={`/admin/parts/${p.id}`} className="font-medium text-charcoal hover:text-primary">{p.name}</Link>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.sku}</td>
                    <td className="px-4 py-3"><StatusBadge variant="neutral">{p.category}</StatusBadge></td>
                    <td className="px-4 py-3 tabular">
                      {p.stock < 10
                        ? <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-destructive pulse-dot" /><span className="text-destructive font-medium">{p.stock}</span></span>
                        : <span className="text-charcoal">{p.stock}</span>}
                    </td>
                    <td className="px-4 py-3 tabular font-medium">{formatRs(p.price)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{vMap[p.vendorId]}</td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" asChild><Link to={`/admin/parts/${p.id}`}>View</Link></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PartsList;
