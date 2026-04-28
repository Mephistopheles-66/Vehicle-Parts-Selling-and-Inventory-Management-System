export interface Vendor {
  id: string
  name: string
  contactEmail?: string
  phone?: string
  address?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateVendorDto {
  name: string
  contactEmail?: string
  phone?: string
  address?: string
  isActive: boolean
}

export type UpdateVendorDto = Partial<CreateVendorDto>
