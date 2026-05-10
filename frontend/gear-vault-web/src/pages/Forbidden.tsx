import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GearVaultLogo } from '@/components/shared/Logo';
import { ShieldX } from 'lucide-react';

const Forbidden = () => (
  <div className="min-h-screen flex items-center justify-center bg-canvas p-6">
    <div className="text-center max-w-md">
      <div className="inline-flex items-center gap-2 mb-6"><GearVaultLogo size={28} /><span className="font-bold">Gear Vault</span></div>
      <ShieldX className="h-14 w-14 text-destructive mx-auto" />
      <h1 className="mt-4 text-3xl font-bold text-charcoal">403 — Vault locked</h1>
      <p className="mt-2 text-muted-foreground">You don't have access to this section.</p>
      <Button asChild className="mt-6"><Link to="/">Back to safety</Link></Button>
    </div>
  </div>
);
export default Forbidden;
