import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VendorsService } from '@/api/generated/client';
import type { CreateVendorDto, UpdateVendorDto } from '@/api/generated/client';
import { getApiErrorMessage, unwrapApiResult } from '@/api/client';

const emptyForm = {
  name: '',
  contactEmail: '',
  phone: '',
  address: '',
  isActive: 'true',
};

const VendorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);
  const [form, setForm] = useState(emptyForm);

  const { data: vendor, isLoading } = useQuery({
    queryKey: ['vendors', id],
    queryFn: async () => unwrapApiResult(await VendorsService.getVendorById({ vendorId: id! }), null),
    enabled: isEditing,
  });

  useEffect(() => {
    if (!vendor) return;
    setForm({
      name: vendor.name ?? '',
      contactEmail: vendor.contactEmail ?? '',
      phone: vendor.phone ?? '',
      address: vendor.address ?? '',
      isActive: String(vendor.isActive ?? true),
    });
  }, [vendor]);

  const saveMutation = useMutation({
    mutationFn: (payload: CreateVendorDto | UpdateVendorDto) => {
      if (id) return VendorsService.updateVendor({ vendorId: id, requestBody: payload });
      return VendorsService.createVendor({ requestBody: payload });
    },
    onSuccess: (response) => {
      const savedVendor = unwrapApiResult(response, null);
      toast.success(id ? 'Vendor updated' : 'Vendor created');
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      if (savedVendor?.id) queryClient.invalidateQueries({ queryKey: ['vendors', savedVendor.id] });
      navigate('/admin/vendors');
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Unable to save vendor')),
  });

  const setField = (key: keyof typeof form, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const payload: CreateVendorDto | UpdateVendorDto = {
      name: form.name.trim(),
      contactEmail: form.contactEmail.trim() || null,
      phone: form.phone.trim() || null,
      address: form.address.trim() || null,
      isActive: form.isActive === 'true',
    };
    saveMutation.mutate(payload);
  };

  return (
    <div>
      <PageHeader title={isEditing ? 'Edit Vendor' : 'Add Vendor'} description={vendor?.name ?? 'Supplier profile and contact details.'} />
      <form onSubmit={submit} className="p-6 lg:p-8 max-w-2xl">
        <Card>
          <CardHeader><CardTitle className="text-base">Vendor Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {isLoading && <div className="text-sm text-muted-foreground">Loading vendor...</div>}
            <div><Label>Company name</Label><Input className="mt-1.5" value={form.name} onChange={e => setField('name', e.target.value)} required /></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Email</Label><Input type="email" className="mt-1.5" value={form.contactEmail} onChange={e => setField('contactEmail', e.target.value)} /></div>
              <div><Label>Phone</Label><Input className="mt-1.5" value={form.phone} onChange={e => setField('phone', e.target.value)} /></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Address</Label><Input className="mt-1.5" value={form.address} onChange={e => setField('address', e.target.value)} /></div>
              <div><Label>Status</Label>
                <Select value={form.isActive} onValueChange={value => setField('isActive', value)}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save vendor
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default VendorForm;
