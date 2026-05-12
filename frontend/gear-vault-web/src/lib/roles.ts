import type { Role } from '@/types';

export const getRoleHomePath = (role: Role) => {
  if (role === 'super-admin') return '/admin';
  return `/${role}`;
};

export const getRoleLabel = (role: Role) => {
  if (role === 'super-admin') return 'Super Admin';
  return role;
};

