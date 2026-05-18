import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { vendors, parts } from '@/data/mock';
import { useMemo, useState } from 'react';
import { Trash2, Plus, Printer } from 'lucide-react';
import { formatRs } from '@/lib/format';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Row { partId: string; qty: number; price: number; }

const PurchaseInvoiceForm = () => {
  const [vendorId, setVendorId] = useState(vendors[0].id);
  const [rows, setRows] = useState<Row[]>([{ partId: parts[0].id, qty: 5, price: parts[0].cost }]);
  const nav = useNavigate();

  const total = useMemo(() => rows.reduce((s, r) => s + r.qty * r.price, 0), [rows]);
  const update = (i: number, patch: Partial<Row>) => setRows(rows.map((r, idx) => idx === i ? { ...r, ...patch } : r));

  return (
    <div>
      <PageHeader title="New Purchase Invoice"
        actions={<><Button variant="outline"><Printer className="h-4 w-4 mr-2" />Print</Button><Button onClick={() => { toast.success('PO saved'); nav('/admin/purchase-invoices'); }}>Save</Button></>} />
      <div className="p-6 lg:p-8 space-y-5">
        <Card>
          <CardHeader><CardTitle className="text-base">Vendor</CardTitle></CardHeader>
          <CardContent>
            <Select value={vendorId} onValueChange={setVendorId}>
              <SelectTrigger className="max-w-md"><SelectValue /></SelectTrigger>
              <SelectContent>{vendors.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}</SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row justify-between items-center">
            <CardTitle className="text-base">Line items</CardTitle>
            <Button size="sm" variant="outline" onClick={() => setRows([...rows, { partId: parts[0].id, qty: 1, price: parts[0].cost }])}><Plus className="h-4 w-4 mr-1" />Add row</Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-canvas border-y"><tr>{['Part','Qty','Cost','Subtotal',''].map(h => <th key={h} className="px-4 py-2.5 text-left text-xs uppercase tracking-wider text-muted-foreground">{h}</th>)}</tr></thead>
              <tbody>{rows.map((r, i) => {
                const part = parts.find(p => p.id === r.partId)!;
                return (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-2">
                      <Select value={r.partId} onValueChange={v => update(i, { partId: v, price: parts.find(p => p.id === v)!.cost })}>
                        <SelectTrigger className="w-[280px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{parts.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2"><Input type="number" className="w-20 font-mono" value={r.qty} onChange={e => update(i, { qty: +e.target.value })} /></td>
                    <td className="px-4 py-2"><Input type="number" className="w-28 font-mono" value={r.price} onChange={e => update(i, { price: +e.target.value })} /></td>
                    <td className="px-4 py-2 tabular font-medium">{formatRs(r.qty * r.price)}</td>
                    <td className="px-4 py-2"><Button variant="ghost" size="icon" onClick={() => setRows(rows.filter((_, idx) => idx !== i))}><Trash2 className="h-4 w-4 text-destructive" /></Button></td>
                  </tr>
                );
              })}</tbody>
              <tfoot><tr className="bg-canvas"><td colSpan={3} className="px-4 py-3 text-right font-medium">Total</td><td className="px-4 py-3 tabular font-bold text-base">{formatRs(total)}</td><td /></tr></tfoot>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default PurchaseInvoiceForm;
