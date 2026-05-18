import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { PartsService, PurchaseInvoicesService } from '@/api/generated/client';
import { formatRs } from '@/lib/format';

const Reports = () => {
  const { data: partsRes } = useQuery({ queryKey: ['parts'], queryFn: () => PartsService.getAllParts() });
  const { data: poRes } = useQuery({ queryKey: ['purchase-invoices'], queryFn: () => PurchaseInvoicesService.getAllPurchaseInvoices() });

  const parts = partsRes?.result ?? [];
  const invoices = poRes?.result ?? [];

  const totalStockValue = parts.reduce((s, p) => s + (p.sellingPrice ?? 0) * (p.stockQuantity ?? 0), 0);
  const totalPurchases = invoices.reduce((s, inv) => s + (inv.grandTotal ?? 0), 0);
  const totalParts = parts.length;
  const totalInvoices = invoices.length;

  return (
    <div>
      <PageHeader title="Financial Reports" />
      <div className="p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card>
            <CardContent className="p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Total stock value</div>
              <div className="text-2xl font-bold tabular">{formatRs(totalStockValue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Total purchases</div>
              <div className="text-2xl font-bold tabular">{formatRs(totalPurchases)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Parts in catalog</div>
              <div className="text-2xl font-bold tabular">{totalParts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Purchase invoices</div>
              <div className="text-2xl font-bold tabular">{totalInvoices}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Parts by category</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-deep-navy text-white">
                <tr>{['Category', 'Items', 'Total stock value'].map(h => <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider">{h}</th>)}</tr>
              </thead>
              <tbody>
                {Object.entries(
                  parts.reduce<Record<string, { count: number; value: number }>>((acc, p) => {
                    const cat = p.category || 'Uncategorized';
                    if (!acc[cat]) acc[cat] = { count: 0, value: 0 };
                    acc[cat].count++;
                    acc[cat].value += (p.sellingPrice ?? 0) * (p.stockQuantity ?? 0);
                    return acc;
                  }, {})
                )
                  .sort((a, b) => b[1].value - a[1].value)
                  .map(([cat, data], i) => (
                    <tr key={cat} className={`border-b ${i % 2 ? 'bg-canvas' : ''}`}>
                      <td className="px-4 py-3 font-medium">{cat}</td>
                      <td className="px-4 py-3 tabular">{data.count}</td>
                      <td className="px-4 py-3 tabular font-medium">{formatRs(data.value)}</td>
                    </tr>
                  ))}
                {parts.length === 0 && <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">No data available.</td></tr>}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Recent purchase invoices</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-deep-navy text-white">
                <tr>{['Invoice #', 'Vendor', 'Date', 'Total', 'Status'].map(h => <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider">{h}</th>)}</tr>
              </thead>
              <tbody>
                {invoices.slice(0, 10).map((inv, i) => (
                  <tr key={inv.id} className={`border-b ${i % 2 ? 'bg-canvas' : ''}`}>
                    <td className="px-4 py-3 font-mono text-xs">{inv.invoiceNo}</td>
                    <td className="px-4 py-3 font-medium">{inv.vendor?.name ?? '-'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-3 tabular font-medium">{formatRs(inv.grandTotal ?? 0)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{inv.status ?? '-'}</td>
                  </tr>
                ))}
                {invoices.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No invoices yet.</td></tr>}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Reports;
