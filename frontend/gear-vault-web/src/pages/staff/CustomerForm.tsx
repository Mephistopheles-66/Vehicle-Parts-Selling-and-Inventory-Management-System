import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { customers } from '@/data/mock';
import { toast } from 'sonner';
import { ChevronRight } from 'lucide-react';

const CustomerForm = () => {
  const { id } = useParams();
  const c = customers.find(x => x.id === id);
  const [step, setStep] = useState(c ? 1 : 0);
  const nav = useNavigate();
  return (
    <div>
      <PageHeader title={c ? 'Edit Customer' : 'Register Customer'} />
      <div className="p-6 lg:p-8 max-w-2xl space-y-5">
        <div className="flex gap-2">
          {['Customer info', 'Vehicle details'].map((s, i) => (
            <div key={s} className={`flex-1 p-3 rounded-md border ${step >= i ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'}`}>
              <div className="text-[10px] uppercase tracking-wider">Step {i+1}</div>
              <div className="text-sm font-medium">{s}</div>
            </div>
          ))}
        </div>
        <Card><CardHeader><CardTitle className="text-base">{step === 0 ? 'Customer info' : 'Vehicle details'}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {step === 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Full name</Label><Input className="mt-1.5" defaultValue={c?.name} /></div>
                  <div><Label>Phone</Label><Input className="mt-1.5" defaultValue={c?.phone} /></div>
                </div>
                <div><Label>Email</Label><Input type="email" className="mt-1.5" defaultValue={c?.email} /></div>
                <Button onClick={() => setStep(1)} className="w-full">Next: Vehicle details <ChevronRight className="h-4 w-4 ml-2" /></Button>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Make</Label><Input className="mt-1.5" placeholder="Honda" /></div>
                  <div><Label>Model</Label><Input className="mt-1.5" placeholder="Civic" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Year</Label><Input type="number" className="mt-1.5 font-mono" placeholder="2022" /></div>
                  <div><Label>Plate</Label><Input className="mt-1.5 font-mono" placeholder="BA 2 PA 4521" /></div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                  <Button onClick={() => { toast.success('Customer registered'); nav('/staff/customers'); }} className="flex-1">Save customer</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default CustomerForm;
