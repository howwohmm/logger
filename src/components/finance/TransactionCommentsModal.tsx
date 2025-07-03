
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Transaction } from '@/hooks/useTransactions';
import { useTransactionComments } from '@/hooks/useTransactionComments';
import CommentsSection from '@/components/comments/CommentsSection';

interface TransactionCommentsModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

const TransactionCommentsModal = ({ transaction, isOpen, onClose }: TransactionCommentsModalProps) => {
  const { comments, loading, addComment, deleteComment } = useTransactionComments(transaction?.id || '');

  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-left font-light">
            Comments for: ${transaction.amount} - {transaction.description || 'Transaction'}
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

export default TransactionCommentsModal;
