
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser } from '@/utils/auth';

interface UpvoteButtonProps {
  ideaId: string;
  upvotes: string[];
  onUpvoteUpdate: (ideaId: string, newUpvotes: string[]) => void;
}

const UpvoteButton = ({ ideaId, upvotes, onUpvoteUpdate }: UpvoteButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const currentUser = getCurrentUser();
  
  // Ensure upvotes is always an array
  const safeUpvotes = upvotes || [];
  const hasUpvoted = currentUser ? safeUpvotes.includes(currentUser) : false;
  const upvoteCount = safeUpvotes.length;

  console.log('UpvoteButton render:', { ideaId, upvotes: safeUpvotes, hasUpvoted, upvoteCount, currentUser });

  const handleUpvote = async () => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You need to be logged in to vote",
        variant: "destructive",
      });
      return;
    }

    console.log('🚀 Upvote clicked for idea:', ideaId);
    console.log('🚀 Current upvotes before action:', safeUpvotes);
    console.log('🚀 Has upvoted before action:', hasUpvoted);
    
    setIsLoading(true);
    try {
      let newUpvotes: string[];
      
      if (hasUpvoted) {
        // Remove upvote
        newUpvotes = safeUpvotes.filter(name => name !== currentUser);
        console.log('❌ Removing upvote, new upvotes:', newUpvotes);
      } else {
        // Add upvote
        newUpvotes = [...safeUpvotes, currentUser];
        console.log('✅ Adding upvote, new upvotes:', newUpvotes);
      }

      console.log('🔄 Updating database with:', { ideaId, newUpvotes });

      const { error } = await supabase
        .from('ideas')
        .update({ upvotes: newUpvotes })
        .eq('id', ideaId);

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }

      console.log('✅ Successfully updated upvotes in database');
      console.log('🔄 Calling onUpvoteUpdate with:', { ideaId, newUpvotes });
      
      onUpvoteUpdate(ideaId, newUpvotes);
      
      toast({
        title: hasUpvoted ? "Upvote removed" : "Upvoted ✓",
        description: hasUpvoted ? "Your upvote has been removed" : "Thanks for your support!",
      });
    } catch (error) {
      console.error('❌ Upvote error:', error);
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
        disabled={isLoading || !currentUser}
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
      <div className="flex flex-col items-start">
        <span className="text-sm text-gray-500 font-medium min-w-[1.5rem]">
          {upvoteCount}
        </span>
        {safeUpvotes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {safeUpvotes.map((name, index) => (
              <span
                key={index}
                className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400"
              >
                {name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpvoteButton;
