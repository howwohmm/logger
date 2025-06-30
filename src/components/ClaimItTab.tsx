
import { useState, useRef } from 'react';
import { Mic, Square, Send, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { mapNameToCanonical, getNameSuggestions } from '@/utils/nameUtils';

interface ClaimItTabProps {
  onSuccess: () => void;
}

const ClaimItTab = ({ onSuccess }: ClaimItTabProps) => {
  const [idea, setIdea] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showNameDropdown, setShowNameDropdown] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Sample categories - in real app, these would come from API
  const existingCategories = [
    'Art & Design',
    'Technology',
    'Business',
    'Creative Writing',
    'Music',
    'Product Ideas',
    'Content Creation'
  ];

  // Get name suggestions based on current input
  const nameSuggestions = getNameSuggestions(name);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { transcript } = await response.json();
        setIdea(transcript);
      } else {
        throw new Error('Transcription failed');
      }
    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        title: "Error",
        description: "Could not transcribe audio",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim() || !name.trim()) return;

    setIsLoading(true);
    try {
      // Map the name to canonical form
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
      {/* Idea input */}
      <div>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="What's your idea?"
          className="w-full h-32 p-3 border-hair border-gray-500 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white bg-background font-light transition-all duration-150 ease-in-out"
          disabled={isLoading}
        />
      </div>

      {/* Voice controls */}
      <div className="flex items-center justify-center">
        <span className="text-sm text-gray-500 font-light mr-3">or</span>
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isLoading}
          className={`p-3 rounded-lg border-hair transition-all duration-150 ease-in-out ${
            isRecording
              ? 'bg-red-500 text-white border-red-500 animate-pulse-record'
              : 'border-gray-500 hover:border-black dark:hover:border-white'
          }`}
        >
          {isRecording ? (
            <Square size={16} strokeWidth={1} />
          ) : (
            <Mic size={16} strokeWidth={1} />
          )}
        </button>
      </div>

      {/* Name input with autocomplete */}
      <div className="relative">
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setShowNameDropdown(true);
          }}
          onFocus={() => setShowNameDropdown(true)}
          onBlur={() => {
            // Delay hiding to allow clicks on dropdown items
            setTimeout(() => setShowNameDropdown(false), 200);
          }}
          placeholder="Your name"
          className="w-full p-3 border-hair border-gray-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white bg-background font-light transition-all duration-150 ease-in-out"
          disabled={isLoading}
        />
        
        {showNameDropdown && nameSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border-hair border-gray-500 rounded-lg z-20 animate-fade-slide-in max-h-40 overflow-y-auto">
            {nameSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setName(suggestion);
                  setShowNameDropdown(false);
                }}
                className="w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-150 ease-in-out font-light border-b border-gray-200 dark:border-gray-800 last:border-b-0"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
          className="w-full p-3 border-hair border-gray-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white bg-background font-light transition-all duration-150 ease-in-out text-left flex items-center justify-between"
          disabled={isLoading}
        >
          <span className={category ? 'text-foreground' : 'text-gray-500'}>
            {category || 'Category (optional)'}
          </span>
          <ChevronDown size={16} strokeWidth={1} />
        </button>

        {showCategoryDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border-hair border-gray-500 rounded-lg z-10 animate-fade-slide-in">
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Search or add new..."
              className="w-full p-3 border-b border-hair border-gray-500 focus:outline-none bg-background font-light"
              autoFocus
            />
            <div className="max-h-40 overflow-y-auto">
              {existingCategories
                .filter(cat => 
                  cat.toLowerCase().includes(category.toLowerCase())
                )
                .map((cat, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setCategory(cat);
                      setShowCategoryDropdown(false);
                    }}
                    className="w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-150 ease-in-out font-light"
                  >
                    {cat}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Submit */}
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
