import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from '@/api/generated/client';
import { getApiErrorMessage, unwrapApiResult } from '@/api/client';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

const Profile = () => {
  const { syncProfile } = useAuth();
  const queryClient = useQueryClient();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => unwrapApiResult(await ProfileService.getProfile(), null),
  });

  const [form, setForm] = useState({ name: '', emailAddress: '', username: '', phoneNumber: '', address: '' });
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    if (!profile) return;
    setForm({
      name: profile.name ?? '',
      emailAddress: profile.emailAddress ?? '',
      username: profile.username ?? '',
      phoneNumber: profile.phoneNumber ?? '',
      address: profile.address ?? '',
    });
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: () => ProfileService.updateProfile({ requestBody: form }),
    onSuccess: async () => {
      toast.success('Profile updated');
      const fresh = unwrapApiResult(await ProfileService.getProfile(), null);
      if (fresh) syncProfile(fresh);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Unable to update profile')),
  });

  const changePasswordMutation = useMutation({
    mutationFn: () => ProfileService.changePassword({ requestBody: pw }),
    onSuccess: () => {
      toast.success('Password updated');
      setPw({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Unable to change password')),
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => ProfileService.updateProfileImage({ formData: { ProfileImage: file } }),
    onSuccess: async () => {
      toast.success('Avatar updated');
      const fresh = unwrapApiResult(await ProfileService.getProfile(), null);
      if (fresh) syncProfile(fresh);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Unable to upload avatar')),
  });

  const initials = (profile?.name ?? 'U').split(' ').map((s: string) => s[0]).join('').toUpperCase();
  const setField = (key: keyof typeof form, value: string) => setForm(prev => ({ ...prev, [key]: value }));
  const setPwField = (key: keyof typeof pw, value: string) => setPw(prev => ({ ...prev, [key]: value }));

  return (
    <div>
      <PageHeader title="My Profile" />
      <div className="p-6 lg:p-8 max-w-2xl">
        {isLoading && <div className="text-sm text-muted-foreground mb-4">Loading profile...</div>}
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Change password</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-5">
            <Card><CardHeader><CardTitle className="text-base">Personal info</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  {profile?.profileImage?.fileUrl
                    ? <img src={profile.profileImage.fileUrl} alt="Avatar" className="h-16 w-16 rounded-full object-cover" />
                    : <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold">{initials}</div>}
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) uploadAvatarMutation.mutate(f); }}
                  />
                  <Button variant="outline" size="sm" onClick={() => avatarInputRef.current?.click()} disabled={uploadAvatarMutation.isPending}>
                    {uploadAvatarMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Upload avatar
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Name</Label><Input className="mt-1.5" value={form.name} onChange={e => setField('name', e.target.value)} /></div>
                  <div><Label>Phone</Label><Input className="mt-1.5" value={form.phoneNumber} onChange={e => setField('phoneNumber', e.target.value)} /></div>
                </div>
                <div><Label>Email</Label><Input type="email" className="mt-1.5" value={form.emailAddress} onChange={e => setField('emailAddress', e.target.value)} /></div>
                <div><Label>Username</Label><Input className="mt-1.5" value={form.username} onChange={e => setField('username', e.target.value)} /></div>
                <div><Label>Address</Label><Input className="mt-1.5" value={form.address} onChange={e => setField('address', e.target.value)} /></div>
                <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending || isLoading}>
                  {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password" className="mt-5">
            <Card><CardContent className="p-6 space-y-4">
              <div><Label>Current password</Label><Input type="password" className="mt-1.5" value={pw.currentPassword} onChange={e => setPwField('currentPassword', e.target.value)} /></div>
              <div><Label>New password</Label><Input type="password" className="mt-1.5" value={pw.newPassword} onChange={e => setPwField('newPassword', e.target.value)} /></div>
              <div><Label>Confirm password</Label><Input type="password" className="mt-1.5" value={pw.confirmPassword} onChange={e => setPwField('confirmPassword', e.target.value)} /></div>
              <Button onClick={() => changePasswordMutation.mutate()} disabled={changePasswordMutation.isPending}>
                {changePasswordMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Update password
              </Button>
            </CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
export default Profile;
