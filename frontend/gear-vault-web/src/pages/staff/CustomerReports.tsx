import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { customers } from '@/data/mock';
import { formatRs } from '@/lib/format';

const CustomerReports = () => {
  const regulars = [...customers].sort((a,b) => b.loyaltyPoints - a.loyaltyPoints);
  const high = [...customers].sort((a,b) => b.totalSpent - a.totalSpent);
  const credit = customers.filter(c => c.pendingCredit > 0);

  const Table = ({ data, col }: { data: typeof customers, col: 'totalSpent'|'pendingCredit'|'loyaltyPoints' }) => (
    <Card><CardContent className="p-0">
      <table className="w-full text-sm">
        <thead className="bg-canvas border-b"><tr>{['Customer','Phone','Vehicles','Value'].map(h=><th key={h} className="px-4 py-2.5 text-left text-xs uppercase tracking-wider text-muted-foreground">{h}</th>)}</tr></thead>
        <tbody>{data.map(c => (
          <tr key={c.id} className="border-b">
            <td className="px-4 py-3 font-medium">{c.name}</td>
            <td className="px-4 py-3 font-mono text-xs">{c.phone}</td>
            <td className="px-4 py-3">{c.vehicles.length}</td>
            <td className="px-4 py-3 tabular font-bold">{col === 'loyaltyPoints' ? c[col] + ' pts' : formatRs(c[col])}</td>
          </tr>))}</tbody>
      </table>
    </CardContent></Card>
  );
  return (
    <div>
      <PageHeader title="Customer Reports" />
      <div className="p-6 lg:p-8">
        <Tabs defaultValue="regulars">
          <TabsList><TabsTrigger value="regulars">Regulars</TabsTrigger><TabsTrigger value="high">High spenders</TabsTrigger><TabsTrigger value="credit">Pending credits</TabsTrigger></TabsList>
          <TabsContent value="regulars" className="mt-5"><Table data={regulars} col="loyaltyPoints" /></TabsContent>
          <TabsContent value="high" className="mt-5"><Table data={high} col="totalSpent" /></TabsContent>
          <TabsContent value="credit" className="mt-5"><Table data={credit} col="pendingCredit" /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
export default CustomerReports;
