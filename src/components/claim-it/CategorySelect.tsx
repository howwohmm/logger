
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
}

const CategorySelect = ({ value, onChange, isLoading }: CategorySelectProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const existingCategories = [
    'Art & Design',
    'Technology',
    'Business',
    'Creative Writing',
    'Music',
    'Product Ideas',
    'Content Creation'
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full p-3 border-hair border-gray-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white bg-background font-light transition-all duration-150 ease-in-out text-left flex items-center justify-between"
        disabled={isLoading}
      >
        <span className={value ? 'text-foreground' : 'text-gray-500'}>
          {value || 'Category (optional)'}
        </span>
        <ChevronDown size={16} strokeWidth={1} />
      </button>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border-hair border-gray-500 rounded-lg z-10 animate-fade-slide-in">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search or add new..."
            className="w-full p-3 border-b border-hair border-gray-500 focus:outline-none bg-background font-light"
            autoFocus
          />
          <div className="max-h-40 overflow-y-auto">
            {existingCategories
              .filter(cat => 
                cat.toLowerCase().includes(value.toLowerCase())
              )
              .map((cat, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    onChange(cat);
                    setShowDropdown(false);
                  }}
                  className="w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-150 ease-in-out font-light"
                >
                  {cat}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
