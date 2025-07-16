import React, { useState } from 'react';
import { X, Users, Link, Mail, Copy, Check } from 'lucide-react';
import { FileData } from '../_modules/FileData';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (fileId: string, emails: string[], permission: 'view' | 'edit') => void;
  file: FileData | null;
}

export default function ShareModal({ isOpen, onClose, onShare, file }: ShareModalProps) {
  const [emails, setEmails] = useState('');
  const [permission, setPermission] = useState<'view' | 'edit'>('view');
  const [linkCopied, setLinkCopied] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen || !file) return null;

  const handleShare = () => {
    const emailList = emails.split(',').map(email => email.trim()).filter(email => email);
    if (emailList.length > 0) {
      onShare(file.id, emailList, permission);
    }
  };

  const handleCopyLink = () => {
    const shareLink = `https://drive.example.com/file/${file.id}`;
    navigator.clipboard.writeText(shareLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Share "{file.name}"</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Share with people */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share with people
            </label>
            <div className="space-y-3">
              <input
                type="text"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="Enter email addresses (comma separated)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value as 'view' | 'edit')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="view">Can view</option>
                <option value="edit">Can edit</option>
              </select>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message (optional)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Get link */}
          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Get link
            </label>
            <div className="flex space-x-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {linkCopied ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Link className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Copy link</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Anyone with the link can {permission} this file
            </p>
          </div>

          {/* Current sharing */}
          {file.sharedWith && file.sharedWith.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currently shared with
              </label>
              <div className="space-y-2">
                {file.sharedWith.map((email, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-700">{email}</span>
                    </div>
                    <span className="text-xs text-gray-500">Can {file.permissions}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
            onClick={handleShare}
            disabled={!emails.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}