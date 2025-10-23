import React, { useMemo, useState } from 'react';
import { Video, Playlist } from '../types';
import { HistoryIcon } from './icons/HistoryIcon';
import { WatchLaterIcon } from './icons/WatchLaterIcon';
import { LikeIcon } from './icons/LikeIcon';
import { HorizontalVideoCard } from './HorizontalVideoCard';
import { YourVideosIcon } from './icons/YourVideosIcon';
import { VideoCard } from './VideoCard';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { PlaylistIcon } from './icons/PlaylistIcon';
import { PlaylistCard } from './PlaylistCard';
import { PlusIcon } from './icons/PlusIcon';
import { CreatePlaylistModal } from './CreatePlaylistModal';
import { CURRENT_USER_CHANNEL_NAME } from '../data/mockData';

interface LibraryPageProps {
  allVideos: Video[];
  onSelectVideo: (video: Video) => void;
  playlists: Playlist[];
  onCreatePlaylist: (name: string) => void;
  historyVideos: Video[];
  likedVideos: Video[];
}

interface LibrarySectionProps {
  title: string;
  icon: React.ReactElement<{ className?: string }>;
  videos: Video[];
  onSelectVideo: (video: Video) => void;
  onViewAll: (title: string) => void;
}

const LibrarySection: React.FC<LibrarySectionProps> = ({ title, icon, videos, onSelectVideo, onViewAll }) => {
    const initialLimit = 5;
    const displayedVideos = videos.slice(0, initialLimit);

    return (
        <section className="py-6 border-b border-slate-200">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    {React.cloneElement(icon, { className: "w-7 h-7 text-slate-500" })}
                    <h2 className="text-xl font-bold text-slate-900">{title}</h2>
                </div>
                {videos.length > initialLimit && (
                    <button
                        onClick={() => onViewAll(title)}
                        className="flex items-center gap-1 px-4 py-2 text-base font-semibold rounded-lg transition-colors text-amber-600 hover:bg-amber-50"
                    >
                        <span>View all</span>
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                )}
            </div>
            
            {displayedVideos.length > 0 ? (
                <div className="suggestions-scroll flex items-stretch gap-4 overflow-x-auto pb-2 -mb-2">
                    {displayedVideos.map(video => (
                        <HorizontalVideoCard 
                            key={`${title}-${video.id}`} 
                            video={video} 
                            onSelectVideo={onSelectVideo} 
                        />
                    ))}
                </div>
            ) : (
                <p className="text-slate-500 pl-11">No videos in this section yet.</p>
            )}
        </section>
    );
};


export const LibraryPage: React.FC<LibraryPageProps> = ({ allVideos, onSelectVideo, playlists, onCreatePlaylist, historyVideos, likedVideos }) => {
  const [detailedView, setDetailedView] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const librarySections = useMemo(() => {
    const watchLaterPlaylist = playlists.find(p => p.name === 'Watch Later');
    const watchLaterVideoIds = watchLaterPlaylist ? watchLaterPlaylist.videoIds : new Set();
    const watchLaterVideos = allVideos.filter(v => watchLaterVideoIds.has(v.id));
    const yourVideos = allVideos.filter(v => v.channelName === CURRENT_USER_CHANNEL_NAME);

    return [
        { title: 'History', icon: <HistoryIcon />, videos: historyVideos },
        { title: 'Your Videos', icon: <YourVideosIcon />, videos: yourVideos },
        { title: 'Watch Later', icon: <WatchLaterIcon />, videos: watchLaterVideos },
        { title: 'Liked Videos', icon: <LikeIcon />, videos: likedVideos },
    ]
  }, [allVideos, playlists, historyVideos, likedVideos]);
  
  const selectedSection = useMemo(() => {
      if (!detailedView) return null;
      return librarySections.find(s => s.title === detailedView);
  }, [detailedView, librarySections]);

  if (detailedView === 'Playlists') {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 animate-fade-in">
        <header className="py-6 flex items-center gap-4 border-b border-slate-200 mb-6">
          <button
            onClick={() => setDetailedView(null)}
            className="p-2 rounded-full hover:bg-slate-200 transition-colors"
            aria-label="Back to Library"
          >
            <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
          </button>
          <div className="flex items-center gap-4">
            <PlaylistIcon className="w-8 h-8 text-slate-500" />
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Playlists</h1>
          </div>
        </header>
        <main>
          {playlists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8 pb-6">
              {playlists.map((playlist, index) => (
                <div key={playlist.id} className="video-card-enter" style={{ animationDelay: `${index * 30}ms` }}>
                  <PlaylistCard playlist={playlist} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg">You haven't created any playlists yet.</p>
            </div>
          )}
        </main>
      </div>
    );
  }

  if (selectedSection) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 animate-fade-in">
        <header className="py-6 flex items-center gap-4 border-b border-slate-200 mb-6">
          <button
            onClick={() => setDetailedView(null)}
            className="p-2 rounded-full hover:bg-slate-200 transition-colors"
            aria-label="Back to Library"
          >
            <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
          </button>
          <div className="flex items-center gap-4">
            {React.cloneElement(selectedSection.icon, { className: "w-8 h-8 text-slate-500" })}
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{selectedSection.title}</h1>
          </div>
        </header>
        <main>
          {selectedSection.videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8 pb-6">
              {selectedSection.videos.map((video, index) => (
                <div key={`${selectedSection.title}-${video.id}`} className="video-card-enter" style={{ animationDelay: `${index * 30}ms` }}>
                  <VideoCard video={video} onSelectVideo={onSelectVideo} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg">No videos in this section yet.</p>
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6">
       <header className="py-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Library</h1>
      </header>
      <main>
        {librarySections.map(section => (
            <LibrarySection 
                key={section.title}
                {...section}
                onSelectVideo={onSelectVideo}
                onViewAll={setDetailedView}
            />
        ))}
         <section className="py-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <PlaylistIcon className="w-7 h-7 text-slate-500" />
                    <h2 className="text-xl font-bold text-slate-900">Playlists</h2>
                </div>
                {playlists.length > 4 && (
                    <button
                        onClick={() => setDetailedView('Playlists')}
                        className="flex items-center gap-1 px-4 py-2 text-base font-semibold rounded-lg transition-colors text-amber-600 hover:bg-amber-50"
                    >
                        <span>View all</span>
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                )}
            </div>
            
            <div className="suggestions-scroll flex items-stretch gap-4 overflow-x-auto pb-2 -mb-2">
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex flex-col items-center justify-center text-center gap-2 w-64 flex-shrink-0 p-2 rounded-xl border-2 border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-100 transition-colors"
                >
                    <PlusIcon className="w-8 h-8 text-slate-500" />
                    <span className="font-semibold text-slate-700">Create new playlist</span>
                </button>
                {playlists.slice(0, 4).map(playlist => (
                    <div key={playlist.id} className="w-64 flex-shrink-0">
                        <PlaylistCard playlist={playlist} />
                    </div>
                ))}
            </div>
         </section>
      </main>
      <CreatePlaylistModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={onCreatePlaylist}
      />
    </div>
  );
};
