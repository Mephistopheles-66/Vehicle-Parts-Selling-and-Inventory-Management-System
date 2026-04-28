import axios from 'axios'
import type { Part, CreatePartDto, UpdatePartDto } from '../types/part'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export const getParts = async (): Promise<Part[]> => {
  const { data } = await api.get<Part[]>('/api/parts')
  return data
}

export const getPartById = async (id: string): Promise<Part> => {
  const { data } = await api.get<Part>(`/api/parts/${id}`)
  return data
}

export const createPart = async (dto: CreatePartDto): Promise<Part> => {
  const { data } = await api.post<Part>('/api/parts', dto)
  return data
}

export const updatePart = async (id: string, dto: UpdatePartDto): Promise<Part> => {
  const { data } = await api.put<Part>(`/api/parts/${id}`, dto)
  return data
}

export const deletePart = async (id: string): Promise<void> => {
  await api.delete(`/api/parts/${id}`)
}
