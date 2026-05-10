import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GearVaultLogo } from '@/components/shared/Logo';
import { toast } from 'sonner';

const Verify = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [seconds, setSeconds] = useState(45);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const set = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...code]; next[i] = v; setCode(next);
    if (v && i < 5) refs.current[i+1]?.focus();
  };

  const submit = () => {
    if (code.join('').length !== 6) return toast.error('Enter the 6-digit code');
    toast.success('Account verified');
    navigate('/customer');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas p-6">
      <div className="w-full max-w-md bg-background border rounded-lg shadow-sm p-8 text-center">
        <Link to="/" className="inline-flex items-center gap-2 text-charcoal mb-6">
          <GearVaultLogo size={28} /><span className="font-bold">Gear Vault</span>
        </Link>
        <h1 className="text-2xl font-bold text-charcoal">Verify your account</h1>
        <p className="text-sm text-muted-foreground mt-1">We sent a 6-digit code to your email.</p>
        <div className="mt-8 flex justify-center gap-2">
          {code.map((c, i) => (
            <input key={i} ref={el => refs.current[i] = el} value={c} onChange={e => set(i, e.target.value)}
              className="h-12 w-11 text-center text-lg font-mono font-semibold rounded-md border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
          ))}
        </div>
        <Button onClick={submit} className="w-full mt-8">Verify</Button>
        <p className="mt-4 text-xs text-muted-foreground">
          {seconds > 0 ? <>Resend code in <span className="font-mono">{seconds}s</span></> : <button onClick={() => setSeconds(45)} className="text-primary hover:underline">Resend code</button>}
        </p>
      </div>
    </div>
  );
};

export default Verify;
