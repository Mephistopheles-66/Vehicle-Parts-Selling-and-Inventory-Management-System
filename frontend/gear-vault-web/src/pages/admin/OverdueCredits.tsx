import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { Receipt } from 'lucide-react';

const OverdueCredits = () => {
  return (
    <div>
      <PageHeader title="Overdue Credits" description="Outstanding balances across customers." />
      <div className="p-6 lg:p-8">
        <Card>
          <CardContent>
            <EmptyState icon={Receipt} title="No overdue credits" description="There are no outstanding balances at the moment." />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default OverdueCredits;
