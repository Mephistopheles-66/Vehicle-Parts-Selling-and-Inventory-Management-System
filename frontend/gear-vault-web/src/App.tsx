import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { AppLayout } from "@/layouts/AppLayout";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Verify from "./pages/auth/Verify";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import NotFound from "./pages/NotFound";
import Forbidden from "./pages/Forbidden";
import Settings from "./pages/Settings";

import AdminDashboard from "./pages/admin/Dashboard";
import PartsList from "./pages/admin/PartsList";
import PartForm from "./pages/admin/PartForm";
import PartDetails from "./pages/admin/PartDetails";
import VendorsList from "./pages/admin/VendorsList";
import VendorForm from "./pages/admin/VendorForm";
import VendorDetails from "./pages/admin/VendorDetails";
import PurchaseInvoicesList from "./pages/admin/PurchaseInvoicesList";
import PurchaseInvoiceForm from "./pages/admin/PurchaseInvoiceForm";
import UsersList from "./pages/admin/UsersList";
import RolesList from "./pages/admin/RolesList";
import Reports from "./pages/admin/Reports";
import LowStock from "./pages/admin/LowStock";
import OverdueCredits from "./pages/admin/OverdueCredits";

import StaffDashboard from "./pages/staff/Dashboard";
import CustomersList from "./pages/staff/CustomersList";
import CustomerForm from "./pages/staff/CustomerForm";
import CustomerDetails from "./pages/staff/CustomerDetails";
import SalesInvoicesList from "./pages/staff/SalesInvoicesList";
import CreateSalesInvoice from "./pages/staff/CreateSalesInvoice";
import ViewSalesInvoice from "./pages/staff/ViewSalesInvoice";
import CustomerReports from "./pages/staff/CustomerReports";
import Appointments from "./pages/staff/Appointments";
import PartRequests from "./pages/staff/PartRequests";

import CustomerDashboard from "./pages/customer/Dashboard";
import Profile from "./pages/customer/Profile";
import MyVehicles from "./pages/customer/MyVehicles";
import VehicleHealth from "./pages/customer/VehicleHealth";
import { ServiceCenter, BookAppointment, MyAppointments, BrowseParts, RequestPart, PurchaseHistory, MyInvoices, Reviews } from "./pages/customer/Pages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="bottom-right" />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/403" element={<Forbidden />} />

            <Route element={<AppLayout allow={['super-admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/parts" element={<PartsList />} />
              <Route path="/admin/parts/new" element={<PartForm />} />
              <Route path="/admin/parts/:id" element={<PartDetails />} />
              <Route path="/admin/parts/:id/edit" element={<PartForm />} />
              <Route path="/admin/vendors" element={<VendorsList />} />
              <Route path="/admin/vendors/new" element={<VendorForm />} />
              <Route path="/admin/vendors/:id" element={<VendorDetails />} />
              <Route path="/admin/vendors/:id/edit" element={<VendorForm />} />
              <Route path="/admin/purchase-invoices" element={<PurchaseInvoicesList />} />
              <Route path="/admin/purchase-invoices/new" element={<PurchaseInvoiceForm />} />
              <Route path="/admin/purchase-invoices/:id" element={<PurchaseInvoiceForm />} />
              <Route path="/admin/users" element={<UsersList />} />
              <Route path="/admin/users/new" element={<UsersList />} />
              <Route path="/admin/roles" element={<RolesList />} />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/inventory-report" element={<Reports />} />
              <Route path="/admin/low-stock" element={<LowStock />} />
              <Route path="/admin/overdue-credits" element={<OverdueCredits />} />
            </Route>

            <Route element={<AppLayout allow={['staff', 'super-admin']} />}>
              <Route path="/staff" element={<StaffDashboard />} />
              <Route path="/staff/customers" element={<CustomersList />} />
              <Route path="/staff/customers/new" element={<CustomerForm />} />
              <Route path="/staff/customers/:id" element={<CustomerDetails />} />
              <Route path="/staff/customers/:id/edit" element={<CustomerForm />} />
              <Route path="/staff/invoices" element={<SalesInvoicesList />} />
              <Route path="/staff/invoices/new" element={<CreateSalesInvoice />} />
              <Route path="/staff/invoices/:id" element={<ViewSalesInvoice />} />
              <Route path="/staff/customer-reports" element={<CustomerReports />} />
              <Route path="/staff/appointments" element={<Appointments />} />
              <Route path="/staff/part-requests" element={<PartRequests />} />
            </Route>

            <Route element={<AppLayout allow={['customer']} />}>
              <Route path="/customer" element={<CustomerDashboard />} />
              <Route path="/customer/profile" element={<Profile />} />
              <Route path="/customer/vehicles" element={<MyVehicles />} />
              <Route path="/customer/health" element={<VehicleHealth />} />
              <Route path="/customer/service-center" element={<ServiceCenter />} />
              <Route path="/customer/book" element={<BookAppointment />} />
              <Route path="/customer/appointments" element={<MyAppointments />} />
              <Route path="/customer/parts" element={<BrowseParts />} />
              <Route path="/customer/request-part" element={<RequestPart />} />
              <Route path="/customer/history" element={<PurchaseHistory />} />
              <Route path="/customer/invoices" element={<MyInvoices />} />
              <Route path="/customer/invoices/:id" element={<ViewSalesInvoice />} />
              <Route path="/customer/reviews" element={<Reviews />} />
            </Route>

            <Route element={<AppLayout allow={['super-admin','staff','customer']} />}>
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="/index" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
