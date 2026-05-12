import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GearVaultLogo } from '@/components/shared/Logo';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { getApiErrorMessage } from '@/api/client';

const Register = () => {
  const { registerCustomer } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('Rohan');
  const [lastName, setLastName] = useState('Bista');
  const [email, setEmail] = useState('rohan@example.com');
  const [phone, setPhone] = useState('+977 9801000003');
  const [password, setPassword] = useState('demo1234');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const name = `${firstName} ${lastName}`.trim();
      await registerCustomer({
        name,
        username: email.split('@')[0],
        emailAddress: email,
        phoneNumber: phone,
        password,
      });
      toast.success('Account created. Verify your email next.');
      navigate('/verify');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to create account'));
    } finally {
      setLoading(false);
    }
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
            <div><Label>First name</Label><Input className="mt-1.5" value={firstName} onChange={e => setFirstName(e.target.value)} required /></div>
            <div><Label>Last name</Label><Input className="mt-1.5" value={lastName} onChange={e => setLastName(e.target.value)} required /></div>
          </div>
          <div><Label>Email</Label><Input type="email" className="mt-1.5" value={email} onChange={e => setEmail(e.target.value)} required /></div>
          <div><Label>Phone</Label><Input className="mt-1.5" value={phone} onChange={e => setPhone(e.target.value)} required /></div>
          <div><Label>Password</Label><Input type="password" className="mt-1.5" value={password} onChange={e => setPassword(e.target.value)} required /></div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Create account
          </Button>
        </form>
        <p className="mt-6 text-sm text-muted-foreground text-center">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
