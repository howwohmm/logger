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

// Legacy functions - keeping for backward compatibility
export const getCurrentUser = (): UserName | null => {
  return null; // Authentication now handled by AuthContext
};

export const setCurrentUser = (name: UserName): void => {
  // No-op - authentication now handled by AuthContext
};

export const clearCurrentUser = (): void => {
  // No-op - authentication now handled by AuthContext
};

export const requireAuth = (): UserName | null => {
  return null; // Authentication now handled by AuthContext
};
