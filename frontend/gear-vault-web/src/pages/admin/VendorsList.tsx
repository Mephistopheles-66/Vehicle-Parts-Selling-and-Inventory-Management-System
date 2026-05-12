import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Building2, Edit, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { VendorsService } from '@/api/generated/client';
import { getApiErrorMessage, unwrapApiResult } from '@/api/client';

const VendorsList = () => {
  const [q, setQ] = useState('');
  const queryClient = useQueryClient();
  const { data: vendors = [], isLoading, error } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => unwrapApiResult(await VendorsService.getAllVendors(), []),
  });

  const deleteMutation = useMutation({
    mutationFn: (vendorId: string) => VendorsService.deleteVendor({ vendorId }),
    onSuccess: () => {
      toast.success('Vendor deleted');
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Unable to delete vendor')),
  });

  const filtered = vendors.filter(vendor => {
    const needle = q.toLowerCase();
    return (vendor.name ?? '').toLowerCase().includes(needle)
      || (vendor.contactEmail ?? '').toLowerCase().includes(needle)
      || (vendor.phone ?? '').toLowerCase().includes(needle);
  });

  return (
    <div>
      <PageHeader title="Vendors" description="Trusted suppliers powering the vault."
        actions={<Button asChild><Link to="/admin/vendors/new"><Plus className="h-4 w-4 mr-2" />Add vendor</Link></Button>} />
      <div className="p-6 lg:p-8 space-y-5">
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search vendors..." className="pl-9" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-deep-navy text-white">
                <tr className="text-left">{['Vendor','Email','Phone','Address','Status','Updated','Actions'].map(h => <th key={h} className="px-4 py-3 text-xs uppercase tracking-wider">{h}</th>)}</tr>
              </thead>
              <tbody>
                {isLoading && <tr><td className="px-4 py-8 text-center text-muted-foreground" colSpan={7}>Loading vendors...</td></tr>}
                {error && <tr><td className="px-4 py-8 text-center text-destructive" colSpan={7}>{getApiErrorMessage(error, 'Unable to load vendors')}</td></tr>}
                {!isLoading && !error && filtered.length === 0 && <tr><td className="px-4 py-8 text-center text-muted-foreground" colSpan={7}>No vendors found.</td></tr>}
                {filtered.map((vendor, i) => (
                  <tr key={vendor.id} className={`border-b hover:bg-secondary/40 ${i % 2 ? 'bg-canvas' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-md bg-secondary flex items-center justify-center"><Building2 className="h-4 w-4 text-muted-foreground" /></div>
                        <Link to={`/admin/vendors/${vendor.id}`} className="font-medium text-charcoal hover:text-primary">{vendor.name}</Link>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{vendor.contactEmail ?? '-'}</td>
                    <td className="px-4 py-3 font-mono text-xs">{vendor.phone ?? '-'}</td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[260px] truncate">{vendor.address ?? '-'}</td>
                    <td className="px-4 py-3"><StatusBadge variant={vendor.isActive ? 'success' : 'neutral'}>{vendor.isActive ? 'Active' : 'Inactive'}</StatusBadge></td>
                    <td className="px-4 py-3 text-muted-foreground">{vendor.updatedAt ? new Date(vendor.updatedAt).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" asChild><Link to={`/admin/vendors/${vendor.id}`}>View</Link></Button>
                        <Button variant="ghost" size="icon" asChild><Link to={`/admin/vendors/${vendor.id}/edit`}><Edit className="h-4 w-4" /></Link></Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={!vendor.id || deleteMutation.isPending}
                          onClick={() => vendor.id && deleteMutation.mutate(vendor.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorsList;
