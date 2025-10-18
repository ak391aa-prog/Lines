import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { BellIcon } from './icons/BellIcon';
import { MenuIcon } from './icons/MenuIcon';
import { Logo } from './icons/Logo';
import { Video, Suggestion, FollowedChannel } from '../types';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { SearchSuggestionCard } from './SearchSuggestionCard';
import { UserMenu } from './UserMenu';
import { PlusIcon } from './icons/PlusIcon';
import { TrendingIcon } from './icons/TrendingIcon';


interface HeaderProps {
  onLogoClick: () => void;
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  suggestions: Suggestion[];
  onSuggestionClick: (suggestion: Suggestion) => void;
  onOpenSearchPage: () => void;
  onOpenNotificationsPage: () => void;
  onOpenVoiceSearch: () => void;
  onOpenCreateModal: () => void;
  onOpenProfilePage: () => void;
  onOpenSettingsPage: () => void;
}

const QuerySuggestionItem: React.FC<{ query: string; onClick: () => void }> = ({ query, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-4 w-full p-2.5 text-left hover:bg-slate-100 rounded-lg transition-colors"
    aria-label={`Search for ${query}`}
  >
    <SearchIcon className="w-5 h-5 text-slate-500 flex-shrink-0 ml-1" />
    <div className="flex-1">
      <h4 className="text-base font-semibold text-slate-700">
        {query}
      </h4>
    </div>
  </button>
);

const ChannelSuggestionItem: React.FC<{ channel: FollowedChannel; onClick: () => void }> = ({ channel, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-4 w-full p-2.5 text-left hover:bg-slate-100 rounded-lg transition-colors"
    aria-label={`Go to ${channel.name} channel`}
  >
    <img src={channel.avatarUrl} alt={channel.name} className="w-10 h-10 rounded-full flex-shrink-0" />
    <div className="flex-1 overflow-hidden">
      <h4 className="text-base font-semibold text-slate-800 truncate">{channel.name}</h4>
      <p className="text-sm text-slate-500 truncate">{channel.handle}</p>
    </div>
  </button>
);

const KeywordSuggestionItem: React.FC<{ keyword: string; onClick: () => void }> = ({ keyword, onClick }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-4 w-full p-2.5 text-left hover:bg-slate-100 rounded-lg transition-colors"
      aria-label={`Search for category ${keyword}`}
    >
      <TrendingIcon className="w-5 h-5 text-slate-500 flex-shrink-0 ml-1" />
      <div className="flex-1">
        <h4 className="text-base font-semibold text-slate-700">
          {keyword}
        </h4>
      </div>
    </button>
);

export const Header: React.FC<HeaderProps> = ({ 
  onLogoClick, 
  onToggleSidebar, 
  searchQuery, 
  onSearchChange,
  suggestions,
  onSuggestionClick,
  onOpenSearchPage,
  onOpenNotificationsPage,
  onOpenVoiceSearch,
  onOpenCreateModal,
  onOpenProfilePage,
  onOpenSettingsPage,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const showSuggestions = isFocused && suggestions.length > 0;

  return (
    <header className="flex-shrink-0 bg-white/80 backdrop-blur-md z-20 flex items-center justify-between px-2 sm:px-4 h-16 border-b border-slate-200 gap-2">
      
      {/* --- Left side content (Menu, Logo) --- */}
      <div className="flex items-center gap-1 sm:gap-4">
        <button onClick={onToggleSidebar} className="p-3 rounded-full hover:bg-slate-100 transition-colors" aria-label="Toggle navigation menu">
          <MenuIcon className="h-7 w-7 text-slate-600" />
        </button>
        <button onClick={onLogoClick} className="flex items-center gap-2" aria-label="Lines homepage">
          <Logo className="h-7 w-7 text-amber-500" />
          <span className="text-xl font-bold tracking-tighter hidden sm:block text-slate-900">Lines</span>
        </button>
      </div>

      {/* --- Desktop Search bar --- */}
      <div className="relative flex-1 justify-center items-center hidden sm:flex gap-4">
        <form onSubmit={(e) => { e.preventDefault(); onSuggestionClick({ type: 'query', query: searchQuery }); }} className="relative w-full max-w-xs sm:max-w-md md:max-w-2xl">
            <div className="relative flex items-center w-full bg-white border border-slate-300 rounded-full shadow-sm group
                            focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 transition-all">
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full bg-transparent text-slate-900 rounded-l-full py-2.5 pl-5 pr-3 text-base 
                               focus:outline-none placeholder-slate-500"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                />
                <div className="h-6 border-l border-slate-300 group-focus-within:border-amber-500 transition-colors"></div>
                <button type="submit" className="px-4 text-slate-500 hover:text-slate-900 transition-colors" aria-label="Search">
                    <SearchIcon className="h-5 w-5" />
                </button>
            </div>
            
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden animate-fade-in p-2">
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => {
                      switch (suggestion.type) {
                        case 'query':
                          return <QuerySuggestionItem key={`query-${suggestion.query}`} query={suggestion.query} onClick={() => onSuggestionClick(suggestion)} />
                        case 'video':
                          return <SearchSuggestionCard key={suggestion.video.id} video={suggestion.video} onSuggestionClick={() => onSuggestionClick(suggestion)} />
                        case 'channel':
                          return <ChannelSuggestionItem key={suggestion.channel.handle} channel={suggestion.channel} onClick={() => onSuggestionClick(suggestion)} />
                        case 'keyword':
                          return <KeywordSuggestionItem key={suggestion.keyword} keyword={suggestion.keyword} onClick={() => onSuggestionClick(suggestion)} />
                        default:
                          return null;
                      }
                  })}
                </div>
              </div>
            )}
        </form>
        <button onClick={onOpenVoiceSearch} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors" aria-label="Search with your voice">
            <MicrophoneIcon className="h-6 w-6 text-slate-600"/>
        </button>
      </div>
      
      {/* --- Right side content (Search Icon, Bell, Avatar) --- */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button 
            onClick={onOpenSearchPage}
            className="p-3 rounded-full hover:bg-slate-100 transition-colors sm:hidden" aria-label="Open search">
            <SearchIcon className="h-7 w-7 text-slate-600" />
        </button>
        
        <button 
            onClick={onOpenCreateModal}
            className="relative p-3 rounded-full hover:bg-slate-100 transition-colors hidden sm:flex" 
            aria-label="Create a video"
        >
            <PlusIcon className="h-7 w-7 text-slate-600" />
        </button>
        
        {/* --- Notifications Button --- */}
        <div className="relative">
            <button 
                onClick={onOpenNotificationsPage}
                className="relative p-3 rounded-full hover:bg-slate-100 transition-colors" 
                aria-label="View notifications. New notifications available."
            >
                <BellIcon className="h-7 w-7 text-slate-600" />
                <span className="absolute top-2.5 right-2.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" aria-hidden="true" />
            </button>
        </div>

        <div className="relative">
            <button 
              onClick={() => setIsUserMenuOpen(p => !p)}
              aria-label="Open user menu" 
              className="h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 focus:ring-offset-white flex-shrink-0"
            >
              <img
                src="https://picsum.photos/seed/user-avatar/40/40"
                alt="User Avatar"
                className="h-full w-full rounded-full ring-2 ring-transparent hover:ring-amber-500 transition-all"
              />
            </button>
             <UserMenu
                isOpen={isUserMenuOpen}
                onClose={() => setIsUserMenuOpen(false)}
                onNavigateToProfile={onOpenProfilePage}
                onNavigateToSettings={onOpenSettingsPage}
             />
        </div>
      </div>
    </header>
  );
};
