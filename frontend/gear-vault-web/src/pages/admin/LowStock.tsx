import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { parts } from '@/data/mock';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const LowStock = () => {
  const low = parts.filter(p => p.stock < 15).sort((a,b) => a.stock - b.stock);
  return (
    <div>
      <PageHeader title="Low Stock Alerts" description="Replenish before customers feel it." />
      <div className="p-6 lg:p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {low.map(p => (
          <Card key={p.id} className="border-destructive/30">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-destructive/10 text-destructive flex items-center justify-center"><AlertTriangle className="h-5 w-5" /></div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-charcoal truncate">{p.name}</div>
                  <div className="text-xs font-mono text-muted-foreground">{p.sku}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold tabular text-destructive">{p.stock}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">in stock</div>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full mt-4"><Link to="/admin/purchase-invoices/new">Reorder</Link></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default LowStock;
