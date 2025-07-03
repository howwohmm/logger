
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Idea } from '@/pages/Dashboard';
import { useIdeaComments } from '@/hooks/useIdeaComments';
import CommentsSection from '@/components/comments/CommentsSection';

interface CommentsModalProps {
  idea: Idea | null;
  isOpen: boolean;
  onClose: () => void;
}

const CommentsModal = ({ idea, isOpen, onClose }: CommentsModalProps) => {
  const { comments, loading, addComment, deleteComment } = useIdeaComments(idea?.id || '');

  if (!idea) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-left font-light">
            Comments for: {idea.idea.length > 50 ? idea.idea.substring(0, 50) + '...' : idea.idea}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <CommentsSection
            comments={comments}
            loading={loading}
            onAddComment={addComment}
            onDeleteComment={deleteComment}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentsModal;
