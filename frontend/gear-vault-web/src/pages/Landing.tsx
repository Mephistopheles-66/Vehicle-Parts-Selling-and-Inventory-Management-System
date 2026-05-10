import { Link } from 'react-router-dom';
import { GearVaultLogo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Package, BarChart3, Wrench, Sparkles, ArrowRight, Cog } from 'lucide-react';

const features = [
  { icon: Package, title: 'Inventory Vault', text: 'Track every part down to the SKU. Auto low-stock alerts and supplier sync.' },
  { icon: BarChart3, title: 'Sales Intelligence', text: 'Real-time financial reports across daily, monthly, and yearly horizons.' },
  { icon: Wrench, title: 'Service Workflow', text: 'Appointments, vehicle history, and customer credit — all in one place.' },
  { icon: Sparkles, title: 'AI Vehicle Health', text: 'Predict part failures before they happen. Recommend service proactively.' },
];

const Landing = () => (
  <div className="min-h-screen bg-canvas">
    <header className="border-b bg-background">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 text-charcoal">
          <GearVaultLogo />
          <span className="font-bold text-[15px]">Gear Vault</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-charcoal">Features</a>
          <a href="#services" className="hover:text-charcoal">Services</a>
          <a href="#contact" className="hover:text-charcoal">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link to="/register"><Button size="sm">Get started</Button></Link>
        </div>
      </div>
    </header>

    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-10%,hsl(var(--primary)/0.08),transparent_60%)]" />
      <div className="relative max-w-[1280px] mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-5">
            <ShieldCheck className="h-3.5 w-3.5" /> Trusted by service centers across Nepal
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-charcoal leading-tight tracking-tight">
            Welcome to <span className="text-primary">Gear Vault</span>.<br/>
            Precision parts. Locked-in trust.
          </h1>
          <p className="mt-5 text-base text-muted-foreground max-w-lg">
            The secure, intelligent platform for automotive parts retail and service. Manage inventory, sales, customers, and AI-powered vehicle health from one vault.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register"><Button size="lg" className="gap-2">Open your vault <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link to="/login"><Button size="lg" variant="outline">Sign in to demo</Button></Link>
          </div>
          <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
            <div><span className="block text-2xl font-bold text-charcoal tabular">99.9%</span>uptime SLA</div>
            <div><span className="block text-2xl font-bold text-charcoal tabular">50K+</span>parts indexed</div>
            <div><span className="block text-2xl font-bold text-charcoal tabular">24/7</span>support</div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/3] rounded-2xl bg-deep-navy overflow-hidden shadow-md relative">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            <div className="absolute inset-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur p-6 flex flex-col">
              <div className="flex items-center gap-2 text-white text-sm font-medium">
                <GearVaultLogo size={20} className="text-white" /> Gear Vault Console
              </div>
              <div className="grid grid-cols-3 gap-3 mt-5">
                {[{l:'Revenue',v:'Rs. 845K'},{l:'Stock',v:'1,242'},{l:'Customers',v:'318'}].map(s => (
                  <div key={s.l} className="rounded-lg bg-white/5 border border-white/10 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-white/50">{s.l}</div>
                    <div className="text-base font-bold text-white tabular mt-1">{s.v}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex-1 rounded-lg bg-gradient-to-tr from-primary/40 to-white/5 border border-white/10 relative overflow-hidden">
                <svg viewBox="0 0 200 100" className="w-full h-full">
                  <polyline fill="none" stroke="white" strokeWidth="1.5" opacity="0.8" points="0,80 25,72 50,60 75,55 100,40 125,45 150,28 175,22 200,10" />
                </svg>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-white/60">
                <span>Last 6 months</span>
                <span className="text-success">+24.5%</span>
              </div>
            </div>
            <Cog className="absolute -bottom-10 -right-10 h-48 w-48 text-white/5" />
          </div>
        </div>
      </div>
    </section>

    <section id="features" className="py-20 bg-background border-y">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-charcoal">Everything your service center needs</h2>
          <p className="mt-3 text-muted-foreground">Built for admins, staff, and customers — each role gets a focused workspace.</p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(f => (
            <div key={f.title} className="rounded-lg border bg-background p-6 hover:shadow-md transition-all">
              <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-charcoal">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section id="services" className="py-20">
      <div className="max-w-[1280px] mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-charcoal">Services that keep wheels turning</h2>
          <p className="mt-3 text-muted-foreground">Full mechanical service, brake systems, batteries, tires, oil changes, and AI-driven preventive maintenance.</p>
          <ul className="mt-6 space-y-3 text-sm">
            {['OEM and aftermarket parts catalog','Loyalty discount automation','Branded invoicing & email delivery','Predictive maintenance dashboards'].map(t => (
              <li key={t} className="flex items-start gap-3"><ShieldCheck className="h-4 w-4 text-primary mt-0.5" />{t}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-deep-navy text-white p-8">
          <h3 className="font-semibold text-lg">Ready to vault your inventory?</h3>
          <p className="text-white/70 text-sm mt-2">Spin up a demo in seconds. No credit card required.</p>
          <Link to="/register"><Button size="lg" variant="secondary" className="mt-5">Create account</Button></Link>
        </div>
      </div>
    </section>

    <footer id="contact" className="border-t bg-background py-8">
      <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <GearVaultLogo size={20} />
          <span>© 2026 Gear Vault — Precision parts. Locked-in trust.</span>
        </div>
        <div className="flex gap-5">
          <a href="#" className="hover:text-charcoal">Privacy</a>
          <a href="#" className="hover:text-charcoal">Terms</a>
          <a href="#" className="hover:text-charcoal">Support</a>
        </div>
      </div>
    </footer>
  </div>
);

export default Landing;
