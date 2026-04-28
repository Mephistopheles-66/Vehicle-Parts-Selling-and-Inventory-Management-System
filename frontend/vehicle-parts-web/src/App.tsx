import { Routes, Route, Navigate } from 'react-router-dom'
import PartsListPage from './features/parts/PartsListPage'
import PartCreatePage from './features/parts/PartCreatePage'
import PartEditPage from './features/parts/PartEditPage'
import VendorsListPage from './features/vendors/VendorsListPage'
import VendorCreatePage from './features/vendors/VendorCreatePage'
import VendorEditPage from './features/vendors/VendorEditPage'
import PurchaseInvoicesListPage from './features/purchase-invoices/PurchaseInvoicesListPage'
import PurchaseInvoiceCreatePage from './features/purchase-invoices/PurchaseInvoiceCreatePage'

export default function App() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Routes>
        <Route path="/" element={<Navigate to="/parts" replace />} />
        <Route path="/parts" element={<PartsListPage />} />
        <Route path="/parts/new" element={<PartCreatePage />} />
        <Route path="/parts/:id/edit" element={<PartEditPage />} />
        <Route path="/vendors" element={<VendorsListPage />} />
        <Route path="/vendors/new" element={<VendorCreatePage />} />
        <Route path="/vendors/:id/edit" element={<VendorEditPage />} />
        <Route path="/purchase-invoices" element={<PurchaseInvoicesListPage />} />
        <Route path="/purchase-invoices/new" element={<PurchaseInvoiceCreatePage />} />
      </Routes>
    </div>
  )
}
