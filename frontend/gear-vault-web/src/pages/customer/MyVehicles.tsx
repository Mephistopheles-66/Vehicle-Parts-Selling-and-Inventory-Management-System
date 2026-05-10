import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { customers } from '@/data/mock';
import { Plus, Car, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const c = customers[0];

const MyVehicles = () => (
  <div>
    <PageHeader title="My Vehicles" actions={<Button><Plus className="h-4 w-4 mr-2" />Add vehicle</Button>} />
    <div className="p-6 lg:p-8 grid md:grid-cols-2 gap-4">
      {c.vehicles.map(v => (
        <Card key={v.id}><CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-md bg-primary/10 text-primary flex items-center justify-center"><Car className="h-6 w-6" /></div>
            <div className="flex-1">
              <div className="font-semibold text-lg">{v.make} {v.model}</div>
              <div className="text-xs font-mono text-muted-foreground mt-0.5">{v.plate} · {v.year}</div>
              <div className="mt-3 flex gap-4 text-xs"><span>Mileage <span className="font-medium tabular text-charcoal">{v.mileage.toLocaleString()} km</span></span><span>Health <span className={`font-medium ${v.healthScore > 80 ? 'text-success' : v.healthScore > 60 ? 'text-warning' : 'text-destructive'}`}>{v.healthScore}/100</span></span></div>
            </div>
          </div>
          <div className="flex gap-2 mt-4"><Button asChild size="sm" variant="outline" className="flex-1"><Link to="/customer/health">View health</Link></Button><Button size="icon" variant="ghost"><Edit className="h-4 w-4" /></Button><Button size="icon" variant="ghost"><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
        </CardContent></Card>
      ))}
    </div>
  </div>
);
export default MyVehicles;
