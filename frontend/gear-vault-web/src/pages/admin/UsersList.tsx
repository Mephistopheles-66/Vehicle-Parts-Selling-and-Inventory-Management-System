import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { users } from '@/data/mock';
import { Plus, UserCog } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/shared/StatusBadge';

const variants = { admin: 'info', staff: 'success', customer: 'neutral' } as const;

const UsersList = () => (
  <div>
    <PageHeader title="Users" description="Manage staff and admin accounts."
      actions={<Button asChild><Link to="/admin/users/new"><Plus className="h-4 w-4 mr-2" />Add user</Link></Button>} />
    <div className="p-6 lg:p-8">
      <Card><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead className="bg-deep-navy text-white"><tr>{['Name','Email','Phone','Role',''].map(h => <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider">{h}</th>)}</tr></thead>
          <tbody>{users.map((u, i) => (
            <tr key={u.id} className={`border-b hover:bg-secondary/40 ${i%2?'bg-canvas':''}`}>
              <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">{u.name.split(' ').map(s=>s[0]).slice(0,2).join('')}</div><span className="font-medium">{u.name}</span></div></td>
              <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
              <td className="px-4 py-3 font-mono text-xs">{u.phone}</td>
              <td className="px-4 py-3"><StatusBadge variant={variants[u.role]}>{u.role}</StatusBadge></td>
              <td className="px-4 py-3"><Button variant="ghost" size="sm">Edit</Button></td>
            </tr>))}</tbody>
        </table>
      </CardContent></Card>
    </div>
  </div>
);
export default UsersList;
