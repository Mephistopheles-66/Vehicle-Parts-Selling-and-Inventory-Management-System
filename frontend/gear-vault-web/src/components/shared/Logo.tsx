import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props { className?: string; size?: number; }

export const GearVaultLogo = ({ className, size = 32 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden>
    <path d="M32 6l22 10v16c0 14-9.5 24-22 28C19.5 56 10 46 10 32V16L32 6z" fill="currentColor" opacity="0.12" />
    <path d="M32 6l22 10v16c0 14-9.5 24-22 28C19.5 56 10 46 10 32V16L32 6z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    <circle cx="32" cy="32" r="7" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="32" y1="20" x2="32" y2="24" />
      <line x1="32" y1="40" x2="32" y2="44" />
      <line x1="20" y1="32" x2="24" y2="32" />
      <line x1="40" y1="32" x2="44" y2="32" />
    </g>
  </svg>
);

export const GearVaultWordmark = ({ className }: { className?: string }) => (
  <div className={cn('flex items-center gap-2.5', className)}>
    <GearVaultLogo />
    <div className="flex flex-col leading-none">
      <span className="font-bold text-[15px] tracking-tight">Gear Vault</span>
      <span className="text-[10px] uppercase tracking-[0.18em] opacity-60 mt-0.5">Parts · Vault</span>
    </div>
  </div>
);

export { ShieldCheck };
