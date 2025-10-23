import React from 'react';
import { Playlist } from '../types';
import { ClockIcon } from './icons/ClockIcon';
import { LikeIcon } from './icons/LikeIcon';
import { PlusIcon } from './icons/PlusIcon';
import { CheckIcon } from './icons/CheckIcon';

interface SavePlaylistMenuProps {
  isOpen: boolean;
  onClose: () => void;
  playlists: Playlist[];
  videoId: string;
  onTogglePlaylist: (playlistId: string) => void;
  onOpenCreatePlaylistModal: () => void;
}

const PlaylistIcon: React.FC<{name: string}> = ({ name }) => {
    if (name.toLowerCase().includes('later')) return <ClockIcon className="w-6 h-6 text-slate-600" />;
    if (name.toLowerCase().includes('favorite')) return <LikeIcon className="w-6 h-6 text-slate-600" />;
    return <div className="w-6 h-6" />;
}

export const SavePlaylistMenu: React.FC<SavePlaylistMenuProps> = ({ isOpen, onClose, playlists, videoId, onTogglePlaylist, onOpenCreatePlaylistModal }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 z-30 p-2 animate-menu-pop-in"
        role="menu"
        aria-orientation="vertical"
    >
      <div className="flex items-center justify-between p-2">
         <h3 className="font-bold text-slate-900 text-lg">Save to...</h3>
         {/* <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100"><XIcon className="w-5 h-5 text-slate-500" /></button> */}
      </div>

      <div className="my-1">
        {playlists.map(playlist => {
            const isChecked = playlist.videoIds.has(videoId);
            return (
                <button
                    key={playlist.id}
                    onClick={() => onTogglePlaylist(playlist.id)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-100 rounded-lg"
                    role="menuitemcheckbox"
                    aria-checked={isChecked}
                >
                    <div className="flex items-center gap-4">
                        <PlaylistIcon name={playlist.name} />
                        <span className="font-semibold text-slate-800">{playlist.name}</span>
                    </div>
                    <div className={`w-6 h-6 flex items-center justify-center rounded-md border-2 transition-colors ${isChecked ? 'bg-slate-900 border-slate-900' : 'border-slate-400'}`}>
                        {isChecked && <CheckIcon className="w-4 h-4 text-white" />}
                    </div>
                </button>
            )
        })}
      </div>
      
      <div className="border-t border-slate-200 mt-1 pt-1">
        <button
            onClick={onOpenCreatePlaylistModal}
            className="w-full flex items-center gap-4 p-3 text-left hover:bg-slate-100 rounded-lg">
            <PlusIcon className="w-6 h-6 text-slate-600" />
            <span className="font-semibold text-slate-800">Create new playlist</span>
        </button>
      </div>
    </div>
  );
};
