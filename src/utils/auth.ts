
import { supabase } from '@/integrations/supabase/client';

export type UserName = string;

export const validateCodeword = async (codeword: string): Promise<UserName | null> => {
  try {
    const normalizedCodeword = codeword.toLowerCase().trim();
    
    const { data, error } = await supabase
      .from('codewords')
      .select('contributor_name')
      .eq('codeword', normalizedCodeword)
      .single();

    if (error || !data) {
      return null;
    }

    return data.contributor_name;
  } catch (error) {
    console.error('Error validating codeword:', error);
    return null;
  }
};

// Session management utilities
export const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

export const createUserSession = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('user_sessions')
      .insert({
        user_id: userId,
        last_activity: new Date().toISOString()
      });

    if (error) {
      console.error('Error creating user session:', error);
    }
  } catch (error) {
    console.error('Error creating user session:', error);
  }
};

export const updateSessionActivity = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('user_sessions')
      .update({ last_activity: new Date().toISOString() })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating session activity:', error);
    }
  } catch (error) {
    console.error('Error updating session activity:', error);
  }
};

export const cleanupUserSessions = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('user_sessions')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error cleaning up user sessions:', error);
    }
  } catch (error) {
    console.error('Error cleaning up user sessions:', error);
  }
};

export const cleanupAuthState = () => {
  // Clear all auth-related localStorage items
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-') || key === 'artgonic_session') {
      localStorage.removeItem(key);
    }
  });
  
  // Clear sessionStorage as well
  if (typeof sessionStorage !== 'undefined') {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  }
};
