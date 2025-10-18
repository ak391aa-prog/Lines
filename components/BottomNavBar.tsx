import React from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { SubscriptionsIcon } from './icons/SubscriptionsIcon';
import { LibraryIcon } from './icons/LibraryIcon';
import { TrendingIcon } from './icons/TrendingIcon';
import { PlusIcon } from './icons/PlusIcon';

interface BottomNavBarProps {
  onGoHome: () => void;
  onOpenTrendingPage: () => void;
  onOpenFollowingPage: () => void;
  onOpenLibraryPage: () => void;
  onOpenCreateModal: () => void;
  activePage: string;
}

const NavItem: React.FC<{ icon: React.ReactElement<React.SVGProps<SVGSVGElement> & { active?: boolean }>; label: string; active?: boolean; onClick?: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 w-full pt-2 pb-1 transition-colors duration-200 ${
      active ? 'text-amber-600' : 'text-slate-600 hover:text-amber-600'
    }`}
    aria-label={label}
    aria-current={active ? 'page' : undefined}
  >
    {React.cloneElement(icon, { active: active, className: "w-6 h-6" })}
    <span className={`text-xs font-medium mt-1 ${active ? 'font-semibold' : ''}`}>{label}</span>
  </button>
);

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ onGoHome, onOpenTrendingPage, onOpenFollowingPage, onOpenLibraryPage, onOpenCreateModal, activePage }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 sm:hidden z-50">
      <div className="grid grid-cols-5 h-full">
        <NavItem icon={<HomeIcon />} label="Home" active={activePage === 'home'} onClick={onGoHome} />
        <NavItem icon={<TrendingIcon />} label="Trending" active={activePage === 'trending'} onClick={onOpenTrendingPage} />
        <NavItem icon={<PlusIcon />} label="Create" onClick={onOpenCreateModal} />
        <NavItem icon={<SubscriptionsIcon />} label="Following" active={activePage === 'following'} onClick={onOpenFollowingPage} />
        <NavItem icon={<LibraryIcon />} label="Library" active={activePage === 'library'} onClick={onOpenLibraryPage}/>
      </div>
    </nav>
  );
};