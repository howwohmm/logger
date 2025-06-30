
import { Idea } from '@/pages/Dashboard';

interface MobileStatsRowProps {
  ideas: Idea[];
}

const MobileStatsRow = ({ ideas }: MobileStatsRowProps) => {
  const stats = [
    { label: 'Total', value: ideas.length },
    { label: 'Proposed', value: ideas.filter(idea => idea.status === 'proposed').length },
    { label: 'In Progress', value: ideas.filter(idea => idea.status === 'in-progress').length },
    { label: 'Completed', value: ideas.filter(idea => idea.status === 'completed').length },
    { label: 'Parked', value: ideas.filter(idea => idea.status === 'parked').length },
    { label: 'Claimed', value: ideas.filter(idea => idea.name).length },
    { label: 'Anonymous', value: ideas.filter(idea => !idea.name).length },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex-shrink-0 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-background"
        >
          <span className="text-sm font-medium text-foreground">
            {stat.label} {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MobileStatsRow;
