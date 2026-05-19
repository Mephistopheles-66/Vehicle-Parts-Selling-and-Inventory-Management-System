import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PartRequestsService } from '@/api/generated/client';
import { unwrapApiResult } from '@/api/client';
import type { PartRequestDto } from '@/api/generated/client';

const partRequestStatusVariant = (s?: string | null) => {
  const status = s?.toUpperCase();
  if (status === 'REJECTED' || status === 'CANCELLED') return 'danger';
  if (status === 'FULFILLED' || status === 'AVAILABLE') return 'success';
  if (status === 'SOURCING' || status === 'REVIEWED') return 'info';
  return 'warning';
};

const PartRequests = () => {
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['all-part-requests'],
    queryFn: async () => unwrapApiResult(await PartRequestsService.getAllPartRequests(), []),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      PartRequestsService.updatePartRequestStatus({ partRequestId: id, requestBody: status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['all-part-requests'] }),
  });

  return (
    <div>
      <PageHeader title="Part Requests" description="Customer requests for unavailable parts." />
      <div className="p-6 lg:p-8 space-y-3">
        {isLoading && <div className="text-sm text-muted-foreground">Loading part requests…</div>}
        {!isLoading && requests.length === 0 && (
          <div className="text-sm text-muted-foreground">No part requests found.</div>
        )}
        {requests.map((r: PartRequestDto) => (
          <Card key={r.id}><CardContent className="p-5 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{r.partName}</span>
                <StatusBadge variant={partRequestStatusVariant(r.status)}>{r.status ?? '—'}</StatusBadge>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                From {r.customerName || 'Unknown'} · {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}
              </div>
              {r.description && <div className="text-sm mt-2 text-charcoal">{r.description}</div>}
            </div>
            {r.status?.toUpperCase() === 'PENDING' && r.id && (
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={statusMutation.isPending}
                  onClick={() => statusMutation.mutate({ id: r.id!, status: 'Rejected' })}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  disabled={statusMutation.isPending}
                  onClick={() => statusMutation.mutate({ id: r.id!, status: 'Available' })}
                >
                  Mark sourced
                </Button>
              </div>
            )}
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
};
export default PartRequests;
