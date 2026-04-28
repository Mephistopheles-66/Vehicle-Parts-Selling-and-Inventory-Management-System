import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPartById, updatePart } from '../../api/partsApi'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import PartForm from './PartForm'

export default function PartEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: part, isLoading } = useQuery({
    queryKey: ['parts', id],
    queryFn: () => getPartById(id!),
    enabled: !!id,
  })

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof updatePart>[1]) => updatePart(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] })
      toast.success('Part updated successfully')
      navigate('/parts')
    },
    onError: () => {
      toast.error('Failed to update part')
    },
  })

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/parts" className="hover:text-foreground">
          Parts
        </Link>
        <span>/</span>
        <span className="text-foreground">Edit Part</span>
      </nav>

      <h1 className="text-3xl font-bold">Edit Part</h1>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : part ? (
        <PartForm
          defaultValues={{
            partNumber: part.partNumber,
            name: part.name,
            description: part.description,
            category: part.category,
            unit: part.unit,
            reorderLevel: part.reorderLevel,
            costPrice: part.costPrice,
            sellingPrice: part.sellingPrice,
            isActive: part.isActive,
          }}
          onSubmit={(data) => mutation.mutate(data)}
          isLoading={mutation.isPending}
        />
      ) : null}
    </div>
  )
}
