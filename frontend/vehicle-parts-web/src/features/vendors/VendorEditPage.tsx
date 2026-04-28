import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getVendorById, updateVendor } from '../../api/vendorsApi'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import VendorForm from './VendorForm'

export default function VendorEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: vendor, isLoading } = useQuery({
    queryKey: ['vendors', id],
    queryFn: () => getVendorById(id!),
    enabled: !!id,
  })

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof updateVendor>[1]) => updateVendor(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] })
      toast.success('Vendor updated successfully')
      navigate('/vendors')
    },
    onError: () => {
      toast.error('Failed to update vendor')
    },
  })

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/vendors" className="hover:text-foreground">
          Vendors
        </Link>
        <span>/</span>
        <span className="text-foreground">Edit Vendor</span>
      </nav>

      <h1 className="text-3xl font-bold">Edit Vendor</h1>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full max-w-lg" />
          <Skeleton className="h-10 w-full max-w-lg" />
          <Skeleton className="h-10 w-full max-w-lg" />
          <Skeleton className="h-20 w-full max-w-lg" />
        </div>
      ) : vendor ? (
        <VendorForm
          defaultValues={{
            name: vendor.name,
            contactEmail: vendor.contactEmail,
            phone: vendor.phone,
            address: vendor.address,
            isActive: vendor.isActive,
          }}
          onSubmit={(data) => mutation.mutate(data)}
          isLoading={mutation.isPending}
        />
      ) : null}
    </div>
  )
}
