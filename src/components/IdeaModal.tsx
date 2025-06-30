
import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import QuickSaveTab from './QuickSaveTab';

interface IdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IdeaModal = ({ isOpen, onClose }: IdeaModalProps) => {
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
          <h2 className="text-lg font-medium">Log New Idea</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-all duration-150 ease-in-out"
          >
            <X size={16} strokeWidth={1} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <QuickSaveTab onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
};

export default IdeaModal;
