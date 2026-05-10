import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GearVaultLogo } from '@/components/shared/Logo';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login('customer');
    toast.success('Account created. Verify your email next.');
    navigate('/verify');
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas p-6">
      <div className="w-full max-w-md bg-background border rounded-lg shadow-sm p-8">
        <Link to="/" className="flex items-center gap-2 text-charcoal mb-6">
          <GearVaultLogo size={28} /><span className="font-bold">Gear Vault</span>
        </Link>
        <h1 className="text-2xl font-bold text-charcoal">Create your account</h1>
        <p className="text-sm text-muted-foreground mt-1">Join Gear Vault — manage your vehicles and parts.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>First name</Label><Input className="mt-1.5" defaultValue="Rohan" required /></div>
            <div><Label>Last name</Label><Input className="mt-1.5" defaultValue="Bista" required /></div>
          </div>
          <div><Label>Email</Label><Input type="email" className="mt-1.5" defaultValue="rohan@example.com" required /></div>
          <div><Label>Phone</Label><Input className="mt-1.5" defaultValue="+977 9801000003" required /></div>
          <div><Label>Password</Label><Input type="password" className="mt-1.5" defaultValue="demo1234" required /></div>
          <Button type="submit" className="w-full">Create account</Button>
        </form>
        <p className="mt-6 text-sm text-muted-foreground text-center">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
