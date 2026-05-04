import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GearVaultLogo } from '@/components/shared/Logo';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-canvas p-6">
    <div className="text-center max-w-md">
      <div className="inline-flex items-center gap-2 mb-6"><GearVaultLogo size={28} /><span className="font-bold">Gear Vault</span></div>
      <div className="text-6xl font-bold text-primary tabular">404</div>
      <h1 className="mt-2 text-2xl font-bold text-charcoal">Page not found</h1>
      <p className="mt-2 text-muted-foreground">This part isn't in the vault.</p>
      <Button asChild className="mt-6"><Link to="/">Back home</Link></Button>
    </div>
  </div>
);
export default NotFound;
