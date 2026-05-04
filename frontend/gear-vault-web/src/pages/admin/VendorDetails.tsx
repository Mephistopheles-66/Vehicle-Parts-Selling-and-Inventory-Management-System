import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, Link } from 'react-router-dom';
import { vendors, purchaseInvoices } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRs } from '@/lib/format';

const VendorDetails = () => {
  const { id } = useParams();
  const v = vendors.find(x => x.id === id) ?? vendors[0];
  const orders = purchaseInvoices.filter(p => p.vendorId === v.id);
  return (
    <div>
      <PageHeader title={v.name} description={v.address}
        actions={<Button asChild><Link to={`/admin/vendors/${v.id}/edit`}><Edit className="h-4 w-4 mr-2" />Edit</Link></Button>} />
      <div className="p-6 lg:p-8 grid lg:grid-cols-3 gap-5">
        <Card>
          <CardHeader><CardTitle className="text-base">Profile</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div><div className="text-muted-foreground text-xs">Contact</div><div className="font-medium">{v.contact}</div></div>
            <div><div className="text-muted-foreground text-xs">Email</div><div>{v.email}</div></div>
            <div><div className="text-muted-foreground text-xs">Phone</div><div className="font-mono">{v.phone}</div></div>
            <div><div className="text-muted-foreground text-xs">Total purchases</div><div className="tabular font-bold text-base">{formatRs(v.totalPurchases)}</div></div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Purchase history</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-canvas border-y"><tr>{['PO #','Date','Items','Total','Status'].map(h => <th key={h} className="text-left px-4 py-2.5 text-xs uppercase tracking-wider text-muted-foreground">{h}</th>)}</tr></thead>
              <tbody>{orders.map(o => (
                <tr key={o.id} className="border-b">
                  <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                  <td className="px-4 py-3">{o.date}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.items.length}</td>
                  <td className="px-4 py-3 tabular font-medium">{formatRs(o.total)}</td>
                  <td className="px-4 py-3"><StatusBadge variant={o.status === 'paid' ? 'success' : 'warning'}>{o.status}</StatusBadge></td>
                </tr>))}</tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default VendorDetails;
