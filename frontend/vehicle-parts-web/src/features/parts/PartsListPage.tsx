import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getParts, deletePart } from '../../api/partsApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Package } from 'lucide-react'
import type { Part } from '../../types/part'

const CATEGORIES = ['Engine', 'Brakes', 'Electrical', 'Filters', 'Tyres', 'Hardware', 'Other']

const formatNPR = (value: number) =>
  `NPR ${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}`

function getStatusBadge(part: Part) {
  if (part.stockQty === 0) {
    return <Badge variant="destructive">Out of Stock</Badge>
  }
  if (part.stockQty <= part.reorderLevel) {
    return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Low Stock</Badge>
  }
  return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>
}

function getRowClassName(part: Part) {
  if (part.stockQty === 0) return 'opacity-60'
  if (part.stockQty <= part.reorderLevel) return 'border-l-4 border-amber-400'
  return ''
}

export default function PartsListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: parts, isLoading } = useQuery({
    queryKey: ['parts'],
    queryFn: getParts,
  })

  const deleteMutation = useMutation({
    mutationFn: deletePart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] })
      toast.success('Part deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete part')
    },
  })

  const filteredParts = (parts ?? []).filter((part) => {
    if (search) {
      const s = search.toLowerCase()
      if (
        !part.partNumber.toLowerCase().includes(s) &&
        !part.name.toLowerCase().includes(s)
      ) {
        return false
      }
    }
    if (category !== 'all' && part.category !== category) return false
    if (statusFilter === 'in-stock') return part.stockQty > 0 && part.stockQty > part.reorderLevel
    if (statusFilter === 'low-stock') return part.stockQty > 0 && part.stockQty <= part.reorderLevel
    if (statusFilter === 'out-of-stock') return part.stockQty === 0
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Parts</h1>
        <Button onClick={() => navigate('/parts/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Part
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search by part number or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={category} onValueChange={(v) => setCategory(v ?? 'all')}>
          <SelectTrigger className="sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? 'all')}>
          <SelectTrigger className="sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Stock Qty</TableHead>
                <TableHead>Reorder Level</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 9 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : filteredParts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No parts found</h3>
          <p className="text-muted-foreground mb-4">
            {search || category !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your filters.'
              : 'Get started by adding your first part.'}
          </p>
          {!search && category === 'all' && statusFilter === 'all' && (
            <Button onClick={() => navigate('/parts/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Add your first part
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Stock Qty</TableHead>
                <TableHead className="text-right">Reorder Level</TableHead>
                <TableHead className="text-right">Selling Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParts.map((part) => (
                <TableRow key={part.id} className={getRowClassName(part)}>
                  <TableCell className="font-mono">{part.partNumber}</TableCell>
                  <TableCell>{part.name}</TableCell>
                  <TableCell>{part.category ?? '—'}</TableCell>
                  <TableCell>{part.unit}</TableCell>
                  <TableCell className="text-right">{part.stockQty}</TableCell>
                  <TableCell className="text-right">{part.reorderLevel}</TableCell>
                  <TableCell className="text-right">{formatNPR(part.sellingPrice)}</TableCell>
                  <TableCell>{getStatusBadge(part)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/parts/${part.id}/edit`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(part.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Part</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this part? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  deleteMutation.mutate(deleteId)
                  setDeleteId(null)
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
