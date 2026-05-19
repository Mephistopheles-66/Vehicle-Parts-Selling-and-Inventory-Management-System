import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AdminNotificationsService } from '@/api/generated/client';
import { EmptyState } from '@/components/shared/EmptyState';
import { unwrapApiResult } from '@/api/client';

const LowStock = () => {
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['admin-notifications', 'low-stock'],
    queryFn: async () =>
      unwrapApiResult(await AdminNotificationsService.getLowStockNotifications(), []),
  });

  return (
    <div>
      <PageHeader title="Low Stock Alerts" description="Replenish before customers feel it." />
      <div className="p-6 lg:p-8">
        {isLoading && <p className="text-muted-foreground text-center py-12">Loading...</p>}
        {!isLoading && notifications.length === 0 && (
          <EmptyState icon={AlertTriangle} title="All stocked up" description="No items are below reorder level." />
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notifications.map(notification => {
            const part = notification.part;

            return (
            <Card key={notification.id} className="border-destructive/30">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-destructive/10 text-destructive flex items-center justify-center"><AlertTriangle className="h-5 w-5" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-charcoal truncate">{part?.name ?? notification.title}</div>
                    <div className="text-xs font-mono text-muted-foreground">{part?.partNumber ?? notification.type}</div>
                    <div className="mt-1 text-xs text-muted-foreground line-clamp-2">{notification.message}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold tabular text-destructive">{part?.stockQuantity ?? '-'}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">in stock</div>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full mt-4"><Link to="/admin/purchase-invoices/new">Reorder</Link></Button>
              </CardContent>
            </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default LowStock;
