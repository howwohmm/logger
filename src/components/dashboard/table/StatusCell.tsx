
import { Badge } from '@/components/ui/badge';

interface StatusCellProps {
  status: string;
  onStatusUpdate: (newStatus: string) => void;
}

const StatusCell = ({ status, onStatusUpdate }: StatusCellProps) => {
  const statusConfig = {
    'proposed': { label: 'Proposed', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    'in-progress': { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    'completed': { label: 'Completed', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    'parked': { label: 'Parked', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
  };

  return (
    <>
      <select
        value={status}
        onChange={(e) => onStatusUpdate(e.target.value)}
        className="text-xs font-light border-0 bg-transparent focus:outline-none cursor-pointer"
      >
        {Object.entries(statusConfig).map(([value, config]) => (
          <option key={value} value={value}>
            {config.label}
          </option>
        ))}
      </select>
      <Badge 
        variant="outline" 
        className={`ml-2 text-xs font-light ${statusConfig[status as keyof typeof statusConfig]?.color}`}
      >
        {statusConfig[status as keyof typeof statusConfig]?.label || status}
      </Badge>
    </>
  );
};

export default StatusCell;
