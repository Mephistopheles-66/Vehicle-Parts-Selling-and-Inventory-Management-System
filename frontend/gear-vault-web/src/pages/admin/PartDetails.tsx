import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, Link } from 'react-router-dom';
import { parts, vendors } from '@/data/mock';
import { Package, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRs } from '@/lib/format';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const stockHistory = Array.from({ length: 8 }).map((_, i) => ({ week: `W${i+1}`, stock: 60 - i*5 + Math.round(Math.random()*4) }));

const PartDetails = () => {
  const { id } = useParams();
  const part = parts.find(p => p.id === id) ?? parts[0];
  const vendor = vendors.find(v => v.id === part.vendorId);
  return (
    <div>
      <PageHeader title={part.name} description={`SKU ${part.sku}`}
        actions={<Button asChild><Link to={`/admin/parts/${part.id}/edit`}><Edit className="h-4 w-4 mr-2" />Edit</Link></Button>} />
      <div className="p-6 lg:p-8 grid lg:grid-cols-3 gap-5">
        <Card>
          <CardContent className="p-6">
            <div className="aspect-square rounded-lg bg-secondary flex items-center justify-center"><Package className="h-16 w-16 text-muted-foreground" /></div>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Category</span><StatusBadge variant="neutral">{part.category}</StatusBadge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Vendor</span><span className="font-medium">{vendor?.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Stock</span><span className="tabular font-medium">{part.stock}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Cost</span><span className="tabular">{formatRs(part.cost)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Price</span><span className="tabular font-bold">{formatRs(part.price)}</span></div>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Stock history</CardTitle></CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer>
              <LineChart data={stockHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0D1B2A', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                <Line type="monotone" dataKey="stock" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default PartDetails;
