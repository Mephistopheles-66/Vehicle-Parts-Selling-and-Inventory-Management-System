import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Role, User } from '@/types';
import { users } from '@/data/mock';

interface AuthCtx {
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>({ user: null, login: () => {}, logout: () => {} });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('gv-user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('gv-user', JSON.stringify(user));
    else localStorage.removeItem('gv-user');
  }, [user]);

  const login = (role: Role) => {
    const u = users.find(x => x.role === role) ?? users[0];
    setUser(u);
  };
  const logout = () => setUser(null);

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
};

export const useAuth = () => useContext(Ctx);
