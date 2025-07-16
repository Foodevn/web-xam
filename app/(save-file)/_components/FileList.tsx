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

interface FileListProps {
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

export default function FileList({ 
  files, 
  selectedFiles, 
  onSelectedFilesChange, 
  onStarToggle,
  onShare,
  onRename,
  onDuplicate,
  onPreview,
  onFolderOpen
}: FileListProps) {
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, fileId: string} | null>(null);

  const getFileIcon = (file: FileData) => {
    if (file.isFolder) return <Folder className="h-5 w-5 text-blue-500" />;
    if (file.type.startsWith('image/')) return <Image className="h-5 w-5 text-green-500" />;
    if (file.type.startsWith('video/')) return <Video className="h-5 w-5 text-red-500" />;
    if (file.type.startsWith('audio/')) return <Music className="h-5 w-5 text-purple-500" />;
    if (file.type.includes('zip') || file.type.includes('rar')) return <Archive className="h-5 w-5 text-orange-500" />;
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  const handleFileClick = (file: FileData, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      if (selectedFiles.includes(file.id)) {
        onSelectedFilesChange(selectedFiles.filter(id => id !== file.id));
      } else {
        onSelectedFilesChange([...selectedFiles, file.id]);
      }
    } else {
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
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
          <div className="col-span-1"></div>
          <div className="col-span-5">Name</div>
          <div className="col-span-2">Owner</div>
          <div className="col-span-2">Last modified</div>
          <div className="col-span-1">File size</div>
          <div className="col-span-1"></div>
        </div>

        {/* Files */}
        <div className="divide-y divide-gray-100">
          {files.map((file) => (
            <div
              key={file.id}
              onClick={(e) => handleFileClick(file, e)}
              onDoubleClick={() => handleDoubleClick(file)}
              onContextMenu={(e) => handleContextMenu(e, file.id)}
              className={`grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedFiles.includes(file.id) ? 'bg-blue-50' : ''
              }`}
            >
              {/* Checkbox */}
              <div className="col-span-1 flex items-center">
                <div className={`w-4 h-4 rounded border-2 transition-all duration-200 ${
                  selectedFiles.includes(file.id)
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedFiles.includes(file.id) && (
                    <svg className="w-3 h-3 text-white absolute" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Name */}
              <div className="col-span-5 flex items-center space-x-3">
                {getFileIcon(file)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-900 truncate">{file.name}</span>
                    {file.shared && <Share2 className="h-3 w-3 text-blue-500 flex-shrink-0" />}
                  </div>
                  {file.description && (
                    <p className="text-xs text-gray-500 truncate">{file.description}</p>
                  )}
                </div>
              </div>

              {/* Owner */}
              <div className="col-span-2 flex items-center">
                <span className="text-sm text-gray-600">
                  {file.owner === 'me' ? 'me' : file.owner}
                </span>
              </div>

              {/* Last modified */}
              <div className="col-span-2 flex items-center">
                <span className="text-sm text-gray-600">{file.lastModified || file.uploadDate}</span>
              </div>

              {/* File size */}
              <div className="col-span-1 flex items-center">
                <span className="text-sm text-gray-600">{file.isFolder ? '—' : file.size}</span>
              </div>

              {/* Actions */}
              <div className="col-span-1 flex items-center justify-end space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStarToggle(file.id);
                  }}
                  className={`p-1 rounded transition-colors ${
                    file.starred 
                      ? 'text-yellow-500 hover:text-yellow-600' 
                      : 'text-gray-300 hover:text-gray-400'
                  }`}
                >
                  <Star className={`h-4 w-4 ${file.starred ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContextMenu(e, file.id);
                  }}
                  className="p-1 rounded text-gray-300 hover:text-gray-400 transition-colors"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
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