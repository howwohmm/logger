
import { Edit3 } from 'lucide-react';
import { Idea } from '@/pages/Dashboard';
import MobileIdeaCard from './MobileIdeaCard';

interface MobileIdeasListProps {
  ideas: Idea[];
  onStatusUpdate: (ideaId: string, newStatus: string) => void;
  onUpvoteUpdate: (ideaId: string, newUpvotes: string[]) => void;
  onDelete: (ideaId: string) => void;
}

const MobileIdeasList = ({ ideas, onStatusUpdate, onUpvoteUpdate, onDelete }: MobileIdeasListProps) => {
  if (ideas.length === 0) {
    return (
      <div className="text-center py-12">
        <Edit3 size={32} strokeWidth={1} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">No ideas yet</h3>
        <p className="text-xs text-gray-500 font-light">Try adjusting your filters or add some new ideas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ideas.map((idea) => (
        <MobileIdeaCard
          key={idea.id}
          idea={idea}
          onStatusUpdate={onStatusUpdate}
          onUpvoteUpdate={onUpvoteUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default MobileIdeasList;
