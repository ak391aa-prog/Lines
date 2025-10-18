import React from 'react';
import { Video } from '../types';
import { ThumbnailBadge } from './ThumbnailBadge';
import { LazyImage } from './LazyImage';
import { RankingBadge } from './RankingBadge';

interface SearchSuggestionCardProps {
  video: Video;
  onSuggestionClick: () => void;
}

const SearchSuggestionCardComponent: React.FC<SearchSuggestionCardProps> = ({ video, onSuggestionClick }) => {
  return (
    <button
      onClick={onSuggestionClick}
      className="flex items-center gap-4 w-full p-2 text-left hover:bg-slate-100 rounded-lg transition-colors"
      aria-label={`Search for ${video.title}`}
    >
      <div className="relative w-28 h-16 object-cover rounded-md flex-shrink-0">
        {video.badge && <ThumbnailBadge type={video.badge} small />}
        <RankingBadge rank={video.rank} countryCode={video.countryCode} small />
        <LazyImage
          src={video.thumbnailUrl}
          alt=""
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <div className="flex-1">
        <h4 className="text-base font-semibold text-slate-800 line-clamp-2 leading-tight">
          {video.title}
        </h4>
        <p className="text-sm text-slate-500 mt-0.5">{video.channelName}</p>
      </div>
    </button>
  );
};

export const SearchSuggestionCard = React.memo(SearchSuggestionCardComponent);
