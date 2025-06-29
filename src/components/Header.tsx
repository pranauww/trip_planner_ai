import React from 'react';
import { Plane } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">
            AI Travel Assistant
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>AI Online</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 