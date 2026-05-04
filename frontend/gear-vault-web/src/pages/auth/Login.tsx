import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GearVaultLogo } from '@/components/shared/Logo';
import { useAuth } from '@/hooks/use-auth';
import { ShieldCheck, Cog, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Role } from '@/types';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@gearvault.com');
  const [pwd, setPwd] = useState('demo1234');
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const role: Role = email.includes('admin') ? 'admin' : email.includes('staff') ? 'staff' : 'customer';
      login(role);
      toast.success('Welcome back to Gear Vault');
      navigate(`/${role}`);
    }, 500);
  };

  const quick = (role: Role) => { login(role); navigate(`/${role}`); };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative bg-deep-navy text-white p-10 lg:p-14 flex flex-col overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <Cog className="absolute -bottom-20 -right-20 h-[420px] w-[420px] text-white/[0.04]" />
        <Link to="/" className="relative flex items-center gap-2.5">
          <GearVaultLogo size={32} className="text-white" />
          <span className="font-bold text-lg">Gear Vault</span>
        </Link>
        <div className="relative mt-auto">
          <div className="inline-flex items-center gap-2 text-xs text-white/60 mb-4">
            <ShieldCheck className="h-3.5 w-3.5" /> Secure portal
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold leading-tight tracking-tight">Precision parts.<br/>Locked-in trust.</h2>
          <p className="mt-4 text-white/60 max-w-md text-sm leading-relaxed">
            Sign in to access your inventory vault, customer records, and intelligent service tools.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 lg:p-14 bg-background">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-charcoal">Sign in to Gear Vault</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Enter your credentials to access your dashboard.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1.5" required />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pwd">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link>
              </div>
              <Input id="pwd" type="password" value={pwd} onChange={e => setPwd(e.target.value)} className="mt-1.5" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Sign in
            </Button>
          </form>

          <div className="mt-6">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 text-center">Demo accounts</div>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={() => quick('admin')}>Admin</Button>
              <Button variant="outline" size="sm" onClick={() => quick('staff')}>Staff</Button>
              <Button variant="outline" size="sm" onClick={() => quick('customer')}>Customer</Button>
            </div>
          </div>

          <p className="mt-8 text-sm text-muted-foreground text-center">
            New to Gear Vault? <Link to="/register" className="text-primary font-medium hover:underline">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
