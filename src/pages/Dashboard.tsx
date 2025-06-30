
import DashboardFilters from '@/components/dashboard/DashboardFilters';
import IdeasTable from '@/components/dashboard/IdeasTable';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LoadingSpinner from '@/components/dashboard/LoadingSpinner';
import ProtectedRoute from '@/components/ProtectedRoute';
import MobileStatsRow from '@/components/dashboard/mobile/MobileStatsRow';
import MobileFiltersSheet from '@/components/dashboard/mobile/MobileFiltersSheet';
import MobileIdeasList from '@/components/dashboard/mobile/MobileIdeasList';
import { useIdeas } from '@/hooks/useIdeas';
import { useIdeasFilter } from '@/hooks/useIdeasFilter';
import { useIsMobile } from '@/hooks/use-mobile';

export interface Idea {
  id: string;
  idea: string;
  name: string | null;
  original_name: string | null;
  category: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  upvotes: string[];
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
  const { ideas, isLoading, updateIdeaStatus, updateIdeaUpvotes, deleteIdea } = useIdeas();
  const { filteredIdeas, filters, setFilters } = useIdeasFilter(ideas);
  const isMobile = useIsMobile();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        <DashboardHeader />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Desktop Stats */}
          <div className="hidden md:block">
            <DashboardStats ideas={ideas} />
          </div>

          {/* Mobile Stats */}
          <div className="md:hidden mb-6">
            <MobileStatsRow ideas={ideas} />
          </div>

          {/* Desktop Filters */}
          <div className="hidden md:block">
            <DashboardFilters 
              ideas={ideas}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Mobile Filters */}
          <div className="md:hidden mb-6 flex justify-between items-center">
            <h2 className="text-lg font-light">Ideas</h2>
            <MobileFiltersSheet 
              ideas={ideas}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block">
            <IdeasTable 
              ideas={filteredIdeas}
              onStatusUpdate={updateIdeaStatus}
              onUpvoteUpdate={updateIdeaUpvotes}
              onDelete={deleteIdea}
            />
          </div>

          {/* Mobile List */}
          <div className="md:hidden">
            <MobileIdeasList 
              ideas={filteredIdeas}
              onStatusUpdate={updateIdeaStatus}
              onUpvoteUpdate={updateIdeaUpvotes}
              onDelete={deleteIdea}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
