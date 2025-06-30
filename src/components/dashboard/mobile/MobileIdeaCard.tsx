
import { useState } from 'react';
import { Calendar, Tag, MoreVertical } from 'lucide-react';
import { Idea } from '@/pages/Dashboard';
import { Button } from '@/components/ui/button';
import UpvoteButton from '../table/UpvoteButton';
import ActionsCell from '../table/ActionsCell';
import EditIdeaModal from '../EditIdeaModal';

interface MobileIdeaCardProps {
  idea: Idea;
  onStatusUpdate: (ideaId: string, newStatus: string) => void;
  onUpvoteUpdate: (ideaId: string, newUpvotes: string[]) => void;
  onDelete: (ideaId: string) => void;
}

const MobileIdeaCard = ({ idea, onStatusUpdate, onUpvoteUpdate, onDelete }: MobileIdeaCardProps) => {
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const truncateText = (text: string, maxLength: number = 120) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'proposed':
        return 'text-blue-600 dark:text-blue-400';
      case 'in-progress':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'parked':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const handleDeleteWithErrorHandling = async (ideaId: string) => {
    try {
      await onDelete(ideaId);
    } catch (error) {
      // Error handling is now done in the ActionsCell component
      console.error('Delete error in mobile card:', error);
    }
  };

  return (
    <>
      <div className="bg-background border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-3">
        {/* Idea text */}
        <div className="font-light text-sm leading-relaxed">
          <div 
            className="cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? idea.idea : truncateText(idea.idea)}
          </div>
          {idea.idea.length > 120 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status */}
            <span className={`px-2 py-1 border border-gray-300 dark:border-gray-700 rounded text-xs font-medium ${getStatusColor(idea.status)}`}>
              {idea.status}
            </span>

            {/* Category */}
            {idea.category && (
              <span className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded text-xs font-light text-gray-600 dark:text-gray-400">
                {idea.category}
              </span>
            )}

            {/* Contributor */}
            {idea.name && (
              <span className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded text-xs font-light text-gray-600 dark:text-gray-400">
                {idea.name}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <UpvoteButton
              ideaId={idea.id}
              upvotes={idea.upvotes || []}
              onUpvoteUpdate={onUpvoteUpdate}
            />
            <ActionsCell 
              idea={idea}
              onEdit={setEditingIdea}
              onDelete={handleDeleteWithErrorHandling}
            />
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1 text-xs text-gray-500 font-light pt-1 border-t border-gray-100 dark:border-gray-800">
          <Calendar size={12} strokeWidth={1} />
          {formatDate(idea.created_at)}
        </div>
      </div>

      {editingIdea && (
        <EditIdeaModal
          idea={editingIdea}
          isOpen={!!editingIdea}
          onClose={() => setEditingIdea(null)}
          onSave={() => setEditingIdea(null)}
        />
      )}
    </>
  );
};

export default MobileIdeaCard;
