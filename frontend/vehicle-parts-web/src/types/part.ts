export interface Part {
  id: string
  partNumber: string
  name: string
  description?: string
  category?: string
  unit: 'PIECE' | 'BOX' | 'METER' | 'LITER' | 'KG'
  stockQty: number
  reorderLevel: number
  costPrice: number
  sellingPrice: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreatePartDto {
  partNumber: string
  name: string
  description?: string
  category?: string
  unit: Part['unit']
  reorderLevel: number
  costPrice: number
  sellingPrice: number
  isActive: boolean
}

export type UpdatePartDto = Partial<CreatePartDto>
