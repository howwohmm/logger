
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface IdeaComment {
  id: string;
  idea_id: string;
  commenter_name: string;
  comment: string;
  created_at: string;
}

export const useIdeaComments = (ideaId: string) => {
  const [comments, setComments] = useState<IdeaComment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('idea_comments')
        .select('*')
        .eq('idea_id', ideaId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching idea comments:', error);
      toast({
        title: "Error",
        description: "Could not load comments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (commenterName: string, comment: string) => {
    try {
      const { data, error } = await supabase
        .from('idea_comments')
        .insert([{
          idea_id: ideaId,
          commenter_name: commenterName,
          comment: comment
        }])
        .select()
        .single();

      if (error) throw error;
      
      setComments(prev => [...prev, data]);
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully",
      });
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Could not add comment",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('idea_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      
      setComments(prev => prev.filter(c => c.id !== commentId));
      toast({
        title: "Comment deleted",
        description: "Comment has been removed",
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: "Could not delete comment",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    if (ideaId) {
      fetchComments();
    }
  }, [ideaId]);

  return {
    comments,
    loading,
    addComment,
    deleteComment,
    refetch: fetchComments
  };
};
