
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Idea } from '@/pages/Dashboard';

export const useIdeas = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchIdeas = async () => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIdeas(data || []);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      toast({
        title: "Error",
        description: "Could not load ideas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateIdeaStatus = async (ideaId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('ideas')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', ideaId);

      if (error) throw error;

      setIdeas(prev => prev.map(idea => 
        idea.id === ideaId 
          ? { ...idea, status: newStatus, updated_at: new Date().toISOString() }
          : idea
      ));

      toast({
        title: "Updated ✓",
        description: `Status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Could not update status",
        variant: "destructive",
      });
    }
  };

  const updateIdeaUpvotes = (ideaId: string, newUpvotes: string[]) => {
    setIdeas(prev => prev.map(idea => 
      idea.id === ideaId 
        ? { ...idea, upvotes: newUpvotes }
        : idea
    ));
  };

  const deleteIdea = async (ideaId: string) => {
    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', ideaId);

      if (error) throw error;

      setIdeas(prev => prev.filter(idea => idea.id !== ideaId));
      
      toast({
        title: "Deleted ✓",
        description: "Idea removed successfully",
      });
    } catch (error) {
      console.error('Error deleting idea:', error);
      toast({
        title: "Error",
        description: "Could not delete idea",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  return {
    ideas,
    setIdeas,
    isLoading,
    updateIdeaStatus,
    updateIdeaUpvotes,
    deleteIdea,
    fetchIdeas
  };
};
