import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import type { Role, User } from '@/types';
import { users } from '@/data/mock';
import { AuthenticationService } from '@/api/generated/client';
import type { ProfileDto } from '@/api/generated/client';
import { getApiErrorMessage, mapProfileToUser, setAuthToken } from '@/api/client';

interface AuthCtx {
  user: User | null;
  login: (emailAddressOrUsername: string, password: string) => Promise<User>;
  loginDemo: (role: Role) => void;
  registerCustomer: (input: RegisterCustomerInput) => Promise<void>;
  syncProfile: (profile: ProfileDto) => void;
  logout: () => Promise<void>;
}

interface RegisterCustomerInput {
  name: string;
  username: string;
  emailAddress: string;
  phoneNumber: string;
  address?: string;
  password: string;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  login: async () => {
    throw new Error('Auth provider is not ready');
  },
  loginDemo: () => {},
  registerCustomer: async () => {},
  syncProfile: () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('gv-user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('gv-user', JSON.stringify(user));
    else localStorage.removeItem('gv-user');
  }, [user]);

  const login = async (emailAddressOrUsername: string, password: string) => {
    const response = await AuthenticationService.login({
      requestBody: { emailAddressOrUsername, password },
    });
    const token = response.result?.token;
    const profile = response.result?.profile;

    if (!profile || !token) {
      throw new Error(response.message ?? 'Login did not return account details');
    }

    const nextUser = mapProfileToUser(profile);
    setAuthToken(token);
    setUser(nextUser);
    return nextUser;
  };

  const loginDemo = (role: Role) => {
    const u = users.find(x => x.role === role) ?? users[0];
    setAuthToken(null);
    setUser(u);
  };

  const registerCustomer = async (input: RegisterCustomerInput) => {
    const response = await AuthenticationService.register({
      formData: {
        Name: input.name,
        Username: input.username,
        EmailAddress: input.emailAddress,
        Address: input.address,
        Password: input.password,
        PhoneNumber: input.phoneNumber,
      },
    });

    if (response.result === false) {
      throw new Error(response.message ?? 'Registration failed');
    }
  };

  const syncProfile = useCallback((profile: ProfileDto) => {
    setUser(mapProfileToUser(profile));
  }, []);

  const logout = async () => {
    try {
      await AuthenticationService.logout();
    } catch (error) {
      console.warn(getApiErrorMessage(error, 'Logout request failed'));
    } finally {
      setAuthToken(null);
      setUser(null);
    }
  };

  return <Ctx.Provider value={{ user, login, loginDemo, registerCustomer, syncProfile, logout }}>{children}</Ctx.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(Ctx);
