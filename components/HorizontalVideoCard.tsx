import React from 'react';
import { Video } from '../types';
import { ThumbnailBadge } from './ThumbnailBadge';
import { LazyImage } from './LazyImage';
import { RankingBadge } from './RankingBadge';
import { formatTimeAgo } from '../utils/timeUtils';
import { formatCompactNumber } from '../utils/numberUtils';

interface HorizontalVideoCardProps {
  video: Video;
  onSelectVideo: (video: Video) => void;
}

const HorizontalVideoCardComponent: React.FC<HorizontalVideoCardProps> = ({ video, onSelectVideo }) => {
  return (
    <button
      type="button"
      className="flex items-center gap-4 group w-[22rem] flex-shrink-0 p-2 rounded-lg border border-transparent hover:bg-slate-100 hover:border-slate-200 transition-all text-left"
      onClick={() => onSelectVideo(video)}
      aria-label={`Watch ${video.title} by ${video.channelName}`}
    >
      <div className="relative w-40 flex-shrink-0">
        {video.badge && <ThumbnailBadge type={video.badge} />}
        <RankingBadge rank={video.rank} countryCode={video.countryCode} />
        <LazyImage
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-auto object-cover rounded-md aspect-video"
        />
        <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1.5 py-0.5 rounded z-10">
          {video.duration}
        </span>
      </div>
      <div className="flex flex-col">
        <h3 className="text-base font-semibold text-slate-800 line-clamp-2 leading-tight">
          {video.title}
        </h3>
        <p className="text-sm text-slate-500 mt-1">{video.channelName}</p>
        <div className="text-sm text-slate-500">
          <span>{formatCompactNumber(video.viewCount)} views</span>
          <span className="mx-1">&middot;</span>
          <span>{formatTimeAgo(video.uploadDate)}</span>
        </div>
      </div>
    </button>
  );
};

export const HorizontalVideoCard = React.memo(HorizontalVideoCardComponent);