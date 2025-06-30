
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  Calendar, 
  User, 
  Tag 
} from 'lucide-react';
import { Idea } from '@/pages/Dashboard';
import EditIdeaModal from './EditIdeaModal';

interface IdeasTableProps {
  ideas: Idea[];
  onStatusUpdate: (ideaId: string, newStatus: string) => void;
  onDelete: (ideaId: string) => void;
}

const IdeasTable = ({ ideas, onStatusUpdate, onDelete }: IdeasTableProps) => {
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const statusConfig = {
    'proposed': { label: 'Proposed', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    'in-progress': { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    'completed': { label: 'Completed', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    'parked': { label: 'Parked', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
  };

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

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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
                  <div className="font-light">
                    <div 
                      className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      onClick={() => toggleRowExpansion(idea.id)}
                    >
                      {expandedRows.has(idea.id) ? idea.idea : truncateText(idea.idea)}
                    </div>
                    {idea.idea.length > 100 && (
                      <button
                        onClick={() => toggleRowExpansion(idea.id)}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
                      >
                        {expandedRows.has(idea.id) ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <select
                    value={idea.status}
                    onChange={(e) => onStatusUpdate(idea.id, e.target.value)}
                    className="text-xs font-light border-0 bg-transparent focus:outline-none cursor-pointer"
                  >
                    {Object.entries(statusConfig).map(([value, config]) => (
                      <option key={value} value={value}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                  <Badge 
                    variant="outline" 
                    className={`ml-2 text-xs font-light ${statusConfig[idea.status as keyof typeof statusConfig]?.color}`}
                  >
                    {statusConfig[idea.status as keyof typeof statusConfig]?.label || idea.status}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User size={14} strokeWidth={1} className="text-gray-400" />
                    <span className="font-light text-sm">
                      {idea.name || 'Anonymous'}
                    </span>
                  </div>
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
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-light">
                    <Calendar size={14} strokeWidth={1} className="text-gray-400" />
                    {formatDate(idea.created_at)}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingIdea(idea)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit3 size={14} strokeWidth={1} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this idea?')) {
                          onDelete(idea.id);
                        }
                      }}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/30"
                    >
                      <Trash2 size={14} strokeWidth={1} />
                    </Button>
                  </div>
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
          onSave={() => {
            // Refresh will happen through the parent component
            setEditingIdea(null);
          }}
        />
      )}
    </>
  );
};

export default IdeasTable;
