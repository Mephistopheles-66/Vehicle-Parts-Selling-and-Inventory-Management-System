import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GearVaultLogo } from '@/components/shared/Logo';
import { toast } from 'sonner';

const ForgotPassword = () => (
  <div className="min-h-screen flex items-center justify-center bg-canvas p-6">
    <div className="w-full max-w-md bg-background border rounded-lg shadow-sm p-8">
      <Link to="/" className="flex items-center gap-2 text-charcoal mb-6">
        <GearVaultLogo size={28} /><span className="font-bold">Gear Vault</span>
      </Link>
      <h1 className="text-2xl font-bold text-charcoal">Reset your password</h1>
      <p className="text-sm text-muted-foreground mt-1">Enter your email — we'll send you a reset link.</p>
      <form onSubmit={e => { e.preventDefault(); toast.success('Reset link sent'); }} className="mt-6 space-y-4">
        <div><Label>Email</Label><Input type="email" defaultValue="superadmin@gearvault.com" className="mt-1.5" /></div>
        <Button type="submit" className="w-full">Send reset link</Button>
      </form>
      <p className="mt-6 text-sm text-center text-muted-foreground">
        <Link to="/login" className="text-primary font-medium hover:underline">Back to sign in</Link>
      </p>
    </div>
  </div>
);
export default ForgotPassword;
