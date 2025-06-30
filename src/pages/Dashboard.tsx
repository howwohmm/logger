
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DashboardFilters from '@/components/dashboard/DashboardFilters';
import IdeasTable from '@/components/dashboard/IdeasTable';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Idea {
  id: string;
  idea: string;
  name: string | null;
  category: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface FilterState {
  status: string;
  category: string;
  name: string;
  search: string;
  sortBy: 'created_at' | 'updated_at' | 'status';
  sortOrder: 'asc' | 'desc';
}

const Dashboard = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    category: 'all',
    name: 'all',
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch ideas from Supabase
  const fetchIdeas = async () => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIdeas(data || []);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      toast({
        title: "Error",
        description: "Could not load ideas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update idea status
  const updateIdeaStatus = async (ideaId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('ideas')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', ideaId);

      if (error) throw error;

      // Update local state
      setIdeas(prev => prev.map(idea => 
        idea.id === ideaId 
          ? { ...idea, status: newStatus, updated_at: new Date().toISOString() }
          : idea
      ));

      toast({
        title: "Updated ✓",
        description: `Status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Could not update status",
        variant: "destructive",
      });
    }
  };

  // Delete idea
  const deleteIdea = async (ideaId: string) => {
    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', ideaId);

      if (error) throw error;

      setIdeas(prev => prev.filter(idea => idea.id !== ideaId));
      
      toast({
        title: "Deleted ✓",
        description: "Idea removed successfully",
      });
    } catch (error) {
      console.error('Error deleting idea:', error);
      toast({
        title: "Error",
        description: "Could not delete idea",
        variant: "destructive",
      });
    }
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...ideas];

    // Apply filters
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

    // Apply sorting
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

  useEffect(() => {
    fetchIdeas();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-gray-500 font-light">Loading ideas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-foreground transition-colors"
              >
                <ArrowLeft size={16} strokeWidth={1} />
                Back to Logger
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-700" />
              <h1 className="text-xl font-light text-foreground">Ideas Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <DashboardStats ideas={ideas} />

        {/* Filters */}
        <DashboardFilters 
          ideas={ideas}
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Ideas Table */}
        <IdeasTable 
          ideas={filteredIdeas}
          onStatusUpdate={updateIdeaStatus}
          onDelete={deleteIdea}
        />
      </div>
    </div>
  );
};

export default Dashboard;
