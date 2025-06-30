
import { useState, useRef } from 'react';
import { Mic, Square, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuickSaveTabProps {
  onSuccess: () => void;
}

const QuickSaveTab = ({ onSuccess }: QuickSaveTabProps) => {
  const [idea, setIdea] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

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
    if (!idea.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea: idea.trim(),
          name: null,
          category: null,
        }),
      });

      if (response.ok) {
        toast({
          title: "Saved ✓",
          description: "Idea logged successfully",
        });
        setIdea('');
        onSuccess();
      } else {
        throw new Error('Failed to save idea');
      }
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

      {/* Submit */}
      <button
        type="submit"
        disabled={!idea.trim() || isLoading}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          'Saving...'
        ) : (
          <>
            <Send size={16} strokeWidth={1} />
            Quick Save
          </>
        )}
      </button>
    </form>
  );
};

export default QuickSaveTab;
