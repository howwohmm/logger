
import DashboardFilters from '@/components/dashboard/DashboardFilters';
import IdeasTable from '@/components/dashboard/IdeasTable';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LoadingSpinner from '@/components/dashboard/LoadingSpinner';
import { useIdeas } from '@/hooks/useIdeas';
import { useIdeasFilter } from '@/hooks/useIdeasFilter';

export interface Idea {
  id: string;
  idea: string;
  name: string | null;
  original_name: string | null;
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
  const { ideas, isLoading, updateIdeaStatus, deleteIdea } = useIdeas();
  const { filteredIdeas, filters, setFilters } = useIdeasFilter(ideas);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardStats ideas={ideas} />

        <DashboardFilters 
          ideas={ideas}
          filters={filters}
          onFiltersChange={setFilters}
        />

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
