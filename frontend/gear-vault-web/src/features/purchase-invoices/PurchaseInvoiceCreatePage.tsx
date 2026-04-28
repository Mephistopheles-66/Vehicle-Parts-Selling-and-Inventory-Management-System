import { useState, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getVendors } from '../../api/vendorsApi'
import { getParts } from '../../api/partsApi'
import {
  createPurchaseInvoice,
  postInvoice,
} from '../../api/purchaseInvoicesApi'
import type { CreatePurchaseInvoiceDto } from '../../types/purchaseInvoice'
import PurchaseInvoiceLineItems from './PurchaseInvoiceLineItems'
import type { LineItemInput } from './PurchaseInvoiceLineItems'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { Loader2 } from 'lucide-react'

const invoiceSchema = z.object({
  vendorId: z.string().min(1, 'Vendor is required'),
  invoiceNo: z.string().min(1, 'Invoice number is required'),
  invoiceDate: z.string().min(1, 'Invoice date is required'),
  dueDate: z.string().optional(),
  lineItems: z
    .array(
      z.object({
        partId: z.string().min(1, 'Part is required'),
        quantity: z.number().min(1, 'Min 1'),
        unitPrice: z.number().min(0, 'Min 0'),
      })
    )
    .min(1, 'At least one line item is required'),
  discount: z.number().min(0),
  taxAmount: z.number().min(0),
  amountPaid: z.number().min(0),
})

type InvoiceFormData = z.infer<typeof invoiceSchema>

const formatNPR = (value: number) =>
  `NPR ${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}`

export default function PurchaseInvoiceCreatePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [showPostConfirm, setShowPostConfirm] = useState(false)
  const [pendingPostData, setPendingPostData] = useState<CreatePurchaseInvoiceDto | null>(null)

  const { data: vendors } = useQuery({
    queryKey: ['vendors'],
    queryFn: getVendors,
  })

  const { data: parts } = useQuery({
    queryKey: ['parts'],
    queryFn: getParts,
  })

  const createMutation = useMutation({
    mutationFn: createPurchaseInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-invoices'] })
    },
  })

  const postMutation = useMutation({
    mutationFn: postInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-invoices'] })
      queryClient.invalidateQueries({ queryKey: ['parts'] })
    },
  })

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      vendorId: '',
      invoiceNo: '',
      invoiceDate: '',
      dueDate: '',
      lineItems: [{ partId: '', quantity: 1, unitPrice: 0 }],
      discount: 0,
      taxAmount: 0,
      amountPaid: 0,
    },
  })

  const lineItems = watch('lineItems') as LineItemInput[]
  const discount = watch('discount')
  const taxAmount = watch('taxAmount')
  const amountPaid = watch('amountPaid')

  const subtotal = useMemo(
    () => lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    [lineItems]
  )
  const grandTotal = subtotal - (discount || 0) + (taxAmount || 0)
  const balanceDue = grandTotal - (amountPaid || 0)

  const buildDto = (data: InvoiceFormData): CreatePurchaseInvoiceDto => ({
    vendorId: data.vendorId,
    invoiceNo: data.invoiceNo,
    invoiceDate: data.invoiceDate,
    dueDate: data.dueDate || undefined,
    lineItems: data.lineItems,
    discount: data.discount,
    taxAmount: data.taxAmount,
    amountPaid: data.amountPaid,
  })

  const handleSaveDraft = handleSubmit(async (data) => {
    try {
      await createMutation.mutateAsync(buildDto(data))
      toast.success('Invoice saved as draft')
      navigate('/purchase-invoices')
    } catch {
      toast.error('Failed to save invoice')
    }
  })

  const handlePostIntent = handleSubmit((data) => {
    setPendingPostData(buildDto(data))
    setShowPostConfirm(true)
  })

  const handlePostConfirm = async () => {
    if (!pendingPostData) return
    try {
      const invoice = await createMutation.mutateAsync(pendingPostData)
      await postMutation.mutateAsync(invoice.id)
      toast.success('Invoice posted successfully')
      navigate('/purchase-invoices')
    } catch {
      toast.error('Failed to post invoice')
    } finally {
      setShowPostConfirm(false)
      setPendingPostData(null)
    }
  }

  const isSubmitting = createMutation.isPending || postMutation.isPending

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/purchase-invoices" className="hover:text-foreground">
          Purchase Invoices
        </Link>
        <span>/</span>
        <span className="text-foreground">Create Invoice</span>
      </nav>

      <h1 className="text-3xl font-bold">Create Purchase Invoice</h1>

      <div className="space-y-8">
        {/* HEADER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Vendor *</Label>
              <Controller
                name="vendorId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {(vendors ?? []).map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.vendorId && (
                <p className="text-sm text-destructive">{errors.vendorId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceNo">Invoice No *</Label>
              <Input id="invoiceNo" placeholder="INV-001" {...register('invoiceNo')} />
              {errors.invoiceNo && (
                <p className="text-sm text-destructive">{errors.invoiceNo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceDate">Invoice Date *</Label>
              <Input id="invoiceDate" type="date" {...register('invoiceDate')} />
              {errors.invoiceDate && (
                <p className="text-sm text-destructive">{errors.invoiceDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" {...register('dueDate')} />
            </div>
          </div>

          <div className="flex justify-end items-start">
            <Badge variant="secondary" className="text-base px-4 py-1">
              DRAFT
            </Badge>
          </div>
        </div>

        {/* LINE ITEMS */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Line Items</h2>
          {errors.lineItems && !Array.isArray(errors.lineItems) && (
            <p className="text-sm text-destructive">{errors.lineItems.message}</p>
          )}
          <Controller
            name="lineItems"
            control={control}
            render={({ field }) => (
              <PurchaseInvoiceLineItems
                parts={parts ?? []}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        {/* SUMMARY */}
        <div className="flex justify-end">
          <Card className="w-full max-w-sm">
            <CardContent className="pt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatNPR(subtotal)}</span>
              </div>

              <div className="flex justify-between items-center">
                <Label htmlFor="discount" className="text-sm text-muted-foreground">
                  Discount (NPR)
                </Label>
                <Input
                  id="discount"
                  type="number"
                  step="0.01"
                  min={0}
                  className="w-36 text-right"
                  {...register('discount', { valueAsNumber: true })}
                />
              </div>

              <div className="flex justify-between items-center">
                <Label htmlFor="taxAmount" className="text-sm text-muted-foreground">
                  Tax Amount (NPR)
                </Label>
                <Input
                  id="taxAmount"
                  type="number"
                  step="0.01"
                  min={0}
                  className="w-36 text-right"
                  {...register('taxAmount', { valueAsNumber: true })}
                />
              </div>

              <div className="flex justify-between border-t pt-3">
                <span className="font-bold text-lg">Grand Total</span>
                <span className="font-bold text-lg">{formatNPR(grandTotal)}</span>
              </div>

              <div className="flex justify-between items-center">
                <Label htmlFor="amountPaid" className="text-sm text-muted-foreground">
                  Amount Paid (NPR)
                </Label>
                <Input
                  id="amountPaid"
                  type="number"
                  step="0.01"
                  min={0}
                  className="w-36 text-right"
                  {...register('amountPaid', { valueAsNumber: true })}
                />
              </div>

              <div className="flex justify-between border-t pt-3">
                <span className="font-medium">Balance Due</span>
                <span
                  className={`font-medium ${balanceDue > 0 ? 'text-amber-600' : ''}`}
                >
                  {formatNPR(balanceDue)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 border-t pt-6">
          <Button
            type="button"
            className="bg-amber-600 hover:bg-amber-700"
            disabled={isSubmitting}
            onClick={handlePostIntent}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post Invoice
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={handleSaveDraft}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save as Draft
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={isSubmitting}
            onClick={() => navigate('/purchase-invoices')}
          >
            Cancel
          </Button>
        </div>
      </div>

      <AlertDialog open={showPostConfirm} onOpenChange={setShowPostConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Post Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Posting this invoice will update stock quantities. This cannot be
              undone. Continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePostConfirm}>
              Post Invoice
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
