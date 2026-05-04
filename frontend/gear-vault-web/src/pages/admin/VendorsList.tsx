import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { vendors } from '@/data/mock';
import { Plus, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatRs } from '@/lib/format';

const VendorsList = () => (
  <div>
    <PageHeader title="Vendors" description="Trusted suppliers powering the vault."
      actions={<Button asChild><Link to="/admin/vendors/new"><Plus className="h-4 w-4 mr-2" />Add vendor</Link></Button>} />
    <div className="p-6 lg:p-8">
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-deep-navy text-white">
              <tr className="text-left">{['Vendor','Contact','Phone','Total purchases','Last order',''].map(h => <th key={h} className="px-4 py-3 text-xs uppercase tracking-wider">{h}</th>)}</tr>
            </thead>
            <tbody>
              {vendors.map((v, i) => (
                <tr key={v.id} className={`border-b hover:bg-secondary/40 ${i % 2 ? 'bg-canvas' : ''}`}>
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="h-9 w-9 rounded-md bg-secondary flex items-center justify-center"><Building2 className="h-4 w-4 text-muted-foreground" /></div><Link to={`/admin/vendors/${v.id}`} className="font-medium text-charcoal hover:text-primary">{v.name}</Link></div></td>
                  <td className="px-4 py-3 text-muted-foreground">{v.contact}</td>
                  <td className="px-4 py-3 font-mono text-xs">{v.phone}</td>
                  <td className="px-4 py-3 tabular font-medium">{formatRs(v.totalPurchases)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{v.lastOrder}</td>
                  <td className="px-4 py-3"><Button variant="ghost" size="sm" asChild><Link to={`/admin/vendors/${v.id}`}>View</Link></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  </div>
);
export default VendorsList;
