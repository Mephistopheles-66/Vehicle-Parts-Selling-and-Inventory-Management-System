import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRs } from '@/lib/format';
import { Building2, Download, Loader2, Mail, MapPin, Package, Phone, Star, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AppointmentsService, PartRequestsService, PartsService, ReviewsService, SalesInvoiceService, VehiclesService } from '@/api/generated/client';
import { getApiErrorMessage, unwrapApiResult } from '@/api/client';
import { toast } from 'sonner';

// ─── Service Center ──────────────────────────────────────────────────────────

export const ServiceCenter = () => (
  <div>
    <PageHeader title="Service Center" description="About Gear Vault." />
    <div className="p-6 lg:p-8 grid lg:grid-cols-3 gap-5">
      <Card className="lg:col-span-2"><CardContent className="p-6">
        <h2 className="text-xl font-bold text-charcoal">Gear Vault Service Center</h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">A full-service automotive workshop and parts retailer. We specialize in OEM-grade replacements, preventive maintenance, and AI-driven diagnostics.</p>
        <div className="mt-5 grid sm:grid-cols-2 gap-3 text-sm">
          {['Engine diagnostics & service','Brake system overhaul','Tire rotation & alignment','Battery & electrical','AC service','Oil & lubricants'].map(s => (
            <div key={s} className="flex items-center gap-2 p-3 rounded-md bg-canvas border">
              <div className="h-2 w-2 rounded-full bg-primary" />{s}
            </div>
          ))}
        </div>
        <div className="mt-6 aspect-[16/7] rounded-lg bg-deep-navy flex items-center justify-center text-white/40 text-sm"><MapPin className="h-5 w-5 mr-2" />Map placeholder · Kathmandu, Nepal</div>
      </CardContent></Card>
      <Card><CardContent className="p-6 space-y-4 text-sm">
        <div className="flex items-center gap-3"><Building2 className="h-4 w-4 text-primary" /><div><div className="text-xs text-muted-foreground">Location</div><div className="font-medium">Balaju, Kathmandu</div></div></div>
        <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /><div><div className="text-xs text-muted-foreground">Phone</div><div className="font-mono">+977 014441111</div></div></div>
        <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /><div><div className="text-xs text-muted-foreground">Email</div><div>hello@gearvault.com</div></div></div>
        <div className="border-t pt-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Hours</div>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between"><span>Mon – Fri</span><span className="tabular">8:00 – 19:00</span></div>
            <div className="flex justify-between"><span>Saturday</span><span className="tabular">9:00 – 17:00</span></div>
            <div className="flex justify-between"><span>Sunday</span><span className="text-muted-foreground">Closed</span></div>
          </div>
        </div>
      </CardContent></Card>
    </div>
  </div>
);

// ─── Book Appointment ─────────────────────────────────────────────────────────

