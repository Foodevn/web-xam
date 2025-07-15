"use client";
import React, { useState } from 'react';
import Sidebar from './_components/Sidebar';
import MainContent from './_components/MainContent';
import UploadModal from './_components/UploadModal';
import ShareModal from './_components/ShareModal';
import RenameModal from './_components/RenameModal';
import PreviewModal from './_components/PreviewModal';

export interface FileData {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  type: string;
  isFolder?: boolean;
  starred?: boolean;
  shared?: boolean;
  owner?: string;
  permissions?: 'view' | 'edit' | 'owner';
  sharedWith?: string[];
  parentId?: string;
  path?: string[];
  lastModified?: string;
  version?: number;
  tags?: string[];
  description?: string;
}

function App() {
  const [activeView, setActiveView] = useState('my-drive');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<{id: string, name: string}[]>([]);
  const [selectedFileForAction, setSelectedFileForAction] = useState<FileData | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [files, setFiles] = useState<FileData[]>([
    {
      id: '1',
      name: 'Documents',
      size: '—',
      uploadDate: 'Dec 15, 2024',
      lastModified: 'Dec 15, 2024',
      type: 'folder',
      isFolder: true,
      owner: 'me',
      permissions: 'owner',
      version: 1,
      tags: ['work'],
      description: 'Work documents folder'
    },
    {
      id: '2',
      name: 'Photos',
      size: '—',
      uploadDate: 'Dec 14, 2024',
      lastModified: 'Dec 14, 2024',
      type: 'folder',
      isFolder: true,
      starred: true,
      owner: 'me',
      permissions: 'owner',
      version: 1,
      tags: ['personal'],
      description: 'Personal photos collection'
    },
    {
      id: '3',
      name: 'Project Presentation.pdf',
      size: '2.4 MB',
      uploadDate: 'Dec 13, 2024',
      lastModified: 'Dec 13, 2024',
      type: 'application/pdf',
      starred: true,
      owner: 'me',
      permissions: 'owner',
      version: 3,
      tags: ['work', 'presentation'],
      description: 'Q4 project presentation slides'
    },
    {
      id: '4',
      name: 'Summer Vacation.jpg',
      size: '1.8 MB',
      uploadDate: 'Dec 12, 2024',
      lastModified: 'Dec 12, 2024',
      type: 'image/jpeg',
      owner: 'me',
      permissions: 'owner',
      version: 1,
      tags: ['personal', 'vacation'],
      description: 'Summer vacation memories'
    },
    {
      id: '5',
      name: 'Meeting Recording.mp4',
      size: '45.2 MB',
      uploadDate: 'Dec 11, 2024',
      lastModified: 'Dec 11, 2024',
      type: 'video/mp4',
      owner: 'me',
      permissions: 'owner',
      version: 1,
      tags: ['work', 'meeting'],
      description: 'Team meeting recording'
    },
    {
      id: '6',
      name: 'Financial Report.xlsx',
      size: '1.2 MB',
      uploadDate: 'Dec 10, 2024',
      lastModified: 'Dec 10, 2024',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      shared: true,
      owner: 'john.doe@company.com',
      permissions: 'edit',
      sharedWith: ['me', 'jane.smith@company.com'],
      version: 2,
      tags: ['work', 'finance'],
      description: 'Monthly financial report'
    },
    {
      id: '7',
      name: 'Company Logo.png',
      size: '256 KB',
      uploadDate: 'Dec 9, 2024',
      lastModified: 'Dec 9, 2024',
      type: 'image/png',
      owner: 'me',
      permissions: 'owner',
      version: 1,
      tags: ['work', 'branding'],
      description: 'Official company logo'
    },
    {
      id: '8',
      name: 'Background Music.mp3',
      size: '3.7 MB',
      uploadDate: 'Dec 8, 2024',
      lastModified: 'Dec 8, 2024',
      type: 'audio/mp3',
      owner: 'me',
      permissions: 'owner',
      version: 1,
      tags: ['personal', 'music'],
      description: 'Background music for videos'
    }
  ]);

  const handleFileUpload = (newFiles: File[]) => {
    const uploadedFiles: FileData[] = newFiles.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      lastModified: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      type: file.type,
      owner: 'me',
      permissions: 'owner',
      parentId: currentFolder || undefined,
      version: 1,
      tags: [],
      description: ''
    }));

    setFiles(prev => [...uploadedFiles, ...prev]);
    setUploadModalOpen(false);
  };

  const handleCreateFolder = (folderName: string) => {
    const newFolder: FileData = {
      id: `folder-${Date.now()}`,
      name: folderName,
      size: '—',
      uploadDate: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      lastModified: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      type: 'folder',
      isFolder: true,
      owner: 'me',
      permissions: 'owner',
      parentId: currentFolder || undefined,
      version: 1,
      tags: [],
      description: ''
    };

    setFiles(prev => [newFolder, ...prev]);
  };

  const handleStarToggle = (fileId: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, starred: !file.starred } : file
    ));
  };

  const handleDelete = (fileIds: string[]) => {
    if (confirm(`Are you sure you want to delete ${fileIds.length} item(s)?`)) {
      setFiles(prev => prev.filter(file => !fileIds.includes(file.id)));
      setSelectedFiles([]);
    }
  };

  const handleRename = (fileId: string, newName: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { 
        ...file, 
        name: newName,
        lastModified: new Date().toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        })
      } : file
    ));
    setRenameModalOpen(false);
    setSelectedFileForAction(null);
  };

  const handleShare = (fileId: string, emails: string[], permission: 'view' | 'edit') => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { 
        ...file, 
        shared: true,
        sharedWith: [...(file.sharedWith || []), ...emails]
      } : file
    ));
    setShareModalOpen(false);
    setSelectedFileForAction(null);
  };

  const handleFolderOpen = (folderId: string) => {
    const folder = files.find(f => f.id === folderId && f.isFolder);
    if (folder) {
      setCurrentFolder(folderId);
      setBreadcrumbs(prev => [...prev, { id: folderId, name: folder.name }]);
    }
  };

  const handleBreadcrumbClick = (folderId: string | null) => {
    setCurrentFolder(folderId);
    if (folderId === null) {
      setBreadcrumbs([]);
    } else {
      const index = breadcrumbs.findIndex(b => b.id === folderId);
      setBreadcrumbs(prev => prev.slice(0, index + 1));
    }
  };

  const handleDownload = (fileIds: string[]) => {
    fileIds.forEach(fileId => {
      const file = files.find(f => f.id === fileId);
      if (file && !file.isFolder) {
        // Simulate download
        console.log(`Downloading ${file.name}`);
        // In a real app, you would trigger the actual download here
      }
    });
  };

  const handleDuplicate = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      const duplicatedFile: FileData = {
        ...file,
        id: `copy-${Date.now()}`,
        name: `Copy of ${file.name}`,
        uploadDate: new Date().toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        lastModified: new Date().toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        version: 1
      };
      setFiles(prev => [duplicatedFile, ...prev]);
    }
  };

  const handlePreview = (file: FileData) => {
    setSelectedFileForAction(file);
    setPreviewModalOpen(true);
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = currentFolder ? file.parentId === currentFolder : !file.parentId;
    
    let matchesView = true;
    switch (activeView) {
      case 'starred':
        matchesView = file.starred === true;
        break;
      case 'shared':
        matchesView = file.shared === true || file.owner !== 'me';
        break;
      case 'recent':
        matchesView = true; // Show all files, sorted by date
        break;
      case 'trash':
        matchesView = false; // No trash implementation yet
        break;
      default:
        matchesView = true;
    }
    
    return matchesSearch && matchesFolder && matchesView;
  });

  // Sort files
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'date':
        comparison = new Date(a.lastModified || a.uploadDate).getTime() - new Date(b.lastModified || b.uploadDate).getTime();
        break;
      case 'size':
        const sizeA = a.isFolder ? 0 : parseFloat(a.size.replace(/[^\d.]/g, ''));
        const sizeB = b.isFolder ? 0 : parseFloat(b.size.replace(/[^\d.]/g, ''));
        comparison = sizeA - sizeB;
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="h-screen flex bg-white">
      <Sidebar 
        activeView={activeView}
        onViewChange={setActiveView}
        onNewClick={() => setUploadModalOpen(true)}
      />
      
      <MainContent
        files={sortedFiles}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFiles={selectedFiles}
        onSelectedFilesChange={setSelectedFiles}
        onStarToggle={handleStarToggle}
        onDelete={handleDelete}
        onDownload={handleDownload}
        onShare={(fileId) => {
          const file = files.find(f => f.id === fileId);
          if (file) {
            setSelectedFileForAction(file);
            setShareModalOpen(true);
          }
        }}
        onRename={(fileId) => {
          const file = files.find(f => f.id === fileId);
          if (file) {
            setSelectedFileForAction(file);
            setRenameModalOpen(true);
          }
        }}
        onDuplicate={handleDuplicate}
        onPreview={handlePreview}
        onFolderOpen={handleFolderOpen}
        activeView={activeView}
        currentFolder={currentFolder}
        breadcrumbs={breadcrumbs}
        onBreadcrumbClick={handleBreadcrumbClick}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={setSortBy}
        onSortOrderChange={setSortOrder}
      />

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onFileUpload={handleFileUpload}
        onCreateFolder={handleCreateFolder}
      />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => {
          setShareModalOpen(false);
          setSelectedFileForAction(null);
        }}
        onShare={handleShare}
        file={selectedFileForAction}
      />

      <RenameModal
        isOpen={renameModalOpen}
        onClose={() => {
          setRenameModalOpen(false);
          setSelectedFileForAction(null);
        }}
        onRename={handleRename}
        file={selectedFileForAction}
      />

      <PreviewModal
        isOpen={previewModalOpen}
        onClose={() => {
          setPreviewModalOpen(false);
          setSelectedFileForAction(null);
        }}
        file={selectedFileForAction}
      />
    </div>
  );
}

export default App;