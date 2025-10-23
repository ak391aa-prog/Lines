import React from 'react';
import { Video } from '../types';
import { ThumbnailBadge } from './ThumbnailBadge';
import { LazyImage } from './LazyImage';
import { RankingBadge } from './RankingBadge';
import { formatTimeAgo } from '../utils/timeUtils';
import { formatCompactNumber } from '../utils/numberUtils';

interface VideoCardProps {
  video: Video;
  onSelectVideo: (video: Video) => void;
}

const VideoCardComponent: React.FC<VideoCardProps> = ({ video, onSelectVideo }) => {
  return (
    <button
      type="button"
      className="flex flex-col group text-left transition-transform duration-300 ease-out transform hover:-translate-y-1"
      onClick={() => onSelectVideo(video)}
      aria-label={`Watch ${video.title} by ${video.channelName}`}
    >
      <div className="relative rounded-xl overflow-hidden transition-shadow duration-300 shadow-sm group-hover:shadow-xl group-hover:shadow-amber-400/20">
        {video.badge && <ThumbnailBadge type={video.badge} />}
        <RankingBadge rank={video.rank} countryCode={video.countryCode} />
        <LazyImage
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full aspect-video"
        />
        <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded z-10">
          {video.duration}
        </span>
      </div>
      <div className="flex mt-3">
        <img
          src={video.channelAvatarUrl}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="h-10 w-10 rounded-full mr-3 flex-shrink-0"
        />
        <div className="flex flex-col">
          <h3 className="text-base sm:text-lg font-semibold text-slate-800 line-clamp-2 leading-tight transition-colors group-hover:text-amber-600">
            {video.title}
          </h3>
          <p className="text-[15px] text-slate-500 mt-1">{video.channelName}</p>
          <div className="text-[15px] text-slate-500">
            <span>{formatCompactNumber(video.viewCount)} views</span>
            <span className="mx-1">&middot;</span>
            <span>{formatTimeAgo(video.uploadDate)}</span>
          </div>
        </div>
      </div>
    </button>
  );
};

export const VideoCard = React.memo(VideoCardComponent);