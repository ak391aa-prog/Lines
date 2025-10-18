import React, { useState, useMemo, useEffect } from 'react';
import { Video, FollowedChannel } from '../types';
import { VideoCard } from './VideoCard';
import { SearchResultCard } from './SearchResultCard';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { FollowedChannelItem } from './FollowedChannelItem';
import { GridViewIcon } from './icons/GridViewIcon';
import { ListViewIcon } from './icons/ListViewIcon';
import { ChevronUpIcon } from './icons/ChevronUpIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { isToday, isThisWeek } from '../utils/dateUtils';
import { mockChannels } from '../services/videoService';

interface FollowingPageProps {
  allVideos: Video[];
  onSelectVideo: (video: Video) => void;
}

const ViewModeButton: React.FC<{
  label: string;
  icon: React.ReactElement;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    aria-label={`Switch to ${label} view`}
    aria-pressed={isActive}
    className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-slate-300 text-slate-900' : 'text-slate-500 hover:bg-slate-200'}`}
  >
    {icon}
  </button>
);


export const FollowingPage: React.FC<FollowingPageProps> = ({ allVideos, onSelectVideo }) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedChannel, setSelectedChannel] = useState<string>('All');
    const [isLoading, setIsLoading] = useState(true);

    const followedChannelNames = useMemo(() => mockChannels.map(c => c.name), []);
    
    const videos = useMemo(() => {
        return allVideos
            .filter(video => followedChannelNames.includes(video.channelName))
            .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    }, [allVideos, followedChannelNames]);

    const videosWithNewStatus = useMemo(() => {
        const channelsWithNewVideos = new Set<string>();
        videos.forEach(video => {
            if (isToday(new Date(video.uploadDate))) {
                channelsWithNewVideos.add(video.channelName);
            }
        });
        return { videos, channelsWithNewVideos };
    }, [videos]);

    const filteredAndGroupedVideos = useMemo(() => {
        const filtered = selectedChannel === 'All'
            ? videosWithNewStatus.videos
            : videosWithNewStatus.videos.filter(v => v.channelName === selectedChannel);
        
        const groups: { [key: string]: Video[] } = {
            'Today': [],
            'This Week': [],
            'Older': [],
        };

        filtered.forEach(video => {
            const uploadDate = new Date(video.uploadDate);
            if (isToday(uploadDate)) {
                groups['Today'].push(video);
            } else if (isThisWeek(uploadDate)) {
                groups['This Week'].push(video);
            } else {
                groups['Older'].push(video);
            }
        });
        
        return groups;

    }, [videosWithNewStatus, selectedChannel]);

    useEffect(() => {
        if (allVideos.length > 0) {
            setIsLoading(false);
        }
    }, [allVideos]);

    return (
        <div className="flex-1">
            <header className="sticky top-0 bg-slate-50/90 backdrop-blur-md z-10 px-4 pt-4 pb-2 border-b border-slate-200">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Following</h1>
                    <button className="flex items-center gap-2 px-4 py-2 text-base font-semibold rounded-lg transition-colors bg-slate-200 text-slate-800 hover:bg-slate-300">
                        <SettingsIcon className="w-5 h-5"/>
                        <span className="hidden sm:inline">Manage</span>
                    </button>
                </div>
                <div className="max-w-7xl mx-auto mt-4">
                     <div className="category-scroll flex items-start gap-4 overflow-x-auto pb-2 -mb-2">
                        <button
                            onClick={() => setSelectedChannel('All')}
                            className={`flex flex-col items-center gap-2 w-20 flex-shrink-0 group ${selectedChannel === 'All' ? '' : 'opacity-70 hover:opacity-100'}`}
                            aria-pressed={selectedChannel === 'All'}
                        >
                           <div className={`flex items-center justify-center w-[72px] h-[72px] rounded-full transition-colors ${selectedChannel === 'All' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-800'}`}>
                                All
                           </div>
                           <span className={`text-xs text-center truncate w-full ${selectedChannel === 'All' ? 'font-bold text-slate-900' : 'font-medium text-slate-800'}`}>All</span>
                        </button>
                        {mockChannels.map(channel => (
                            <FollowedChannelItem 
                                key={channel.name}
                                channel={channel}
                                isSelected={selectedChannel === channel.name}
                                hasNewVideos={videosWithNewStatus.channelsWithNewVideos.has(channel.name)}
                                onClick={setSelectedChannel}
                            />
                        ))}
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 md:px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                    <button className="flex items-center gap-2 px-4 py-2 text-base font-semibold rounded-lg transition-colors bg-slate-200 text-slate-800 hover:bg-slate-300">
                        <ChevronUpIcon className="w-5 h-5" />
                        Latest
                    </button>
                    <div className="flex items-center gap-2 p-1 bg-slate-200 rounded-lg">
                        <ViewModeButton label="Grid" icon={<GridViewIcon className="w-5 h-5"/>} isActive={viewMode === 'grid'} onClick={() => setViewMode('grid')} />
                        <ViewModeButton label="List" icon={<ListViewIcon className="w-5 h-5"/>} isActive={viewMode === 'list'} onClick={() => setViewMode('list')} />
                    </div>
                </div>

                 {isLoading ? (
                    <div className="flex justify-center items-center p-10">
                        <SpinnerIcon className="w-10 h-10 text-amber-500 animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-10">
                        {Object.entries(filteredAndGroupedVideos).map(([groupTitle, videoList]) => {
                            const typedVideoList = videoList as Video[];
                            return (
                                typedVideoList.length > 0 && (
                                <section key={groupTitle}>
                                    <h2 className="text-xl font-bold text-slate-800 mb-4">{groupTitle}</h2>
                                    {viewMode === 'grid' ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
                                            {typedVideoList.map((video, index) => (
                                                <div key={video.id} className="video-card-enter" style={{ animationDelay: `${index * 50}ms` }}>
                                                    <VideoCard video={video} onSelectVideo={onSelectVideo} />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {typedVideoList.map((video, index) => (
                                                <div key={video.id} className="video-card-enter" style={{ animationDelay: `${index * 50}ms` }}>
                                                    <SearchResultCard video={video} onSelectVideo={onSelectVideo} />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            ));
                        })}
                         {videos.length === 0 && !isLoading && (
                            <div className="text-center py-16 px-4">
                                <h2 className="text-2xl font-bold text-slate-800">No new videos</h2>
                                <p className="text-slate-500 mt-2">Your followed channels haven't posted anything new recently.</p>
                            </div>
                         )}
                    </div>
                )}
            </main>
        </div>
    );
};
