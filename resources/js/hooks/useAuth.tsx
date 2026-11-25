import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';

export interface AuthUser {
  id: number | string;
  name: string;
  email: string;
  role?: 'admin' | 'client' | string;
  phone?: string;
  company?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: any | null;
  isAdmin: boolean;
  signUp: (email: string, password: string, displayName?: string, phone?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem('auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const res = await api.get('/user');
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('auth_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          setUser(null);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const res = await api.post('/login', { email, password });
      if (res.data?.token && res.data?.user) {
        localStorage.setItem('auth_token', res.data.token);
        localStorage.setItem('auth_user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        return { error: null };
      }
      return { error: { message: 'লগইন ব্যর্থ হয়েছে।' } };
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data?.errors?.email?.[0] || 'লগইন করতে সমস্যা হয়েছে।';
      return { error: { message } };
    }
  };

  const signUp = async (email: string, password: string, displayName?: string, phone?: string) => {
    try {
      const res = await api.post('/register', {
        name: displayName || email.split('@')[0],
        email,
        password,
        phone
      });

      if (res.data?.token && res.data?.user) {
        localStorage.setItem('auth_token', res.data.token);
        localStorage.setItem('auth_user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        return { error: null };
      }
      return { error: { message: 'রেজিস্ট্রেশন সম্পন্ন করা যায়নি।' } };
    } catch (error: any) {
      const message = error.response?.data?.message || 
                      error.response?.data?.errors?.email?.[0] || 
                      error.response?.data?.errors?.password?.[0] || 
                      'রেজিস্ট্রেশন করতে সমস্যা হয়েছে।';
      return { error: { message } };
    }
  };

  const signOut = async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setUser(null);
    }
  };

  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    session: user ? { user } : null,
    isAdmin,
    signUp,
    signIn,
    signOut,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
