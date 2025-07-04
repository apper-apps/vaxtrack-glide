import { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search vaccines...",
  className = '',
  searchTerm: externalSearchTerm = '',
  hasActiveFilters = false,
  onToggleFilters,
  onClearFilters
}) => {
  const [searchTerm, setSearchTerm] = useState(externalSearchTerm);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon="Search"
            className="w-full"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
            >
              <ApperIcon name="X" className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
<Button type="submit" variant="primary" icon="Search">
          Search
        </Button>
        
        {/* Filter Toggle Button */}
        {onToggleFilters && (
          <Button
            type="button"
            variant="secondary"
            icon="Filter"
            onClick={onToggleFilters}
            className={`relative ${hasActiveFilters ? 'bg-primary/10 text-primary border-primary' : ''}`}
          >
            Filters
            {hasActiveFilters && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                !
              </span>
            )}
          </Button>
        )}
        
        {/* Clear All Button */}
        {(searchTerm || hasActiveFilters) && onClearFilters && (
          <Button
            type="button"
            variant="ghost"
            icon="X"
            onClick={() => {
              handleClear();
              onClearFilters();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear All
          </Button>
        )}
      </form>
    </div>
  );
};

export default SearchBar;