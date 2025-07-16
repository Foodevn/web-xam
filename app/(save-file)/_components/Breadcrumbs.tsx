import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  breadcrumbs: {id: string, name: string}[];
  onBreadcrumbClick: (folderId: string | null) => void;
}

export default function Breadcrumbs({ breadcrumbs, onBreadcrumbClick }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 mb-4 text-sm">
      <button
        onClick={() => onBreadcrumbClick(null)}
        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <Home className="h-4 w-4" />
        <span>My Drive</span>
      </button>
      
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.id}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <button
            onClick={() => onBreadcrumbClick(breadcrumb.id)}
            className={`hover:text-blue-600 transition-colors ${
              index === breadcrumbs.length - 1 
                ? 'text-gray-900 font-medium' 
                : 'text-blue-600'
            }`}
          >
            {breadcrumb.name}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}