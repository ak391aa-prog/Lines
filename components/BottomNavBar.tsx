import React from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { SubscriptionsIcon } from './icons/SubscriptionsIcon';
import { LibraryIcon } from './icons/LibraryIcon';
import { PlusIcon } from './icons/PlusIcon';
import { ShortsIcon } from './icons/ShortsIcon';

interface BottomNavBarProps {
  onGoHome: () => void;
  onOpenShortsPage: () => void;
  onOpenFollowingPage: () => void;
  onOpenLibraryPage: () => void;
  onOpenUploadPage: () => void;
  activePage: string;
}

const NavItem: React.FC<{ icon: React.ReactElement<React.SVGProps<SVGSVGElement> & { active?: boolean }>; label: string; active?: boolean; onClick?: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors duration-200 group ${
      active ? 'text-amber-600' : 'text-slate-600 hover:text-slate-900'
    }`}
    aria-label={label}
    aria-current={active ? 'page' : undefined}
  >
    <div className={`p-2 rounded-full transition-colors duration-200 ${active ? 'bg-amber-100' : 'group-hover:bg-slate-100'}`}>
      {React.cloneElement(icon, { active: active, className: "w-6 h-6" })}
    </div>
    <span className={`text-xs font-medium -mt-0.5 ${active ? 'font-semibold' : ''}`}>{label}</span>
  </button>
);

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ onGoHome, onOpenShortsPage, onOpenFollowingPage, onOpenLibraryPage, onOpenUploadPage, activePage }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 sm:hidden z-50">
      <div className="grid grid-cols-5 h-full items-center">
        <NavItem icon={<HomeIcon />} label="Home" active={activePage === 'home'} onClick={onGoHome} />
        <NavItem icon={<ShortsIcon />} label="Shorts" active={activePage === 'shorts'} onClick={onOpenShortsPage} />
        <div className="flex justify-center">
            <button 
                onClick={onOpenUploadPage} 
                aria-label="Create"
                className="p-3 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl shadow-lg shadow-slate-500/30 transition-all transform hover:scale-110 hover:-translate-y-1 active:scale-95 duration-200"
            >
                <PlusIcon className="w-7 h-7" />
            </button>
        </div>
        <NavItem icon={<SubscriptionsIcon />} label="Following" active={activePage === 'following'} onClick={onOpenFollowingPage} />
        <NavItem icon={<LibraryIcon />} label="Library" active={activePage === 'library'} onClick={onOpenLibraryPage}/>
      </div>
    </nav>
  );
};