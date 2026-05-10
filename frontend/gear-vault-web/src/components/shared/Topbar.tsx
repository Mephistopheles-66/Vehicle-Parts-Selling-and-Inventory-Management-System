import { Bell, Search, LogOut, Settings, User as UserIcon, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const Topbar = ({ onSearchOpen }: { onSearchOpen?: () => void }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const initials = user?.name.split(' ').map(s => s[0]).slice(0,2).join('') ?? 'GV';

  return (
    <header className="h-16 border-b bg-background sticky top-0 z-30 flex items-center px-4 lg:px-6 gap-4">
      <button
        onClick={onSearchOpen}
        className="hidden md:flex flex-1 max-w-md items-center gap-2.5 h-10 px-3.5 rounded-md border border-input bg-canvas hover:border-primary/40 transition-colors text-sm text-muted-foreground"
      >
        <Search className="h-4 w-4" />
        <span>Search parts, customers, invoices…</span>
        <kbd className="ml-auto font-mono text-[10px] px-1.5 py-0.5 rounded border border-border bg-background">⌘K</kbd>
      </button>
      <div className="flex-1 md:hidden" />
      <Button variant="ghost" size="icon" onClick={() => setDark(d => !d)} aria-label="Toggle theme">
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
      <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
        <Bell className="h-4 w-4" />
        <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-destructive" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2.5 h-10 pl-1 pr-3 rounded-md hover:bg-secondary transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-sm font-medium text-charcoal">{user?.name}</span>
              <span className="text-[11px] text-muted-foreground capitalize">{user?.role}</span>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate(user?.role === 'customer' ? '/customer/profile' : '/settings')}>
            <UserIcon className="h-4 w-4 mr-2" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <Settings className="h-4 w-4 mr-2" /> Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { logout(); navigate('/login'); }}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
