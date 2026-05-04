import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  getPurchaseInvoices,
  cancelInvoice,
} from '../../api/purchaseInvoicesApi'
import type { PurchaseInvoice } from '../../types/purchaseInvoice'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Plus, Pencil, XCircle, FileText } from 'lucide-react'

const formatNPR = (value: number) =>
  `NPR ${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}`

function getStatusBadge(status: PurchaseInvoice['status']) {
  switch (status) {
    case 'DRAFT':
      return <Badge variant="secondary">Draft</Badge>
    case 'POSTED':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Posted</Badge>
    case 'CANCELLED':
      return <Badge variant="destructive">Cancelled</Badge>
  }
}

export default function PurchaseInvoicesListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [tab, setTab] = useState('all')
  const [cancelId, setCancelId] = useState<string | null>(null)

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['purchase-invoices'],
    queryFn: getPurchaseInvoices,
  })

  const cancelMutation = useMutation({
    mutationFn: cancelInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-invoices'] })
      queryClient.invalidateQueries({ queryKey: ['parts'] })
      toast.success('Invoice cancelled successfully')
    },
    onError: () => {
      toast.error('Failed to cancel invoice')
    },
  })

  const filterByTab = (list: PurchaseInvoice[]) => {
    if (tab === 'all') return list
    return list.filter((inv) => inv.status === tab.toUpperCase())
  }

  const filtered = filterByTab(invoices ?? [])

  const renderTable = (data: PurchaseInvoice[]) => {
    if (isLoading) {
      return (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice No</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Invoice Date</TableHead>
                <TableHead>Grand Total</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Balance Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )
    }

    if (data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No invoices found</h3>
          <p className="text-muted-foreground mb-4">
            {tab !== 'all'
              ? `No ${tab} invoices yet.`
              : 'Get started by creating your first purchase invoice.'}
          </p>
          {tab === 'all' && (
            <Button onClick={() => navigate('/purchase-invoices/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Create your first invoice
            </Button>
          )}
        </div>
      )
    }

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice No</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Invoice Date</TableHead>
              <TableHead className="text-right">Grand Total</TableHead>
              <TableHead className="text-right">Amount Paid</TableHead>
              <TableHead className="text-right">Balance Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-mono">{invoice.invoiceNo}</TableCell>
                <TableCell>{invoice.vendor.name}</TableCell>
                <TableCell>
                  {new Date(invoice.invoiceDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </TableCell>
                <TableCell className="text-right">
                  {formatNPR(invoice.grandTotal)}
                </TableCell>
                <TableCell className="text-right">
                  {formatNPR(invoice.amountPaid)}
                </TableCell>
                <TableCell
                  className={`text-right ${invoice.balanceDue > 0 ? 'text-amber-600 font-medium' : ''}`}
                >
                  {formatNPR(invoice.balanceDue)}
                </TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {invoice.status === 'DRAFT' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          navigate(`/purchase-invoices/${invoice.id}/edit`)
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {invoice.status === 'POSTED' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCancelId(invoice.id)}
                      >
                        <XCircle className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Purchase Invoices</h1>
        <Button onClick={() => navigate('/purchase-invoices/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="posted">Posted</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-4">
          {renderTable(filtered)}
        </TabsContent>
      </Tabs>

      <AlertDialog
        open={!!cancelId}
        onOpenChange={(open) => !open && setCancelId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this invoice? This may reverse
              stock adjustments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Invoice</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (cancelId) {
                  cancelMutation.mutate(cancelId)
                  setCancelId(null)
                }
              }}
            >
              Cancel Invoice
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
