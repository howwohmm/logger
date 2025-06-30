
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Idea } from '@/pages/Dashboard';

export const useIdeas = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { updateActivity } = useAuth();

  const fetchIdeas = async () => {
    try {
      console.log('Fetching ideas from database...');
      updateActivity();
      
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching ideas:', error);
        throw error;
      }
      
      console.log('Fetched ideas:', data);
      
      // Ensure upvotes field is always an array
      const processedData = data?.map(idea => ({
        ...idea,
        upvotes: idea.upvotes || []
      })) || [];
      
      console.log('Processed ideas with upvotes:', processedData);
      setIdeas(processedData);
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
      updateActivity();
      
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
    console.log('🔄 updateIdeaUpvotes called with:', { ideaId, newUpvotes });
    console.log('🔄 Current ideas state before update:', ideas.map(i => ({ id: i.id, upvotes: i.upvotes })));
    
    updateActivity();
    
    setIdeas(prev => {
      const updated = prev.map(idea => 
        idea.id === ideaId 
          ? { ...idea, upvotes: newUpvotes }
          : idea
      );
      console.log('🔄 Updated ideas state:', updated.map(i => ({ id: i.id, upvotes: i.upvotes })));
      return updated;
    });
  };

  const deleteIdea = async (ideaId: string) => {
    try {
      updateActivity();
      
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', ideaId);

      if (error) {
        console.error('Delete error from Supabase:', error);
        // Check if it's a permission error
        if (error.message.includes('policy')) {
          throw new Error('You do not have permission to delete this idea. Only Varsha and Ohm can delete ideas.');
        }
        throw error;
      }

      setIdeas(prev => prev.filter(idea => idea.id !== ideaId));
      
      toast({
        title: "Deleted ✓",
        description: "Idea removed successfully",
      });
    } catch (error) {
      console.error('Error deleting idea:', error);
      const errorMessage = error instanceof Error ? error.message : "Could not delete idea";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error; // Re-throw so calling components can handle it
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
