
import { useState, useEffect } from 'react';
import { Idea, FilterState } from '@/pages/Dashboard';

export const useIdeasFilter = (ideas: Idea[]) => {
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    category: 'all',
    name: 'all',
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  useEffect(() => {
    let filtered = [...ideas];

    if (filters.status !== 'all') {
      filtered = filtered.filter(idea => idea.status === filters.status);
    }
    
    if (filters.category !== 'all') {
      filtered = filtered.filter(idea => idea.category === filters.category);
    }
    
    if (filters.name !== 'all') {
      filtered = filtered.filter(idea => idea.name === filters.name);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(idea => 
        idea.idea.toLowerCase().includes(searchLower) ||
        (idea.name && idea.name.toLowerCase().includes(searchLower)) ||
        (idea.category && idea.category.toLowerCase().includes(searchLower))
      );
    }

    filtered.sort((a, b) => {
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];
      
      if (filters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredIdeas(filtered);
  }, [ideas, filters]);

  return {
    filteredIdeas,
    filters,
    setFilters
  };
};
