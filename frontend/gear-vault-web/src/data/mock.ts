import type { Part, Vendor, Customer, SalesInvoice, PurchaseInvoice, Appointment, PartRequest, Prediction, User } from '@/types';

export const users: User[] = [
  { id: 'u1', name: 'Aarav Sharma', email: 'admin@gearvault.com', role: 'admin', phone: '+977 9801000001' },
  { id: 'u2', name: 'Priya Thapa', email: 'staff@gearvault.com', role: 'staff', phone: '+977 9801000002' },
  { id: 'u3', name: 'Rohan Bista', email: 'customer@gearvault.com', role: 'customer', phone: '+977 9801000003' },
  { id: 'u4', name: 'Mina Gurung', email: 'mina@gearvault.com', role: 'staff', phone: '+977 9801000004' },
  { id: 'u5', name: 'Sandeep K.C.', email: 'sandeep@gearvault.com', role: 'staff', phone: '+977 9801000005' },
];

export const vendors: Vendor[] = [
  { id: 'v1', name: 'Himalayan Auto Imports', contact: 'Bibek Rana', email: 'orders@hai.np', phone: '+977 014441111', address: 'Balaju, Kathmandu', totalPurchases: 1240000, lastOrder: '2026-04-22' },
  { id: 'v2', name: 'Asia Parts Co.', contact: 'Sneha Lama', email: 'sales@asiaparts.com', phone: '+977 014442222', address: 'Teku, Kathmandu', totalPurchases: 845000, lastOrder: '2026-04-18' },
  { id: 'v3', name: 'Kathmandu Lubricants', contact: 'Dipesh Shrestha', email: 'info@klub.np', phone: '+977 014443333', address: 'Bhaktapur', totalPurchases: 612000, lastOrder: '2026-04-15' },
  { id: 'v4', name: 'Bagmati Tire House', contact: 'Suresh Karki', email: 'tires@bagmati.np', phone: '+977 014444444', address: 'Lalitpur', totalPurchases: 398000, lastOrder: '2026-03-30' },
];

export const parts: Part[] = [
  { id: 'p1', sku: 'GV-OIL-5W30', name: 'Synthetic Engine Oil 5W-30 (4L)', category: 'Lubricants', price: 4500, cost: 3200, stock: 42, vendorId: 'v3', description: 'Full synthetic motor oil for modern petrol engines.' },
  { id: 'p2', sku: 'GV-BRK-FRT-CIV', name: 'Front Brake Pads — Honda Civic', category: 'Brakes', price: 6800, cost: 4400, stock: 8, vendorId: 'v1', description: 'Ceramic brake pads, low dust.' },
  { id: 'p3', sku: 'GV-BAT-12V70', name: 'Car Battery 12V 70Ah', category: 'Electrical', price: 14500, cost: 11000, stock: 14, vendorId: 'v2' },
  { id: 'p4', sku: 'GV-TIR-205-55', name: 'All-Season Tire 205/55 R16', category: 'Tires', price: 11200, cost: 8500, stock: 24, vendorId: 'v4' },
  { id: 'p5', sku: 'GV-FLT-AIR-COR', name: 'Air Filter — Toyota Corolla', category: 'Filters', price: 1800, cost: 1100, stock: 6, vendorId: 'v1' },
  { id: 'p6', sku: 'GV-WIP-22', name: 'Wiper Blade 22"', category: 'Accessories', price: 950, cost: 520, stock: 60, vendorId: 'v2' },
  { id: 'p7', sku: 'GV-SPK-IRD', name: 'Iridium Spark Plug (set of 4)', category: 'Engine', price: 5200, cost: 3400, stock: 18, vendorId: 'v1' },
  { id: 'p8', sku: 'GV-COOL-GRN', name: 'Coolant Premix Green (4L)', category: 'Lubricants', price: 1600, cost: 900, stock: 35, vendorId: 'v3' },
  { id: 'p9', sku: 'GV-SUS-SHK-SUZ', name: 'Shock Absorber — Suzuki Swift', category: 'Suspension', price: 8900, cost: 6200, stock: 4, vendorId: 'v2' },
  { id: 'p10', sku: 'GV-LMP-LED-H4', name: 'LED Headlamp H4 Pair', category: 'Electrical', price: 4200, cost: 2800, stock: 22, vendorId: 'v2' },
];

