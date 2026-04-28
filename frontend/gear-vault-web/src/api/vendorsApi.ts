import axios from 'axios'
import type { Vendor, CreateVendorDto, UpdateVendorDto } from '../types/vendor'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export const getVendors = async (): Promise<Vendor[]> => {
  const { data } = await api.get<Vendor[]>('/api/vendors')
  return data
}

export const getVendorById = async (id: string): Promise<Vendor> => {
  const { data } = await api.get<Vendor>(`/api/vendors/${id}`)
  return data
}

export const createVendor = async (dto: CreateVendorDto): Promise<Vendor> => {
  const { data } = await api.post<Vendor>('/api/vendors', dto)
  return data
}

export const updateVendor = async (id: string, dto: UpdateVendorDto): Promise<Vendor> => {
  const { data } = await api.put<Vendor>(`/api/vendors/${id}`, dto)
  return data
}

export const deleteVendor = async (id: string): Promise<void> => {
  await api.delete(`/api/vendors/${id}`)
}
