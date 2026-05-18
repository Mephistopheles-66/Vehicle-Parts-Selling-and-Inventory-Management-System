import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { purchaseInvoices } from '@/data/mock';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRs } from '@/lib/format';

const PurchaseInvoicesList = () => (
  <div>
    <PageHeader title="Purchase Invoices" actions={<Button asChild><Link to="/admin/purchase-invoices/new"><Plus className="h-4 w-4 mr-2" />New PO</Link></Button>} />
    <div className="p-6 lg:p-8">
      <Card><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead className="bg-deep-navy text-white"><tr>{['PO #','Vendor','Date','Items','Total','Status',''].map(h => <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider">{h}</th>)}</tr></thead>
          <tbody>{purchaseInvoices.map((p, i) => (
            <tr key={p.id} className={`border-b hover:bg-secondary/40 ${i%2?'bg-canvas':''}`}>
              <td className="px-4 py-3 font-mono text-xs">{p.id}</td>
              <td className="px-4 py-3 font-medium">{p.vendorName}</td>
              <td className="px-4 py-3 text-muted-foreground">{p.date}</td>
              <td className="px-4 py-3 tabular">{p.items.length}</td>
              <td className="px-4 py-3 tabular font-medium">{formatRs(p.total)}</td>
              <td className="px-4 py-3"><StatusBadge variant={p.status === 'paid' ? 'success' : 'warning'}>{p.status}</StatusBadge></td>
              <td className="px-4 py-3"><Button variant="ghost" size="sm" asChild><Link to={`/admin/purchase-invoices/${p.id}`}>View</Link></Button></td>
            </tr>))}</tbody>
        </table>
      </CardContent></Card>
    </div>
  </div>
);
export default PurchaseInvoicesList;
