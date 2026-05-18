import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Search, ShieldCheck, UserCog } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserService, RoleService } from '@/api/generated/client';
import { getApiErrorMessage, roleFromApi } from '@/api/client';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

const variants = { 'super-admin': 'info', staff: 'success', customer: 'neutral' } as const;

const emptyForm = {
  name: '',
  username: '',
  emailAddress: '',
  phoneNumber: '',
  address: '',
  password: '',
  roleId: '',
};

const initials = (name?: string | null) => (name ?? 'U').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();

const UsersList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showCreate = location.pathname.endsWith('/new');
  const [q, setQ] = useState('');
  const [form, setForm] = useState(emptyForm);

  const { data: usersResponse, isLoading, error } = useQuery({
    queryKey: ['users', q],
    queryFn: () => UserService.getAllUsersList({ globalSearch: q || undefined }),
  });
  const { data: rolesResponse } = useQuery({
    queryKey: ['roles'],
    queryFn: () => RoleService.getAllRolesList({}),
  });

  const users = usersResponse?.result ?? [];
  const roleOptions = (rolesResponse?.result ?? []).filter(
    r => r.name?.toLowerCase() === 'staff' || r.name?.toLowerCase() === 'customer'
  );

  const createMutation = useMutation({
    mutationFn: () => UserService.registerUser({
      formData: {
        Name: form.name,
        Username: form.username,
        EmailAddress: form.emailAddress,
        PhoneNumber: form.phoneNumber,
        Address: form.address || undefined,
        Password: form.password,
        RoleId: form.roleId,
      },
    }),
    onSuccess: () => {
      toast.success('User created');
      setForm(emptyForm);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate('/admin/users');
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Unable to create user')),
  });

  const toggleMutation = useMutation({
    mutationFn: (userId: string) => UserService.activateDeactivateUser({ userId }),
    onSuccess: () => {
      toast.success('User status updated');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Unable to update user status')),
  });

  const setField = (key: keyof typeof form, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  return (
    <div>
      <PageHeader title="Users" description="Manage customer, staff, and admin accounts."
        actions={<Button asChild><Link to="/admin/users/new"><Plus className="h-4 w-4 mr-2" />Add user</Link></Button>} />
      <div className="p-6 lg:p-8 space-y-5">
        {showCreate && (
          <Card>
            <CardHeader><CardTitle className="text-base">Create User</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={submit} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div><Label>Name</Label><Input className="mt-1.5" value={form.name} onChange={e => setField('name', e.target.value)} required /></div>
                <div><Label>Username</Label><Input className="mt-1.5" value={form.username} onChange={e => setField('username', e.target.value)} required /></div>
                <div><Label>Email</Label><Input className="mt-1.5" type="email" value={form.emailAddress} onChange={e => setField('emailAddress', e.target.value)} required /></div>
                <div><Label>Phone</Label><Input className="mt-1.5" value={form.phoneNumber} onChange={e => setField('phoneNumber', e.target.value)} required /></div>
                <div><Label>Address</Label><Input className="mt-1.5" value={form.address} onChange={e => setField('address', e.target.value)} /></div>
                <div><Label>Password</Label><Input className="mt-1.5" type="password" value={form.password} onChange={e => setField('password', e.target.value)} required /></div>
                <div><Label>Role</Label>
                  <Select value={form.roleId} onValueChange={value => setField('roleId', value)} required>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select role" /></SelectTrigger>
                    <SelectContent>{roleOptions.map(role => <SelectItem key={role.id} value={role.id ?? ''}>{role.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <Button type="submit" disabled={createMutation.isPending || !form.roleId}>Create user</Button>
                  <Button type="button" variant="outline" onClick={() => navigate('/admin/users')}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search users..." className="pl-9" />
            </div>
          </CardContent>
        </Card>

        <Card><CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-deep-navy text-white"><tr>{['Name','Email','Phone','Role','Verified','Status',''].map(h => <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody>
              {isLoading && <tr><td className="px-4 py-8 text-center text-muted-foreground" colSpan={7}>Loading users...</td></tr>}
              {error && <tr><td className="px-4 py-8 text-center text-destructive" colSpan={7}>{getApiErrorMessage(error, 'Unable to load users')}</td></tr>}
              {!isLoading && !error && users.length === 0 && <tr><td className="px-4 py-8 text-center text-muted-foreground" colSpan={7}>No users found.</td></tr>}
              {users.map((u, i) => {
                const role = roleFromApi(u.role?.name);
                return (
                  <tr key={u.id} className={`border-b hover:bg-secondary/40 ${i%2?'bg-canvas':''}`}>
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">{initials(u.name)}</div><span className="font-medium">{u.name}</span></div></td>
                    <td className="px-4 py-3 text-muted-foreground">{u.emailAddress}</td>
                    <td className="px-4 py-3 font-mono text-xs">{u.phoneNumber ?? '-'}</td>
                    <td className="px-4 py-3"><StatusBadge variant={variants[role]}>{u.role?.name ?? role}</StatusBadge></td>
                    <td className="px-4 py-3"><StatusBadge variant={u.isVerified ? 'success' : 'warning'}>{u.isVerified ? 'Verified' : 'Pending'}</StatusBadge></td>
                    <td className="px-4 py-3"><StatusBadge variant={u.isActive ? 'success' : 'neutral'}>{u.isActive ? 'Active' : 'Inactive'}</StatusBadge></td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" disabled={!u.id || toggleMutation.isPending} onClick={() => u.id && toggleMutation.mutate(u.id)}>
                        {u.isActive ? <UserCog className="h-4 w-4 mr-2" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent></Card>
      </div>
    </div>
  );
};
export default UsersList;
