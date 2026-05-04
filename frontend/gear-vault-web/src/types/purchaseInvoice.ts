import type { Part } from './part'
import type { Vendor } from './vendor'

export interface PurchaseInvoiceLineItem {
  id: string
  part: Part
  quantity: number
  unitPrice: number
  total: number
}

export interface PurchaseInvoice {
  id: string
  vendor: Vendor
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
