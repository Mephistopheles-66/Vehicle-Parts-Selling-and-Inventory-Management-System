import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { appointments } from '@/data/mock';
import { Calendar as CalIcon, List, Plus } from 'lucide-react';
import { useState } from 'react';
import { StatusBadge } from '@/components/shared/StatusBadge';

const Appointments = () => {
  const [view, setView] = useState<'list' | 'cal'>('list');
  return (
    <div>
      <PageHeader title="Appointments" actions={<>
        <div className="flex border rounded-md overflow-hidden">
          <button onClick={() => setView('list')} className={`px-3 py-1.5 text-sm flex items-center gap-1.5 ${view === 'list' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}><List className="h-3.5 w-3.5" />List</button>
          <button onClick={() => setView('cal')} className={`px-3 py-1.5 text-sm flex items-center gap-1.5 ${view === 'cal' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}><CalIcon className="h-3.5 w-3.5" />Calendar</button>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />New</Button>
      </>} />
      <div className="p-6 lg:p-8">
        {view === 'list' ? (
          <Card><CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-deep-navy text-white"><tr>{['Date','Time','Customer','Vehicle','Service','Status'].map(h=><th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider">{h}</th>)}</tr></thead>
              <tbody>{appointments.map((a, i) => (
                <tr key={a.id} className={`border-b ${i%2?'bg-canvas':''}`}>
                  <td className="px-4 py-3">{a.date}</td>
                  <td className="px-4 py-3 font-mono">{a.time}</td>
                  <td className="px-4 py-3 font-medium">{a.customerName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.vehicleLabel}</td>
                  <td className="px-4 py-3">{a.service}</td>
                  <td className="px-4 py-3"><StatusBadge variant={a.status === 'completed' ? 'success' : a.status === 'in-progress' ? 'info' : a.status === 'cancelled' ? 'danger' : 'neutral'}>{a.status}</StatusBadge></td>
                </tr>))}</tbody>
            </table>
          </CardContent></Card>
        ) : (
          <Card><CardContent className="p-6 grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => {
              const apt = appointments.find(a => +a.date.split('-')[2] === i + 1);
              return (
                <div key={i} className="aspect-square border rounded-md p-2 text-xs hover:border-primary transition-colors">
                  <div className="text-muted-foreground tabular">{i + 1}</div>
                  {apt && <div className="mt-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] truncate">{apt.time} {apt.service}</div>}
                </div>
              );
            })}
          </CardContent></Card>
        )}
      </div>
    </div>
  );
};
export default Appointments;
