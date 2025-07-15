import React from 'react';
import TopBar from './TopBar';
import FileGrid from './FileGrid';
import FileList from './FileList';
import Breadcrumbs from './Breadcrumbs';
import { FileData } from '../page';

interface MainContentProps {
  files: FileData[];
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFiles: string[];
  onSelectedFilesChange: (files: string[]) => void;
  onStarToggle: (fileId: string) => void;
  onDelete: (fileIds: string[]) => void;
  onDownload: (fileIds: string[]) => void;
  onShare: (fileId: string) => void;
  onRename: (fileId: string) => void;
  onDuplicate: (fileId: string) => void;
  onPreview: (file: FileData) => void;
  onFolderOpen: (folderId: string) => void;
  activeView: string;
  currentFolder: string | null;
  breadcrumbs: {id: string, name: string}[];
  onBreadcrumbClick: (folderId: string | null) => void;
  sortBy: 'name' | 'date' | 'size' | 'type';
  sortOrder: 'asc' | 'desc';
  onSortChange: (sort: 'name' | 'date' | 'size' | 'type') => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

export default function MainContent({
  files,
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  selectedFiles,
  onSelectedFilesChange,
  onStarToggle,
  onDelete,
  onDownload,
  onShare,
  onRename,
  onDuplicate,
  onPreview,
  onFolderOpen,
  activeView,
  currentFolder,
  breadcrumbs,
  onBreadcrumbClick,
  sortBy,
  sortOrder,
  onSortChange,
  onSortOrderChange
}: MainContentProps) {
  const getViewTitle = () => {
    if (currentFolder) {
      const currentFolderName = breadcrumbs[breadcrumbs.length - 1]?.name;
      return currentFolderName || 'Folder';
    }
    
    switch (activeView) {
      case 'my-drive': return 'My Drive';
      case 'shared': return 'Shared with me';
      case 'recent': return 'Recent';
      case 'starred': return 'Starred';
      case 'trash': return 'Trash';
      default: return 'My Drive';
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <TopBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        selectedFiles={selectedFiles}
        onDelete={onDelete}
        onDownload={onDownload}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={onSortChange}
        onSortOrderChange={onSortOrderChange}
      />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {currentFolder && (
            <Breadcrumbs
              breadcrumbs={breadcrumbs}
              onBreadcrumbClick={onBreadcrumbClick}
            />
          )}
          
          <h1 className="text-2xl font-medium text-gray-900 mb-6">{getViewTitle()}</h1>
          
          {files.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'No files found' : 'No files yet'}
              </h3>
              <p className="text-gray-500">
                {searchQuery 
                  ? 'Try adjusting your search criteria'
                  : 'Upload your first file to get started'
                }
              </p>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <FileGrid
                  files={files}
                  selectedFiles={selectedFiles}
                  onSelectedFilesChange={onSelectedFilesChange}
                  onStarToggle={onStarToggle}
                  onShare={onShare}
                  onRename={onRename}
                  onDuplicate={onDuplicate}
                  onPreview={onPreview}
                  onFolderOpen={onFolderOpen}
                />
              ) : (
                <FileList
                  files={files}
                  selectedFiles={selectedFiles}
                  onSelectedFilesChange={onSelectedFilesChange}
                  onStarToggle={onStarToggle}
                  onShare={onShare}
                  onRename={onRename}
                  onDuplicate={onDuplicate}
                  onPreview={onPreview}
                  onFolderOpen={onFolderOpen}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}