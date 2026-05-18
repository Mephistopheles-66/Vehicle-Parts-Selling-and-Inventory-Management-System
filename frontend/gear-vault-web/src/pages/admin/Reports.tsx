import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KpiCard } from '@/components/shared/KpiCard';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { DollarSign, ShoppingCart, TrendingUp, FileText } from 'lucide-react';
import { formatRs } from '@/lib/format';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FinancialReportsService } from '@/api/generated/client';
import { getApiErrorMessage } from '@/api/client';

type Period = 'daily' | 'monthly' | 'yearly';

const Reports = () => {
  const [period, setPeriod] = useState<Period>('monthly');

  const { data: report, isLoading, error } = useQuery({
    queryKey: ['financial-reports', period],
    queryFn: async () => {
      const res = await FinancialReportsService.getFinancialReport({ period });
      return res.result ?? null;
    },
  });

  const entries = report?.entries ?? [];

  return (
    <div>
      <PageHeader title="Financial Reports" description="Revenue, purchases, and profit overview." />
      <div className="p-6 lg:p-8">
        <Tabs value={period} onValueChange={v => setPeriod(v as Period)}>
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>

          {(['daily', 'monthly', 'yearly'] as const).map(k => (
            <TabsContent key={k} value={k} className="space-y-5 mt-5">
              {isLoading && <div className="text-sm text-muted-foreground py-8 text-center">Loading report...</div>}
              {error && <div className="text-sm text-destructive py-8 text-center">{getApiErrorMessage(error, 'Unable to load report')}</div>}

              {!isLoading && !error && report && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard label="Total Sales Revenue" value={formatRs(report.totalSalesRevenue ?? 0)} icon={DollarSign} accent="success" />
                    <KpiCard label="Total Purchase Cost" value={formatRs(report.totalPurchaseCost ?? 0)} icon={ShoppingCart} accent="navy" />
                    <KpiCard label="Total Profit" value={formatRs(report.totalProfit ?? 0)} icon={TrendingUp} accent={((report.totalProfit ?? 0) >= 0) ? 'success' : 'danger'} />
                    <KpiCard label="Invoices" value={`${report.totalSalesInvoices ?? 0} sales / ${report.totalPurchaseInvoices ?? 0} purchase`} icon={FileText} accent="navy" />
                  </div>

                  <Card>
                    <CardHeader><CardTitle className="text-base">Revenue vs Purchases</CardTitle></CardHeader>
                    <CardContent className="h-[320px]">
                      {entries.length === 0
                        ? <div className="h-full flex items-center justify-center text-sm text-muted-foreground">No data for this period.</div>
                        : (
                          <ResponsiveContainer>
                            <LineChart data={entries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="period" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                              <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => (v / 1000) + 'k'} />
                              <Tooltip contentStyle={{ background: '#0D1B2A', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }} formatter={(v: number) => formatRs(v)} />
                              <Line type="monotone" dataKey="totalSalesRevenue" name="Revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4 }} />
                              <Line type="monotone" dataKey="totalPurchaseCost" name="Purchases" stroke="#9CA3AF" strokeWidth={2} dot={{ r: 3 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle className="text-base">Profit by period</CardTitle></CardHeader>
                    <CardContent className="h-[280px]">
                      {entries.length === 0
                        ? <div className="h-full flex items-center justify-center text-sm text-muted-foreground">No data for this period.</div>
                        : (
                          <ResponsiveContainer>
                            <BarChart data={entries}>
                              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="period" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => (v / 1000) + 'k'} />
                              <Tooltip contentStyle={{ background: '#0D1B2A', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }} formatter={(v: number) => formatRs(v)} />
                              <Bar dataKey="totalProfit" name="Profit" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                    </CardContent>
                  </Card>

                  {entries.length > 0 && (
                    <Card>
                      <CardHeader><CardTitle className="text-base">Breakdown</CardTitle></CardHeader>
                      <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-deep-navy text-white">
                            <tr>{['Period', 'Sales Revenue', 'Purchase Cost', 'Profit', 'Discounts', 'Tax', 'Sales #', 'Purchase #'].map(h => (
                              <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider">{h}</th>
                            ))}</tr>
                          </thead>
                          <tbody>
                            {entries.map((e, i) => (
                              <tr key={e.period} className={`border-b hover:bg-secondary/40 ${i % 2 ? 'bg-canvas' : ''}`}>
                                <td className="px-4 py-3 font-medium">{e.period}</td>
                                <td className="px-4 py-3 tabular">{formatRs(e.totalSalesRevenue ?? 0)}</td>
                                <td className="px-4 py-3 tabular">{formatRs(e.totalPurchaseCost ?? 0)}</td>
                                <td className={`px-4 py-3 tabular font-medium ${(e.totalProfit ?? 0) >= 0 ? 'text-success' : 'text-destructive'}`}>{formatRs(e.totalProfit ?? 0)}</td>
                                <td className="px-4 py-3 tabular text-muted-foreground">{formatRs(e.totalDiscounts ?? 0)}</td>
                                <td className="px-4 py-3 tabular text-muted-foreground">{formatRs(e.totalTax ?? 0)}</td>
                                <td className="px-4 py-3 tabular">{e.salesInvoiceCount ?? 0}</td>
                                <td className="px-4 py-3 tabular">{e.purchaseInvoiceCount ?? 0}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
export default Reports;
