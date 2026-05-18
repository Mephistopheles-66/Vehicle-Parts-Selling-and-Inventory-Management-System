import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useMemo, useState, useEffect } from 'react';
import { Trash2, Plus, Loader2 } from 'lucide-react';
import { formatRs } from '@/lib/format';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PurchaseInvoicesService, PartsService, VendorsService } from '@/api/generated/client';
import { getApiErrorMessage, unwrapApiResult } from '@/api/client';

interface Row { partId: string; qty: number; price: number; }

const PurchaseInvoiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isViewing = Boolean(id);

  const [vendorId, setVendorId] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState('');
  const [discount, setDiscount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [rows, setRows] = useState<Row[]>([{ partId: '', qty: 1, price: 0 }]);

  const { data: vendors = [] } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => unwrapApiResult(await VendorsService.getAllVendors(), []),
  });

  const { data: parts = [] } = useQuery({
    queryKey: ['parts'],
    queryFn: async () => unwrapApiResult(await PartsService.getAllParts(), []),
  });

  const { data: invoice, isLoading: invoiceLoading } = useQuery({
    queryKey: ['purchase-invoices', id],
    queryFn: async () => unwrapApiResult(await PurchaseInvoicesService.getPurchaseInvoiceById({ invoiceId: id! }), null),
    enabled: isViewing,
  });

  useEffect(() => {
    if (!invoice) return;
    setVendorId(invoice.vendor?.id ?? '');
    setInvoiceNo(invoice.invoiceNo ?? '');
    setInvoiceDate(invoice.invoiceDate ? invoice.invoiceDate.slice(0, 10) : '');
    setDueDate(invoice.dueDate ? invoice.dueDate.slice(0, 10) : '');
    setDiscount(invoice.discount ?? 0);
    setTaxAmount(invoice.taxAmount ?? 0);
    setAmountPaid(invoice.amountPaid ?? 0);
    setRows(
      (invoice.lineItems ?? []).map(li => ({
        partId: li.part?.id ?? '',
        qty: li.quantity ?? 0,
        price: li.unitPrice ?? 0,
      }))
    );
  }, [invoice]);

  const subtotal = useMemo(() => rows.reduce((s, r) => s + r.qty * r.price, 0), [rows]);
  const grandTotal = subtotal - discount + taxAmount;
  const update = (i: number, patch: Partial<Row>) => setRows(rows.map((r, idx) => idx === i ? { ...r, ...patch } : r));

  const saveMutation = useMutation({
    mutationFn: () => PurchaseInvoicesService.createPurchaseInvoice({
      requestBody: {
        vendorId,
        invoiceNo: invoiceNo.trim() || undefined,
        invoiceDate,
        dueDate: dueDate || undefined,
        discount,
        taxAmount,
        amountPaid,
        lineItems: rows.filter(r => r.partId).map(r => ({
          partId: r.partId,
          quantity: r.qty,
          unitPrice: r.price,
        })),
      },
    }),
    onSuccess: () => {
      toast.success('Purchase invoice created');
      queryClient.invalidateQueries({ queryKey: ['purchase-invoices'] });
      navigate('/admin/purchase-invoices');
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Unable to create invoice')),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId) { toast.error('Please select a vendor'); return; }
    if (rows.every(r => !r.partId)) { toast.error('Add at least one line item'); return; }
    saveMutation.mutate();
  };

  const isReadonly = isViewing && invoice;
  const statusLabel = invoice?.status ?? 'Draft';

  return (
    <div>
      <PageHeader
        title={isViewing ? `Invoice ${invoice?.invoiceNo ?? ''}` : 'New Purchase Invoice'}
        description={isViewing ? `Status: ${statusLabel}` : 'Create a new stock purchase order.'}
      />
      <form onSubmit={submit} className="p-6 lg:p-8 space-y-5">
        {invoiceLoading && <div className="text-sm text-muted-foreground">Loading invoice...</div>}

        <div className="grid lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Invoice details</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Vendor</Label>
                <Select value={vendorId} onValueChange={setVendorId} disabled={!!isReadonly}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select vendor" /></SelectTrigger>
                  <SelectContent>{vendors.map(v => <SelectItem key={v.id} value={v.id ?? ''}>{v.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Invoice No.</Label><Input className="mt-1.5 font-mono" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} disabled={!!isReadonly} /></div>
              <div><Label>Invoice Date</Label><Input className="mt-1.5" type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} disabled={!!isReadonly} required /></div>
              <div><Label>Due Date</Label><Input className="mt-1.5" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} disabled={!!isReadonly} /></div>
            </CardContent>
          </Card>

          <div className="space-y-5">
            <Card>
              <CardHeader><CardTitle className="text-base">Summary</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="tabular font-medium">{formatRs(subtotal)}</span></div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground">Discount</span>
                  {isReadonly
                    ? <span className="tabular">{formatRs(discount)}</span>
                    : <Input type="number" min="0" step="0.01" className="w-28 font-mono text-right" value={discount} onChange={e => setDiscount(+e.target.value)} />}
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground">Tax</span>
                  {isReadonly
                    ? <span className="tabular">{formatRs(taxAmount)}</span>
                    : <Input type="number" min="0" step="0.01" className="w-28 font-mono text-right" value={taxAmount} onChange={e => setTaxAmount(+e.target.value)} />}
                </div>
                <div className="border-t pt-3 flex justify-between"><span className="font-medium">Grand Total</span><span className="tabular font-bold text-base">{formatRs(grandTotal)}</span></div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground">Amount Paid</span>
                  {isReadonly
                    ? <span className="tabular">{formatRs(amountPaid)}</span>
                    : <Input type="number" min="0" step="0.01" className="w-28 font-mono text-right" value={amountPaid} onChange={e => setAmountPaid(+e.target.value)} />}
                </div>
                <div className="flex justify-between"><span className="text-muted-foreground">Balance Due</span><span className="tabular font-medium">{formatRs(grandTotal - amountPaid)}</span></div>
                {isViewing && <div className="flex justify-between"><span className="text-muted-foreground">Status</span><StatusBadge variant={statusLabel.toLowerCase() === 'posted' ? 'success' : statusLabel.toLowerCase() === 'cancelled' ? 'danger' : 'warning'}>{statusLabel}</StatusBadge></div>}
              </CardContent>
            </Card>
            {!isReadonly && (
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={saveMutation.isPending}>
                  {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save invoice
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              </div>
            )}
          </div>
        </div>

        <Card>
          <CardHeader className="flex-row justify-between items-center">
            <CardTitle className="text-base">Line items</CardTitle>
            {!isReadonly && (
              <Button size="sm" variant="outline" type="button" onClick={() => setRows([...rows, { partId: '', qty: 1, price: 0 }])}>
                <Plus className="h-4 w-4 mr-1" />Add row
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-canvas border-y">
                <tr>{['Part', 'Qty', 'Unit Price', 'Subtotal', ...(isReadonly ? [] : [''])].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-2">
                      {isReadonly
                        ? <span className="font-medium">{parts.find(p => p.id === r.partId)?.name ?? invoice?.lineItems?.[i]?.part?.name ?? '-'}</span>
                        : (
                          <Select value={r.partId} onValueChange={v => update(i, { partId: v })}>
                            <SelectTrigger className="w-[280px]"><SelectValue placeholder="Select part" /></SelectTrigger>
                            <SelectContent>{parts.map(p => <SelectItem key={p.id} value={p.id ?? ''}>{p.name}</SelectItem>)}</SelectContent>
                          </Select>
                        )}
                    </td>
                    <td className="px-4 py-2">
                      {isReadonly
                        ? <span className="tabular">{r.qty}</span>
                        : <Input type="number" min="1" className="w-20 font-mono" value={r.qty} onChange={e => update(i, { qty: +e.target.value })} />}
                    </td>
                    <td className="px-4 py-2">
                      {isReadonly
                        ? <span className="tabular">{formatRs(r.price)}</span>
                        : <Input type="number" min="0" step="0.01" className="w-28 font-mono" value={r.price} onChange={e => update(i, { price: +e.target.value })} />}
                    </td>
                    <td className="px-4 py-2 tabular font-medium">{formatRs(r.qty * r.price)}</td>
                    {!isReadonly && (
                      <td className="px-4 py-2">
                        <Button variant="ghost" size="icon" type="button" onClick={() => setRows(rows.filter((_, idx) => idx !== i))} disabled={rows.length <= 1}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-canvas">
                  <td colSpan={3} className="px-4 py-3 text-right font-medium">Total</td>
                  <td className="px-4 py-3 tabular font-bold text-base">{formatRs(subtotal)}</td>
                  {!isReadonly && <td />}
                </tr>
              </tfoot>
            </table>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
export default PurchaseInvoiceForm;
