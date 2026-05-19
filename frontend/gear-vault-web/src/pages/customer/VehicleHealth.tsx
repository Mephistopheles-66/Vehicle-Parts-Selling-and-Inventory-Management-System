import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Check, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { getApiErrorMessage, unwrapApiResult } from '@/api/client';
import {
  AiVehicleHealthService,
  VehiclesService,
  type CreatePartFailurePredictionDto,
  type PartFailurePredictionDto,
  type VehicleDto,
} from '@/api/generated/client';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const USAGE_PATTERNS = [
  'Mixed city and highway usage',
  'Mostly city traffic',
  'Mostly highway driving',
  'Heavy daily commercial use',
  'Short trips and stop-start traffic',
  'Occasional weekend use',
  'Rough roads or hill routes',
];

const CONDITION_OPTIONS = [
  'Brake squeak',
  'Weak pickup',
  'Battery warning',
  'Unusual vibration',
  'Engine smoke',
  'Overheating',
  'Low mileage or high fuel use',
  'Tyre wear or grip issue',
  'Hard starting',
  'Dusty cabin or poor airflow',
];

const defaultForm = {
  currentMileage: '',
  averageDailyKilometers: '25',
  lastServiceDate: '',
  conditionNotes: [] as string[],
  usagePattern: 'Mixed city and highway usage',
};

const severityVariant = (severity?: string | null) => {
  const value = severity?.toLowerCase();
  if (value === 'critical' || value === 'high') return 'danger' as const;
  if (value === 'medium') return 'warning' as const;
  return 'info' as const;
};

const formatDate = (value?: string | null) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const Gauge = ({ value }: { value: number }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const normalized = Math.max(0, Math.min(100, value));
  const color =
    normalized >= 70
      ? 'hsl(var(--destructive))'
      : normalized >= 40
        ? 'hsl(var(--warning))'
        : 'hsl(var(--success))';

  return (
    <svg viewBox="0 0 120 120" className="h-28 w-28">
      <circle cx="60" cy="60" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="10" />
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - normalized / 100)}
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="58" textAnchor="middle" className="font-bold tabular" fontSize="24" fill="#1F2937">
        {Math.round(normalized)}
      </text>
      <text x="60" y="76" textAnchor="middle" fontSize="9" fill="#9CA3AF">
        risk
      </text>
    </svg>
  );
};

