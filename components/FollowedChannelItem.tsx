import React from 'react';
import { FollowedChannel } from '../types';
import { formatCompactNumber } from '../utils/numberUtils';

interface FollowedChannelItemProps {
  channel: FollowedChannel;
  isSelected: boolean;
  hasNewVideos: boolean;
  onClick: (channelName: string) => void;
}

export const FollowedChannelItem: React.FC<FollowedChannelItemProps> = ({ channel, isSelected, hasNewVideos, onClick }) => {
  return (
    <button
      onClick={() => onClick(channel.name)}
      className="flex flex-col items-center gap-2 w-20 flex-shrink-0 group"
      aria-pressed={isSelected}
    >
      <div className={`relative rounded-full p-0.5 transition-all duration-300 ${isSelected || hasNewVideos ? 'bg-gradient-to-tr from-amber-500 to-blue-500' : ''}`}>
        <div className="bg-slate-50 p-0.5 rounded-full">
            <img 
                src={channel.avatarUrl} 
                alt={`${channel.name} channel avatar`}
                className="w-16 h-16 rounded-full transition-transform duration-300 group-hover:scale-105" 
            />
        </div>
        {channel.isLive && (
             <div className="absolute bottom-0 right-0 z-10">
                <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-md border-2 border-slate-50 animate-pulse-live">
                    Live
                </span>
            </div>
        )}
      </div>
      <span className={`text-xs text-center truncate w-full transition-colors ${isSelected ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>
        {channel.name}
      </span>
    </button>
  );
};