export interface PurchaseInvoiceLineItem {
  id: string
  partId: string
  partName: string
  partNumber: string
  quantity: number
  unitPrice: number
  total: number
}

export interface PurchaseInvoice {
  id: string
  vendorId: string
  vendorName: string
  invoiceNo: string
  invoiceDate: string
  dueDate?: string
  status: 'DRAFT' | 'POSTED' | 'CANCELLED'
  lineItems: PurchaseInvoiceLineItem[]
  subtotal: number
  discount: number
  taxAmount: number
  grandTotal: number
  amountPaid: number
  balanceDue: number
  createdAt: string
  updatedAt: string
}

export interface CreatePurchaseInvoiceDto {
  vendorId: string
  invoiceNo: string
  invoiceDate: string
  dueDate?: string
  lineItems: {
    partId: string
    quantity: number
    unitPrice: number
  }[]
  discount: number
  taxAmount: number
  amountPaid: number
}
