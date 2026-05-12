import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, Link } from 'react-router-dom';
import { Edit, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRs } from '@/lib/format';
import { useQuery } from '@tanstack/react-query';
import { PartsService } from '@/api/generated/client';
import { getApiErrorMessage, unwrapApiResult } from '@/api/client';

const PartDetails = () => {
  const { id } = useParams();
  const { data: part, isLoading, error } = useQuery({
    queryKey: ['parts', id],
    queryFn: async () => unwrapApiResult(await PartsService.getPartById({ partId: id! }), null),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Part details" description="Loading inventory item..." />
        <div className="p-6 lg:p-8 text-sm text-muted-foreground">Loading part...</div>
      </div>
    );
  }

  if (error || !part) {
    return (
      <div>
        <PageHeader title="Part not found" description="Unable to load this inventory item." />
        <div className="p-6 lg:p-8 text-sm text-destructive">{getApiErrorMessage(error, 'Unable to load part')}</div>
      </div>
    );
  }

  const lowStock = (part.stockQuantity ?? 0) <= (part.reorderLevel ?? 0);

  return (
    <div>
      <PageHeader title={part.name ?? 'Part'} description={`Part number ${part.partNumber ?? '-'}`}
        actions={<Button asChild><Link to={`/admin/parts/${part.id}/edit`}><Edit className="h-4 w-4 mr-2" />Edit</Link></Button>} />
      <div className="p-6 lg:p-8 grid lg:grid-cols-3 gap-5">
        <Card>
          <CardContent className="p-6">
            <div className="aspect-square rounded-lg bg-secondary flex items-center justify-center"><Package className="h-16 w-16 text-muted-foreground" /></div>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4"><span className="text-muted-foreground">Category</span><StatusBadge variant="neutral">{part.category ?? '-'}</StatusBadge></div>
              <div className="flex justify-between gap-4"><span className="text-muted-foreground">Unit</span><span className="font-medium">{part.unit ?? '-'}</span></div>
              <div className="flex justify-between gap-4"><span className="text-muted-foreground">Stock</span><span className={lowStock ? 'tabular font-medium text-destructive' : 'tabular font-medium'}>{part.stockQuantity ?? 0}</span></div>
              <div className="flex justify-between gap-4"><span className="text-muted-foreground">Reorder level</span><span className="tabular">{part.reorderLevel ?? 0}</span></div>
              <div className="flex justify-between gap-4"><span className="text-muted-foreground">Selling price</span><span className="tabular font-bold">{formatRs(part.sellingPrice ?? 0)}</span></div>
              <div className="flex justify-between gap-4"><span className="text-muted-foreground">Status</span><StatusBadge variant={part.isActive ? 'success' : 'neutral'}>{part.isActive ? 'Active' : 'Inactive'}</StatusBadge></div>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Description</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-muted-foreground leading-relaxed">{part.description || 'No description has been added for this part yet.'}</p>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-md border p-4">
                <div className="text-muted-foreground">Created</div>
                <div className="mt-1 font-medium">{part.createdAt ? new Date(part.createdAt).toLocaleString() : '-'}</div>
              </div>
              <div className="rounded-md border p-4">
                <div className="text-muted-foreground">Updated</div>
                <div className="mt-1 font-medium">{part.updatedAt ? new Date(part.updatedAt).toLocaleString() : '-'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default PartDetails;
