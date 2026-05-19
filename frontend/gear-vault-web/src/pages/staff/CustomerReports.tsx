import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Loader2 } from 'lucide-react';

import { getApiErrorMessage, unwrapApiResult } from '@/api/client';
import { type CustomerReportDto, UserService } from '@/api/generated/client';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatRs } from '@/lib/format';

const formatDate = (value?: string | null) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const EmptyState = () => (
  <Card>
    <CardContent className="p-10 text-center text-sm text-muted-foreground">
      No customer report data available yet.
    </CardContent>
  </Card>
);

const LoadingState = () => (
  <Card>
    <CardContent className="p-10 text-center text-sm text-muted-foreground">
      <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
      Loading report...
    </CardContent>
  </Card>
);

const ErrorState = ({ error }: { error: unknown }) => (
  <Card>
    <CardContent className="flex items-center gap-2 p-6 text-sm text-destructive">
      <AlertCircle className="h-4 w-4" />
      {getApiErrorMessage(error, 'Unable to load customer report.')}
    </CardContent>
  </Card>
);

const ReportTable = ({
  data,
  valueLabel,
  valueFor,
}: {
  data: CustomerReportDto[];
  valueLabel: string;
  valueFor: (report: CustomerReportDto) => string | number;
}) => {
  if (data.length === 0) return <EmptyState />;

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-canvas">
              <tr>
                {['Customer', 'Phone', 'Vehicles', 'Invoices', valueLabel, 'Last purchase'].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((report) => (
                <tr key={report.customer?.id ?? `${report.customer?.phoneNumber}-${report.lastPurchaseAt}`} className="border-b">
                  <td className="px-4 py-3">
                    <div className="font-medium">{report.customer?.name ?? 'Customer'}</div>
                    <div className="text-xs text-muted-foreground">{report.customer?.emailAddress ?? '-'}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{report.customer?.phoneNumber ?? '-'}</td>
                  <td className="px-4 py-3">{report.vehicleCount ?? 0}</td>
                  <td className="px-4 py-3">{report.invoiceCount ?? 0}</td>
                  <td className="px-4 py-3 font-bold tabular-nums">{valueFor(report)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(report.lastPurchaseAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

const CustomerReports = () => {
  const regularsQuery = useQuery({
    queryKey: ['customer-reports', 'regulars'],
    queryFn: async () => unwrapApiResult(await UserService.getRegularCustomerReports({ limit: 20 }), []),
  });

  const highSpendersQuery = useQuery({
    queryKey: ['customer-reports', 'high-spenders'],
    queryFn: async () => unwrapApiResult(await UserService.getHighSpenderReports({ limit: 20 }), []),
  });

  const pendingCreditsQuery = useQuery({
    queryKey: ['customer-reports', 'pending-credits'],
    queryFn: async () => unwrapApiResult(await UserService.getPendingCreditReports({ limit: 20 }), []),
  });

  const renderReport = (
    query: typeof regularsQuery,
    valueLabel: string,
    valueFor: (report: CustomerReportDto) => string | number,
  ) => {
    if (query.isLoading) return <LoadingState />;
    if (query.error) return <ErrorState error={query.error} />;
    return <ReportTable data={query.data ?? []} valueLabel={valueLabel} valueFor={valueFor} />;
  };

  return (
    <div>
      <PageHeader title="Customer Reports" />
      <div className="p-6 lg:p-8">
        <Tabs defaultValue="regulars">
          <TabsList>
            <TabsTrigger value="regulars">Regulars</TabsTrigger>
            <TabsTrigger value="high">High spenders</TabsTrigger>
            <TabsTrigger value="credit">Pending credits</TabsTrigger>
          </TabsList>
          <TabsContent value="regulars" className="mt-5">
            {renderReport(regularsQuery, 'Invoices', (report) => report.invoiceCount ?? 0)}
          </TabsContent>
          <TabsContent value="high" className="mt-5">
            {renderReport(highSpendersQuery, 'Total spent', (report) => formatRs(report.totalSpent ?? 0))}
          </TabsContent>
          <TabsContent value="credit" className="mt-5">
            {renderReport(pendingCreditsQuery, 'Pending credit', (report) => formatRs(report.pendingCredit ?? 0))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerReports;
