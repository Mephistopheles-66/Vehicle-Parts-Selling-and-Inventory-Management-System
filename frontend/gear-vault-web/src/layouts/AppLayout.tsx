import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '@/components/shared/Sidebar';
import { Topbar } from '@/components/shared/Topbar';
import { CommandPalette } from '@/components/shared/CommandPalette';
import { useAuth } from '@/hooks/use-auth';
import type { Role } from '@/types';
import { useState } from 'react';

export const AppLayout = ({ allow }: { allow: Role[] }) => {
  const { user } = useAuth();
  const [palette, setPalette] = useState(false);

  if (!user) return <Navigate to="/login" replace />;
  if (!allow.includes(user.role)) return <Navigate to="/403" replace />;

  return (
    <div className="flex h-screen bg-canvas">
      <Sidebar role={user.role} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onSearchOpen={() => setPalette(true)} />
        <main className="flex-1 overflow-y-auto fade-in">
          <Outlet />
        </main>
        <footer className="border-t bg-background py-3 px-6 text-xs text-muted-foreground">
          © 2026 Gear Vault — Precision parts. Locked-in trust.
        </footer>
      </div>
      <CommandPalette open={palette} onOpenChange={setPalette} />
    </div>
  );
};
