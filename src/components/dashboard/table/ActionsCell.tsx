
import { Button } from '@/components/ui/button';
import { Edit3, Trash2, MessageCircle } from 'lucide-react';
import { Idea } from '@/pages/Dashboard';

interface ActionsCellProps {
  idea: Idea;
  onEdit: (idea: Idea) => void;
  onDelete: (ideaId: string) => void;
  onViewComments?: (idea: Idea) => void;
}

const ActionsCell = ({ idea, onEdit, onDelete, onViewComments }: ActionsCellProps) => {
  return (
    <div className="flex items-center gap-1">
      {onViewComments && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewComments(idea)}
          className="text-gray-400 hover:text-blue-600 p-1 h-auto"
          title="View Comments"
        >
          <MessageCircle size={14} strokeWidth={1} />
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(idea)}
        className="text-gray-400 hover:text-blue-600 p-1 h-auto"
        title="Edit Idea"
      >
        <Edit3 size={14} strokeWidth={1} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(idea.id)}
        className="text-gray-400 hover:text-red-600 p-1 h-auto"
        title="Delete Idea"
      >
        <Trash2 size={14} strokeWidth={1} />
      </Button>
    </div>
  );
};

export default ActionsCell;
