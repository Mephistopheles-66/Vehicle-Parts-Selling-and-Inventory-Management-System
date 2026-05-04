import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Info } from 'lucide-react'
import type { CreatePartDto } from '../../types/part'

const CATEGORIES = ['Engine', 'Brakes', 'Electrical', 'Filters', 'Tyres', 'Hardware', 'Other'] as const
const UNITS = ['PIECE', 'BOX', 'METER', 'LITER', 'KG'] as const

const partSchema = z.object({
  partNumber: z.string().min(1, 'Part number is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.string().optional(),
  unit: z.enum(UNITS),
  reorderLevel: z.number({ invalid_type_error: 'Required' }).min(0, 'Must be 0 or greater'),
  sellingPrice: z.number({ invalid_type_error: 'Required' }).min(0, 'Must be 0 or greater'),
  isActive: z.boolean(),
})

interface PartFormProps {
  defaultValues?: Partial<CreatePartDto>
  onSubmit: (data: CreatePartDto) => void
  isLoading: boolean
}

export default function PartForm({ defaultValues, onSubmit, isLoading }: PartFormProps) {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreatePartDto>({
    resolver: zodResolver(partSchema),
    defaultValues: {
      partNumber: '',
      name: '',
      description: '',
      category: '',
      unit: 'PIECE',
      reorderLevel: 0,
      sellingPrice: 0,
      isActive: true,
      ...defaultValues,
    },
  })

  const { onChange: onPartNumberChange, ...partNumberRest } = register('partNumber')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Stock quantity is managed through Purchase and Sales Invoices.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="partNumber">Part Number *</Label>
          <Input
            id="partNumber"
            placeholder="e.g. BRK-001"
            className="font-mono"
            {...partNumberRest}
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase()
              onPartNumberChange(e)
            }}
          />
          {errors.partNumber && (
            <p className="text-sm text-destructive">{errors.partNumber.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" placeholder="Part name" {...register('name')} />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Optional description"
            rows={3}
            {...register('description')}
          />
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select value={field.value || ''} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Unit *</Label>
          <Controller
            name="unit"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reorderLevel">Reorder Level</Label>
          <Input
            id="reorderLevel"
            type="number"
            min={0}
            {...register('reorderLevel', { valueAsNumber: true })}
          />
          {errors.reorderLevel && (
            <p className="text-sm text-destructive">{errors.reorderLevel.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sellingPrice">Selling Price (NPR)</Label>
          <Input
            id="sellingPrice"
            type="number"
            step="0.01"
            min={0}
            {...register('sellingPrice', { valueAsNumber: true })}
          />
          {errors.sellingPrice && (
            <p className="text-sm text-destructive">{errors.sellingPrice.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2 pt-6">
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Switch
                id="isActive"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="isActive">Active</Label>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate('/parts')}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
