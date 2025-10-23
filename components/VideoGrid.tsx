import React, { useRef, useCallback } from 'react';
import { Video } from '../types';
import { VideoCard } from './VideoCard';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface VideoGridProps {
  videos: Video[];
  onSelectVideo: (video: Video) => void;
  isLoading: boolean;
  loadMoreVideos: () => void;
  hasMore: boolean;
  isFetchingMore: boolean;
  scrollableRootRef: React.RefObject<HTMLElement>;
}

const Shimmer = () => <div className="absolute inset-0 animate-shimmer"></div>;

const VideoCardSkeleton = () => (
    <div className="flex flex-col">
        <div className="relative overflow-hidden w-full aspect-video bg-slate-200 rounded-xl">
            <Shimmer />
        </div>
        <div className="flex mt-3">
            <div className="relative overflow-hidden h-9 w-9 rounded-full bg-slate-200 mr-3 flex-shrink-0">
                <Shimmer />
            </div>
            <div className="flex-1 space-y-2">
                <div className="relative overflow-hidden h-4 bg-slate-200 rounded w-3/4">
                    <Shimmer />
                </div>
                <div className="relative overflow-hidden h-4 bg-slate-200 rounded w-1/2">
                    <Shimmer />
                </div>
            </div>
        </div>
    </div>
);

export const VideoGrid: React.FC<VideoGridProps> = ({ videos, onSelectVideo, isLoading, loadMoreVideos, hasMore, isFetchingMore, scrollableRootRef }) => {
  const observer = useRef<IntersectionObserver>();
  // FIX: Explicitly type the 'node' parameter to avoid potential type inference issues.
  const lastVideoElementRef = useCallback((node: Element | null) => {
    if (isLoading || isFetchingMore) return;
    if (observer.current) observer.current.disconnect();
    
    // FIX: Inlined the IntersectionObserver callback to resolve a potential TS error.
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreVideos();
      }
    }, {
      root: scrollableRootRef.current,
      rootMargin: '0px 0px 200px 0px', // Trigger when 200px from the bottom
    });

    if (node) observer.current.observe(node);
  }, [isLoading, isFetchingMore, hasMore, loadMoreVideos, scrollableRootRef]);


  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8 py-4 md:py-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <VideoCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (videos.length === 0 && !isFetchingMore) {
    return (
      <div className="text-center py-16 px-4">
        <h2 className="text-2xl font-bold text-slate-800">No videos found</h2>
        <p className="text-slate-500 mt-2">Try adjusting your search or category filters.</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8 py-4 md:py-6">
        {videos.map((video, index) => {
           const isLastElement = videos.length === index + 1;
           return (
            <div 
              ref={isLastElement ? lastVideoElementRef : null}
              key={video.id} 
              className="video-card-enter" 
              style={{ animationDelay: `${index % 8 * 50}ms` }} // use modulo to keep animation fast on long lists
            >
              <VideoCard video={video} onSelectVideo={onSelectVideo} />
            </div>
           )
        })}
      </div>
      {isFetchingMore && (
        <div className="flex justify-center items-center p-6">
            <SpinnerIcon className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      )}
      {!hasMore && !isLoading && videos.length > 8 && (
        <div className="text-center py-10">
            <p className="text-slate-500 font-semibold text-lg">You've reached the end!</p>
        </div>
      )}
    </>
  );
};
