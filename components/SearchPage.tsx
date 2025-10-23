import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Video } from '../types';
import { backendService } from '../services/backendService';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { SearchIcon } from './icons/SearchIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { SearchResultCard } from './SearchResultCard';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { TrashIcon } from './icons/TrashIcon';

interface SearchPageProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClose: () => void;
  onSelectVideo: (video: Video) => void;
  recentSearches: string[];
  onClearRecentSearches: () => void;
  onRecentSearchClick: (query: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  searchQuery,
  onSearchChange,
  onClose,
  onSelectVideo,
  recentSearches,
  onClearRecentSearches,
  onRecentSearchClick,
}) => {
  const [results, setResults] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const scrollContainerRef = useRef<HTMLElement>(null);

  const hasTyped = searchQuery.length > 0;

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const handler = setTimeout(() => {
      setIsLoading(true);
      setPage(1);
      setResults([]);
      backendService.getVideos({ query: searchQuery, page: 1, limit: 12 })
        .then(({ videos, hasMore }) => {
          setResults(videos);
          setHasMore(hasMore);
          setIsLoading(false);
        });
    }, 300); // Debounce search

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const loadMoreResults = useCallback(async () => {
    if (isFetchingMore || !hasMore || !searchQuery.trim()) return;

    setIsFetchingMore(true);
    const nextPage = page + 1;
    const { videos: newVideos, hasMore: newHasMore } = await backendService.getVideos({
      query: searchQuery,
      page: nextPage,
      limit: 12
    });

    setResults(prev => [...prev, ...newVideos]);
    setPage(nextPage);
    setHasMore(newHasMore);
    setIsFetchingMore(false);
  }, [isFetchingMore, hasMore, page, searchQuery]);
  
  const observer = useRef<IntersectionObserver>();
  // FIX: Explicitly type the 'node' parameter to avoid potential type inference issues.
  const lastResultElementRef = useCallback((node: Element | null) => {
    if (isLoading || isFetchingMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreResults();
      }
    }, {
      root: scrollContainerRef.current,
      rootMargin: '0px 0px 300px 0px', // Trigger when 300px from the bottom
    });

    if (node) observer.current.observe(node);
  }, [isLoading, isFetchingMore, hasMore, loadMoreResults]);


  return (
    <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col animate-fade-in">
      {/* Search Header */}
      <header className="flex-shrink-0 flex items-center px-2 sm:px-4 h-16 border-b border-slate-200 gap-2">
        <button
          onClick={onClose}
          className="p-3 rounded-full hover:bg-slate-200 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="h-7 w-7 text-slate-600" />
        </button>
        <form 
          onSubmit={(e) => e.preventDefault()} 
          className="relative flex-1 flex items-center"
        >
            <div className="relative flex items-center w-full bg-white border border-slate-300 rounded-full shadow-sm 
                        focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 transition-all">
                <input
                    type="search"
                    placeholder="Search Lines"
                    className="w-full bg-transparent text-slate-800 rounded-full py-2.5 pl-5 pr-10 text-base 
                                focus:outline-none placeholder-slate-500"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    autoFocus
                />
                {searchQuery && (
                    <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-800 transition-colors"
                    aria-label="Clear search"
                    >
                    <XCircleIcon className="w-5 h-5" />
                    </button>
                )}
            </div>
        </form>
         <button className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors flex-shrink-0 ml-2" aria-label="Search with your voice">
            <MicrophoneIcon className="h-6 w-6 text-slate-600"/>
        </button>
      </header>

      {/* Content Area */}
      <main ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        {isLoading && hasTyped && (
          <div className="flex justify-center items-center p-10">
            <SpinnerIcon className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
        )}

        {!isLoading && hasTyped && (
          <div className="p-2 sm:p-4">
            {results.length > 0 ? (
              <>
                <div className="space-y-4">
                  {results.map((video, index) => {
                    const isLastElement = results.length === index + 1;
                    return (
                      <div 
                        ref={isLastElement ? lastResultElementRef : null}
                        key={`${video.id}-${index}`}
                        className="video-card-enter" 
                        style={{ animationDelay: `${index % 12 * 40}ms` }}
                      >
                        <SearchResultCard video={video} onSelectVideo={onSelectVideo} />
                      </div>
                    )
                  })}
                </div>
                {isFetchingMore && (
                  <div className="flex justify-center items-center p-6">
                      <SpinnerIcon className="w-8 h-8 text-amber-500 animate-spin" />
                  </div>
                )}
                {!hasMore && !isFetchingMore && results.length > 0 && (
                  <div className="text-center py-10">
                      <p className="text-slate-500 font-semibold text-lg">You've reached the end!</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 px-4">
                <SearchIcon className="w-16 h-16 text-slate-400 mx-auto" />
                <h2 className="text-2xl font-bold text-slate-800 mt-4">No results for "{searchQuery}"</h2>
                <p className="text-slate-500 mt-2">Try checking for typos or using different keywords.</p>
              </div>
            )}
          </div>
        )}

        {!hasTyped && (
          <div className="animate-fade-in p-4">
            {recentSearches.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-base font-semibold text-slate-800">Recent Searches</h2>
                  <button
                    onClick={onClearRecentSearches}
                    className="p-2 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
                    aria-label="Clear all recent searches"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {recentSearches.map((query, index) => (
                    <button
                      key={index}
                      onClick={() => onRecentSearchClick(query)}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                    >
                      <HistoryIcon className="w-5 h-5 text-slate-500 flex-shrink-0" />
                      <span className="text-base font-medium text-slate-700">{query}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16 px-4 text-slate-500">
                <p>Your search history will appear here.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
