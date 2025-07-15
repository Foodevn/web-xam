import React from 'react';
import { X, Download, Share2, Star, MoreVertical, FileText, Image, Video, Music, Archive } from 'lucide-react';
import { FileData } from '../page';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: FileData | null;
}

export default function PreviewModal({ isOpen, onClose, file }: PreviewModalProps) {
  if (!isOpen || !file) return null;

  const getFileIcon = (file: FileData) => {
    if (file.type.startsWith('image/')) return <Image className="h-16 w-16 text-green-500" />;
    if (file.type.startsWith('video/')) return <Video className="h-16 w-16 text-red-500" />;
    if (file.type.startsWith('audio/')) return <Music className="h-16 w-16 text-purple-500" />;
    if (file.type.includes('zip') || file.type.includes('rar')) return <Archive className="h-16 w-16 text-orange-500" />;
    return <FileText className="h-16 w-16 text-gray-500" />;
  };

  const renderPreview = () => {
    if (file.type.startsWith('image/')) {
      return (
        <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
          <div className="text-center">
            <Image className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Image preview would appear here</p>
            <p className="text-sm text-gray-500 mt-1">In a real app, the actual image would be displayed</p>
          </div>
        </div>
      );
    }

    if (file.type.startsWith('video/')) {
      return (
        <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
          <div className="text-center">
            <Video className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Video preview would appear here</p>
            <p className="text-sm text-gray-500 mt-1">In a real app, a video player would be displayed</p>
          </div>
        </div>
      );
    }

    if (file.type.startsWith('audio/')) {
      return (
        <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
          <div className="text-center">
            <Music className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Audio player would appear here</p>
            <p className="text-sm text-gray-500 mt-1">In a real app, an audio player would be displayed</p>
          </div>
        </div>
      );
    }

    if (file.type === 'application/pdf') {
      return (
        <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
          <div className="text-center">
            <FileText className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">PDF preview would appear here</p>
            <p className="text-sm text-gray-500 mt-1">In a real app, the PDF content would be displayed</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
        <div className="text-center">
          {getFileIcon(file)}
          <p className="text-gray-600 mt-4">Preview not available for this file type</p>
          <p className="text-sm text-gray-500 mt-1">Download the file to view its contents</p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {getFileIcon(file)}
            <div>
              <h3 className="text-lg font-medium text-gray-900">{file.name}</h3>
              <p className="text-sm text-gray-500">
                {file.size} • {file.lastModified || file.uploadDate}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
            <button className={`p-2 rounded-lg transition-colors ${
              file.starred 
                ? 'text-yellow-500 hover:bg-yellow-50' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}>
              <Star className={`h-5 w-5 ${file.starred ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Preview */}
            <div className="lg:col-span-2">
              {renderPreview()}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Details</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <span className="ml-2 text-gray-900">{file.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Size:</span>
                    <span className="ml-2 text-gray-900">{file.size}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Owner:</span>
                    <span className="ml-2 text-gray-900">{file.owner === 'me' ? 'me' : file.owner}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Modified:</span>
                    <span className="ml-2 text-gray-900">{file.lastModified || file.uploadDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <span className="ml-2 text-gray-900">{file.uploadDate}</span>
                  </div>
                  {file.version && (
                    <div>
                      <span className="text-gray-500">Version:</span>
                      <span className="ml-2 text-gray-900">{file.version}</span>
                    </div>
                  )}
                </div>
              </div>

              {file.description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{file.description}</p>
                </div>
              )}

              {file.tags && file.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {file.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {file.shared && file.sharedWith && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Shared with</h4>
                  <div className="space-y-2">
                    {file.sharedWith.map((email, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        {email}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}