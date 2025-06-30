
import { Idea } from '@/pages/Dashboard';

interface DashboardStatsProps {
  ideas: Idea[];
}

const DashboardStats = ({ ideas }: DashboardStatsProps) => {
  const stats = {
    total: ideas.length,
    proposed: ideas.filter(idea => idea.status === 'proposed').length,
    inProgress: ideas.filter(idea => idea.status === 'in-progress').length,
    completed: ideas.filter(idea => idea.status === 'completed').length,
    parked: ideas.filter(idea => idea.status === 'parked').length,
    claimed: ideas.filter(idea => idea.name).length,
    anonymous: ideas.filter(idea => !idea.name).length,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="text-2xl font-light text-foreground">{stats.total}</div>
        <div className="text-sm text-gray-500 font-light">Total Ideas</div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="text-2xl font-light text-blue-700 dark:text-blue-300">{stats.proposed}</div>
        <div className="text-sm text-blue-600 dark:text-blue-400 font-light">Proposed</div>
      </div>
      
      <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <div className="text-2xl font-light text-yellow-700 dark:text-yellow-300">{stats.inProgress}</div>
        <div className="text-sm text-yellow-600 dark:text-yellow-400 font-light">In Progress</div>
      </div>
      
      <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
        <div className="text-2xl font-light text-green-700 dark:text-green-300">{stats.completed}</div>
        <div className="text-sm text-green-600 dark:text-green-400 font-light">Completed</div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-950/30 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="text-2xl font-light text-gray-700 dark:text-gray-300">{stats.parked}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400 font-light">Parked</div>
      </div>
      
      <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="text-2xl font-light text-purple-700 dark:text-purple-300">{stats.claimed}</div>
        <div className="text-sm text-purple-600 dark:text-purple-400 font-light">Claimed</div>
      </div>
      
      <div className="bg-slate-50 dark:bg-slate-950/30 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
        <div className="text-2xl font-light text-slate-700 dark:text-slate-300">{stats.anonymous}</div>
        <div className="text-sm text-slate-600 dark:text-slate-400 font-light">Anonymous</div>
      </div>
    </div>
  );
};

export default DashboardStats;
