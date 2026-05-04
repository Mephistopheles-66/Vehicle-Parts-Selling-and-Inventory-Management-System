import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const Settings = () => (
  <div>
    <PageHeader title="Settings" />
    <div className="p-6 lg:p-8 max-w-2xl space-y-5">
      <Card><CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {['Email notifications','SMS alerts','Low stock alerts','Appointment reminders'].map(s => (
            <div key={s} className="flex items-center justify-between"><span className="text-sm">{s}</span><Switch defaultChecked /></div>
          ))}
        </CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base">Theme</CardTitle></CardHeader>
        <CardContent><div className="text-sm text-muted-foreground">Toggle theme via the sun/moon icon in the top bar.</div></CardContent></Card>
    </div>
  </div>
);
export default Settings;
