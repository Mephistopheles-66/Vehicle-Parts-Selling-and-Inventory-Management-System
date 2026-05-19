import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalIcon, List, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppointmentsService, UserService, VehiclesService } from '@/api/generated/client';
import { unwrapApiResult, getApiErrorMessage } from '@/api/client';
import type { AppointmentDto, CustomerSearchResultDto, VehicleDto } from '@/api/generated/client';
import { toast } from 'sonner';

const apptStatusVariant = (s?: string | null) => {
  const status = s?.toUpperCase();
  if (status === 'COMPLETED') return 'success';
  if (status === 'CANCELLED') return 'danger';
  if (status === 'CONFIRMED') return 'info';
  return 'neutral';
};

const isCompletable = (s?: string | null) => {
  const status = s?.toUpperCase();
  return status !== 'COMPLETED' && status !== 'CANCELLED';
};

const Appointments = () => {
  const [view, setView] = useState<'list' | 'cal'>('list');
  const [showNew, setShowNew] = useState(false);
  const queryClient = useQueryClient();

  // ── appointment list ──────────────────────────────────────────────────────
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['all-appointments'],
    queryFn: async () => unwrapApiResult(await AppointmentsService.getAllAppointments(), []),
  });

  const completeMutation = useMutation({
    mutationFn: (appointmentId: string) =>
      AppointmentsService.completeAppointment({ appointmentId }),
    onSuccess: () => {
      toast.success('Appointment marked as completed');
      queryClient.invalidateQueries({ queryKey: ['all-appointments'] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Could not complete appointment')),
  });

  // ── new appointment form state ────────────────────────────────────────────
  const [customerQuery, setCustomerQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSearchResultDto | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [notes, setNotes] = useState('');

  const { data: searchResults = [], isFetching: searching } = useQuery({
    queryKey: ['customer-search', customerQuery],
    queryFn: async () => unwrapApiResult(await UserService.searchCustomers({ q: customerQuery, limit: 8 }), []),
    enabled: customerQuery.trim().length >= 2 && !selectedCustomer,
  });

  // load vehicles when a customer is selected
  const { data: customerVehicles = [], isLoading: vehiclesLoading } = useQuery({
    queryKey: ['customer-vehicles', selectedCustomer?.customer?.id],
    queryFn: async () =>
      unwrapApiResult(await VehiclesService.getVehiclesByCustomerId({ customerId: selectedCustomer!.customer!.id! }), []),
    enabled: !!selectedCustomer?.customer?.id,
  });

  const createMutation = useMutation({
    mutationFn: () => AppointmentsService.createAppointmentByStaff({
      requestBody: { vehicleId: selectedVehicleId, scheduledAt, notes: notes.trim() || null },
    }),
    onSuccess: () => {
      toast.success('Appointment created');
      queryClient.invalidateQueries({ queryKey: ['all-appointments'] });
      resetForm();
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Could not create appointment')),
  });

  const resetForm = () => {
    setShowNew(false);
    setCustomerQuery('');
    setSelectedCustomer(null);
    setSelectedVehicleId('');
    setScheduledAt('');
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  return (
    <div>
      <PageHeader title="Appointments" actions={<>
        <div className="flex border rounded-md overflow-hidden">
          <button onClick={() => setView('list')} className={`px-3 py-1.5 text-sm flex items-center gap-1.5 ${view === 'list' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}><List className="h-3.5 w-3.5" />List</button>
          <button onClick={() => setView('cal')} className={`px-3 py-1.5 text-sm flex items-center gap-1.5 ${view === 'cal' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}><CalIcon className="h-3.5 w-3.5" />Calendar</button>
        </div>
        <Button onClick={() => setShowNew(true)}><Plus className="h-4 w-4 mr-2" />New</Button>
      </>} />

      <div className="p-6 lg:p-8 space-y-5">

        {/* ── New Appointment Form ── */}
        {showNew && (
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">New Appointment</CardTitle>
              <Button size="icon" variant="ghost" onClick={resetForm}><X className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">

                {/* Customer search */}
                {!selectedCustomer ? (
                  <div>
                    <Label>Customer</Label>
                    <Input
                      className="mt-1.5"
                      placeholder="Search by name, phone or email…"
                      value={customerQuery}
                      onChange={e => setCustomerQuery(e.target.value)}
                    />
                    {customerQuery.trim().length >= 2 && (
                      <div className="mt-1 border rounded-md divide-y text-sm">
                        {searching && <div className="px-3 py-2 text-muted-foreground">Searching…</div>}
                        {!searching && searchResults.length === 0 && (
                          <div className="px-3 py-2 text-muted-foreground">No customers found.</div>
                        )}
                        {searchResults.map((r: CustomerSearchResultDto) => (
                          <button
                            key={r.customer?.id}
                            type="button"
                            className="w-full text-left px-3 py-2 hover:bg-secondary transition-colors"
                            onClick={() => {
                              setSelectedCustomer(r);
                              setCustomerQuery('');
                              setSelectedVehicleId('');
                            }}
                          >
                            <span className="font-medium">{r.customer?.name}</span>
                            <span className="text-muted-foreground ml-2">{r.customer?.phoneNumber}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <Label>Customer</Label>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-sm font-medium">{selectedCustomer.customer?.name}</span>
                      <span className="text-xs text-muted-foreground">{selectedCustomer.customer?.phoneNumber}</span>
                      <button type="button" className="text-xs text-primary ml-auto" onClick={() => { setSelectedCustomer(null); setSelectedVehicleId(''); }}>Change</button>
                    </div>
                  </div>
                )}

                {/* Vehicle select */}
                {selectedCustomer && (
                  <div>
                    <Label>Vehicle</Label>
                    {vehiclesLoading ? (
                      <div className="mt-1.5 text-sm text-muted-foreground">Loading vehicles…</div>
                    ) : customerVehicles.length === 0 ? (
                      <div className="mt-1.5 text-sm text-muted-foreground">No vehicles registered for this customer.</div>
                    ) : (
                      <div className="mt-1.5 flex flex-col gap-1.5">
                        {customerVehicles.map((v: VehicleDto) => (
                          <button
                            key={v.id}
                            type="button"
                            className={`text-left text-sm px-3 py-2 rounded-md border transition-colors ${selectedVehicleId === v.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                            onClick={() => setSelectedVehicleId(v.id!)}
                          >
                            <span className="font-medium">{v.make} {v.model}</span>
                            <span className="text-muted-foreground ml-2">{v.vehicleNumber}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Date/time */}
                <div>
                  <Label>Date &amp; time</Label>
                  <Input
                    type="datetime-local"
                    className="mt-1.5"
                    value={scheduledAt}
                    onChange={e => setScheduledAt(e.target.value)}
                    required
                  />
                </div>

                {/* Notes */}
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    className="mt-1.5"
                    rows={2}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Service type, special instructions…"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    type="submit"
                    disabled={!selectedVehicleId || !scheduledAt || createMutation.isPending}
                  >
                    Create appointment
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* ── Appointment List / Calendar ── */}
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading appointments…</div>
        ) : view === 'list' ? (
          <Card><CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-deep-navy text-white">
                <tr>{['Date', 'Time', 'Customer', 'Vehicle', 'Notes', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {appointments.length === 0
                  ? <tr><td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">No appointments found.</td></tr>
                  : appointments.map((a: AppointmentDto, i: number) => {
                    const dt = a.scheduledAt ? new Date(a.scheduledAt) : null;
                    const date = dt ? dt.toLocaleDateString() : '—';
                    const time = dt ? dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';
                    return (
                      <tr key={a.id} className={`border-b ${i % 2 ? 'bg-canvas' : ''}`}>
                        <td className="px-4 py-3">{date}</td>
                        <td className="px-4 py-3 font-mono">{time}</td>
                        <td className="px-4 py-3 font-medium">{a.customerName || '—'}</td>
                        <td className="px-4 py-3 text-muted-foreground">{[a.vehicleMake, a.vehicleModel].filter(Boolean).join(' ') || a.vehicleNumber || '—'}</td>
                        <td className="px-4 py-3">{a.notes || '—'}</td>
                        <td className="px-4 py-3"><StatusBadge variant={apptStatusVariant(a.status)}>{a.status ?? '—'}</StatusBadge></td>
                        <td className="px-4 py-3">
                          {a.id && isCompletable(a.status) && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={completeMutation.isPending}
                              onClick={() => completeMutation.mutate(a.id!)}
                            >
                              Mark complete
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </CardContent></Card>
        ) : (
          <Card><CardContent className="p-6 grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => {
              const day = i + 1;
              const apt = appointments.find((a: AppointmentDto) => {
                const d = a.scheduledAt ? new Date(a.scheduledAt) : null;
                return d ? d.getDate() === day : false;
              });
              return (
                <div key={i} className="aspect-square border rounded-md p-2 text-xs hover:border-primary transition-colors">
                  <div className="text-muted-foreground tabular">{day}</div>
                  {apt && (
                    <div className="mt-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] truncate">
                      {apt.scheduledAt ? new Date(apt.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''} {apt.notes}
                    </div>
                  )}
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
