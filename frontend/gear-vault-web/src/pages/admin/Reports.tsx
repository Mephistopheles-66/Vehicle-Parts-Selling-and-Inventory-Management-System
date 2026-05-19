import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { PartsService, PurchaseInvoicesService, SalesInvoiceService } from '@/api/generated/client';
import { formatRs } from '@/lib/format';

type Period = 'daily' | 'monthly' | 'yearly' | 'all';

function getDateRange(period: Period): Date | null {
  if (period === 'all') return null;
  const now = new Date();
  switch (period) {
    case 'daily':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case 'monthly':
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case 'yearly':
      return new Date(now.getFullYear(), 0, 1);
  }
}

const periodLabels: Record<Period, string> = {
  daily: 'Today',
  monthly: 'This Month',
  yearly: 'This Year',
  all: 'All Time',
};

const Reports = () => {
  const [period, setPeriod] = useState<Period>('all');

  const { data: partsRes } = useQuery({ queryKey: ['parts'], queryFn: () => PartsService.getAllParts() });
  const { data: poRes } = useQuery({ queryKey: ['purchase-invoices'], queryFn: () => PurchaseInvoicesService.getAllPurchaseInvoices() });
  const { data: salesRes } = useQuery({ queryKey: ['sales-invoices'], queryFn: () => SalesInvoiceService.getAllInvoices({}) });

  const parts = partsRes?.result ?? [];
  const allInvoices = poRes?.result ?? [];
  const allSales = salesRes?.result ?? [];

  const rangeStart = getDateRange(period);

  const invoices = useMemo(() => {
    if (!rangeStart) return allInvoices;
    return allInvoices.filter(inv => {
      if (!inv.invoiceDate) return false;
      return new Date(inv.invoiceDate) >= rangeStart;
    });
  }, [allInvoices, rangeStart]);

  const sales = useMemo(() => {
    if (!rangeStart) return allSales;
    return allSales.filter(s => {
      if (!s.createdAt) return false;
      return new Date(s.createdAt) >= rangeStart;
    });
  }, [allSales, rangeStart]);

  const totalStockValue = parts.reduce((s, p) => s + (p.sellingPrice ?? 0) * (p.stockQuantity ?? 0), 0);
  const totalPurchases = invoices.reduce((s, inv) => s + (inv.grandTotal ?? 0), 0);
  const totalSales = sales.reduce((s, inv) => s + (inv.totalAmount ?? 0), 0);
  const totalParts = parts.length;
  const totalPurchaseInvoices = invoices.length;
  const totalSalesInvoices = sales.length;

  return (
    <div>
      <PageHeader title="Financial Reports" />
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-muted-foreground">{periodLabels[period]} Report</h2>
          <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Card>
            <CardContent className="p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Total stock value</div>
              <div className="text-2xl font-bold tabular">{formatRs(totalStockValue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Total purchases ({totalPurchaseInvoices})</div>
              <div className="text-2xl font-bold tabular">{formatRs(totalPurchases)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Total sales ({totalSalesInvoices})</div>
              <div className="text-2xl font-bold tabular">{formatRs(totalSales)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Card>
            <CardContent className="p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Net profit / loss</div>
              <div className={`text-2xl font-bold tabular ${totalSales - totalPurchases >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatRs(totalSales - totalPurchases)}
              </div>
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
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Total invoices</div>
              <div className="text-2xl font-bold tabular">{totalPurchaseInvoices + totalSalesInvoices}</div>
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
          <CardHeader><CardTitle className="text-base">Purchase invoices</CardTitle></CardHeader>
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
                {invoices.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No purchase invoices for this period.</td></tr>}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Sales invoices</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-deep-navy text-white">
                <tr>{['Invoice #', 'Customer', 'Date', 'Total', 'Payment'].map(h => <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider">{h}</th>)}</tr>
              </thead>
              <tbody>
                {sales.slice(0, 10).map((inv, i) => (
                  <tr key={inv.id} className={`border-b ${i % 2 ? 'bg-canvas' : ''}`}>
                    <td className="px-4 py-3 font-mono text-xs">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3 font-medium">{inv.customer?.fullName ?? '-'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-3 tabular font-medium">{formatRs(inv.totalAmount ?? 0)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{inv.paymentStatus ?? '-'}</td>
                  </tr>
                ))}
                {sales.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No sales invoices for this period.</td></tr>}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Reports;
