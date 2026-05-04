import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { customers, predictions } from '@/data/mock';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Sparkles } from 'lucide-react';

const c = customers[0];

const Gauge = ({ value }: { value: number }) => {
  const r = 50, c2 = 2 * Math.PI * r;
  const color = value > 80 ? 'hsl(var(--success))' : value > 60 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))';
  return (
    <svg viewBox="0 0 120 120" className="h-32 w-32">
      <circle cx="60" cy="60" r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="10" />
      <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={c2} strokeDashoffset={c2 * (1 - value / 100)} transform="rotate(-90 60 60)" />
      <text x="60" y="58" textAnchor="middle" className="font-bold tabular" fontSize="24" fill="#1F2937">{value}</text>
      <text x="60" y="76" textAnchor="middle" fontSize="9" fill="#9CA3AF">/ 100</text>
    </svg>
  );
};

const VehicleHealth = () => (
  <div>
    <PageHeader title="Vehicle Health" description="AI-powered predictions across your fleet." />
    <div className="p-6 lg:p-8 space-y-6">
      {c.vehicles.map(v => {
        const preds = predictions.filter(p => p.vehicleId === v.id);
        return (
          <Card key={v.id}><CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <div className="font-semibold text-lg">{v.make} {v.model} <span className="text-muted-foreground font-normal">{v.year}</span></div>
                <div className="text-xs font-mono text-muted-foreground">{v.plate}</div>
                <div className="text-xs text-muted-foreground mt-1">{v.mileage.toLocaleString()} km</div>
              </div>
              <div className="flex items-center gap-4"><Gauge value={v.healthScore} /><div><div className="text-xs uppercase tracking-wider text-muted-foreground">Condition</div><div className="font-semibold">{v.healthScore > 80 ? 'Excellent' : v.healthScore > 60 ? 'Fair' : 'Needs attention'}</div></div></div>
            </div>
            <div className="mt-6 space-y-2">
              <div className="text-sm font-medium flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Predicted issues</div>
              {preds.length === 0 ? <div className="text-sm text-muted-foreground">No issues predicted. You're good to go.</div> : preds.map(p => (
                <div key={p.id} className="p-3 rounded-md border bg-canvas">
                  <div className="flex items-center justify-between"><span className="font-medium">{p.part}</span><StatusBadge variant={p.severity === 'high' ? 'danger' : p.severity === 'medium' ? 'warning' : 'info'}>{p.severity} · {p.confidence}%</StatusBadge></div>
                  <div className="text-xs text-muted-foreground mt-1">ETA ~{p.etaDays} days</div>
                  <div className="text-sm mt-1 text-charcoal">{p.recommendation}</div>
                </div>
              ))}
            </div>
          </CardContent></Card>
        );
      })}
    </div>
  </div>
);
export default VehicleHealth;
