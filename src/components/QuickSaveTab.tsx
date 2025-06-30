
import { useState } from 'react';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import VoiceRecorder from './claim-it/VoiceRecorder';

interface QuickSaveTabProps {
  onSuccess: () => void;
}

const QuickSaveTab = ({ onSuccess }: QuickSaveTabProps) => {
  const [idea, setIdea] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, updateActivity } = useAuth();

  const existingCategories = [
    'Art & Design',
    'Technology', 
    'Business',
    'Creative Writing',
    'Music',
    'Product Ideas',
    'Content Creation'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update activity on user interaction
    updateActivity();
    
    if (!idea.trim()) {
      toast({
        title: "Error",
        description: "Please enter an idea",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error", 
        description: "You need to be logged in to save ideas",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Determine contributor role based on name
      const contributorRole = (user.user_metadata?.name?.toLowerCase() === 'varsha' || 
                             user.user_metadata?.name?.toLowerCase() === 'ohm') ? 'admin' : 'contributor';

      const ideaData = {
        idea: idea.trim(),
        name: user.user_metadata?.name || user.email,
        original_name: user.user_metadata?.name || user.email,
        category: category || null,
        status: 'proposed',
        upvotes: [],
        contributor_role: contributorRole
      };

      console.log('🚀 Saving idea with data:', ideaData);

      const { error } = await supabase
        .from('ideas')
        .insert(ideaData);

      if (error) throw error;

      toast({
        title: "Saved ✓",
        description: "Your idea has been logged successfully",
      });
      
      setIdea('');
      setCategory('');
      onSuccess();
    } catch (error) {
      console.error('Error saving idea:', error);
      toast({
        title: "Error",
        description: "Could not save idea",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranscription = (text: string) => {
    setIdea(text);
    updateActivity();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          value={idea}
          onChange={(e) => {
            setIdea(e.target.value);
            updateActivity();
          }}
          placeholder="What's your idea? (No character limit - write as much as you want!)"
          className="w-full p-3 border-hair border-gray-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white bg-background font-light transition-all duration-150 ease-in-out resize-none"
          rows={6}
          disabled={isLoading}
        />
      </div>

      <VoiceRecorder onTranscription={handleTranscription} isLoading={isLoading} />

      <div className="relative">
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            updateActivity();
          }}
          className="w-full p-3 border-hair border-gray-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white bg-background font-light transition-all duration-150 ease-in-out"
          disabled={isLoading}
        >
          <option value="">Category (optional)</option>
          {existingCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading || !idea.trim()}
        className="w-full btn-primary flex items-center justify-center gap-2"
      >
        <Send size={16} strokeWidth={1} />
        {isLoading ? 'Saving...' : 'Save Idea'}
      </button>
    </form>
  );
};

export default QuickSaveTab;
