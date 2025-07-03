
import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Calendar, Tag, Edit3 } from 'lucide-react';
import { Idea } from '@/pages/Dashboard';
import EditIdeaModal from './EditIdeaModal';
import CommentsModal from './CommentsModal';
import ContributorCell from './table/ContributorCell';
import StatusCell from './table/StatusCell';
import IdeaCell from './table/IdeaCell';
import ActionsCell from './table/ActionsCell';
import UpvoteButton from './table/UpvoteButton';

interface IdeasTableProps {
  ideas: Idea[];
  onStatusUpdate: (ideaId: string, newStatus: string) => void;
  onUpvoteUpdate: (ideaId: string, newUpvotes: string[]) => void;
  onDelete: (ideaId: string) => void;
}

const IdeasTable = ({ ideas, onStatusUpdate, onUpvoteUpdate, onDelete }: IdeasTableProps) => {
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [commentsIdea, setCommentsIdea] = useState<Idea | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpansion = (ideaId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(ideaId)) {
      newExpanded.delete(ideaId);
    } else {
      newExpanded.add(ideaId);
    }
    setExpandedRows(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (ideas.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
        <div className="text-gray-400 mb-4">
          <Edit3 size={48} strokeWidth={1} className="mx-auto mb-4" />
        </div>
        <h3 className="text-lg font-light text-gray-600 dark:text-gray-400 mb-2">No ideas found</h3>
        <p className="text-sm text-gray-500 font-light">Try adjusting your filters or add some new ideas.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 dark:border-gray-800">
              <TableHead className="font-light text-gray-700 dark:text-gray-300">Idea</TableHead>
              <TableHead className="font-light text-gray-700 dark:text-gray-300">Status</TableHead>
              <TableHead className="font-light text-gray-700 dark:text-gray-300">Contributor</TableHead>
              <TableHead className="font-light text-gray-700 dark:text-gray-300">Category</TableHead>
              <TableHead className="font-light text-gray-700 dark:text-gray-300">Upvotes</TableHead>
              <TableHead className="font-light text-gray-700 dark:text-gray-300">Created</TableHead>
              <TableHead className="font-light text-gray-700 dark:text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ideas.map((idea) => (
              <TableRow 
                key={idea.id} 
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <TableCell className="max-w-md">
                  <IdeaCell 
                    idea={idea.idea}
                    ideaId={idea.id}
                    expandedRows={expandedRows}
                    onToggleExpansion={toggleRowExpansion}
                  />
                </TableCell>
                
                <TableCell>
                  <StatusCell 
                    status={idea.status}
                    onStatusUpdate={(newStatus) => onStatusUpdate(idea.id, newStatus)}
                  />
                </TableCell>
                
                <TableCell>
                  <ContributorCell idea={idea} />
                </TableCell>
                
                <TableCell>
                  {idea.category ? (
                    <div className="flex items-center gap-2">
                      <Tag size={14} strokeWidth={1} className="text-gray-400" />
                      <span className="font-light text-sm">{idea.category}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 font-light text-sm">—</span>
                  )}
                </TableCell>

                <TableCell>
                  <UpvoteButton
                    ideaId={idea.id}
                    upvotes={idea.upvotes || []}
                    onUpvoteUpdate={onUpvoteUpdate}
                  />
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-light">
                    <Calendar size={14} strokeWidth={1} className="text-gray-400" />
                    {formatDate(idea.created_at)}
                  </div>
                </TableCell>
                
                <TableCell>
                  <ActionsCell 
                    idea={idea}
                    onEdit={setEditingIdea}
                    onDelete={onDelete}
                    onViewComments={setCommentsIdea}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingIdea && (
        <EditIdeaModal
          idea={editingIdea}
          isOpen={!!editingIdea}
          onClose={() => setEditingIdea(null)}
          onSave={() => setEditingIdea(null)}
        />
      )}

      {commentsIdea && (
        <CommentsModal
          idea={commentsIdea}
          isOpen={!!commentsIdea}
          onClose={() => setCommentsIdea(null)}
        />
      )}
    </>
  );
};

export default IdeasTable;
