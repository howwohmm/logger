
import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Idea } from '@/pages/Dashboard';

interface EditIdeaModalProps {
  idea: Idea;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const EditIdeaModal = ({ idea, isOpen, onClose, onSave }: EditIdeaModalProps) => {
  const [formData, setFormData] = useState({
    idea: idea.idea,
    name: idea.name || '',
    category: idea.category || '',
    status: idea.status
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const statusOptions = [
    { value: 'proposed', label: 'Proposed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'parked', label: 'Parked' },
  ];

  const handleSave = async () => {
    if (!formData.idea.trim()) {
      toast({
        title: "Error",
        description: "Idea content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('ideas')
        .update({
          idea: formData.idea.trim(),
          name: formData.name.trim() || null,
          category: formData.category.trim() || null,
          status: formData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', idea.id);

      if (error) throw error;

      toast({
        title: "Updated ✓",
        description: "Idea saved successfully",
      });
      
      onSave();
    } catch (error) {
      console.error('Error updating idea:', error);
      toast({
        title: "Error",
        description: "Could not update idea",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-light">Edit Idea</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={16} strokeWidth={1} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Idea Content */}
          <div>
            <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
              Idea Content *
            </label>
            <textarea
              value={formData.idea}
              onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
              className="w-full h-32 p-3 border border-gray-300 dark:border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white bg-background font-light"
              placeholder="Describe the idea..."
              disabled={isLoading}
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
              Contributor Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white bg-background font-light"
              placeholder="Who contributed this idea?"
              disabled={isLoading}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white bg-background font-light"
              placeholder="e.g. Technology, Art, Business..."
              disabled={isLoading}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white bg-background font-light"
              disabled={isLoading}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-foreground transition-colors font-light"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || !formData.idea.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              'Saving...'
            ) : (
              <>
                <Save size={16} strokeWidth={1} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditIdeaModal;
