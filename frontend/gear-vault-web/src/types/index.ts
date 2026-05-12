export type Role = 'super-admin' | 'staff' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
}

export interface Part {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  vendorId: string;
  image?: string;
  description?: string;
  compatibleVehicles?: string[];
}

export interface Vendor {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  totalPurchases: number;
  lastOrder: string;
}

export interface Vehicle {
  id: string;
  customerId: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  vin?: string;
  mileage: number;
  healthScore: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
  vehicles: Vehicle[];
  totalSpent: number;
  pendingCredit: number;
  loyaltyPoints: number;
}

export interface InvoiceItem {
  partId: string;
  name: string;
  qty: number;
  price: number;
}

export interface SalesInvoice {
  id: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  staffId: string;
}

export interface PurchaseInvoice {
  id: string;
  vendorId: string;
  vendorName: string;
  items: InvoiceItem[];
  total: number;
  status: 'paid' | 'pending';
  date: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  vehicleId: string;
  vehicleLabel: string;
  service: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

export interface PartRequest {
  id: string;
  customerId: string;
  customerName: string;
  partName: string;
  description: string;
  date: string;
  status: 'pending' | 'sourced' | 'rejected';
}

export interface Prediction {
  id: string;
  vehicleId: string;
  part: string;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  etaDays: number;
  recommendation: string;
}
