
import { Button } from '@/components/ui/button';
import { Edit3, Trash2 } from 'lucide-react';
import { Idea } from '@/pages/Dashboard';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ActionsCellProps {
  idea: Idea;
  onEdit: (idea: Idea) => void;
  onDelete: (ideaId: string) => void;
}

const ActionsCell = ({ idea, onEdit, onDelete }: ActionsCellProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Check if current user can delete ideas (only Varsha and Ohm)
  const canDelete = user?.user_metadata?.name && 
    ['varsha', 'ohm'].includes(user.user_metadata.name.toLowerCase());

  const handleDelete = async () => {
    if (!canDelete) {
      toast({
        title: "Access Denied",
        description: "Only Varsha and Ohm can delete ideas",
        variant: "destructive",
      });
      return;
    }

    if (confirm('Are you sure you want to delete this idea?')) {
      try {
        await onDelete(idea.id);
      } catch (error) {
        console.error('Delete error:', error);
        toast({
          title: "Delete Failed",
          description: "You don't have permission to delete this idea",
          variant: "destructive",
        });
      }
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
        disabled={!canDelete}
        className={`h-8 w-8 p-0 ${
          canDelete 
            ? 'text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/30'
            : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
        }`}
        title={canDelete ? 'Delete idea' : 'Only Varsha and Ohm can delete ideas'}
      >
        <Trash2 size={14} strokeWidth={1} />
      </Button>
    </div>
  );
};

export default ActionsCell;
