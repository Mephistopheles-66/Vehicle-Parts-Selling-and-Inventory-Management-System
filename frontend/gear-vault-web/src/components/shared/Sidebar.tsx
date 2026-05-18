import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, Truck, FileText, Users,
  BarChart3, AlertTriangle, Calendar, MessageSquare, Wrench,
  Car, Sparkles, Receipt, Star, Search, History, UserCog, Building2, Mail, Settings
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Role } from '@/types';
import { GearVaultWordmark } from '@/components/shared/Logo';
import { cn } from '@/lib/utils';

interface NavItem { to: string; label: string; icon: LucideIcon; alert?: boolean; }
interface NavGroup { label: string; items: NavItem[]; }

const adminNav: NavGroup[] = [
  { label: 'Overview', items: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  ]},
  { label: 'Inventory', items: [
    { to: '/admin/parts', label: 'Parts', icon: Package },
    { to: '/admin/vendors', label: 'Vendors', icon: Building2 },
    { to: '/admin/purchase-invoices', label: 'Purchase Invoices', icon: Truck },
    { to: '/admin/low-stock', label: 'Low Stock Alerts', icon: AlertTriangle },
  ]},
  { label: 'People', items: [
    { to: '/admin/users', label: 'Users', icon: UserCog },
  ]},
  { label: 'Reports', items: [
    { to: '/admin/reports', label: 'Financial Reports', icon: BarChart3 },
    { to: '/admin/overdue-credits', label: 'Overdue Credits', icon: Receipt },
  ]},
];

const staffNav: NavGroup[] = [
  { label: 'Overview', items: [{ to: '/staff', label: 'Dashboard', icon: LayoutDashboard }] },
  { label: 'Sales', items: [
    { to: '/staff/customers', label: 'Customers', icon: Users },
    { to: '/staff/invoices', label: 'Sales Invoices', icon: FileText },
    { to: '/staff/invoices/new', label: 'New Invoice', icon: Receipt },
  ]},
  { label: 'Service', items: [
    { to: '/staff/appointments', label: 'Appointments', icon: Calendar },
    { to: '/staff/part-requests', label: 'Part Requests', icon: MessageSquare },
  ]},
  { label: 'Reports', items: [
    { to: '/staff/customer-reports', label: 'Customer Reports', icon: BarChart3 },
  ]},
];

const customerNav: NavGroup[] = [
  { label: 'My Garage', items: [
    { to: '/customer', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/customer/vehicles', label: 'My Vehicles', icon: Car },
    { to: '/customer/health', label: 'Vehicle Health', icon: Sparkles },
  ]},
  { label: 'Service', items: [
    { to: '/customer/appointments', label: 'Appointments', icon: Calendar },
    { to: '/customer/book', label: 'Book Appointment', icon: Wrench },
    { to: '/customer/service-center', label: 'Service Center', icon: Building2 },
  ]},
  { label: 'Shop', items: [
    { to: '/customer/parts', label: 'Browse Parts', icon: Package },
    { to: '/customer/request-part', label: 'Request a Part', icon: MessageSquare },
    { to: '/customer/invoices', label: 'My Invoices', icon: Receipt },
    { to: '/customer/history', label: 'Purchase History', icon: History },
  ]},
  { label: 'Account', items: [
    { to: '/customer/profile', label: 'My Profile', icon: UserCog },
    { to: '/customer/reviews', label: 'My Reviews', icon: Star },
  ]},
];

export const Sidebar = ({ role }: { role: Role }) => {
  const groups = role === 'super-admin' ? adminNav : role === 'staff' ? staffNav : customerNav;
  const { pathname } = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-[260px] bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="h-16 flex items-center px-5 border-b border-sidebar-border text-white">
        <GearVaultWordmark />
      </div>
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-3 space-y-6">
        {groups.map(group => (
          <div key={group.label}>
            <div className="px-3 mb-2 text-[10px] uppercase tracking-[0.16em] text-white/40 font-semibold">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const active = pathname === item.to || pathname.startsWith(item.to);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/admin' || item.to === `/${role}`}
                    className={cn(
                      'group flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200',
                      'border-l-[3px] border-transparent',
                      active
                        ? 'bg-sidebar-accent text-white border-primary font-medium'
                        : 'text-white/70 hover:text-white hover:bg-sidebar-accent/50'
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.alert && <span className="h-2 w-2 rounded-full bg-destructive pulse-dot" />}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-sidebar-border text-[11px] text-white/40">
        © 2026 Gear Vault
      </div>
    </aside>
  );
};
