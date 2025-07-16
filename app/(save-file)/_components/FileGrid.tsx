import React, { useState } from 'react';
import { 
  Folder, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive,
  Star,
  MoreVertical,
  Share2,
  Download,
  Edit3,
  Copy,
  Eye,
  Trash2
} from 'lucide-react';
import { FileData } from '../_modules/FileData';

interface FileGridProps {
  files: FileData[];
  selectedFiles: string[];
  onSelectedFilesChange: (files: string[]) => void;
  onStarToggle: (fileId: string) => void;
  onShare: (fileId: string) => void;
  onRename: (fileId: string) => void;
  onDuplicate: (fileId: string) => void;
  onPreview: (file: FileData) => void;
  onFolderOpen: (folderId: string) => void;
}

export default function FileGrid({ 
  files, 
  selectedFiles, 
  onSelectedFilesChange, 
  onStarToggle,
  onShare,
  onRename,
  onDuplicate,
  onPreview,
  onFolderOpen
}: FileGridProps) {
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, fileId: string} | null>(null);

  const getFileIcon = (file: FileData) => {
    if (file.isFolder) return <Folder className="h-8 w-8 text-blue-500" />;
    if (file.type.startsWith('image/')) return <Image className="h-8 w-8 text-green-500" />;
    if (file.type.startsWith('video/')) return <Video className="h-8 w-8 text-red-500" />;
    if (file.type.startsWith('audio/')) return <Music className="h-8 w-8 text-purple-500" />;
    if (file.type.includes('zip') || file.type.includes('rar')) return <Archive className="h-8 w-8 text-orange-500" />;
    return <FileText className="h-8 w-8 text-gray-500" />;
  };

  const handleFileClick = (file: FileData, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      // Multi-select with Ctrl/Cmd
      if (selectedFiles.includes(file.id)) {
        onSelectedFilesChange(selectedFiles.filter(id => id !== file.id));
      } else {
        onSelectedFilesChange([...selectedFiles, file.id]);
      }
    } else {
      // Single select or open folder
      if (file.isFolder) {
        onFolderOpen(file.id);
      } else {
        onSelectedFilesChange([file.id]);
      }
    }
  };

  const handleDoubleClick = (file: FileData) => {
    if (file.isFolder) {
      onFolderOpen(file.id);
    } else {
      onPreview(file);
    }
  };

  const handleContextMenu = (event: React.MouseEvent, fileId: string) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      fileId
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  React.useEffect(() => {
    const handleClickOutside = () => closeContextMenu();
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {files.map((file) => (
          <div
            key={file.id}
            onClick={(e) => handleFileClick(file, e)}
            onDoubleClick={() => handleDoubleClick(file)}
            onContextMenu={(e) => handleContextMenu(e, file.id)}
            className={`group relative bg-white border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer ${
              selectedFiles.includes(file.id) 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Selection checkbox */}
            <div className={`absolute top-2 left-2 w-5 h-5 rounded border-2 transition-all duration-200 ${
              selectedFiles.includes(file.id)
                ? 'bg-blue-500 border-blue-500'
                : 'border-gray-300 group-hover:border-gray-400'
            }`}>
              {selectedFiles.includes(file.id) && (
                <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>

            {/* Star button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStarToggle(file.id);
              }}
              className={`absolute top-2 right-8 p-1 rounded transition-colors ${
                file.starred 
                  ? 'text-yellow-500 hover:text-yellow-600' 
                  : 'text-gray-300 hover:text-gray-400 opacity-0 group-hover:opacity-100'
              }`}
            >
              <Star className={`h-4 w-4 ${file.starred ? 'fill-current' : ''}`} />
            </button>

            {/* More options */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleContextMenu(e, file.id);
              }}
              className="absolute top-2 right-2 p-1 rounded text-gray-300 hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {/* Shared indicator */}
            {file.shared && (
              <div className="absolute top-2 right-12 text-blue-500">
                <Share2 className="h-3 w-3" />
              </div>
            )}

            {/* File icon */}
            <div className="flex justify-center mb-3 mt-2">
              {getFileIcon(file)}
            </div>

            {/* File info */}
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-900 truncate mb-1" title={file.name}>
                {file.name}
              </h3>
              <p className="text-xs text-gray-500">{file.lastModified || file.uploadDate}</p>
              {!file.isFolder && (
                <p className="text-xs text-gray-400">{file.size}</p>
              )}
              {file.owner !== 'me' && (
                <p className="text-xs text-blue-600">Shared by {file.owner}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 min-w-48"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => {
              const file = files.find(f => f.id === contextMenu.fileId);
              if (file) onPreview(file);
              closeContextMenu();
            }}
            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => {
              onShare(contextMenu.fileId);
              closeContextMenu();
            }}
            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
          <button
            onClick={() => {
              onRename(contextMenu.fileId);
              closeContextMenu();
            }}
            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Edit3 className="h-4 w-4" />
            <span>Rename</span>
          </button>
          <button
            onClick={() => {
              onDuplicate(contextMenu.fileId);
              closeContextMenu();
            }}
            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Copy className="h-4 w-4" />
            <span>Make a copy</span>
          </button>
          <div className="border-t border-gray-100 my-1"></div>
          <button
            onClick={() => {
              // Handle download
              closeContextMenu();
            }}
            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
          <button
            onClick={() => {
              // Handle delete
              closeContextMenu();
            }}
            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            <span>Remove</span>
          </button>
        </div>
      )}
    </>
  );
}