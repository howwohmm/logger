
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

export const getCurrentUser = (): UserName | null => {
  const userData = localStorage.getItem('artgonic_user');
  return userData ? JSON.parse(userData).name : null;
};

export const setCurrentUser = (name: UserName): void => {
  localStorage.setItem('artgonic_user', JSON.stringify({ name }));
};

export const clearCurrentUser = (): void => {
  localStorage.removeItem('artgonic_user');
};

export const requireAuth = (): UserName | null => {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = '/login';
    return null;
  }
  return user;
};
