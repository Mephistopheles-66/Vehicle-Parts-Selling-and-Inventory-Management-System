import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { createVendor } from '../../api/vendorsApi'
import { toast } from 'sonner'
import VendorForm from './VendorForm'

export default function VendorCreatePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] })
      toast.success('Vendor created successfully')
      navigate('/vendors')
    },
    onError: () => {
      toast.error('Failed to create vendor')
    },
  })

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/vendors" className="hover:text-foreground">
          Vendors
        </Link>
        <span>/</span>
        <span className="text-foreground">Add New Vendor</span>
      </nav>

      <h1 className="text-3xl font-bold">Add New Vendor</h1>

      <VendorForm onSubmit={(data) => mutation.mutate(data)} isLoading={mutation.isPending} />
    </div>
  )
}
