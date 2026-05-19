import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRs } from '@/lib/format';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PurchaseInvoicesService } from '@/api/generated/client';
import { getApiErrorMessage } from '@/api/client';
import { toast } from 'sonner';

const statusVariant = (s?: string | null) => {
  const lower = s?.toLowerCase();
  if (lower === 'posted') return 'success' as const;
  if (lower === 'cancelled') return 'danger' as const;
  return 'warning' as const;
};

const PurchaseInvoicesList = () => {
  const queryClient = useQueryClient();
  const { data: res, isLoading, error } = useQuery({
    queryKey: ['purchase-invoices'],
    queryFn: () => PurchaseInvoicesService.getAllPurchaseInvoices(),
  });
  const invoices = res?.result ?? [];

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

  const busy = postMutation.isPending || cancelMutation.isPending;

  return (
    <div>
      <PageHeader title="Purchase Invoices" actions={<Button asChild><Link to="/admin/purchase-invoices/new"><Plus className="h-4 w-4 mr-2" />New PO</Link></Button>} />
      <div className="p-6 lg:p-8">
        <Card><CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-deep-navy text-white">
              <tr>
                {['Invoice #', 'Vendor', 'Date', 'Due Date', 'Items', 'Grand Total', 'Balance Due', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>}
              {error && <tr><td colSpan={9} className="px-4 py-8 text-center text-destructive">{getApiErrorMessage(error, 'Unable to load invoices')}</td></tr>}
              {!isLoading && !error && invoices.length === 0 && <tr><td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">No purchase invoices yet.</td></tr>}
              {invoices.map((p, i) => {
                const isDraft = p.status?.toLowerCase() === 'draft';
                return (
                  <tr key={p.id} className={`border-b hover:bg-secondary/40 ${i % 2 ? 'bg-canvas' : ''}`}>
                    <td className="px-4 py-3 font-mono text-xs">{p.invoiceNo}</td>
                    <td className="px-4 py-3 font-medium">{p.vendor?.name ?? '-'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.invoiceDate ? new Date(p.invoiceDate).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.dueDate ? new Date(p.dueDate).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-3 tabular">{p.lineItems?.length ?? 0}</td>
                    <td className="px-4 py-3 tabular font-medium">{formatRs(p.grandTotal ?? 0)}</td>
                    <td className="px-4 py-3 tabular font-medium">{formatRs(p.balanceDue ?? 0)}</td>
                    <td className="px-4 py-3"><StatusBadge variant={statusVariant(p.status)}>{p.status ?? 'Draft'}</StatusBadge></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" asChild><Link to={`/admin/purchase-invoices/${p.id}`}>View</Link></Button>
                        {isDraft && (
                          <>
                            <Button variant="ghost" size="sm" disabled={busy} onClick={() => p.id && postMutation.mutate(p.id)}>
                              {postMutation.isPending && postMutation.variables === p.id
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : <CheckCircle className="h-3.5 w-3.5 text-green-600" />}
                            </Button>
                            <Button variant="ghost" size="sm" disabled={busy} onClick={() => p.id && cancelMutation.mutate(p.id)}>
                              {cancelMutation.isPending && cancelMutation.variables === p.id
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : <XCircle className="h-3.5 w-3.5 text-destructive" />}
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
