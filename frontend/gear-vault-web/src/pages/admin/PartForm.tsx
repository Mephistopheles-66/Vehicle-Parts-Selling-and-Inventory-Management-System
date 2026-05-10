import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate, useParams } from 'react-router-dom';
import { parts, vendors } from '@/data/mock';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ImagePlus } from 'lucide-react';

const PartForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const part = parts.find(p => p.id === id);

  return (
    <div>
      <PageHeader title={part ? 'Edit Part' : 'Add Part'} description={part ? part.name : 'New inventory item.'} />
      <form onSubmit={e => { e.preventDefault(); toast.success('Part saved'); navigate('/admin/parts'); }} className="p-6 lg:p-8 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card><CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Name</Label><Input className="mt-1.5" defaultValue={part?.name} placeholder="e.g. Front Brake Pads" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>SKU</Label><Input className="mt-1.5 font-mono" defaultValue={part?.sku} required /></div>
                <div><Label>Category</Label>
                  <Select defaultValue={part?.category ?? 'Brakes'}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{['Lubricants','Brakes','Electrical','Tires','Filters','Engine','Suspension','Accessories'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Description</Label><Textarea className="mt-1.5" rows={3} defaultValue={part?.description} /></div>
            </CardContent>
          </Card>
          <Card><CardHeader><CardTitle className="text-base">Pricing & Stock</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <div><Label>Cost (Rs.)</Label><Input className="mt-1.5 font-mono" type="number" defaultValue={part?.cost} /></div>
              <div><Label>Price (Rs.)</Label><Input className="mt-1.5 font-mono" type="number" defaultValue={part?.price} /></div>
              <div><Label>Stock</Label><Input className="mt-1.5 font-mono" type="number" defaultValue={part?.stock} /></div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-5">
          <Card><CardHeader><CardTitle className="text-base">Image</CardTitle></CardHeader>
            <CardContent>
              <button type="button" className="w-full aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                <ImagePlus className="h-7 w-7 mb-2" />
                <span className="text-sm">Upload image</span>
              </button>
            </CardContent>
          </Card>
          <Card><CardHeader><CardTitle className="text-base">Vendor</CardTitle></CardHeader>
            <CardContent>
              <Select defaultValue={part?.vendorId ?? vendors[0].id}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{vendors.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}</SelectContent>
              </Select>
            </CardContent>
          </Card>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">Save part</Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PartForm;
