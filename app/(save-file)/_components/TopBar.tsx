import React, { useState } from 'react';
import { Search, Grid3X3, List, Trash2, Settings, Download, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  selectedFiles: string[];
  onDelete: (fileIds: string[]) => void;
  onDownload: (fileIds: string[]) => void;
  sortBy: 'name' | 'date' | 'size' | 'type';
  sortOrder: 'asc' | 'desc';
  onSortChange: (sort: 'name' | 'date' | 'size' | 'type') => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

export default function TopBar({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  selectedFiles,
  onDelete,
  onDownload,
  sortBy,
  sortOrder,
  onSortChange,
  onSortOrderChange
}: TopBarProps) {
  const [showSortMenu, setShowSortMenu] = useState(false);

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'date', label: 'Last modified' },
    { value: 'size', label: 'Size' },
    { value: 'type', label: 'Type' }
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search in Drive"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 ml-4">
          {selectedFiles.length > 0 && (
            <>
              <button
                onClick={() => onDownload(selectedFiles)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download selected"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDelete(selectedFiles)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Delete selected"
              >
                <Trash2 className="h-5 w-5" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
            </>
          )}

          {/* Sort Menu */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center space-x-1 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Sort"
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            </button>
            
            {showSortMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        if (sortBy === option.value) {
                          onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          onSortChange(option.value as any);
                          onSortOrderChange('asc');
                        }
                        setShowSortMenu(false);
                      }}
                      className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left hover:bg-gray-50 ${
                        sortBy === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      <span>{option.label}</span>
                      {sortBy === option.value && (
                        sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Grid view"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}