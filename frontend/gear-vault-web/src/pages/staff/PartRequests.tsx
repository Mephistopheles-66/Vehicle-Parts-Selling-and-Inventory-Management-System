import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { partRequests } from '@/data/mock';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';

const PartRequests = () => (
  <div>
    <PageHeader title="Part Requests" description="Customer requests for unavailable parts." />
    <div className="p-6 lg:p-8 space-y-3">
      {partRequests.map(r => (
        <Card key={r.id}><CardContent className="p-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2"><span className="font-semibold">{r.partName}</span><StatusBadge variant={r.status === 'sourced' ? 'success' : r.status === 'rejected' ? 'danger' : 'warning'}>{r.status}</StatusBadge></div>
            <div className="text-xs text-muted-foreground mt-1">From {r.customerName} · {r.date}</div>
            <div className="text-sm mt-2 text-charcoal">{r.description}</div>
          </div>
          {r.status === 'pending' && <div className="flex gap-2"><Button size="sm" variant="outline">Reject</Button><Button size="sm">Mark sourced</Button></div>}
        </CardContent></Card>
      ))}
    </div>
  </div>
);
export default PartRequests;
