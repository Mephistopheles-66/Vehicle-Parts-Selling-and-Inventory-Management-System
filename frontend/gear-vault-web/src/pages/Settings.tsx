import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Camera, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProfileService } from '@/api/generated/client';
import type { ProfileDto, UpdateProfileDto } from '@/api/generated/client';
import { getApiErrorMessage, unwrapApiResult } from '@/api/client';
import { getRoleLabel } from '@/lib/roles';
import { roleFromApi } from '@/api/client';
import { useAuth } from '@/hooks/use-auth';

const emptyProfileForm = {
  name: '',
  username: '',
  emailAddress: '',
  phoneNumber: '',
  address: '',
};

const emptyPasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const initials = (name?: string | null) => (name || 'GV').split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase();

const Settings = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { syncProfile } = useAuth();
  const [profileForm, setProfileForm] = useState(emptyProfileForm);
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => unwrapApiResult(await ProfileService.getProfile(), null),
  });

  useEffect(() => {
    if (!profile) return;
    setProfileForm({
      name: profile.name ?? '',
      username: profile.username ?? '',
      emailAddress: profile.emailAddress ?? '',
      phoneNumber: profile.phoneNumber ?? '',
      address: profile.address ?? '',
    });
    syncProfile(profile);
  }, [profile, syncProfile]);

  const roleLabel = useMemo(() => getRoleLabel(roleFromApi(profile?.role?.name)), [profile?.role?.name]);

  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdateProfileDto) => ProfileService.updateProfile({ requestBody: payload }),
    onSuccess: async (response) => {
      if (response.result === false) throw new Error(response.message ?? 'Unable to update profile');
      toast.success('Profile updated');
      const refreshed = unwrapApiResult(await ProfileService.getProfile(), null);
      if (refreshed) syncProfile(refreshed);
      queryClient.setQueryData(['profile'], refreshed);
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Unable to update profile')),
  });

  const updateImageMutation = useMutation({
    mutationFn: (file: File) => ProfileService.updateProfileImage({ formData: { ProfileImage: file } }),
    onSuccess: async (response) => {
      if (response.result === false) throw new Error(response.message ?? 'Unable to update profile image');
      toast.success('Profile image updated');
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Unable to update profile image')),
  });

  const removeImageMutation = useMutation({
    mutationFn: () => ProfileService.removeProfileImage(),
    onSuccess: async (response) => {
      if (response.result === false) throw new Error(response.message ?? 'Unable to remove profile image');
      toast.success('Profile image removed');
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Unable to remove profile image')),
  });

  const changePasswordMutation = useMutation({
    mutationFn: () => ProfileService.changePassword({ requestBody: passwordForm }),
    onSuccess: (response) => {
      if (response.result === false) throw new Error(response.message ?? 'Unable to update password');
      toast.success('Password updated');
      setPasswordForm(emptyPasswordForm);
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Unable to update password')),
  });

  const setProfileField = (key: keyof typeof profileForm, value: string) => setProfileForm(prev => ({ ...prev, [key]: value }));
  const setPasswordField = (key: keyof typeof passwordForm, value: string) => setPasswordForm(prev => ({ ...prev, [key]: value }));

  const saveProfile = (event: React.FormEvent) => {
    event.preventDefault();
    updateProfileMutation.mutate({
      name: profileForm.name.trim(),
      username: profileForm.username.trim(),
      emailAddress: profileForm.emailAddress.trim(),
      phoneNumber: profileForm.phoneNumber.trim(),
      address: profileForm.address.trim(),
    });
  };

  const changePassword = (event: React.FormEvent) => {
    event.preventDefault();
    changePasswordMutation.mutate();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) updateImageMutation.mutate(file);
    event.target.value = '';
  };

  const disabled = isLoading || updateProfileMutation.isPending;

  return (
    <div>
      <PageHeader title="Settings" description="Manage your account, security, and workspace preferences." />
      <div className="p-6 lg:p-8">
        {error && <div className="mb-5 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{getApiErrorMessage(error, 'Unable to load profile')}</div>}
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-5">
            <div className="grid lg:grid-cols-[280px_1fr] gap-5">
              <Card>
                <CardContent className="p-6 text-center">
                  <Avatar className="mx-auto h-24 w-24">
                    <AvatarImage src={profile?.profileImage?.fileUrl ?? undefined} alt={profile?.name ?? 'Profile'} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">{initials(profile?.name)}</AvatarFallback>
                  </Avatar>
                  <h2 className="mt-4 font-semibold text-charcoal">{profile?.name || 'Loading...'}</h2>
                  <p className="text-sm text-muted-foreground">{roleLabel}</p>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  <div className="mt-5 grid gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={updateImageMutation.isPending}>
                      {updateImageMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Camera className="h-4 w-4 mr-2" />}
                      Upload image
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeImageMutation.mutate()} disabled={!profile?.profileImage?.fileUrl || removeImageMutation.isPending}>
                      <Trash2 className="h-4 w-4 mr-2" /> Remove image
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">Account Details</CardTitle></CardHeader>
                <CardContent>
                  <form onSubmit={saveProfile} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><Label>Name</Label><Input className="mt-1.5" value={profileForm.name} onChange={e => setProfileField('name', e.target.value)} disabled={disabled} required /></div>
                      <div><Label>Username</Label><Input className="mt-1.5" value={profileForm.username} onChange={e => setProfileField('username', e.target.value)} disabled={disabled} required /></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><Label>Email</Label><Input type="email" className="mt-1.5" value={profileForm.emailAddress} onChange={e => setProfileField('emailAddress', e.target.value)} disabled={disabled} required /></div>
                      <div><Label>Phone</Label><Input className="mt-1.5" value={profileForm.phoneNumber} onChange={e => setProfileField('phoneNumber', e.target.value)} disabled={disabled} /></div>
                    </div>
                    <div><Label>Address</Label><Input className="mt-1.5" value={profileForm.address} onChange={e => setProfileField('address', e.target.value)} disabled={disabled} /></div>
                    <Button type="submit" disabled={disabled}>
                      {updateProfileMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Save changes
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-5">
            <Card>
              <CardHeader><CardTitle className="text-base">Change Password</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={changePassword} className="space-y-4">
                  <div><Label>Current password</Label><Input type="password" className="mt-1.5" value={passwordForm.currentPassword} onChange={e => setPasswordField('currentPassword', e.target.value)} required /></div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><Label>New password</Label><Input type="password" className="mt-1.5" value={passwordForm.newPassword} onChange={e => setPasswordField('newPassword', e.target.value)} required /></div>
                    <div><Label>Confirm password</Label><Input type="password" className="mt-1.5" value={passwordForm.confirmPassword} onChange={e => setPasswordField('confirmPassword', e.target.value)} required /></div>
                  </div>
                  <Button type="submit" disabled={changePasswordMutation.isPending}>
                    {changePasswordMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Update password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
