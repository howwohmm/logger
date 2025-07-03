
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Subscription } from '@/hooks/useSubscriptions';
import { useSubscriptionComments } from '@/hooks/useSubscriptionComments';
import CommentsSection from '@/components/comments/CommentsSection';

interface SubscriptionCommentsModalProps {
  subscription: Subscription | null;
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionCommentsModal = ({ subscription, isOpen, onClose }: SubscriptionCommentsModalProps) => {
  const { comments, loading, addComment, deleteComment } = useSubscriptionComments(subscription?.id || '');

  if (!subscription) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-left font-light">
            Comments for: {subscription.name} - ${subscription.cost}
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

export default SubscriptionCommentsModal;
