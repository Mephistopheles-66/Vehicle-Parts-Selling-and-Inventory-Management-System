import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { customers } from '@/data/mock';
import { toast } from 'sonner';

const c = customers[0];

const Profile = () => (
  <div>
    <PageHeader title="My Profile" />
    <div className="p-6 lg:p-8 max-w-2xl">
      <Tabs defaultValue="profile">
        <TabsList><TabsTrigger value="profile">Profile</TabsTrigger><TabsTrigger value="password">Change password</TabsTrigger></TabsList>
        <TabsContent value="profile" className="mt-5"><Card><CardHeader><CardTitle className="text-base">Personal info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold">{c.name.split(' ').map(s=>s[0]).join('')}</div>
              <Button variant="outline" size="sm">Upload avatar</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Name</Label><Input className="mt-1.5" defaultValue={c.name} /></div>
              <div><Label>Phone</Label><Input className="mt-1.5" defaultValue={c.phone} /></div>
            </div>
            <div><Label>Email</Label><Input type="email" className="mt-1.5" defaultValue={c.email} /></div>
            <Button onClick={() => toast.success('Profile updated')}>Save changes</Button>
          </CardContent></Card></TabsContent>
        <TabsContent value="password" className="mt-5"><Card><CardContent className="p-6 space-y-4">
          <div><Label>Current password</Label><Input type="password" className="mt-1.5" /></div>
          <div><Label>New password</Label><Input type="password" className="mt-1.5" /></div>
          <Button onClick={() => toast.success('Password updated')}>Update password</Button>
        </CardContent></Card></TabsContent>
      </Tabs>
    </div>
  </div>
);
export default Profile;
