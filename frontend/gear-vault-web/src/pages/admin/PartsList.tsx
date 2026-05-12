import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRs } from '@/lib/format';
import { Edit, Package, Plus, Search, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PartsService } from '@/api/generated/client';
import { getApiErrorMessage, unwrapApiResult } from '@/api/client';
import { toast } from 'sonner';

const PartsList = () => {
  const [q, setQ] = useState('');
  const queryClient = useQueryClient();
  const { data: parts = [], isLoading, error } = useQuery({
    queryKey: ['parts'],
    queryFn: async () => unwrapApiResult(await PartsService.getAllParts(), []),
  });
  const deleteMutation = useMutation({
    mutationFn: (partId: string) => PartsService.deletePart({ partId }),
    onSuccess: () => {
      toast.success('Part deleted');
      queryClient.invalidateQueries({ queryKey: ['parts'] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Unable to delete part')),
  });

  const filtered = parts.filter(p => {
    const needle = q.toLowerCase();
    return (p.name ?? '').toLowerCase().includes(needle) || (p.partNumber ?? '').toLowerCase().includes(needle);
  });

  return (
    <div>
      <PageHeader title="Parts" description="Every component, locked and tracked."
        actions={<Button asChild><Link to="/admin/parts/new"><Plus className="h-4 w-4 mr-2" />Add part</Link></Button>} />
      <div className="p-6 lg:p-8 space-y-5">
        <Card>
          <CardContent className="p-4 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or part number..." className="pl-9" />
            </div>
            <Button variant="outline" size="sm">Category</Button>
            <Button variant="outline" size="sm">Stock</Button>
            <Button variant="outline" size="sm">Status</Button>
          </CardContent>
        </Card>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-deep-navy text-white sticky top-0">
                <tr className="text-left">
                  {['Part','Part No.','Category','Stock','Reorder','Price','Status','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 font-medium text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr><td className="px-4 py-8 text-center text-muted-foreground" colSpan={8}>Loading parts...</td></tr>
                )}
                {error && (
                  <tr><td className="px-4 py-8 text-center text-destructive" colSpan={8}>{getApiErrorMessage(error, 'Unable to load parts')}</td></tr>
                )}
                {!isLoading && !error && filtered.length === 0 && (
                  <tr><td className="px-4 py-8 text-center text-muted-foreground" colSpan={8}>No parts found.</td></tr>
                )}
                {filtered.map((p, i) => (
                  <tr key={p.id} className={`border-b hover:bg-secondary/40 transition-colors ${i % 2 ? 'bg-canvas' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-md bg-secondary flex items-center justify-center"><Package className="h-4 w-4 text-muted-foreground" /></div>
                        <Link to={`/admin/parts/${p.id}`} className="font-medium text-charcoal hover:text-primary">{p.name}</Link>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.partNumber}</td>
                    <td className="px-4 py-3"><StatusBadge variant="neutral">{p.category}</StatusBadge></td>
                    <td className="px-4 py-3 tabular">
                      {(p.stockQuantity ?? 0) <= (p.reorderLevel ?? 0)
                        ? <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-destructive pulse-dot" /><span className="text-destructive font-medium">{p.stockQuantity ?? 0}</span></span>
                        : <span className="text-charcoal">{p.stockQuantity ?? 0}</span>}
                    </td>
                    <td className="px-4 py-3 tabular text-muted-foreground">{p.reorderLevel ?? 0}</td>
                    <td className="px-4 py-3 tabular font-medium">{formatRs(p.sellingPrice ?? 0)}</td>
                    <td className="px-4 py-3"><StatusBadge variant={p.isActive ? 'success' : 'neutral'}>{p.isActive ? 'Active' : 'Inactive'}</StatusBadge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" asChild><Link to={`/admin/parts/${p.id}`}>View</Link></Button>
                        <Button variant="ghost" size="icon" asChild><Link to={`/admin/parts/${p.id}/edit`}><Edit className="h-4 w-4" /></Link></Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={!p.id || deleteMutation.isPending}
                          onClick={() => p.id && deleteMutation.mutate(p.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PartsList;
