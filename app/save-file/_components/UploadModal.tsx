import React, { useState, useRef } from 'react';
import { X, Upload, Cloud, File, FolderPlus } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileUpload: (files: File[]) => void;
  onCreateFolder: (folderName: string) => void;
}

export default function UploadModal({ isOpen, onClose, onFileUpload, onCreateFolder }: UploadModalProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [folderName, setFolderName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    if (files.length === 0) return;
    
    const fileNames = files.map(f => f.name);
    setUploadingFiles(fileNames);
    
    setTimeout(() => {
      onFileUpload(files);
      setUploadingFiles([]);
    }, 2000);
  };

  const handleCreateFolder = () => {
    if (folderName.trim()) {
      onCreateFolder(folderName.trim());
      setFolderName('');
      setShowFolderInput(false);
      onClose();
    }
  };

  const handleFolderKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateFolder();
    } else if (e.key === 'Escape') {
      setShowFolderInput(false);
      setFolderName('');
    }
  };

  React.useEffect(() => {
    if (showFolderInput && folderInputRef.current) {
      folderInputRef.current.focus();
    }
  }, [showFolderInput]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">New</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Quick Actions */}
          <div className="space-y-2 mb-6">
            <button 
              onClick={() => setShowFolderInput(true)}
              className="flex items-center space-x-3 w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="bg-blue-100 p-2 rounded">
                <FolderPlus className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">New folder</span>
            </button>

            {showFolderInput && (
              <div className="ml-12 mr-3">
                <input
                  ref={folderInputRef}
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  onKeyDown={handleFolderKeyPress}
                  placeholder="Folder name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={handleCreateFolder}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setShowFolderInput(false);
                      setFolderName('');
                    }}
                    className="px-3 py-1 text-gray-600 text-sm rounded hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-3 w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="bg-green-100 p-2 rounded">
                <Upload className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">File upload</span>
            </button>

            <button
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.webkitdirectory = true;
                input.onchange = (e) => {
                  const files = Array.from((e.target as HTMLInputElement).files || []);
                  processFiles(files);
                };
                input.click();
              }}
              className="flex items-center space-x-3 w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="bg-purple-100 p-2 rounded">
                <File className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Folder upload</span>
            </button>
          </div>

          {/* Drag and Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
              isDragOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="flex flex-col items-center space-y-3">
              <Cloud className={`h-12 w-12 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Drag files here to upload
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  or click to select files
                </p>
              </div>
            </div>

            {/* Upload Progress */}
            {uploadingFiles.length > 0 && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Uploading...</p>
                  <div className="space-y-1">
                    {uploadingFiles.map((fileName, index) => (
                      <p key={index} className="text-xs text-gray-600">{fileName}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}