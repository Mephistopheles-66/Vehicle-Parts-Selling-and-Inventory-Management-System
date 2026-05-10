import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { revenueSeries, topPartsSeries } from '@/data/mock';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { Download, FileSpreadsheet } from 'lucide-react';
import { formatRs } from '@/lib/format';

const Reports = () => (
  <div>
    <PageHeader title="Financial Reports" actions={<><Button variant="outline"><FileSpreadsheet className="h-4 w-4 mr-2" />Excel</Button><Button><Download className="h-4 w-4 mr-2" />PDF</Button></>} />
    <div className="p-6 lg:p-8">
      <Tabs defaultValue="monthly">
        <TabsList><TabsTrigger value="daily">Daily</TabsTrigger><TabsTrigger value="monthly">Monthly</TabsTrigger><TabsTrigger value="yearly">Yearly</TabsTrigger></TabsList>
        {['daily','monthly','yearly'].map(k => (
          <TabsContent key={k} value={k} className="space-y-5 mt-5">
            <Card><CardHeader><CardTitle className="text-base">Revenue trend</CardTitle></CardHeader>
              <CardContent className="h-[320px]">
                <ResponsiveContainer><LineChart data={revenueSeries} margin={{top:10,right:10,left:-10,bottom:0}}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v=>(v/1000)+'k'} />
                  <Tooltip contentStyle={{background:'#0D1B2A',border:'none',borderRadius:8,color:'#fff',fontSize:12}} formatter={(v:number)=>formatRs(v)} />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{r:4}} />
                  <Line type="monotone" dataKey="purchases" stroke="#9CA3AF" strokeWidth={2} dot={{r:3}} />
                </LineChart></ResponsiveContainer>
              </CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">Top categories</CardTitle></CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer><BarChart data={topPartsSeries}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{background:'#0D1B2A',border:'none',borderRadius:8,color:'#fff',fontSize:12}} />
                  <Bar dataKey="units" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
                </BarChart></ResponsiveContainer>
              </CardContent></Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  </div>
);
export default Reports;