const PredictionCard = ({
  prediction,
  onAcknowledge,
  acknowledging,
}: {
  prediction: PartFailurePredictionDto;
  onAcknowledge: (id: string) => void;
  acknowledging: boolean;
}) => (
  <div className="rounded-md border bg-canvas p-4">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="font-medium text-charcoal">{prediction.predictedPartName ?? 'Predicted part'}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          Predicted attention date: {formatDate(prediction.predictedFailureDate)}
        </div>
      </div>
      <StatusBadge variant={severityVariant(prediction.severity)}>
        {prediction.severity ?? 'Low'} · {Math.round(prediction.riskScore ?? 0)}%
      </StatusBadge>
    </div>
    <div className="mt-3 text-sm text-charcoal">{prediction.recommendation}</div>
    <div className="mt-3 grid gap-2 text-xs text-muted-foreground md:grid-cols-2">
      <div>{prediction.conditionSummary}</div>
      <div>{prediction.usagePatternSummary}</div>
    </div>
    {!prediction.isAcknowledged ? (
      <Button
        variant="outline"
        size="sm"
        className="mt-4"
        disabled={!prediction.id || acknowledging}
        onClick={() => prediction.id && onAcknowledge(prediction.id)}
      >
        {acknowledging ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
        Acknowledge
      </Button>
    ) : (
      <div className="mt-4 text-xs text-success">Acknowledged on {formatDate(prediction.acknowledgedAt)}</div>
    )}
  </div>
);

const VehicleHealth = () => {
  const queryClient = useQueryClient();
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [form, setForm] = useState(defaultForm);

  const {
    data: vehicles = [],
    isLoading: vehiclesLoading,
    error: vehiclesError,
  } = useQuery({
    queryKey: ['my-vehicles'],
    queryFn: async () => unwrapApiResult(await VehiclesService.getMyVehicles(), []),
  });

  const {
    data: predictions = [],
    isLoading: predictionsLoading,
    error: predictionsError,
  } = useQuery({
    queryKey: ['ai-vehicle-health', 'my-predictions'],
    queryFn: async () => unwrapApiResult(await AiVehicleHealthService.getMyVehicleHealthPredictions(), []),
  });

  const selectedVehicle = useMemo<VehicleDto | undefined>(() => {
    return vehicles.find((vehicle) => vehicle.id === selectedVehicleId) ?? vehicles[0];
  }, [selectedVehicleId, vehicles]);

  const predictionsByVehicle = useMemo(() => {
    return predictions.reduce<Record<string, PartFailurePredictionDto[]>>((groups, prediction) => {
      const vehicleId = prediction.vehicle?.id;
      if (!vehicleId) return groups;
      groups[vehicleId] = [...(groups[vehicleId] ?? []), prediction];
      return groups;
    }, {});
  }, [predictions]);

  const generateMutation = useMutation({
    mutationFn: ({ vehicleId, payload }: { vehicleId: string; payload: CreatePartFailurePredictionDto }) =>
      AiVehicleHealthService.generateVehicleHealthPrediction({ vehicleId, requestBody: payload }),
    onSuccess: () => {
      toast.success('AI prediction generated');
      setForm(defaultForm);
      queryClient.invalidateQueries({ queryKey: ['ai-vehicle-health'] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Unable to generate prediction')),
  });

  const acknowledgeMutation = useMutation({
    mutationFn: (predictionId: string) =>
      AiVehicleHealthService.acknowledgeVehicleHealthPrediction({ predictionId }),
    onSuccess: () => {
      toast.success('Prediction acknowledged');
      queryClient.invalidateQueries({ queryKey: ['ai-vehicle-health'] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Unable to acknowledge prediction')),
  });

  const updateForm = (key: keyof typeof defaultForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCondition = (condition: string, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      conditionNotes: checked
        ? [...prev.conditionNotes, condition]
        : prev.conditionNotes.filter((item) => item !== condition),
    }));
  };

  const generatePrediction = () => {
    const vehicleId = selectedVehicle?.id;
    if (!vehicleId) {
      toast.error('Add a vehicle first');
      return;
    }

    const payload: CreatePartFailurePredictionDto = {
      currentMileage: form.currentMileage ? Number(form.currentMileage) : null,
      averageDailyKilometers: form.averageDailyKilometers ? Number(form.averageDailyKilometers) : null,
      lastServiceDate: form.lastServiceDate || null,
      conditionNotes: form.conditionNotes.length > 0 ? form.conditionNotes.join(', ') : null,
      usagePattern: form.usagePattern.trim() || null,
    };

    generateMutation.mutate({ vehicleId, payload });
  };

  return (
    <div>
      <PageHeader title="Vehicle Health" description="AI-powered part failure predictions across your fleet." />
      <div className="space-y-6 p-6 lg:p-8">
        {(vehiclesError || predictionsError) && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {getApiErrorMessage(vehiclesError || predictionsError, 'Unable to load vehicle health data')}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" />
              Generate AI prediction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {vehiclesLoading ? (
              <div className="text-sm text-muted-foreground">Loading vehicles...</div>
            ) : vehicles.length === 0 ? (
              <div className="text-sm text-muted-foreground">Add a vehicle first to generate predictions.</div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label>Vehicle</Label>
                    <Select
                      value={selectedVehicle?.id ?? ''}
                      onValueChange={setSelectedVehicleId}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id ?? ''}>
                            {vehicle.make} {vehicle.model} · {vehicle.vehicleNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Current mileage</Label>
                    <Input
                      type="number"
                      min="0"
                      className="mt-1.5 font-mono"
                      value={form.currentMileage}
                      onChange={(event) => updateForm('currentMileage', event.target.value)}
                      placeholder="e.g. 45000"
                    />
                  </div>
                  <div>
                    <Label>Average daily km</Label>
                    <Input
                      type="number"
                      min="0"
                      className="mt-1.5 font-mono"
                      value={form.averageDailyKilometers}
                      onChange={(event) => updateForm('averageDailyKilometers', event.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Last service date</Label>
                    <Input
                      type="date"
                      className="mt-1.5"
                      value={form.lastServiceDate}
                      onChange={(event) => updateForm('lastServiceDate', event.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Usage pattern</Label>
                    <Select
                      value={form.usagePattern}
                      onValueChange={(value) => updateForm('usagePattern', value)}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select usage pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        {USAGE_PATTERNS.map((pattern) => (
                          <SelectItem key={pattern} value={pattern}>
                            {pattern}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Condition notes</Label>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {CONDITION_OPTIONS.map((condition) => (
                      <label
                        key={condition}
                        className="flex min-h-10 cursor-pointer items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm transition-colors hover:bg-secondary/40"
                      >
                        <Checkbox
                          checked={form.conditionNotes.includes(condition)}
                          onCheckedChange={(checked) => toggleCondition(condition, checked === true)}
                        />
                        <span>{condition}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button onClick={generatePrediction} disabled={generateMutation.isPending}>
                  {generateMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate prediction
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {predictionsLoading ? (
          <div className="text-sm text-muted-foreground">Loading predictions...</div>
        ) : (
          <div className="space-y-5">
            {vehicles.map((vehicle) => {
              const vehiclePredictions = predictionsByVehicle[vehicle.id ?? ''] ?? [];
              const latestRisk = vehiclePredictions[0]?.riskScore ?? 0;

              return (
                <Card key={vehicle.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                      <div>
                        <div className="text-lg font-semibold">
                          {vehicle.make} {vehicle.model}{' '}
                          <span className="font-normal text-muted-foreground">{vehicle.year}</span>
                        </div>
                        <div className="mt-0.5 font-mono text-xs text-muted-foreground">
                          {vehicle.vehicleNumber} · {vehicle.fuelType}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Gauge value={latestRisk} />
                        <div>
                          <div className="text-xs uppercase tracking-wider text-muted-foreground">Latest AI risk</div>
                          <div className="font-semibold">
                            {latestRisk >= 70 ? 'Needs attention' : latestRisk >= 40 ? 'Monitor' : 'Healthy'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Predicted issues
                      </div>
                      {vehiclePredictions.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No AI predictions generated for this vehicle yet.</div>
                      ) : (
                        vehiclePredictions.map((prediction) => (
                          <PredictionCard
                            key={prediction.id}
                            prediction={prediction}
                            onAcknowledge={(predictionId) => acknowledgeMutation.mutate(predictionId)}
                            acknowledging={acknowledgeMutation.isPending}
                          />
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleHealth;
