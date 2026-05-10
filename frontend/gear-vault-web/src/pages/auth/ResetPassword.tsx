import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GearVaultLogo } from '@/components/shared/Logo';
import { toast } from 'sonner';

const ResetPassword = () => {
  const nav = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas p-6">
      <div className="w-full max-w-md bg-background border rounded-lg shadow-sm p-8">
        <Link to="/" className="flex items-center gap-2 text-charcoal mb-6">
          <GearVaultLogo size={28} /><span className="font-bold">Gear Vault</span>
        </Link>
        <h1 className="text-2xl font-bold text-charcoal">Set a new password</h1>
        <form onSubmit={e => { e.preventDefault(); toast.success('Password updated'); nav('/login'); }} className="mt-6 space-y-4">
          <div><Label>New password</Label><Input type="password" className="mt-1.5" /></div>
          <div><Label>Confirm password</Label><Input type="password" className="mt-1.5" /></div>
          <Button type="submit" className="w-full">Update password</Button>
        </form>
      </div>
    </div>
  );
};
export default ResetPassword;
