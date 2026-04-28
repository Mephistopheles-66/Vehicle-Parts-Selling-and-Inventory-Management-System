import axios from 'axios'
import type { PurchaseInvoice, CreatePurchaseInvoiceDto } from '../types/purchaseInvoice'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export const getPurchaseInvoices = async (): Promise<PurchaseInvoice[]> => {
  const { data } = await api.get<PurchaseInvoice[]>('/api/purchase-invoices')
  return data
}

export const getPurchaseInvoiceById = async (id: string): Promise<PurchaseInvoice> => {
  const { data } = await api.get<PurchaseInvoice>(`/api/purchase-invoices/${id}`)
  return data
}

export const createPurchaseInvoice = async (dto: CreatePurchaseInvoiceDto): Promise<PurchaseInvoice> => {
  const { data } = await api.post<PurchaseInvoice>('/api/purchase-invoices', dto)
  return data
}

export const postInvoice = async (id: string): Promise<PurchaseInvoice> => {
  const { data } = await api.put<PurchaseInvoice>(`/api/purchase-invoices/${id}/post`)
  return data
}

export const cancelInvoice = async (id: string): Promise<PurchaseInvoice> => {
  const { data } = await api.put<PurchaseInvoice>(`/api/purchase-invoices/${id}/cancel`)
  return data
}
