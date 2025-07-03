
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Trash2, Send, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Comment {
  id: string;
  commenter_name: string;
  comment: string;
  created_at: string;
}

interface CommentsSectionProps {
  comments: Comment[];
  loading: boolean;
  onAddComment: (name: string, comment: string) => Promise<any>;
  onDeleteComment: (id: string) => Promise<void>;
  title?: string;
}

const CommentsSection = ({
  comments,
  loading,
  onAddComment,
  onDeleteComment,
  title = "Comments"
}: CommentsSectionProps) => {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commenterName, setCommenterName] = useState('');

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !commenterName.trim()) return;

    try {
      await onAddComment(commenterName.trim(), newComment.trim());
      setNewComment('');
      setCommenterName('');
      setIsAddingComment(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-light">
          <MessageCircle size={18} strokeWidth={1} />
          {title} ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-sm text-muted-foreground">No comments yet</div>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="border-l-2 border-muted pl-4 py-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User size={14} strokeWidth={1} className="text-muted-foreground" />
                      <span className="font-medium text-sm">{comment.commenter_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm">{comment.comment}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteComment(comment.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={14} strokeWidth={1} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isAddingComment ? (
          <form onSubmit={handleSubmitComment} className="space-y-3 border-t pt-4">
            <Input
              placeholder="Your name"
              value={commenterName}
              onChange={(e) => setCommenterName(e.target.value)}
              required
            />
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              rows={3}
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={!newComment.trim() || !commenterName.trim()}>
                <Send size={14} strokeWidth={1} className="mr-1" />
                Post Comment
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAddingComment(false);
                  setNewComment('');
                  setCommenterName('');
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingComment(true)}
            className="w-full"
          >
            <MessageCircle size={14} strokeWidth={1} className="mr-2" />
            Add Comment
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentsSection;
