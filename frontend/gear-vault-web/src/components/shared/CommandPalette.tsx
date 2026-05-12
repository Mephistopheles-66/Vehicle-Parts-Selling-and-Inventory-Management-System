import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Users, FileText, Calendar, LayoutDashboard } from 'lucide-react';
import { parts, customers, salesInvoices } from '@/data/mock';
import { useAuth } from '@/hooks/use-auth';
import { getRoleHomePath } from '@/lib/roles';

export const CommandPalette = ({ open, onOpenChange }: { open: boolean; onOpenChange: (b: boolean) => void }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const homePath = user ? getRoleHomePath(user.role) : '/admin';

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onOpenChange]);

  const go = (path: string) => { onOpenChange(false); navigate(path); };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search parts, customers, invoices, pages…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => go(homePath)}><LayoutDashboard className="h-4 w-4 mr-2" />Dashboard</CommandItem>
          <CommandItem onSelect={() => go('/admin/parts')}><Package className="h-4 w-4 mr-2" />Parts</CommandItem>
          <CommandItem onSelect={() => go('/staff/customers')}><Users className="h-4 w-4 mr-2" />Customers</CommandItem>
          <CommandItem onSelect={() => go('/staff/invoices')}><FileText className="h-4 w-4 mr-2" />Invoices</CommandItem>
          <CommandItem onSelect={() => go('/staff/appointments')}><Calendar className="h-4 w-4 mr-2" />Appointments</CommandItem>
        </CommandGroup>
        <CommandGroup heading="Parts">
          {parts.slice(0, 6).map(p => (
            <CommandItem key={p.id} onSelect={() => go(`/admin/parts/${p.id}`)}>
              <Package className="h-4 w-4 mr-2" />{p.name} <span className="ml-auto text-xs text-muted-foreground font-mono">{p.sku}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Customers">
          {customers.map(c => (
            <CommandItem key={c.id} onSelect={() => go(`/staff/customers/${c.id}`)}>
              <Users className="h-4 w-4 mr-2" />{c.name} <span className="ml-auto text-xs text-muted-foreground">{c.phone}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Invoices">
          {salesInvoices.map(i => (
            <CommandItem key={i.id} onSelect={() => go(`/staff/invoices/${i.id}`)}>
              <FileText className="h-4 w-4 mr-2" />{i.id} <span className="ml-auto text-xs text-muted-foreground">{i.customerName}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
