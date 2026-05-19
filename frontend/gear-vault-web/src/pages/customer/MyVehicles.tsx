import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Edit, Loader2, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { VehiclesService } from '@/api/generated/client';
import type { FuelType, VehicleDto } from '@/api/generated/client';
import { getApiErrorMessage, unwrapApiResult } from '@/api/client';
import { toast } from 'sonner';

const FUEL_TYPES: FuelType[] = ['Petrol', 'Diesel', 'Gas', 'Electric', 'Hybrid', 'CNG', 'LPG'];
const emptyForm = { vehicleNumber: '', licenseNumber: '', make: '', model: '', year: String(new Date().getFullYear()), fuelType: 'Petrol' as FuelType };

const MyVehicles = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: vehicles = [], isLoading, error } = useQuery({
    queryKey: ['my-vehicles'],
    queryFn: async () => unwrapApiResult(await VehiclesService.getMyVehicles(), []),
  });

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };
  const openEdit = (v: VehicleDto) => {
    setForm({
      vehicleNumber: v.vehicleNumber ?? '',
      licenseNumber: v.licenseNumber ?? '',
      make: v.make ?? '',
      model: v.model ?? '',
      year: String(v.year ?? new Date().getFullYear()),
      fuelType: v.fuelType ?? 'Petrol',
    });
    setEditingId(v.id ?? null);
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditingId(null); };

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        vehicleNumber: form.vehicleNumber.trim() || null,
        licenseNumber: form.licenseNumber.trim() || null,
        make: form.make.trim() || null,
        model: form.model.trim() || null,
        year: Number(form.year),
        fuelType: form.fuelType,
      };
      if (editingId) return VehiclesService.updateVehicle({ vehicleId: editingId, requestBody: payload });
      return VehiclesService.createVehicle({ requestBody: payload });
    },
    onSuccess: () => {
      toast.success(editingId ? 'Vehicle updated' : 'Vehicle added');
      queryClient.invalidateQueries({ queryKey: ['my-vehicles'] });
      closeForm();
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Unable to save vehicle')),
  });

  const deleteMutation = useMutation({
    mutationFn: (vehicleId: string) => VehiclesService.deleteVehicle({ vehicleId }),
    onSuccess: () => {
      toast.success('Vehicle removed');
      queryClient.invalidateQueries({ queryKey: ['my-vehicles'] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Unable to remove vehicle')),
  });

  const setField = (key: keyof typeof emptyForm, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div>
      <PageHeader title="My Vehicles" actions={<Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add vehicle</Button>} />
      <div className="p-6 lg:p-8 space-y-5">
        {showForm && (
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">{editingId ? 'Edit Vehicle' : 'Add Vehicle'}</CardTitle>
              <Button size="icon" variant="ghost" onClick={closeForm}><X className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Make</Label><Input className="mt-1.5" value={form.make} onChange={e => setField('make', e.target.value)} placeholder="e.g. Toyota" /></div>
                <div><Label>Model</Label><Input className="mt-1.5" value={form.model} onChange={e => setField('model', e.target.value)} placeholder="e.g. Corolla" /></div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div><Label>Year</Label><Input className="mt-1.5 font-mono" type="number" min="1900" max={new Date().getFullYear() + 1} value={form.year} onChange={e => setField('year', e.target.value)} /></div>
                <div><Label>Plate / Vehicle No.</Label><Input className="mt-1.5 font-mono" value={form.vehicleNumber} onChange={e => setField('vehicleNumber', e.target.value)} placeholder="BA 1 KHA 1234" /></div>
                <div><Label>License No.</Label><Input className="mt-1.5 font-mono" value={form.licenseNumber} onChange={e => setField('licenseNumber', e.target.value)} /></div>
              </div>
              <div className="sm:w-48">
                <Label>Fuel type</Label>
                <Select value={form.fuelType} onValueChange={value => setField('fuelType', value)}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{FUEL_TYPES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                  {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingId ? 'Update vehicle' : 'Add vehicle'}
                </Button>
                <Button variant="outline" onClick={closeForm}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading && <div className="text-sm text-muted-foreground">Loading vehicles...</div>}
        {error && <div className="text-sm text-destructive">{getApiErrorMessage(error, 'Unable to load vehicles')}</div>}
        {!isLoading && !error && vehicles.length === 0 && !showForm && (
          <div className="text-sm text-muted-foreground">No vehicles yet. Add one to get started.</div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {vehicles.map(v => (
            <Card key={v.id}><CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <Car className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-lg">{v.make} {v.model}</div>
                  <div className="text-xs font-mono text-muted-foreground mt-0.5">
                    {v.vehicleNumber} · {v.year} · {v.fuelType}
                  </div>
                  {v.licenseNumber && <div className="text-xs text-muted-foreground mt-0.5">License: {v.licenseNumber}</div>}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="icon" variant="ghost" onClick={() => openEdit(v)}><Edit className="h-4 w-4" /></Button>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={deleteMutation.isPending}
                  onClick={() => v.id && deleteMutation.mutate(v.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent></Card>
          ))}
        </div>
      </div>
    </div>
  );
};
export default MyVehicles;
