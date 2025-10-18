import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 text-slate-500 text-sm mt-6">
      <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} Lines. All rights reserved.</p>
        <div className="flex items-center gap-x-6 gap-y-2 flex-wrap justify-center">
          <a href="#" className="hover:text-amber-600 transition-colors">About</a>
          <a href="#" className="hover:text-amber-600 transition-colors">Contact</a>
          <a href="#" className="hover:text-amber-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-amber-600 transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};