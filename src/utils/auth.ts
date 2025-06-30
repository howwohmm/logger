// Legacy auth utilities - keeping for backward compatibility
// but authentication is now handled through AuthContext

// Codeword mapping for the 7 contributors
const CODEWORDS = {
  zen: 'Om',
  tears: 'Keerthi', 
  ex: 'Shan',
  rainbow: 'Varsha',
  niggendra: 'Vishal',
  coffee: 'Harrison',
  sunday: 'Sharika'
} as const;

export type UserName = typeof CODEWORDS[keyof typeof CODEWORDS];

export const validateCodeword = (codeword: string): UserName | null => {
  const normalizedCodeword = codeword.toLowerCase().trim();
  return CODEWORDS[normalizedCodeword as keyof typeof CODEWORDS] || null;
};

// Legacy functions - will be removed once migration is complete
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