export const customers: Customer[] = [
  {
    id: 'c1', name: 'Rohan Bista', email: 'customer@gearvault.com', phone: '+977 9801000003', joinedAt: '2024-08-12',
    totalSpent: 124500, pendingCredit: 0, loyaltyPoints: 1245,
    vehicles: [
      { id: 'vh1', customerId: 'c1', make: 'Honda', model: 'Civic', year: 2019, plate: 'BA 2 PA 4521', mileage: 68400, healthScore: 78 },
      { id: 'vh2', customerId: 'c1', make: 'Suzuki', model: 'Swift', year: 2022, plate: 'BA 12 CHA 9912', mileage: 22100, healthScore: 92 },
    ],
  },
  {
    id: 'c2', name: 'Anjali Maharjan', email: 'anjali@example.com', phone: '+977 9801111222', joinedAt: '2025-01-04',
    totalSpent: 58900, pendingCredit: 12000, loyaltyPoints: 589,
    vehicles: [{ id: 'vh3', customerId: 'c2', make: 'Toyota', model: 'Corolla', year: 2018, plate: 'BA 5 KHA 3344', mileage: 91200, healthScore: 64 }],
  },
  {
    id: 'c3', name: 'Bikash Adhikari', email: 'bikash@example.com', phone: '+977 9802222333', joinedAt: '2023-11-20',
    totalSpent: 245000, pendingCredit: 0, loyaltyPoints: 2450,
    vehicles: [{ id: 'vh4', customerId: 'c3', make: 'Hyundai', model: 'Creta', year: 2021, plate: 'BA 7 GA 1010', mileage: 41000, healthScore: 85 }],
  },
  {
    id: 'c4', name: 'Sita Poudel', email: 'sita@example.com', phone: '+977 9803333444', joinedAt: '2024-03-15',
    totalSpent: 32100, pendingCredit: 8500, loyaltyPoints: 321,
    vehicles: [{ id: 'vh5', customerId: 'c4', make: 'Maruti', model: 'Alto', year: 2017, plate: 'BA 1 JA 7788', mileage: 102300, healthScore: 52 }],
  },
];

export const salesInvoices: SalesInvoice[] = [
  { id: 'INV-2026-0042', customerId: 'c1', customerName: 'Rohan Bista', date: '2026-04-28', staffId: 'u2', status: 'paid',
    items: [{ partId: 'p1', name: 'Synthetic Engine Oil 5W-30', qty: 1, price: 4500 }, { partId: 'p5', name: 'Air Filter — Corolla', qty: 1, price: 1800 }],
    subtotal: 6300, discount: 630, total: 5670 },
  { id: 'INV-2026-0041', customerId: 'c3', customerName: 'Bikash Adhikari', date: '2026-04-27', staffId: 'u4', status: 'paid',
    items: [{ partId: 'p3', name: 'Car Battery 12V 70Ah', qty: 1, price: 14500 }],
    subtotal: 14500, discount: 1450, total: 13050 },
  { id: 'INV-2026-0040', customerId: 'c2', customerName: 'Anjali Maharjan', date: '2026-04-25', staffId: 'u2', status: 'overdue',
    items: [{ partId: 'p9', name: 'Shock Absorber — Swift', qty: 2, price: 8900 }],
    subtotal: 17800, discount: 1780, total: 16020 },
  { id: 'INV-2026-0039', customerId: 'c4', customerName: 'Sita Poudel', date: '2026-04-22', staffId: 'u5', status: 'pending',
    items: [{ partId: 'p6', name: 'Wiper Blade 22"', qty: 2, price: 950 }],
    subtotal: 1900, discount: 0, total: 1900 },
];

export const purchaseInvoices: PurchaseInvoice[] = [
  { id: 'PO-2026-018', vendorId: 'v1', vendorName: 'Himalayan Auto Imports', date: '2026-04-22', status: 'paid', total: 142000,
    items: [{ partId: 'p2', name: 'Front Brake Pads — Civic', qty: 20, price: 4400 }, { partId: 'p7', name: 'Iridium Spark Plug', qty: 16, price: 3400 }] },
  { id: 'PO-2026-017', vendorId: 'v3', vendorName: 'Kathmandu Lubricants', date: '2026-04-18', status: 'paid', total: 89000,
    items: [{ partId: 'p1', name: 'Synthetic Engine Oil', qty: 25, price: 3200 }, { partId: 'p8', name: 'Coolant Premix', qty: 10, price: 900 }] },
  { id: 'PO-2026-016', vendorId: 'v2', vendorName: 'Asia Parts Co.', date: '2026-04-12', status: 'pending', total: 220000,
    items: [{ partId: 'p3', name: 'Car Battery 12V 70Ah', qty: 20, price: 11000 }] },
];