export const BookAppointment = () => {
  const queryClient = useQueryClient();
  const [vehicleId, setVehicleId] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [notes, setNotes] = useState('');

  const { data: vehicles = [], isLoading: vehiclesLoading } = useQuery({
    queryKey: ['my-vehicles'],
    queryFn: async () => unwrapApiResult(await VehiclesService.getMyVehicles(), []),
  });

  const bookMutation = useMutation({
    mutationFn: () => AppointmentsService.createAppointment({
      requestBody: { vehicleId, scheduledAt, notes: notes.trim() || null },
    }),
    onSuccess: () => {
      toast.success('Appointment booked');
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] });
      setVehicleId('');
      setScheduledAt('');
      setNotes('');
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Unable to book appointment')),
  });

  const submit = (e: React.FormEvent) => { e.preventDefault(); bookMutation.mutate(); };

  return (
    <div>
      <PageHeader title="Book Appointment" />
      <form onSubmit={submit} className="p-6 lg:p-8 max-w-xl">
        <Card><CardContent className="p-6 space-y-4">
          {vehiclesLoading && <div className="text-sm text-muted-foreground">Loading vehicles...</div>}
          {!vehiclesLoading && vehicles.length === 0 && (
            <div className="text-sm text-muted-foreground">Add a vehicle first before booking an appointment.</div>
          )}
          <div>
            <Label>Vehicle</Label>
            <Select value={vehicleId} onValueChange={setVehicleId} required>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select a vehicle" /></SelectTrigger>
              <SelectContent>
                {vehicles.map(v => (
                  <SelectItem key={v.id} value={v.id!}>
                    {v.make} {v.model} · {v.vehicleNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date & time</Label>
            <Input type="datetime-local" className="mt-1.5" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} required />
          </div>
          <div><Label>Notes</Label><Textarea className="mt-1.5" rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Anything we should know?" /></div>
          <Button type="submit" className="w-full" disabled={bookMutation.isPending || vehicles.length === 0}>
            {bookMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Book appointment
          </Button>
        </CardContent></Card>
      </form>
    </div>
  );
};

// ─── My Appointments ──────────────────────────────────────────────────────────

export const MyAppointments = () => {
  const queryClient = useQueryClient();
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [newScheduledAt, setNewScheduledAt] = useState('');
  const [rescheduleNotes, setRescheduleNotes] = useState('');

  const { data: appointments = [], isLoading, error } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: async () => unwrapApiResult(await AppointmentsService.getMyAppointments(), []),
  });

  const cancelMutation = useMutation({
    mutationFn: (appointmentId: string) => AppointmentsService.cancelAppointment({ appointmentId }),
    onSuccess: () => {
      toast.success('Appointment cancelled');
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Unable to cancel appointment')),
  });

  const rescheduleMutation = useMutation({
    mutationFn: (appointmentId: string) => AppointmentsService.rescheduleAppointment({
      appointmentId,
      requestBody: { scheduledAt: newScheduledAt, notes: rescheduleNotes.trim() || null },
    }),
    onSuccess: () => {
      toast.success('Appointment rescheduled');
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] });
      setReschedulingId(null);
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Unable to reschedule appointment')),
  });

  const statusVariant = (s?: string | null) => {
    if (s === 'Completed') return 'success';
    if (s === 'Cancelled') return 'danger';
    if (s === 'InProgress') return 'info';
    return 'neutral';
  };

  return (
    <div>
      <PageHeader title="My Appointments" />
      <div className="p-6 lg:p-8 space-y-3">
        {isLoading && <div className="text-sm text-muted-foreground">Loading appointments...</div>}
        {error && <div className="text-sm text-destructive">{getApiErrorMessage(error, 'Unable to load appointments')}</div>}
        {!isLoading && !error && appointments.length === 0 && (
          <div className="text-sm text-muted-foreground">No appointments yet.</div>
        )}
        {appointments.map(a => (
          <Card key={a.id}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold">{a.vehicleMake} {a.vehicleModel}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{a.vehicleNumber}</div>
                  <div className="text-xs font-mono mt-1">{a.scheduledAt ? new Date(a.scheduledAt).toLocaleString() : '—'}</div>
                  {a.notes && <div className="text-sm text-charcoal mt-1">{a.notes}</div>}
                </div>
                <StatusBadge variant={statusVariant(a.status)}>{a.status}</StatusBadge>
              </div>

              {reschedulingId === a.id && (
                <div className="border rounded-md p-4 space-y-3 bg-canvas">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Reschedule</span>
                    <Button size="icon" variant="ghost" onClick={() => setReschedulingId(null)}><X className="h-4 w-4" /></Button>
                  </div>
                  <div><Label>New date & time</Label><Input type="datetime-local" className="mt-1.5" value={newScheduledAt} onChange={e => setNewScheduledAt(e.target.value)} /></div>
                  <div><Label>Notes</Label><Textarea className="mt-1.5" rows={2} value={rescheduleNotes} onChange={e => setRescheduleNotes(e.target.value)} /></div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => a.id && rescheduleMutation.mutate(a.id)} disabled={rescheduleMutation.isPending}>
                      {rescheduleMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Confirm
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setReschedulingId(null)}>Cancel</Button>
                  </div>
                </div>
              )}

              {a.status === 'Scheduled' && reschedulingId !== a.id && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setReschedulingId(a.id ?? null); setNewScheduledAt(''); setRescheduleNotes(a.notes ?? ''); }}>
                    Reschedule
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive" disabled={cancelMutation.isPending} onClick={() => a.id && cancelMutation.mutate(a.id)}>
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ─── Browse Parts ─────────────────────────────────────────────────────────────

export const BrowseParts = () => {
  const [q, setQ] = useState('');

  const { data: parts = [], isLoading } = useQuery({
    queryKey: ['parts'],
    queryFn: async () => unwrapApiResult(await PartsService.getAllParts(), []),
  });

  const filtered = parts.filter(p => (p.name ?? '').toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader title="Browse Parts" />
      <div className="p-6 lg:p-8 space-y-5">
        <Card><CardContent className="p-4 flex gap-3">
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search parts…" />
        </CardContent></Card>
        {isLoading && <div className="text-sm text-muted-foreground">Loading parts...</div>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => (
            <Card key={p.id} className="hover:shadow-md transition-all"><CardContent className="p-4">
              <div className="aspect-square rounded-md bg-secondary flex items-center justify-center"><Package className="h-10 w-10 text-muted-foreground" /></div>
              <div className="mt-3">
                <div className="font-medium text-sm leading-snug">{p.name}</div>
                <div className="text-xs font-mono text-muted-foreground mt-1">{p.partNumber}</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold tabular">{formatRs(p.sellingPrice ?? 0)}</span>
                  <StatusBadge variant={(p.stockQuantity ?? 0) > 0 ? 'success' : 'danger'}>
                    {(p.stockQuantity ?? 0) > 0 ? 'In stock' : 'Out of stock'}
                  </StatusBadge>
                </div>
              </div>
            </CardContent></Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Request Part ─────────────────────────────────────────────────────────────

export const RequestPart = () => {
  const queryClient = useQueryClient();
  const [partName, setPartName] = useState('');
  const [description, setDescription] = useState('');

  const requestMutation = useMutation({
    mutationFn: () => PartRequestsService.createPartRequest({
      requestBody: { partName: partName.trim() || null, description: description.trim() || null },
    }),
    onSuccess: () => {
      toast.success('Request submitted');
      queryClient.invalidateQueries({ queryKey: ['my-part-requests'] });
      setPartName('');
      setDescription('');
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Unable to submit request')),
  });

  const submit = (e: React.FormEvent) => { e.preventDefault(); requestMutation.mutate(); };

  return (
    <div>
      <PageHeader title="Request a Part" description="Can't find it? We'll source it for you." />
      <form onSubmit={submit} className="p-6 lg:p-8 max-w-xl">
        <Card><CardContent className="p-6 space-y-4">
          <div><Label>Part name</Label><Input className="mt-1.5" value={partName} onChange={e => setPartName(e.target.value)} placeholder="e.g. Timing belt for Honda Civic 2019" required /></div>
          <div><Label>Notes</Label><Textarea className="mt-1.5" rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="OEM preferred, color, any other details…" /></div>
          <Button type="submit" className="w-full" disabled={requestMutation.isPending}>
            {requestMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Submit request
          </Button>
        </CardContent></Card>
      </form>
    </div>
  );
};

// ─── Purchase History ─────────────────────────────────────────────────────────

export const PurchaseHistory = () => {
  const { data: invoices = [], isLoading, error } = useQuery({
    queryKey: ['my-invoices'],
    queryFn: async () => unwrapApiResult(await SalesInvoiceService.getMyInvoices(), []),
  });

  const statusVariant = (s?: string) => {
    if (s === 'Paid') return 'success';
    if (s === 'Overdue') return 'danger';
    return 'warning';
  };

  return (
    <div>
      <PageHeader title="Purchase History" />
      <div className="p-6 lg:p-8">
        <Card><CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-deep-navy text-white">
              <tr>{['Invoice','Date','Items','Total','Status'].map(h => <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider">{h}</th>)}</tr>
            </thead>
            <tbody>
              {isLoading && <tr><td className="px-4 py-8 text-center text-muted-foreground" colSpan={5}>Loading history...</td></tr>}
              {error && <tr><td className="px-4 py-8 text-center text-destructive" colSpan={5}>{getApiErrorMessage(error, 'Unable to load history')}</td></tr>}
              {!isLoading && !error && invoices.length === 0 && <tr><td className="px-4 py-8 text-center text-muted-foreground" colSpan={5}>No purchase history yet.</td></tr>}
              {invoices.map((inv, idx) => (
                <tr key={inv.id} className={`border-b ${idx % 2 ? 'bg-canvas' : ''}`}>
                  <td className="px-4 py-3 font-mono text-xs">
                    <Link to={`/customer/invoices/${inv.id}`} className="text-primary">{inv.invoiceNumber ?? inv.id}</Link>
                  </td>
                  <td className="px-4 py-3">{inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3">{inv.items?.length ?? 0}</td>
                  <td className="px-4 py-3 tabular font-medium">{formatRs(inv.totalAmount ?? 0)}</td>
                  <td className="px-4 py-3"><StatusBadge variant={statusVariant(inv.paymentStatus)}>{inv.paymentStatus}</StatusBadge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent></Card>
      </div>
    </div>
  );
};

// ─── My Invoices ──────────────────────────────────────────────────────────────

export const MyInvoices = () => {
  const { data: invoices = [], isLoading, error } = useQuery({
    queryKey: ['my-invoices'],
    queryFn: async () => unwrapApiResult(await SalesInvoiceService.getMyInvoices(), []),
  });

  const statusVariant = (s?: string) => {
    if (s === 'Paid') return 'success';
    if (s === 'Overdue') return 'danger';
    return 'warning';
  };

  return (
    <div>
      <PageHeader title="My Invoices" />
      <div className="p-6 lg:p-8 space-y-3">
        {isLoading && <div className="text-sm text-muted-foreground">Loading invoices...</div>}
        {error && <div className="text-sm text-destructive">{getApiErrorMessage(error, 'Unable to load invoices')}</div>}
        {!isLoading && !error && invoices.length === 0 && <div className="text-sm text-muted-foreground">No invoices yet.</div>}
        {invoices.map(inv => (
          <Card key={inv.id}><CardContent className="p-5 flex items-center justify-between gap-4">
            <div>
              <div className="font-mono text-sm font-semibold">{inv.invoiceNumber ?? inv.id}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : '—'} · {inv.items?.length ?? 0} items
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="tabular font-bold">{formatRs(inv.totalAmount ?? 0)}</span>
              <StatusBadge variant={statusVariant(inv.paymentStatus)}>{inv.paymentStatus}</StatusBadge>
              <Button size="sm" variant="outline" asChild><Link to={`/customer/invoices/${inv.id}`}><Download className="h-4 w-4 mr-1" />View</Link></Button>
            </div>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
};

// ─── Reviews ──────────────────────────────────────────────────────────────────

const StarPicker = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map(s => (
      <button key={s} type="button" onClick={() => onChange(s)} className="focus:outline-none">
        <Star className={`h-5 w-5 ${s <= value ? 'fill-warning text-warning' : 'text-muted-foreground'}`} />
      </button>
    ))}
  </div>
);

export const Reviews = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [appointmentId, setAppointmentId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const { data: reviews = [], isLoading, error } = useQuery({
    queryKey: ['my-reviews'],
    queryFn: async () => unwrapApiResult(await ReviewsService.getMyReviews(), []),
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: async () => unwrapApiResult(await AppointmentsService.getMyAppointments(), []),
  });

  const completedAppointments = appointments.filter(a => a.status === 'Completed');
  const reviewedIds = new Set(reviews.map(r => r.appointmentId));
  const unreviewedAppointments = completedAppointments.filter(a => !reviewedIds.has(a.id));

  const submitMutation = useMutation({
    mutationFn: () => ReviewsService.createReview({
      requestBody: { appointmentId, rating, comment: comment.trim() || null },
    }),
    onSuccess: () => {
      toast.success('Review submitted');
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      setShowForm(false);
      setAppointmentId('');
      setRating(5);
      setComment('');
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Unable to submit review')),
  });

  return (
    <div>
      <PageHeader title="My Reviews" actions={<Button onClick={() => setShowForm(true)} disabled={unreviewedAppointments.length === 0}>Write a review</Button>} />
      <div className="p-6 lg:p-8 space-y-3">
        {showForm && (
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Write a Review</CardTitle>
              <Button size="icon" variant="ghost" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Appointment</Label>
                <Select value={appointmentId} onValueChange={setAppointmentId}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select a completed appointment" /></SelectTrigger>
                  <SelectContent>
                    {unreviewedAppointments.map(a => (
                      <SelectItem key={a.id} value={a.id!}>
                        {a.vehicleMake} {a.vehicleModel} — {a.scheduledAt ? new Date(a.scheduledAt).toLocaleDateString() : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Rating</Label><div className="mt-1.5"><StarPicker value={rating} onChange={setRating} /></div></div>
              <div><Label>Comment</Label><Textarea className="mt-1.5" rows={3} value={comment} onChange={e => setComment(e.target.value)} placeholder="Tell us about your experience…" /></div>
              <div className="flex gap-2">
                <Button onClick={() => submitMutation.mutate()} disabled={submitMutation.isPending || !appointmentId}>
                  {submitMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Submit review
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading && <div className="text-sm text-muted-foreground">Loading reviews...</div>}
        {error && <div className="text-sm text-destructive">{getApiErrorMessage(error, 'Unable to load reviews')}</div>}
        {!isLoading && !error && reviews.length === 0 && !showForm && (
          <div className="text-sm text-muted-foreground">No reviews yet. Complete an appointment to leave one.</div>
        )}

        {reviews.map(r => (
          <Card key={r.id}><CardContent className="p-5">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(s => <Star key={s} className={`h-4 w-4 ${s <= (r.rating ?? 0) ? 'fill-warning text-warning' : 'text-muted-foreground'}`} />)}
            </div>
            {r.comment && <div className="text-sm text-charcoal mt-2">{r.comment}</div>}
            <div className="text-xs text-muted-foreground mt-3">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</div>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
};
