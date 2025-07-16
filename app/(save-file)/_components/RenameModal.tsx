import React, { useState, useEffect, useRef } from 'react';
import { X, Edit3 } from 'lucide-react';
import { FileData } from '../page';

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (fileId: string, newName: string) => void;
  file: FileData | null;
}

export default function RenameModal({ isOpen, onClose, onRename, file }: RenameModalProps) {
  const [newName, setNewName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && file) {
      // Remove file extension for editing (except for folders)
      if (file.isFolder) {
        setNewName(file.name);
      } else {
        const lastDotIndex = file.name.lastIndexOf('.');
        if (lastDotIndex > 0) {
          setNewName(file.name.substring(0, lastDotIndex));
        } else {
          setNewName(file.name);
        }
      }
    }
  }, [isOpen, file]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpen]);

  if (!isOpen || !file) return null;

  const handleRename = () => {
    if (newName.trim() && newName.trim() !== file.name) {
      let finalName = newName.trim();
      
      // Add back file extension if it's not a folder
      if (!file.isFolder) {
        const lastDotIndex = file.name.lastIndexOf('.');
        if (lastDotIndex > 0) {
          const extension = file.name.substring(lastDotIndex);
          if (!finalName.endsWith(extension)) {
            finalName += extension;
          }
        }
      }
      
      onRename(file.id, finalName);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Edit3 className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Rename</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {file.isFolder ? 'Folder name' : 'File name'}
              </label>
              <input
                ref={inputRef}
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={file.isFolder ? 'Enter folder name' : 'Enter file name'}
              />
              {!file.isFolder && (
                <p className="text-xs text-gray-500 mt-1">
                  File extension will be preserved automatically
                </p>
              )}
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Current name:</span> {file.name}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleRename}
            disabled={!newName.trim() || newName.trim() === file.name}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Rename
          </button>
        </div>
      </div>
    </div>
  );
}