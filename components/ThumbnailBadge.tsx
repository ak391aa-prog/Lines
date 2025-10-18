import React from 'react';
import { Video } from '../types';

interface ThumbnailBadgeProps {
  type: NonNullable<Video['badge']>;
  small?: boolean;
}

export const ThumbnailBadge: React.FC<ThumbnailBadgeProps> = ({ type, small = false }) => {
  let badgeClasses = 'absolute top-2 left-2 z-10 text-white font-bold uppercase tracking-wider rounded-md flex items-center justify-center';
  let badgeText = '';
  
  if (small) {
    badgeClasses += ' px-1.5 py-0.5 text-[10px]';
  } else {
    badgeClasses += ' px-2 py-1 text-xs';
  }

  switch (type) {
    case 'live':
      badgeClasses += ' bg-red-600 animate-pulse-badge';
      badgeText = 'Live';
      break;
    case '4k':
      badgeClasses += ' bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-900';
      badgeText = '4K';
      break;
    default:
      return null;
  }

  return (
    <div className={badgeClasses}>
      {badgeText}
    </div>
  );
};