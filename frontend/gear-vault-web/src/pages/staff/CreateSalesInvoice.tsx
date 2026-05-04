import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { customers, parts } from '@/data/mock';
import { useMemo, useState } from 'react';
import { Plus, Trash2, Sparkles, Search } from 'lucide-react';
import { formatRs } from '@/lib/format';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Row { partId: string; qty: number; }

const CreateSalesInvoice = () => {
  const [customerId, setCustomerId] = useState(customers[0].id);
  const [rows, setRows] = useState<Row[]>([{ partId: parts[0].id, qty: 1 }]);
  const [search, setSearch] = useState('');
  const nav = useNavigate();

  const subtotal = useMemo(() => rows.reduce((s, r) => s + (parts.find(p => p.id === r.partId)?.price ?? 0) * r.qty, 0), [rows]);
  const loyaltyApplied = subtotal > 5000;
  const discount = loyaltyApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;

  const addPart = (id: string) => setRows([...rows, { partId: id, qty: 1 }]);
  const filtered = parts.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 5);

  return (
    <div>
      <PageHeader title="New Sales Invoice" description="POS-style billing."
        actions={<Button onClick={() => { toast.success('Invoice created'); nav('/staff/invoices'); }}>Save & print</Button>} />
      <div className="p-6 lg:p-8 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card><CardHeader><CardTitle className="text-base">Customer</CardTitle></CardHeader>
            <CardContent>
              <Select value={customerId} onValueChange={setCustomerId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name} — {c.phone}</SelectItem>)}</SelectContent>
              </Select>
            </CardContent>
          </Card>
          <Card><CardHeader><CardTitle className="text-base">Add parts</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search parts to add…" className="pl-9" />
              </div>
              {search && (
                <div className="border rounded-md divide-y">
                  {filtered.map(p => (
                    <button key={p.id} onClick={() => { addPart(p.id); setSearch(''); }} className="w-full flex items-center justify-between px-3 py-2 text-left text-sm hover:bg-secondary/40">
                      <span><span className="font-medium">{p.name}</span> <span className="text-xs font-mono text-muted-foreground ml-2">{p.sku}</span></span>
                      <span className="tabular text-muted-foreground">{formatRs(p.price)}</span>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card><CardHeader><CardTitle className="text-base">Line items</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-canvas border-y"><tr>{['Part','Qty','Price','Subtotal',''].map(h=><th key={h} className="px-4 py-2.5 text-left text-xs uppercase tracking-wider text-muted-foreground">{h}</th>)}</tr></thead>
                <tbody>{rows.map((r, i) => {
                  const p = parts.find(x => x.id === r.partId)!;
                  return (
                    <tr key={i} className="border-b">
                      <td className="px-4 py-2 font-medium">{p.name}</td>
                      <td className="px-4 py-2"><Input type="number" className="w-20 font-mono" value={r.qty} onChange={e => setRows(rows.map((x,idx)=>idx===i?{...x, qty: +e.target.value}:x))} /></td>
                      <td className="px-4 py-2 tabular">{formatRs(p.price)}</td>
                      <td className="px-4 py-2 tabular font-medium">{formatRs(p.price * r.qty)}</td>
                      <td className="px-4 py-2"><Button variant="ghost" size="icon" onClick={() => setRows(rows.filter((_,idx)=>idx!==i))}><Trash2 className="h-4 w-4 text-destructive" /></Button></td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit sticky top-20"><CardHeader><CardTitle className="text-base">Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="tabular font-medium">{formatRs(subtotal)}</span></div>
            {loyaltyApplied && (
              <div className="slide-in-right flex items-center gap-2 p-2.5 rounded-md bg-success/10 text-success text-xs font-medium">
                <Sparkles className="h-4 w-4" /> Loyalty discount unlocked: −10%
              </div>
            )}
            <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="tabular text-success">−{formatRs(discount)}</span></div>
            <div className="border-t pt-3 flex justify-between text-base"><span className="font-semibold">Total</span><span className="tabular font-bold">{formatRs(total)}</span></div>
            <Button className="w-full mt-2" onClick={() => { toast.success('Invoice saved'); nav('/staff/invoices'); }}>Complete sale</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default CreateSalesInvoice;
