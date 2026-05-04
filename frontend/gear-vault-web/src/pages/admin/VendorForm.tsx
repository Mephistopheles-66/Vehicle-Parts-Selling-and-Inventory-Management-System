import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { vendors } from '@/data/mock';
import { toast } from 'sonner';

const VendorForm = () => {
  const { id } = useParams();
  const v = vendors.find(x => x.id === id);
  const nav = useNavigate();
  return (
    <div>
      <PageHeader title={v ? 'Edit Vendor' : 'Add Vendor'} />
      <form onSubmit={e => { e.preventDefault(); toast.success('Vendor saved'); nav('/admin/vendors'); }} className="p-6 lg:p-8 max-w-2xl">
        <Card>
          <CardHeader><CardTitle className="text-base">Vendor details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Company name</Label><Input className="mt-1.5" defaultValue={v?.name} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Contact person</Label><Input className="mt-1.5" defaultValue={v?.contact} /></div>
              <div><Label>Email</Label><Input type="email" className="mt-1.5" defaultValue={v?.email} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Phone</Label><Input className="mt-1.5" defaultValue={v?.phone} /></div>
              <div><Label>Address</Label><Input className="mt-1.5" defaultValue={v?.address} /></div>
            </div>
            <div className="flex gap-2"><Button type="submit">Save vendor</Button><Button type="button" variant="outline" onClick={() => nav(-1)}>Cancel</Button></div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
export default VendorForm;