export const appointments: Appointment[] = [
  { id: 'a1', customerId: 'c1', customerName: 'Rohan Bista', vehicleId: 'vh1', vehicleLabel: 'Honda Civic 2019', service: 'Full Service', date: '2026-05-05', time: '10:00', status: 'scheduled' },
  { id: 'a2', customerId: 'c2', customerName: 'Anjali Maharjan', vehicleId: 'vh3', vehicleLabel: 'Toyota Corolla 2018', service: 'Brake Inspection', date: '2026-05-06', time: '14:30', status: 'scheduled' },
  { id: 'a3', customerId: 'c3', customerName: 'Bikash Adhikari', vehicleId: 'vh4', vehicleLabel: 'Hyundai Creta 2021', service: 'Tire Rotation', date: '2026-05-03', time: '09:00', status: 'in-progress' },
  { id: 'a4', customerId: 'c4', customerName: 'Sita Poudel', vehicleId: 'vh5', vehicleLabel: 'Maruti Alto 2017', service: 'Battery Check', date: '2026-04-30', time: '11:00', status: 'completed' },
];

export const partRequests: PartRequest[] = [
  { id: 'r1', customerId: 'c2', customerName: 'Anjali Maharjan', partName: 'Timing Belt Kit — Corolla 2018', description: 'Need OEM if possible.', date: '2026-04-28', status: 'pending' },
  { id: 'r2', customerId: 'c3', customerName: 'Bikash Adhikari', partName: 'Roof Rack — Creta', description: 'Cross bars, black.', date: '2026-04-26', status: 'sourced' },
  { id: 'r3', customerId: 'c1', customerName: 'Rohan Bista', partName: 'Cabin Air Filter — Civic', description: 'HEPA preferred.', date: '2026-04-24', status: 'pending' },
];

export const predictions: Prediction[] = [
  { id: 'pr1', vehicleId: 'vh1', part: 'Front Brake Pads', severity: 'medium', confidence: 82, etaDays: 45, recommendation: 'Inspect within 6 weeks; replace if pad thickness < 3mm.' },
  { id: 'pr2', vehicleId: 'vh1', part: 'Battery', severity: 'low', confidence: 61, etaDays: 180, recommendation: 'Battery health test at next service.' },
  { id: 'pr3', vehicleId: 'vh3', part: 'Timing Belt', severity: 'high', confidence: 91, etaDays: 14, recommendation: 'Replace within 2 weeks — exceeded 90,000 km interval.' },
  { id: 'pr4', vehicleId: 'vh5', part: 'Suspension Bushings', severity: 'high', confidence: 88, etaDays: 21, recommendation: 'Worn bushings detected; book inspection.' },
];

export const revenueSeries = [
  { month: 'Nov', revenue: 412000, purchases: 280000 },
  { month: 'Dec', revenue: 528000, purchases: 340000 },
  { month: 'Jan', revenue: 489000, purchases: 310000 },
  { month: 'Feb', revenue: 612000, purchases: 405000 },
  { month: 'Mar', revenue: 702000, purchases: 460000 },
  { month: 'Apr', revenue: 845000, purchases: 520000 },
];

export const topPartsSeries = [
  { name: 'Engine Oil', units: 142 },
  { name: 'Brake Pads', units: 96 },
  { name: 'Tires', units: 81 },
  { name: 'Battery', units: 64 },
  { name: 'Air Filter', units: 58 },
];

export const recentActivity = [
  { id: 1, who: 'Priya Thapa', action: 'created invoice', target: 'INV-2026-0042', when: '2 min ago' },
  { id: 2, who: 'System', action: 'low stock alert', target: 'Front Brake Pads (8 left)', when: '14 min ago' },
  { id: 3, who: 'Mina Gurung', action: 'registered customer', target: 'Anjali Maharjan', when: '1 h ago' },
  { id: 4, who: 'System', action: 'PO received', target: 'PO-2026-017', when: '3 h ago' },
  { id: 5, who: 'Rohan Bista', action: 'booked appointment', target: 'Full Service · May 5', when: '5 h ago' },
];
