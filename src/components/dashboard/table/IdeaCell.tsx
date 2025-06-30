
import { useState } from 'react';

interface IdeaCellProps {
  idea: string;
  ideaId: string;
  expandedRows: Set<string>;
  onToggleExpansion: (ideaId: string) => void;
}

const IdeaCell = ({ idea, ideaId, expandedRows, onToggleExpansion }: IdeaCellProps) => {
  const isExpanded = expandedRows.has(ideaId);
  
  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="font-light">
      <div 
        className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        onClick={() => onToggleExpansion(ideaId)}
      >
        {isExpanded ? idea : truncateText(idea)}
      </div>
      {idea.length > 100 && (
        <button
          onClick={() => onToggleExpansion(ideaId)}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};

export default IdeaCell;
