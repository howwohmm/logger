
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { validateCodeword } from '@/utils/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithCodeword: (codeword: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithCodeword = async (codeword: string) => {
    try {
      const contributorName = await validateCodeword(codeword);
      
      if (!contributorName) {
        return { error: { message: 'Invalid codeword' } };
      }

      // Create a temporary session using the contributor name
      // Since we're using codeword authentication, we'll create a mock session
      const mockUser = {
        id: codeword, // Use codeword as ID for simplicity
        email: `${codeword}@artgonic.local`,
        user_metadata: { name: contributorName },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        app_metadata: {},
        aud: 'authenticated',
        role: 'authenticated'
      } as User;

      const mockSession = {
        access_token: `codeword_${codeword}`,
        refresh_token: `refresh_${codeword}`,
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        user: mockUser
      } as Session;

      setUser(mockUser);
      setSession(mockSession);

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, name: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: name,
        }
      }
    });
    return { error };
  };

  const signOut = async () => {
    // Clear codeword session
    setUser(null);
    setSession(null);
    
    // Also attempt Supabase signout in case there's a real session
    try {
      await supabase.auth.signOut();
    } catch (error) {
      // Ignore errors since we might not have a real Supabase session
    }
  };

  const value = {
    user,
    session,
    loading,
    signInWithCodeword,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
