import React from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { TrendingIcon } from './icons/TrendingIcon';
import { SubscriptionsIcon } from './icons/SubscriptionsIcon';
import { LibraryIcon } from './icons/LibraryIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { YourVideosIcon } from './icons/YourVideosIcon';
import { WatchLaterIcon } from './icons/WatchLaterIcon';
import { LikeIcon } from './icons/LikeIcon';
import { FollowedChannel } from '../types';
import { ShortsIcon } from './icons/ShortsIcon';

interface SidebarProps {
  isOpen: boolean;
  onNavigate: () => void;
  onOpenShortsPage: () => void;
  onOpenTrendingPage: () => void;
  onOpenFollowingPage: () => void;
  onOpenLibraryPage: () => void;
  activePage: string;
  followedChannels: FollowedChannel[];
}

const SidebarItem: React.FC<{ icon: React.ReactElement<React.SVGProps<SVGSVGElement> & { active?: boolean }>; label: string; active?: boolean; onClick: () => void; isSidebarOpen: boolean; }> = ({ icon, label, active, onClick, isSidebarOpen }) => (
  <a 
    href="#" 
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className={`group relative flex items-center py-3 rounded-lg transition-colors duration-200 text-base overflow-hidden ${
      active 
        ? 'text-amber-800 font-semibold bg-amber-500/10' 
        : 'text-slate-600 hover:bg-amber-500/10 font-medium'
    } ${
        isSidebarOpen ? 'px-4' : 'md:justify-center md:px-3'
    }`}
    title={!isSidebarOpen ? label : ''}
  >
    {/* Active indicator that also appears partially on hover for inactive items */}
     <span className={`
      absolute left-0 top-1/2 -translate-y-1/2 w-1 bg-amber-500 rounded-r-full
      transition-all duration-300 ease-out
      ${!isSidebarOpen && 'md:hidden'}
      ${active ? 'h-6' : 'h-0 group-hover:h-5'}
    `}></span>
    
    {React.cloneElement(icon, { active: active, className: "w-6 h-6 flex-shrink-0" })}

    <span 
        className={`whitespace-nowrap overflow-hidden transition-[max-width,opacity,margin] duration-300 ease-in-out
        ${isSidebarOpen ? 'max-w-[150px] opacity-100 ml-4' : 'max-w-0 opacity-0 ml-0'}
    `}>
        {label}
    </span>

    {/* Refined Tooltip */}
    {!isSidebarOpen && (
        <span className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-white text-sm rounded-md shadow-lg
                         opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 delay-150 pointer-events-none
                         hidden md:block whitespace-nowrap z-50">
            {label}
        </span>
    )}
  </a>
);

const SidebarChannelItem: React.FC<{ avatarUrl: string; name: string; isLive?: boolean }> = ({ avatarUrl, name, isLive }) => (
    <a href="#" className="flex items-center gap-4 px-4 py-2.5 rounded-lg hover:bg-slate-200/60 transition-colors group">
        <div className="relative">
            <img src={avatarUrl} alt={`${name} channel avatar`} className="w-8 h-8 rounded-full transition-transform group-hover:scale-110" />
            {isLive && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-50 animate-pulse-live"></div>
            )}
        </div>
        <span className="text-base text-slate-700 group-hover:text-slate-900 font-medium whitespace-nowrap truncate flex-1">{name}</span>
    </a>
);


export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onNavigate, onOpenShortsPage, onOpenTrendingPage, onOpenFollowingPage, onOpenLibraryPage, activePage, followedChannels }) => {
  return (
    <aside 
      className={`
        fixed md:relative top-0 left-0 h-full bg-slate-50 z-30
        border-r border-slate-200
        transition-[width,transform] duration-300 ease-out
        flex-shrink-0 flex flex-col
        ${isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:w-20 md:translate-x-0'}
      `}
    >
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto sidebar-scroll pt-2">
            <div className={`p-3 space-y-2 ${!isOpen && 'md:p-2'}`}>
                {/* Main navigation part */}
                <div className="space-y-1">
                    <SidebarItem icon={<HomeIcon />} label="Home" active={activePage === 'home'} onClick={onNavigate} isSidebarOpen={isOpen} />
                    <SidebarItem icon={<ShortsIcon />} label="Shorts" active={activePage === 'shorts'} onClick={onOpenShortsPage} isSidebarOpen={isOpen} />
                    <SidebarItem icon={<TrendingIcon />} label="Trending" active={activePage === 'trending'} onClick={onOpenTrendingPage} isSidebarOpen={isOpen} />
                    <SidebarItem icon={<SubscriptionsIcon />} label="Following" active={activePage === 'following'} onClick={onOpenFollowingPage} isSidebarOpen={isOpen} />
                    <SidebarItem icon={<LibraryIcon />} label="Library" active={activePage === 'library'} onClick={onOpenLibraryPage} isSidebarOpen={isOpen}/>
                </div>
                
                {/* Subscriptions section is only rendered when sidebar is open, as it's a list, not icons */}
                {isOpen && followedChannels.length > 0 && (
                    <>
                        <hr className="border-slate-200 my-4" />
                        <div>
                            <h3 className="px-4 pt-2 pb-2 text-xs font-bold text-slate-400 tracking-widest uppercase">Following</h3>
                            <div className="space-y-0.5">
                                {followedChannels.map(channel => (
                                    <SidebarChannelItem key={channel.handle} avatarUrl={channel.avatarUrl} name={channel.name} isLive={channel.isLive} />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    </aside>
  );
};