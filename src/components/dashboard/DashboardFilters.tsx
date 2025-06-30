
import { Search, Filter } from 'lucide-react';
import { Idea, FilterState } from '@/pages/Dashboard';

interface DashboardFiltersProps {
  ideas: Idea[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const DashboardFilters = ({ ideas, filters, onFiltersChange }: DashboardFiltersProps) => {
  // Get unique values for filter dropdowns
  const uniqueCategories = Array.from(new Set(ideas.map(idea => idea.category).filter(Boolean)));
  const uniqueNames = Array.from(new Set(ideas.map(idea => idea.name).filter(Boolean)));

  const statusOptions = [
    { value: 'proposed', label: 'Proposed', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    { value: 'parked', label: 'Parked', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
  ];

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={16} strokeWidth={1} />
        <h2 className="text-lg font-light">Filters & Search</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Search size={16} strokeWidth={1} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search ideas, names, categories..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-background font-light focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-background font-light focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
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
          <select
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-background font-light focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
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
          <select
            value={filters.name}
            onChange={(e) => updateFilter('name', e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-background font-light focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
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
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-background font-light focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
          >
            <option value="created_at-desc">Newest First</option>
            <option value="created_at-asc">Oldest First</option>
            <option value="updated_at-desc">Recently Updated</option>
            <option value="status-asc">Status A-Z</option>
            <option value="status-desc">Status Z-A</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default DashboardFilters;
