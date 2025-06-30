
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UpvoteButtonProps {
  ideaId: string;
  upvotes: string[];
  onUpvoteUpdate: (ideaId: string, newUpvotes: string[]) => void;
}

const UpvoteButton = ({ ideaId, upvotes, onUpvoteUpdate }: UpvoteButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // For now, we'll use a simple user identifier. In a real app with auth, this would be the user's ID
  const userId = 'anonymous-user';
  const hasUpvoted = upvotes.includes(userId);
  const upvoteCount = upvotes.length;

  const handleUpvote = async () => {
    setIsLoading(true);
    try {
      let newUpvotes: string[];
      
      if (hasUpvoted) {
        // Remove upvote
        newUpvotes = upvotes.filter(id => id !== userId);
      } else {
        // Add upvote
        newUpvotes = [...upvotes, userId];
      }

      const { error } = await supabase
        .from('ideas')
        .update({ upvotes: newUpvotes })
        .eq('id', ideaId);

      if (error) throw error;

      onUpvoteUpdate(ideaId, newUpvotes);
      
      toast({
        title: hasUpvoted ? "Upvote removed" : "Upvoted ✓",
        description: hasUpvoted ? "Your upvote has been removed" : "Thanks for your support!",
      });
    } catch (error) {
      console.error('Upvote error:', error);
      toast({
        title: "Error",
        description: "Could not update upvote",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleUpvote}
        disabled={isLoading}
        className={`h-8 px-2 ${
          hasUpvoted 
            ? 'text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/30' 
            : 'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-950/30'
        }`}
      >
        <Heart 
          size={14} 
          strokeWidth={1} 
          fill={hasUpvoted ? 'currentColor' : 'none'}
        />
      </Button>
      <span className="text-sm text-gray-500 font-light min-w-[1rem]">
        {upvoteCount}
      </span>
    </div>
  );
};

export default UpvoteButton;
