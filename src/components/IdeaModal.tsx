
import { useState, useRef, useEffect } from 'react';
import { X, Mic, Square, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QuickSaveTab from './QuickSaveTab';
import ClaimItTab from './ClaimItTab';

interface IdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IdeaModal = ({ isOpen, onClose }: IdeaModalProps) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'claim'>('quick');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div 
        ref={modalRef}
        className="bg-background border-hair border-gray-500 rounded-lg w-full max-w-md animate-fade-slide-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-hair border-gray-500">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('quick')}
              className={`pb-2 border-b-2 transition-all duration-150 ease-in-out ${
                activeTab === 'quick'
                  ? 'border-black dark:border-white text-black dark:text-white font-medium'
                  : 'border-transparent text-gray-500 font-light hover:text-black dark:hover:text-white'
              }`}
            >
              Quick Save
            </button>
            <button
              onClick={() => setActiveTab('claim')}
              className={`pb-2 border-b-2 transition-all duration-150 ease-in-out ${
                activeTab === 'claim'
                  ? 'border-black dark:border-white text-black dark:text-white font-medium'
                  : 'border-transparent text-gray-500 font-light hover:text-black dark:hover:text-white'
              }`}
            >
              Claim It
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-all duration-150 ease-in-out"
          >
            <X size={16} strokeWidth={1} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === 'quick' ? (
            <QuickSaveTab onSuccess={onClose} />
          ) : (
            <ClaimItTab onSuccess={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeaModal;
