
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { validateCodeword, createUserSession, updateSessionActivity, cleanupUserSessions, cleanupAuthState, SESSION_TIMEOUT } from '@/utils/auth';

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
  updateActivity: () => void;
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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Auto-logout after 5 minutes of inactivity
  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (user) {
      timeoutRef.current = setTimeout(async () => {
        console.log('Session timed out due to inactivity');
        await signOut();
      }, SESSION_TIMEOUT);
    }
  }, [user]);

  // Update activity tracking
  const updateActivity = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;
    
    if (user) {
      // Update session activity in database (debounced)
      updateSessionActivity(user.id);
      resetTimeout();
    }
  }, [user, resetTimeout]);

  // Activity tracking listeners
  useEffect(() => {
    if (!user) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    // Debounce activity updates to avoid too many database calls
    let activityTimeout: NodeJS.Timeout;
    const debouncedUpdateActivity = () => {
      if (activityTimeout) clearTimeout(activityTimeout);
      activityTimeout = setTimeout(updateActivity, 1000); // Update at most once per second
    };

    events.forEach(event => {
      document.addEventListener(event, debouncedUpdateActivity, true);
    });

    // Initial timeout setup
    resetTimeout();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, debouncedUpdateActivity, true);
      });
      if (activityTimeout) clearTimeout(activityTimeout);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [user, updateActivity, resetTimeout]);

  // Check for stored session on initialization
  useEffect(() => {
    const storedSession = localStorage.getItem('artgonic_session');
    if (storedSession) {
      try {
        const sessionData = JSON.parse(storedSession);
        const sessionAge = Date.now() - new Date(sessionData.timestamp).getTime();
        
        // Check if session is still valid (within 5 minutes)
        if (sessionAge < SESSION_TIMEOUT) {
          setUser(sessionData.user);
          lastActivityRef.current = Date.now();
        } else {
          // Session expired, clean up
          localStorage.removeItem('artgonic_session');
          cleanupAuthState();
        }
      } catch (error) {
        console.error('Error parsing stored session:', error);
        localStorage.removeItem('artgonic_session');
        cleanupAuthState();
      }
    }
    setLoading(false);
  }, []);

  const signInWithCodeword = async (codeword: string) => {
    try {
      // Clean up any existing state first
      cleanupAuthState();
      
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

      // Create session in database
      await createUserSession(mockUser.id);

      setUser(mockUser);
      lastActivityRef.current = Date.now();
      
      // Store session in localStorage with timestamp
      localStorage.setItem('artgonic_session', JSON.stringify({ 
        user: mockUser,
        timestamp: new Date().toISOString()
      }));

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      if (user) {
        // Clean up user sessions in database
        await cleanupUserSessions(user.id);
      }
      
      // Clear all timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Clear state
      setUser(null);
      lastActivityRef.current = 0;
      
      // Clean up all auth-related storage
      cleanupAuthState();
      
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if cleanup fails, clear local state
      setUser(null);
      cleanupAuthState();
    }
  };

  const value = {
    user,
    loading,
    signInWithCodeword,
    signOut,
    updateActivity,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
