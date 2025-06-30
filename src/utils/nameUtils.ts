
import Fuse from 'fuse.js';

// Canonical list of contributors
export const CANONICAL_NAMES = [
  'Om',
  'Keerthi', 
  'Shan',
  'Varsha',
  'Vishal',
  'Harrison',
  'Sharika'
];

// Configure Fuse.js for fuzzy matching
const fuse = new Fuse(CANONICAL_NAMES, {
  threshold: 0.4, // Lower = more strict matching
  distance: 100,
  includeScore: true
});

/**
 * Maps a user input name to the closest canonical name
 * Returns both original and canonical names
 */
export const mapNameToCanonical = (inputName: string): { original: string; canonical: string | null } => {
  if (!inputName?.trim()) {
    return { original: '', canonical: null };
  }

  const trimmedName = inputName.trim();
  
  // Check for exact match first (case insensitive)
  const exactMatch = CANONICAL_NAMES.find(
    name => name.toLowerCase() === trimmedName.toLowerCase()
  );
  
  if (exactMatch) {
    return { original: trimmedName, canonical: exactMatch };
  }

  // Use fuzzy matching
  const results = fuse.search(trimmedName);
  
  if (results.length > 0 && results[0].score! < 0.4) {
    return { 
      original: trimmedName, 
      canonical: results[0].item 
    };
  }

  // No good match found, return as-is with no canonical mapping
  return { original: trimmedName, canonical: null };
};

/**
 * Get autocomplete suggestions for a partial name input
 */
export const getNameSuggestions = (input: string): string[] => {
  if (!input?.trim()) {
    return CANONICAL_NAMES;
  }

  const trimmedInput = input.trim().toLowerCase();
  
  // Return names that start with the input, plus fuzzy matches
  const startsWith = CANONICAL_NAMES.filter(name => 
    name.toLowerCase().startsWith(trimmedInput)
  );
  
  const fuzzyResults = fuse.search(input)
    .filter(result => result.score! < 0.6)
    .map(result => result.item);
  
  // Combine and deduplicate
  const combined = [...new Set([...startsWith, ...fuzzyResults])];
  
  return combined.slice(0, 5); // Limit to 5 suggestions
};
