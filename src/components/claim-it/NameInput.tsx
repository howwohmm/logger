
import { useState } from 'react';
import { getNameSuggestions } from '@/utils/nameUtils';

interface NameInputProps {
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
}

const NameInput = ({ value, onChange, isLoading }: NameInputProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const nameSuggestions = getNameSuggestions(value);

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => {
          setTimeout(() => setShowDropdown(false), 200);
        }}
        placeholder="Your name"
        className="w-full p-3 border-hair border-gray-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white bg-background font-light transition-all duration-150 ease-in-out"
        disabled={isLoading}
      />
      
      {showDropdown && nameSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border-hair border-gray-500 rounded-lg z-20 animate-fade-slide-in max-h-40 overflow-y-auto">
          {nameSuggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                onChange(suggestion);
                setShowDropdown(false);
              }}
              className="w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-150 ease-in-out font-light border-b border-gray-200 dark:border-gray-800 last:border-b-0"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NameInput;
