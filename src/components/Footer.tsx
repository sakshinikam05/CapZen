
import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <img src="/capzen-logo.png" alt="CapZen" className="w-6 h-6 rounded" />
          <span className="text-sm font-semibold text-gray-700">CapZen</span>
        </div>
        <p className="text-sm text-gray-500">
          © {currentYear} CapZen. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
