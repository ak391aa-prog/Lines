import React from 'react';
import { Playlist } from '../types';
import { PlaylistIcon } from './icons/PlaylistIcon';

interface PlaylistCardProps {
  playlist: Playlist;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  return (
    <button className="flex flex-col group text-left transition-transform duration-300 ease-out transform hover:-translate-y-1">
      <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-300 shadow-sm group-hover:shadow-xl group-hover:shadow-amber-400/20">
        <img 
          src={playlist.thumbnailUrl} 
          alt={playlist.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-end gap-2 text-white text-sm font-bold">
            <PlaylistIcon className="w-5 h-5" />
            <span>{playlist.videoCount} videos</span>
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-base font-semibold text-slate-800 line-clamp-2 leading-tight transition-colors group-hover:text-amber-600">
          {playlist.name}
        </h3>
        <p className="text-sm text-slate-500 mt-1">View full playlist</p>
      </div>
    </button>
  );
};
