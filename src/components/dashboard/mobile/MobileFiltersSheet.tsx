
import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Idea, FilterState } from '@/pages/Dashboard';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';

interface MobileFiltersSheetProps {
  ideas: Idea[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const MobileFiltersSheet = ({ ideas, filters, onFiltersChange }: MobileFiltersSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get unique values for filter dropdowns
  const uniqueCategories = Array.from(new Set(ideas.map(idea => idea.category).filter(Boolean)));
  const uniqueNames = Array.from(new Set(ideas.map(idea => idea.name).filter(Boolean)));

  const statusOptions = [
    { value: 'proposed', label: 'Proposed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'parked', label: 'Parked' },
  ];

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: 'all',
      category: 'all',
      name: 'all',
      search: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 font-light"
        >
          <Filter size={16} strokeWidth={1} />
          Filters
        </Button>
      </SheetTrigger>
      
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle className="text-left font-light">Filters & Search</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-light text-gray-600 dark:text-gray-400 mb-2">
              Search
            </label>
            <div className="relative">
              <Search size={16} strokeWidth={1} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search ideas, names, categories..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-background font-light focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white text-sm"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-light text-gray-600 dark:text-gray-400 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-background font-light focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white text-sm"
            >
              <option value="all">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-light text-gray-600 dark:text-gray-400 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-background font-light focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white text-sm"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Name Filter */}
          <div>
            <label className="block text-sm font-light text-gray-600 dark:text-gray-400 mb-2">
              Contributor
            </label>
            <select
              value={filters.name}
              onChange={(e) => updateFilter('name', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-background font-light focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white text-sm"
            >
              <option value="all">All Contributors</option>
              {uniqueNames.map(name => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-light text-gray-600 dark:text-gray-400 mb-2">
              Sort
            </label>
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                onFiltersChange({ 
                  ...filters, 
                  sortBy: sortBy as FilterState['sortBy'], 
                  sortOrder: sortOrder as FilterState['sortOrder'] 
                });
              }}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-background font-light focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white text-sm"
            >
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="updated_at-desc">Recently Updated</option>
              <option value="status-asc">Status A-Z</option>
              <option value="status-desc">Status Z-A</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex-1 font-light"
            >
              Clear All
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              className="flex-1 font-light"
            >
              Apply
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFiltersSheet;
