import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';
import { salesInvoices } from '@/data/mock';
import { Printer, Mail } from 'lucide-react';
import { formatRs } from '@/lib/format';
import { GearVaultLogo } from '@/components/shared/Logo';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/shared/StatusBadge';

const ViewSalesInvoice = () => {
  const { id } = useParams();
  const inv = salesInvoices.find(i => i.id === id) ?? salesInvoices[0];
  return (
    <div>
      <PageHeader title={inv.id} description={`Issued to ${inv.customerName}`}
        actions={<>
          <Dialog>
            <DialogTrigger asChild><Button variant="outline"><Mail className="h-4 w-4 mr-2" />Email invoice</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Email preview</DialogTitle></DialogHeader>
              <div className="rounded-md border bg-canvas">
                <div className="bg-deep-navy text-white p-4 flex items-center gap-2"><GearVaultLogo size={24} className="text-white" /><span className="font-bold">Gear Vault</span></div>
                <div className="p-5 text-sm">
                  <p>Hi {inv.customerName},</p>
                  <p className="mt-2">Thank you for your purchase at Gear Vault. Your invoice <span className="font-mono">{inv.id}</span> total is <span className="font-bold">{formatRs(inv.total)}</span>.</p>
                  <p className="mt-2 text-muted-foreground">Precision parts. Locked-in trust.</p>
                </div>
              </div>
              <Button className="w-full">Send email</Button>
            </DialogContent>
          </Dialog>
          <Button onClick={() => window.print()}><Printer className="h-4 w-4 mr-2" />Print</Button>
        </>} />
      <div className="p-6 lg:p-8 max-w-3xl">
        <Card>
          <div className="bg-deep-navy text-white p-6 flex items-center justify-between rounded-t-lg">
            <div className="flex items-center gap-3"><GearVaultLogo size={36} className="text-white" /><div><div className="font-bold text-lg">Gear Vault</div><div className="text-xs text-white/60">Precision parts. Locked-in trust.</div></div></div>
            <div className="text-right"><div className="text-xs text-white/60">Invoice</div><div className="font-mono font-semibold">{inv.id}</div></div>
          </div>
          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><div className="text-xs text-muted-foreground">Bill to</div><div className="font-medium">{inv.customerName}</div></div>
              <div className="text-right"><div className="text-xs text-muted-foreground">Date</div><div>{inv.date}</div><div className="mt-2"><StatusBadge variant={inv.status === 'paid' ? 'success' : 'warning'}>{inv.status}</StatusBadge></div></div>
            </div>
            <table className="w-full text-sm border-t">
              <thead><tr className="text-left">{['Item','Qty','Price','Subtotal'].map(h=><th key={h} className="py-2 text-xs uppercase tracking-wider text-muted-foreground">{h}</th>)}</tr></thead>
              <tbody>{inv.items.map((it, i) => (
                <tr key={i} className="border-t">
                  <td className="py-3">{it.name}</td>
                  <td className="py-3 tabular">{it.qty}</td>
                  <td className="py-3 tabular">{formatRs(it.price)}</td>
                  <td className="py-3 tabular font-medium">{formatRs(it.qty * it.price)}</td>
                </tr>))}</tbody>
            </table>
            <div className="border-t pt-4 space-y-1.5 text-sm max-w-xs ml-auto">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="tabular">{formatRs(inv.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="tabular text-success">−{formatRs(inv.discount)}</span></div>
              <div className="flex justify-between text-base border-t pt-2"><span className="font-semibold">Total</span><span className="tabular font-bold">{formatRs(inv.total)}</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default ViewSalesInvoice;
