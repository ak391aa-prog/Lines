import React from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

const ShimmerBlock: React.FC<{className?: string}> = ({className}) => (
    <div className={`bg-slate-200 relative overflow-hidden rounded-md ${className}`}>
        <div className="absolute inset-0 animate-shimmer"></div>
    </div>
);

export const VideoPlayerPageLoader: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-2 sm:p-4 lg:p-6 animate-fade-in">
      {/* Main Content */}
      <div className="flex-grow lg:w-2/3">
        {/* Back button placeholder */}
        <div className="flex items-center gap-2 mb-4 h-9">
            <ArrowLeftIcon className="w-5 h-5 text-slate-300" />
            <div className="w-28 h-5 bg-slate-200 rounded"></div>
        </div>

        {/* Video Player */}
        <ShimmerBlock className="aspect-video w-full rounded-lg md:rounded-2xl" />
        
        {/* Title */}
        <ShimmerBlock className="h-8 w-3/4 mt-4" />
        <ShimmerBlock className="h-7 w-1/2 mt-2" />
        
        {/* Channel Info & Actions */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <ShimmerBlock className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
                <ShimmerBlock className="w-32 h-5" />
                <ShimmerBlock className="w-24 h-4" />
            </div>
          </div>
          <ShimmerBlock className="w-32 h-12 rounded-full mt-4 md:mt-0" />
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-2 mt-4">
            <ShimmerBlock className="w-40 h-12 rounded-full" />
            <ShimmerBlock className="w-24 h-12 rounded-full" />
            <ShimmerBlock className="w-24 h-12 rounded-full" />
        </div>

        {/* Description */}
        <div className="bg-slate-100 p-4 rounded-xl mt-4 space-y-2">
           <div className="flex items-center gap-4">
             <ShimmerBlock className="w-20 h-4" />
             <ShimmerBlock className="w-20 h-4" />
           </div>
           <ShimmerBlock className="w-full h-4" />
           <ShimmerBlock className="w-full h-4" />
           <ShimmerBlock className="w-1/3 h-4" />
        </div>
      </div>

      {/* Recommended Videos Sidebar */}
      <div className="lg:w-1/3 lg:max-w-md flex-shrink-0 hidden lg:block">
        <ShimmerBlock className="w-32 h-7 mb-4" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex gap-3">
                <ShimmerBlock className="w-40 h-24 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <ShimmerBlock className="w-full h-4" />
                    <ShimmerBlock className="w-3/4 h-4" />
                    <ShimmerBlock className="w-1/2 h-4" />
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
