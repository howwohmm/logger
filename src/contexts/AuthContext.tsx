
import { createContext, useContext, useEffect, useState } from 'react';
import { validateCodeword } from '@/utils/auth';

interface User {
  id: string;
  email: string;
  user_metadata: { name: string };
  created_at: string;
  updated_at: string;
  app_metadata: {};
  aud: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithCodeword: (codeword: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedSession = localStorage.getItem('artgonic_session');
    if (storedSession) {
      try {
        const sessionData = JSON.parse(storedSession);
        setUser(sessionData.user);
      } catch (error) {
        localStorage.removeItem('artgonic_session');
      }
    }
    setLoading(false);
  }, []);

  const signInWithCodeword = async (codeword: string) => {
    try {
      const contributorName = await validateCodeword(codeword);
      
      if (!contributorName) {
        return { error: { message: 'Invalid codeword' } };
      }

      // Create a session using the contributor name
      const mockUser = {
        id: codeword,
        email: `${codeword}@artgonic.local`,
        user_metadata: { name: contributorName },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        app_metadata: {},
        aud: 'authenticated',
        role: 'authenticated'
      } as User;

      setUser(mockUser);
      
      // Store session in localStorage
      localStorage.setItem('artgonic_session', JSON.stringify({ user: mockUser }));

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('artgonic_session');
  };

  const value = {
    user,
    loading,
    signInWithCodeword,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
