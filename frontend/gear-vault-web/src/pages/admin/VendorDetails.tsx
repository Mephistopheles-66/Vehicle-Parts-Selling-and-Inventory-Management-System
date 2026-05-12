import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Edit, Mail, MapPin, Phone } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VendorsService } from '@/api/generated/client';
import { getApiErrorMessage, unwrapApiResult } from '@/api/client';

const VendorDetails = () => {
  const { id } = useParams();
  const { data: vendor, isLoading, error } = useQuery({
    queryKey: ['vendors', id],
    queryFn: async () => unwrapApiResult(await VendorsService.getVendorById({ vendorId: id! }), null),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Vendor details" description="Loading supplier profile..." />
        <div className="p-6 lg:p-8 text-sm text-muted-foreground">Loading vendor...</div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div>
        <PageHeader title="Vendor not found" description="Unable to load this supplier." />
        <div className="p-6 lg:p-8 text-sm text-destructive">{getApiErrorMessage(error, 'Unable to load vendor')}</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={vendor.name ?? 'Vendor'} description={vendor.address ?? 'Supplier profile'}
        actions={<Button asChild><Link to={`/admin/vendors/${vendor.id}/edit`}><Edit className="h-4 w-4 mr-2" />Edit</Link></Button>} />
      <div className="p-6 lg:p-8">
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /> Email</div>
              <div className="mt-2 font-medium break-all">{vendor.contactEmail ?? '-'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> Phone</div>
              <div className="mt-2 font-mono">{vendor.phone ?? '-'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> Address</div>
              <div className="mt-2 font-medium">{vendor.address ?? '-'}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;
