import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { createPart } from '../../api/partsApi'
import { toast } from 'sonner'
import PartForm from './PartForm'

export default function PartCreatePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createPart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] })
      toast.success('Part created successfully')
      navigate('/parts')
    },
    onError: () => {
      toast.error('Failed to create part')
    },
  })

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/parts" className="hover:text-foreground">
          Parts
        </Link>
        <span>/</span>
        <span className="text-foreground">Add New Part</span>
      </nav>

      <h1 className="text-3xl font-bold">Add New Part</h1>

      <PartForm onSubmit={(data) => mutation.mutate(data)} isLoading={mutation.isPending} />
    </div>
  )
}
