import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate, useParams } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PartsService } from '@/api/generated/client';
import type { CreatePartDto, UpdatePartDto } from '@/api/generated/client';
import { getApiErrorMessage, unwrapApiResult } from '@/api/client';

const categories = ['Lubricants', 'Brakes', 'Electrical', 'Tires', 'Filters', 'Engine', 'Suspension', 'Accessories'];
const units = ['PIECE', 'BOX', 'METER', 'LITER', 'KG'] as const;
const unitLabels: Record<string, string> = { PIECE: 'Piece', BOX: 'Box', METER: 'Meter', LITER: 'Liter', KG: 'Kg' };

const emptyForm = {
  name: '',
  partNumber: '',
  category: 'Brakes',
  unit: 'PIECE',
  description: '',
  stockQuantity: '0',
  sellingPrice: '',
  reorderLevel: '',
  isActive: 'true',
};

const PartForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);
  const [form, setForm] = useState(emptyForm);

  const { data: part, isLoading } = useQuery({
    queryKey: ['parts', id],
    queryFn: async () => unwrapApiResult(await PartsService.getPartById({ partId: id! }), null),
    enabled: isEditing,
  });

  useEffect(() => {
    if (!part) return;
    setForm({
      name: part.name ?? '',
      partNumber: part.partNumber ?? '',
      category: part.category ?? 'Brakes',
      unit: part.unit ?? 'PIECE',
      description: part.description ?? '',
      stockQuantity: String(part.stockQuantity ?? 0),
      sellingPrice: String(part.sellingPrice ?? ''),
      reorderLevel: String(part.reorderLevel ?? ''),
      isActive: String(part.isActive ?? true),
    });
  }, [part]);

  const saveMutation = useMutation({
    mutationFn: (payload: CreatePartDto | UpdatePartDto) => {
      if (id) return PartsService.updatePart({ partId: id, requestBody: payload });
      return PartsService.createPart({ requestBody: payload });
    },
    onSuccess: (response) => {
      const savedPart = unwrapApiResult(response, null);
      toast.success(id ? 'Part updated' : 'Part created');
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      if (savedPart?.id) queryClient.invalidateQueries({ queryKey: ['parts', savedPart.id] });
      navigate('/admin/parts');
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Unable to save part')),
  });

  const setField = (key: keyof typeof form, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreatePartDto | UpdatePartDto = {
      name: form.name.trim(),
      partNumber: form.partNumber.trim(),
      category: form.category,
      unit: form.unit,
      description: form.description.trim() || null,
      stockQuantity: Number(form.stockQuantity),
      sellingPrice: Number(form.sellingPrice),
      reorderLevel: Number(form.reorderLevel),
      isActive: form.isActive === 'true',
    };
    saveMutation.mutate(payload);
  };

  return (
    <div>
      <PageHeader title={isEditing ? 'Edit Part' : 'Add Part'} description={part?.name ?? 'New inventory item.'} />
      <form onSubmit={submit} className="p-6 lg:p-8 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card><CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {isLoading && <div className="text-sm text-muted-foreground">Loading part...</div>}
              <div><Label>Name</Label><Input className="mt-1.5" value={form.name} onChange={e => setField('name', e.target.value)} placeholder="e.g. Front Brake Pads" required /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Part number</Label><Input className="mt-1.5 font-mono" value={form.partNumber} onChange={e => setField('partNumber', e.target.value)} required /></div>
                <div><Label>Category</Label>
                  <Select value={form.category} onValueChange={value => setField('category', value)}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Description</Label><Textarea className="mt-1.5" rows={3} value={form.description} onChange={e => setField('description', e.target.value)} /></div>
            </CardContent>
          </Card>
          <Card><CardHeader><CardTitle className="text-base">Pricing & Reorder</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-3 gap-4">
              <div><Label>Selling price (Rs.)</Label><Input className="mt-1.5 font-mono" type="number" min="0" step="0.01" value={form.sellingPrice} onChange={e => setField('sellingPrice', e.target.value)} required /></div>
              <div><Label>Reorder level</Label><Input className="mt-1.5 font-mono" type="number" min="0" value={form.reorderLevel} onChange={e => setField('reorderLevel', e.target.value)} required /></div>
              <div><Label>Unit</Label>
                <Select value={form.unit} onValueChange={value => setField('unit', value)}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{units.map(u => <SelectItem key={u} value={u}>{unitLabels[u]}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-5">
          <Card><CardHeader><CardTitle className="text-base">Inventory</CardTitle></CardHeader>
            <CardContent>
              <div><Label>Stock quantity</Label><Input className="mt-1.5 font-mono" type="number" min="0" value={form.stockQuantity} onChange={e => setField('stockQuantity', e.target.value)} required /></div>
            </CardContent>
          </Card>
          <Card><CardHeader><CardTitle className="text-base">Status</CardTitle></CardHeader>
            <CardContent>
              <Select value={form.isActive} onValueChange={value => setField('isActive', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={saveMutation.isPending}>
              {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save part
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PartForm;
