import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useMemo, useState } from 'react';
import { Trash2, Plus, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { formatRs } from '@/lib/format';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { VendorsService, PartsService, PurchaseInvoicesService } from '@/api/generated/client';
import { getApiErrorMessage } from '@/api/client';

interface Row { partId: string; qty: number; price: number; }

const statusVariant = (s?: string | null) => {
  const lower = s?.toLowerCase();
  if (lower === 'posted') return 'success' as const;
  if (lower === 'cancelled') return 'danger' as const;
  return 'warning' as const;
};

const PurchaseInvoiceForm = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const queryClient = useQueryClient();

  const { data: vendorsRes } = useQuery({ queryKey: ['vendors'], queryFn: () => VendorsService.getAllVendors() });
  const { data: partsRes } = useQuery({ queryKey: ['parts'], queryFn: () => PartsService.getAllParts() });
  const { data: invoiceRes, isLoading: invoiceLoading } = useQuery({
    queryKey: ['purchase-invoice', id],
    queryFn: () => PurchaseInvoicesService.getPurchaseInvoiceById({ invoiceId: id! }),
    enabled: !!id,
  });

  const vendors = vendorsRes?.result ?? [];
  const parts = partsRes?.result ?? [];
  const existing = invoiceRes?.result;

  const [vendorId, setVendorId] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState('');
  const [discount, setDiscount] = useState('0');
  const [taxAmount, setTaxAmount] = useState('0');
  const [amountPaid, setAmountPaid] = useState('0');
  const [rows, setRows] = useState<Row[]>([{ partId: '', qty: 1, price: 0 }]);
  const [initialized, setInitialized] = useState(false);

  if (existing && !initialized) {
    setVendorId(existing.vendor?.id ?? '');
    setInvoiceNo(existing.invoiceNo ?? '');
    setInvoiceDate(existing.invoiceDate ? existing.invoiceDate.slice(0, 10) : invoiceDate);
    setDueDate(existing.dueDate ? existing.dueDate.slice(0, 10) : '');
    setDiscount(String(existing.discount ?? 0));
    setTaxAmount(String(existing.taxAmount ?? 0));
    setAmountPaid(String(existing.amountPaid ?? 0));
    setRows(
      existing.lineItems?.map(li => ({
        partId: li.part?.id ?? '',
        qty: li.quantity ?? 1,
        price: li.unitPrice ?? 0,
      })) ?? [{ partId: '', qty: 1, price: 0 }]
    );
    setInitialized(true);
  }

  const subtotal = useMemo(() => rows.reduce((s, r) => s + r.qty * r.price, 0), [rows]);
  const grandTotal = useMemo(() => subtotal - Number(discount) + Number(taxAmount), [subtotal, discount, taxAmount]);
  const balanceDue = useMemo(() => grandTotal - Number(amountPaid), [grandTotal, amountPaid]);
  const update = (i: number, patch: Partial<Row>) => {
    // Auto-fill unit price from part's selling price when selecting a part
    if (patch.partId) {
      const selected = parts.find(p => p.id === patch.partId);
      if (selected?.sellingPrice && !rows[i].price) {
        patch = { ...patch, price: selected.sellingPrice };
      }
    }
    setRows(rows.map((r, idx) => idx === i ? { ...r, ...patch } : r));
  };

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['purchase-invoices'] });
    if (id) queryClient.invalidateQueries({ queryKey: ['purchase-invoice', id] });
  };

  const createMutation = useMutation({
    mutationFn: () => PurchaseInvoicesService.createPurchaseInvoice({
      requestBody: {
        vendorId,
        invoiceNo,
        invoiceDate,
        dueDate: dueDate || null,
        lineItems: rows.filter(r => r.partId).map(r => ({ partId: r.partId, quantity: r.qty, unitPrice: r.price })),
        discount: Number(discount),
        taxAmount: Number(taxAmount),
        amountPaid: Number(amountPaid),
      },
    }),
    onSuccess: () => {
      toast.success('Purchase invoice created');
      invalidateAll();
      nav('/admin/purchase-invoices');
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Unable to create invoice')),
  });

  const postMutation = useMutation({
    mutationFn: () => PurchaseInvoicesService.postPurchaseInvoice({ invoiceId: id! }),
    onSuccess: () => {
      toast.success('Invoice posted — stock updated');
      invalidateAll();
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Unable to post invoice')),
  });

  const cancelMutation = useMutation({
    mutationFn: () => PurchaseInvoicesService.cancelPurchaseInvoice({ invoiceId: id! }),
    onSuccess: () => {
      toast.success('Invoice cancelled');
      invalidateAll();
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Unable to cancel invoice')),
  });

  const isView = !!id;
  const isDraft = existing?.status?.toLowerCase() === 'draft';

  return (
    <div>
      <PageHeader
        title={isView ? `Purchase Invoice — ${existing?.invoiceNo ?? ''}` : 'New Purchase Invoice'}
        actions={
          <div className="flex gap-2">
            {!isView && (
              <Button onClick={() => createMutation.mutate()} disabled={!vendorId || rows.every(r => !r.partId) || createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save
              </Button>
            )}
            {isView && isDraft && (
              <>
                <Button onClick={() => postMutation.mutate()} disabled={postMutation.isPending || cancelMutation.isPending}>
                  {postMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                  Post Invoice
                </Button>
                <Button variant="destructive" onClick={() => cancelMutation.mutate()} disabled={postMutation.isPending || cancelMutation.isPending}>
                  {cancelMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
                  Cancel Invoice
                </Button>
              </>
            )}
          </div>
        }
      />
      <div className="p-6 lg:p-8 space-y-5">
        {invoiceLoading && <div className="text-sm text-muted-foreground">Loading invoice...</div>}

        {/* Status banner for view mode */}
        {isView && existing && (
          <div className="flex items-center gap-3">
            <StatusBadge variant={statusVariant(existing.status)}>{existing.status ?? 'Draft'}</StatusBadge>
            {existing.createdAt && <span className="text-xs text-muted-foreground">Created {new Date(existing.createdAt).toLocaleDateString()}</span>}
            {existing.updatedAt && <span className="text-xs text-muted-foreground">Updated {new Date(existing.updatedAt).toLocaleDateString()}</span>}
          </div>
        )}

        <Card>
          <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>Vendor</Label>
              <Select value={vendorId} onValueChange={setVendorId} disabled={isView}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select vendor" /></SelectTrigger>
                <SelectContent>{vendors.map(v => <SelectItem key={v.id} value={v.id ?? ''}>{v.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Invoice #</Label>
              <Input className="mt-1.5" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} disabled={isView} />
            </div>
            <div>
              <Label>Invoice Date</Label>
              <Input className="mt-1.5" type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} disabled={isView} />
            </div>
            <div>
              <Label>Due Date</Label>
              <Input className="mt-1.5" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} disabled={isView} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row justify-between items-center">
            <CardTitle className="text-base">Line Items</CardTitle>
            {!isView && (
              <Button size="sm" variant="outline" onClick={() => setRows([...rows, { partId: '', qty: 1, price: 0 }])}><Plus className="h-4 w-4 mr-1" />Add row</Button>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-canvas border-y">
                <tr>
                  {['Part', 'Qty', 'Unit Price', 'Subtotal', ...(isView ? [] : [''])].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs uppercase tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-2">
                      <Select value={r.partId} onValueChange={v => update(i, { partId: v })} disabled={isView}>
                        <SelectTrigger className="w-[280px]"><SelectValue placeholder="Select part" /></SelectTrigger>
                        <SelectContent>{parts.map(p => <SelectItem key={p.id} value={p.id ?? ''}>{p.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2"><Input type="number" className="w-20 font-mono" value={r.qty} onChange={e => update(i, { qty: +e.target.value })} disabled={isView} /></td>
                    <td className="px-4 py-2"><Input type="number" className="w-28 font-mono" value={r.price} onChange={e => update(i, { price: +e.target.value })} disabled={isView} /></td>
                    <td className="px-4 py-2 tabular font-medium">{formatRs(r.qty * r.price)}</td>
                    {!isView && (
                      <td className="px-4 py-2">
                        <Button variant="ghost" size="icon" onClick={() => setRows(rows.filter((_, idx) => idx !== i))}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Pricing fields — editable only in create mode */}
          <Card>
            <CardHeader><CardTitle className="text-base">Pricing</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label>Discount (Rs.)</Label>
                <Input className="mt-1.5 font-mono" type="number" min="0" step="0.01"
                  value={isView ? (existing?.discount ?? 0) : discount}
                  onChange={e => setDiscount(e.target.value)} disabled={isView} />
              </div>
              <div>
                <Label>Tax Amount (Rs.)</Label>
                <Input className="mt-1.5 font-mono" type="number" min="0" step="0.01"
                  value={isView ? (existing?.taxAmount ?? 0) : taxAmount}
                  onChange={e => setTaxAmount(e.target.value)} disabled={isView} />
              </div>
              <div>
                <Label>Amount Paid (Rs.)</Label>
                <Input className="mt-1.5 font-mono" type="number" min="0" step="0.01"
                  value={isView ? (existing?.amountPaid ?? 0) : amountPaid}
                  onChange={e => setAmountPaid(e.target.value)} disabled={isView} />
              </div>
            </CardContent>
          </Card>

          {/* Totals summary */}
          <Card>
            <CardHeader><CardTitle className="text-base">Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">{formatRs(isView ? (existing?.subtotal ?? 0) : subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-mono text-destructive">- {formatRs(isView ? (existing?.discount ?? 0) : Number(discount))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-mono">+ {formatRs(isView ? (existing?.taxAmount ?? 0) : Number(taxAmount))}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Grand Total</span>
                <span className="font-mono text-base">{formatRs(isView ? (existing?.grandTotal ?? 0) : grandTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-mono">{formatRs(isView ? (existing?.amountPaid ?? 0) : Number(amountPaid))}</span>
              </div>
              <div className="flex justify-between font-medium text-sm">
                <span>Balance Due</span>
                <span className="font-mono">{formatRs(isView ? (existing?.balanceDue ?? 0) : balanceDue)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default PurchaseInvoiceForm;
