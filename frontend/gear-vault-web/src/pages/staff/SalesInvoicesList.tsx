import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { salesInvoices } from '@/data/mock';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { formatRs } from '@/lib/format';
import { StatusBadge } from '@/components/shared/StatusBadge';

const SalesInvoicesList = () => (
  <div>
    <PageHeader title="Sales Invoices" actions={<Button asChild><Link to="/staff/invoices/new"><Plus className="h-4 w-4 mr-2" />New invoice</Link></Button>} />
    <div className="p-6 lg:p-8">
      <Card><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead className="bg-deep-navy text-white"><tr>{['Invoice','Customer','Date','Total','Status',''].map(h=><th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider">{h}</th>)}</tr></thead>
          <tbody>{salesInvoices.map((i, idx) => (
            <tr key={i.id} className={`border-b hover:bg-secondary/40 ${idx%2?'bg-canvas':''}`}>
              <td className="px-4 py-3 font-mono text-xs">{i.id}</td>
              <td className="px-4 py-3 font-medium">{i.customerName}</td>
              <td className="px-4 py-3 text-muted-foreground">{i.date}</td>
              <td className="px-4 py-3 tabular font-medium">{formatRs(i.total)}</td>
              <td className="px-4 py-3"><StatusBadge variant={i.status === 'paid' ? 'success' : i.status === 'overdue' ? 'danger' : 'warning'}>{i.status}</StatusBadge></td>
              <td className="px-4 py-3"><Button variant="ghost" size="sm" asChild><Link to={`/staff/invoices/${i.id}`}>View</Link></Button></td>
            </tr>))}</tbody>
        </table>
      </CardContent></Card>
    </div>
  </div>
);
export default SalesInvoicesList;
