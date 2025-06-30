
import { User } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Idea } from '@/pages/Dashboard';

interface ContributorCellProps {
  idea: Idea;
}

const ContributorCell = ({ idea }: ContributorCellProps) => {
  const displayName = idea.name || 'Anonymous';
  const originalName = idea.original_name;
  
  if (originalName && originalName !== displayName) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-help">
              <User size={14} strokeWidth={1} className="text-gray-400" />
              <span className="font-light text-sm underline decoration-dotted decoration-gray-400">
                {displayName}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-light">Originally entered as: {originalName}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <User size={14} strokeWidth={1} className="text-gray-400" />
      <span className="font-light text-sm">
        {displayName}
      </span>
    </div>
  );
};

export default ContributorCell;
