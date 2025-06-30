
import { useState, useRef } from 'react';
import { Mic, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  isLoading: boolean;
}

const VoiceRecorder = ({ onTranscription, isLoading }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
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
    try {
      console.log('Starting transcription with ElevenLabs...');
      
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const { data, error } = await supabase.functions.invoke('elevenlabs-transcribe', {
        body: formData,
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error('Transcription failed');
      }

      if (data && data.transcript) {
        console.log('Transcription successful:', data.transcript);
        onTranscription(data.transcript);
        toast({
          title: "Success",
          description: "Audio transcribed successfully",
        });
      } else {
        throw new Error('No transcript received');
      }
    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        title: "Error",
        description: "Could not transcribe audio",
        variant: "destructive",
      });
    }
  };

  return (
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
  );
};

export default VoiceRecorder;
