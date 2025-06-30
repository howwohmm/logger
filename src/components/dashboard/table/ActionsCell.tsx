
import { Button } from '@/components/ui/button';
import { Edit3, Trash2 } from 'lucide-react';
import { Idea } from '@/pages/Dashboard';

interface ActionsCellProps {
  idea: Idea;
  onEdit: (idea: Idea) => void;
  onDelete: (ideaId: string) => void;
}

const ActionsCell = ({ idea, onEdit, onDelete }: ActionsCellProps) => {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this idea?')) {
      onDelete(idea.id);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(idea)}
        className="h-8 w-8 p-0"
      >
        <Edit3 size={14} strokeWidth={1} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/30"
      >
        <Trash2 size={14} strokeWidth={1} />
      </Button>
    </div>
  );
};

export default ActionsCell;
