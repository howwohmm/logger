
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
  
  // Ensure upvotes is always an array
  const safeUpvotes = upvotes || [];
  const hasUpvoted = safeUpvotes.includes(userId);
  const upvoteCount = safeUpvotes.length;

  console.log('UpvoteButton render:', { ideaId, upvotes: safeUpvotes, hasUpvoted, upvoteCount });

  const handleUpvote = async () => {
    console.log('Upvote clicked for idea:', ideaId);
    setIsLoading(true);
    try {
      let newUpvotes: string[];
      
      if (hasUpvoted) {
        // Remove upvote
        newUpvotes = safeUpvotes.filter(id => id !== userId);
        console.log('Removing upvote, new upvotes:', newUpvotes);
      } else {
        // Add upvote
        newUpvotes = [...safeUpvotes, userId];
        console.log('Adding upvote, new upvotes:', newUpvotes);
      }

      const { error } = await supabase
        .from('ideas')
        .update({ upvotes: newUpvotes })
        .eq('id', ideaId);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Successfully updated upvotes in database');
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
        className={`h-8 px-2 transition-colors ${
          hasUpvoted 
            ? 'text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/30' 
            : 'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-950/30'
        }`}
      >
        <Heart 
          size={16} 
          strokeWidth={1.5} 
          fill={hasUpvoted ? 'currentColor' : 'none'}
        />
      </Button>
      <span className="text-sm text-gray-500 font-medium min-w-[1.5rem] text-center">
        {upvoteCount}
      </span>
    </div>
  );
};

export default UpvoteButton;
