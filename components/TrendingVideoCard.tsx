import React from 'react';
import { Video } from '../types';
import { TrendingRankBadge } from './TrendingRankBadge';
import { ThumbnailBadge } from './ThumbnailBadge';
import { LazyImage } from './LazyImage';
import { RankingBadge } from './RankingBadge';
import { formatTimeAgo } from '../utils/timeUtils';
import { formatCompactNumber } from '../utils/numberUtils';

interface TrendingVideoCardProps {
  video: Video;
  rank: number;
  onSelectVideo: (video: Video) => void;
  location: 'Regional' | 'Global';
}

const TrendingVideoCardComponent: React.FC<TrendingVideoCardProps> = ({ video, rank, onSelectVideo, location }) => {
  return (
    <button
      type="button"
      className="flex gap-4 group text-left w-full p-2 rounded-lg hover:bg-slate-100 transition-colors"
      onClick={() => onSelectVideo(video)}
      aria-label={`Watch ${video.title} by ${video.channelName}, ranked number ${rank}`}
    >
      <div className="flex items-center justify-center w-12 flex-shrink-0">
        <TrendingRankBadge rank={rank} />
      </div>
      <div className="relative sm:w-64 md:w-80 flex-shrink-0">
        {video.badge && <ThumbnailBadge type={video.badge} />}
        <RankingBadge rank={video.rank} countryCode={video.countryCode} showFlag={location === 'Global'} />
        <LazyImage
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-auto object-cover rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1.5 py-0.5 rounded z-10">
          {video.duration}
        </span>
      </div>
      <div className="flex flex-col flex-grow">
        <h3 className="text-lg sm:text-xl font-semibold text-slate-800 line-clamp-2 leading-tight">
          {video.title}
        </h3>
        <div className="flex items-center gap-2 mt-2">
            <img
            src={video.channelAvatarUrl}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="h-7 w-7 rounded-full flex-shrink-0"
            />
            <p className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">{video.channelName}</p>
        </div>
        <div className="text-sm text-slate-500 mt-1">
            <span>{formatCompactNumber(video.viewCount)} views</span>
            <span className="mx-1.5">&middot;</span>
            <span>{formatTimeAgo(video.uploadDate)}</span>
        </div>
        <p className="text-sm text-slate-600 mt-3 line-clamp-2 hidden md:block">
            {video.description}
        </p>
      </div>
    </button>
  );
};

export const TrendingVideoCard = React.memo(TrendingVideoCardComponent);