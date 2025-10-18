import React, { useRef } from 'react';
import { Video } from '../types';
import { HorizontalVideoCard } from './HorizontalVideoCard';
import { FireIcon } from './icons/FireIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface SuggestionsSectionProps {
  videos: Video[];
  onSelectVideo: (video: Video) => void;
}

export const SuggestionsSection: React.FC<SuggestionsSectionProps> = ({ videos, onSelectVideo }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!videos.length) return null;
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };


  return (
    <div className="bg-slate-100 border-y border-slate-200 py-6">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center gap-2 mb-4">
          <FireIcon className="w-6 h-6 text-amber-500" />
          <h2 className="text-xl font-bold text-slate-900">Trending Now</h2>
        </div>
        <div className="relative group/suggestions">
          <div 
            ref={scrollContainerRef}
            className="suggestions-scroll flex items-stretch gap-4 overflow-x-auto pb-2 -mb-2"
          >
            {videos.map(video => (
              <HorizontalVideoCard 
                key={video.id} 
                video={video} 
                onSelectVideo={onSelectVideo} 
              />
            ))}
          </div>
          {/* Desktop scroll buttons */}
          <button 
            onClick={() => scroll('left')}
            className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg border border-slate-200
                       text-slate-700 hover:bg-white hover:text-slate-900 transition-all z-10
                       opacity-0 group-hover/suggestions:opacity-100 hidden lg:flex"
            aria-label="Scroll left"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg border border-slate-200
                       text-slate-700 hover:bg-white hover:text-slate-900 transition-all z-10
                       opacity-0 group-hover/suggestions:opacity-100 hidden lg:flex"
            aria-label="Scroll right"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
