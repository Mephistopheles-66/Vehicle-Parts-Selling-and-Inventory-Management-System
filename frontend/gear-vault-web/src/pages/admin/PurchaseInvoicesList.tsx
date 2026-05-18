import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRs } from '@/lib/format';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PurchaseInvoicesService } from '@/api/generated/client';
import { getApiErrorMessage, unwrapApiResult } from '@/api/client';
import { toast } from 'sonner';

const statusVariant = (status?: string | null) => {
  const s = (status ?? '').toLowerCase();
  if (s === 'posted') return 'success';
  if (s === 'cancelled') return 'danger';
  return 'warning';
};

const PurchaseInvoicesList = () => {
  const [q, setQ] = useState('');
  const queryClient = useQueryClient();

  const { data: invoices = [], isLoading, error } = useQuery({
    queryKey: ['purchase-invoices'],
    queryFn: async () => unwrapApiResult(await PurchaseInvoicesService.getAllPurchaseInvoices(), []),
  });

  const postMutation = useMutation({
    mutationFn: (invoiceId: string) => PurchaseInvoicesService.postPurchaseInvoice({ invoiceId }),
    onSuccess: () => {
      toast.success('Invoice posted — stock updated');
      queryClient.invalidateQueries({ queryKey: ['purchase-invoices'] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Unable to post invoice')),
  });

  const cancelMutation = useMutation({
    mutationFn: (invoiceId: string) => PurchaseInvoicesService.cancelPurchaseInvoice({ invoiceId }),
    onSuccess: () => {
      toast.success('Invoice cancelled');
      queryClient.invalidateQueries({ queryKey: ['purchase-invoices'] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Unable to cancel invoice')),
  });

  const filtered = invoices.filter(p => {
    const needle = q.toLowerCase();
    return (p.invoiceNo ?? '').toLowerCase().includes(needle)
      || (p.vendor?.name ?? '').toLowerCase().includes(needle);
  });

  return (
    <div>
      <PageHeader title="Purchase Invoices" description="Stock purchase orders and invoices."
        actions={<Button asChild><Link to="/admin/purchase-invoices/new"><Plus className="h-4 w-4 mr-2" />New PO</Link></Button>} />
      <div className="p-6 lg:p-8 space-y-5">
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by invoice no. or vendor..." className="pl-9" />
            </div>
          </CardContent>
        </Card>

        <Card><CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-deep-navy text-white">
              <tr>{['Invoice #', 'Vendor', 'Date', 'Items', 'Total', 'Status', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {isLoading && <tr><td className="px-4 py-8 text-center text-muted-foreground" colSpan={7}>Loading invoices...</td></tr>}
              {error && <tr><td className="px-4 py-8 text-center text-destructive" colSpan={7}>{getApiErrorMessage(error, 'Unable to load invoices')}</td></tr>}
              {!isLoading && !error && filtered.length === 0 && <tr><td className="px-4 py-8 text-center text-muted-foreground" colSpan={7}>No purchase invoices found.</td></tr>}
              {filtered.map((p, i) => {
                const isDraft = (p.status ?? '').toLowerCase() === 'draft';
                return (
                  <tr key={p.id} className={`border-b hover:bg-secondary/40 ${i % 2 ? 'bg-canvas' : ''}`}>
                    <td className="px-4 py-3 font-mono text-xs">{p.invoiceNo ?? '-'}</td>
                    <td className="px-4 py-3 font-medium">{p.vendor?.name ?? '-'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.invoiceDate ? new Date(p.invoiceDate).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-3 tabular">{p.lineItems?.length ?? 0}</td>
                    <td className="px-4 py-3 tabular font-medium">{formatRs(p.grandTotal ?? 0)}</td>
                    <td className="px-4 py-3"><StatusBadge variant={statusVariant(p.status)}>{p.status ?? 'Draft'}</StatusBadge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" asChild><Link to={`/admin/purchase-invoices/${p.id}`}>View</Link></Button>
                        {isDraft && (
                          <>
                            <Button variant="ghost" size="sm" disabled={!p.id || postMutation.isPending} onClick={() => p.id && postMutation.mutate(p.id)}>
                              <CheckCircle className="h-4 w-4 mr-1 text-success" />Post
                            </Button>
                            <Button variant="ghost" size="sm" disabled={!p.id || cancelMutation.isPending} onClick={() => p.id && cancelMutation.mutate(p.id)}>
                              <XCircle className="h-4 w-4 mr-1 text-destructive" />Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent></Card>
      </div>
    </div>
  );
};
export default PurchaseInvoicesList;
