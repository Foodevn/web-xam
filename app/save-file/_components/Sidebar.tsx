import React from 'react';
import { 
  Plus, 
  HardDrive, 
  Users, 
  Clock, 
  Star, 
  Trash2,
  Cloud
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onNewClick: () => void;
}

export default function Sidebar({ activeView, onViewChange, onNewClick }: SidebarProps) {
  const menuItems = [
    { id: 'my-drive', label: 'My Drive', icon: HardDrive },
    { id: 'shared', label: 'Shared with me', icon: Users },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'starred', label: 'Starred', icon: Star },
    { id: 'trash', label: 'Trash', icon: Trash2 },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500 p-2 rounded">
            <Cloud className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-medium text-gray-700">Drive</span>
        </div>
      </div>

      {/* New Button */}
      <div className="p-4">
        <button
          onClick={onNewClick}
          className="flex items-center space-x-3 w-full bg-white border border-gray-300 rounded-full px-4 py-3 hover:shadow-md transition-shadow duration-200"
        >
          <Plus className="h-5 w-5 text-gray-600" />
          <span className="font-medium text-gray-700">New</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-left transition-colors duration-150 ${
                activeView === item.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Storage */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-sm text-gray-600 mb-2">Storage</div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
        </div>
        <div className="text-xs text-gray-500">6.8 GB of 15 GB used</div>
      </div>
    </div>
  );
}