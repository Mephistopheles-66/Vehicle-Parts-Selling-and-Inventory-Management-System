import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { customers } from '@/data/mock';
import { formatRs } from '@/lib/format';
import { StatusBadge } from '@/components/shared/StatusBadge';

const OverdueCredits = () => {
  const overdue = customers.filter(c => c.pendingCredit > 0);
  return (
    <div>
      <PageHeader title="Overdue Credits" description="Outstanding balances across customers." />
      <div className="p-6 lg:p-8">
        <Card><CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-deep-navy text-white"><tr>{['Customer','Phone','Credit','Status'].map(h=><th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody>{overdue.map((c,i)=>(
              <tr key={c.id} className={`border-b ${i%2?'bg-canvas':''}`}>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 font-mono text-xs">{c.phone}</td>
                <td className="px-4 py-3 tabular font-bold text-destructive">{formatRs(c.pendingCredit)}</td>
                <td className="px-4 py-3"><StatusBadge variant="danger">Overdue</StatusBadge></td>
              </tr>
            ))}</tbody>
          </table>
        </CardContent></Card>
      </div>
    </div>
  );
};
export default OverdueCredits;
