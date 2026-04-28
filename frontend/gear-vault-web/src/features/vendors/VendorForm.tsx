import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'
import type { CreateVendorDto } from '../../types/vendor'

const vendorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contactEmail: z.union([z.string().email('Invalid email'), z.literal('')]).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  isActive: z.boolean(),
})

interface VendorFormProps {
  defaultValues?: Partial<CreateVendorDto>
  onSubmit: (data: CreateVendorDto) => void
  isLoading: boolean
}

export default function VendorForm({ defaultValues, onSubmit, isLoading }: VendorFormProps) {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateVendorDto>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: '',
      contactEmail: '',
      phone: '',
      address: '',
      isActive: true,
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input id="name" placeholder="Vendor name" {...register('name')} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactEmail">Email</Label>
        <Input
          id="contactEmail"
          type="email"
          placeholder="vendor@example.com"
          {...register('contactEmail')}
        />
        {errors.contactEmail && (
          <p className="text-sm text-destructive">{errors.contactEmail.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" placeholder="Phone number" {...register('phone')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          placeholder="Vendor address"
          rows={3}
          {...register('address')}
        />
      </div>

      <div className="flex items-center space-x-2">
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

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate('/vendors')}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
