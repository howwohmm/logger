
import { useState } from 'react';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { mapNameToCanonical } from '@/utils/nameUtils';
import VoiceRecorder from './claim-it/VoiceRecorder';
import NameInput from './claim-it/NameInput';
import CategorySelect from './claim-it/CategorySelect';

interface ClaimItTabProps {
  onSuccess: () => void;
}

const ClaimItTab = ({ onSuccess }: ClaimItTabProps) => {
  const [idea, setIdea] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim() || !name.trim()) return;

    setIsLoading(true);
    try {
      const nameMapping = mapNameToCanonical(name);
      
      const { data, error } = await supabase
        .from('ideas')
        .insert([
          {
            idea: idea.trim(),
            name: nameMapping.canonical || nameMapping.original,
            original_name: nameMapping.original,
            category: category.trim() || null,
          }
        ]);

      if (error) {
        throw error;
      }

      toast({
        title: "Claimed ✓",
        description: `Idea logged with your name${nameMapping.canonical && nameMapping.canonical !== nameMapping.original ? ` (matched to ${nameMapping.canonical})` : ''}`,
      });
      setIdea('');
      setName('');
      setCategory('');
      onSuccess();
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Could not save idea",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="What's your idea?"
          className="w-full h-32 p-3 border-hair border-gray-500 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white bg-background font-light transition-all duration-150 ease-in-out"
          disabled={isLoading}
        />
      </div>

      <VoiceRecorder onTranscription={setIdea} isLoading={isLoading} />

      <NameInput 
        value={name}
        onChange={setName}
        isLoading={isLoading}
      />

      <CategorySelect 
        value={category}
        onChange={setCategory}
        isLoading={isLoading}
      />

      <button
        type="submit"
        disabled={!idea.trim() || !name.trim() || isLoading}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          'Claiming...'
        ) : (
          <>
            <Send size={16} strokeWidth={1} />
            Claim It
          </>
        )}
      </button>
    </form>
  );
};

export default ClaimItTab;
