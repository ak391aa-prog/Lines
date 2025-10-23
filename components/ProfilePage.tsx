import React, { useState, useMemo, ReactNode } from 'react';
import { Video, FollowedChannel, Playlist } from '../types';
import { VideoCard } from './VideoCard';
import { UserCogIcon } from './icons/UserCogIcon';
import { YourVideosIcon } from './icons/YourVideosIcon';
import { PlaylistIcon } from './icons/PlaylistIcon';
import { SubscriptionsIcon } from './icons/SubscriptionsIcon';
import { InfoCircleIcon } from './icons/InfoCircleIcon';
import { PlaylistCard } from './PlaylistCard';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { HomeIcon } from './icons/HomeIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { formatTimeAgo } from '../utils/timeUtils';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { ShareIcon } from './icons/ShareIcon';
import { CURRENT_USER_CHANNEL_NAME } from '../data/mockData';
import { formatCompactNumber } from '../utils/numberUtils';


interface ProfilePageProps {
  allVideos: Video[];
  onSelectVideo: (video: Video) => void;
  onGoBack: () => void;
}

const MOCK_FOLLOWED_CHANNELS: FollowedChannel[] = [
    { name: 'Nature Explorers', handle: '@nature', subscriberCount: 2300000, avatarUrl: 'https://picsum.photos/seed/ch1/48/48', notificationLevel: 'all' },
    { name: 'FutureVisions', handle: '@future', subscriberCount: 4100000, avatarUrl: 'https://picsum.photos/seed/ch4/48/48', notificationLevel: 'personalized' },
    { name: 'DesignScapes', handle: '@design', subscriberCount: 780000, avatarUrl: 'https://picsum.photos/seed/ch3/48/48', notificationLevel: 'none' },
    { name: 'Gourmet Chef', handle: '@chef', subscriberCount: 950000, avatarUrl: 'https://picsum.photos/seed/ch5/48/48', isLive: true, notificationLevel: 'all' },
    { name: '3DArts', handle: '@3darts', subscriberCount: 450000, avatarUrl: 'https://picsum.photos/seed/ch6/48/48', notificationLevel: 'personalized' },
    { name: 'ZenLife', handle: '@zen', subscriberCount: 620000, avatarUrl: 'https://picsum.photos/seed/ch7/48/48', notificationLevel: 'personalized' },
    { name: 'TechExplained', handle: '@techexplained', subscriberCount: 3100000, avatarUrl: 'https://picsum.photos/seed/ch8/48/48', notificationLevel: 'none' },
];

const MOCK_PLAYLISTS: Playlist[] = [
    { id: 'pl-1', name: 'React Advanced Patterns', videoIds: new Set(['2']), thumbnailUrl: 'https://picsum.photos/seed/playlist1/640/360', videoCount: 15 },
    { id: 'pl-2', name: 'Component Library Design', videoIds: new Set(['10']), thumbnailUrl: 'https://picsum.photos/seed/playlist2/640/360', videoCount: 8 },
    { id: 'pl-3', name: 'State Management Deep Dive', videoIds: new Set(), thumbnailUrl: 'https://picsum.photos/seed/playlist3/640/360', videoCount: 23 },
    { id: 'pl-4', name: 'Web Animation Techniques', videoIds: new Set(), thumbnailUrl: 'https://picsum.photos/seed/playlist4/640/360', videoCount: 12 },
];

type ProfileTab = 'Home' | 'Videos' | 'Playlists' | 'Following' | 'About';

const TABS: { name: ProfileTab; icon: React.ReactElement }[] = [
  { name: 'Home', icon: <HomeIcon /> },
  { name: 'Videos', icon: <YourVideosIcon /> },
  { name: 'Playlists', icon: <PlaylistIcon /> },
  { name: 'Following', icon: <SubscriptionsIcon /> },
  { name: 'About', icon: <InfoCircleIcon /> },
];

const TabButton: React.FC<{
  label: string;
  icon: React.ReactElement<{ className?: string, active?: boolean }>;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    role="tab"
    aria-selected={isActive}
    className={`flex items-center gap-2 px-4 py-2 my-2 rounded-lg text-base font-semibold transition-colors whitespace-nowrap ${
        isActive 
            ? 'bg-slate-900 text-white' 
            : 'text-slate-600 hover:bg-slate-200'
    }`}
  >
    {React.cloneElement(icon, { className: 'w-6 h-6', active: isActive })}
    <span>{label}</span>
  </button>
);

const ChannelCard: React.FC<{ channel: FollowedChannel }> = ({ channel }) => (
    <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-slate-200/60 transition-colors">
        <img src={channel.avatarUrl} alt={channel.name} className="w-24 h-24 rounded-full mb-3" />
        <h3 className="text-lg font-bold text-slate-800">{channel.name}</h3>
        <p className="text-sm text-slate-500">{channel.handle}</p>
        <p className="text-sm text-slate-500">{formatCompactNumber(channel.subscriberCount)} subscribers</p>
        <button className="mt-3 px-6 py-2 text-sm font-bold bg-slate-900 text-white rounded-full hover:bg-black transition-colors">
            Follow
        </button>
    </div>
);

const HorizontalSection: React.FC<{ title: string, children: ReactNode }> = ({ title, children }) => (
    <section className="py-6">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-lg text-amber-600 hover:bg-amber-50 transition-colors">
                <span>View all</span>
                <ChevronRightIcon className="w-4 h-4" />
            </button>
        </div>
        <div className="category-scroll flex gap-4 overflow-x-auto pb-2 -mb-2">
            {children}
        </div>
    </section>
);

const ProfileBottomNavItem: React.FC<{ icon: React.ReactElement; label: string; active?: boolean; onClick?: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 w-full pt-2 pb-1 transition-colors duration-200 ${
      active ? 'text-slate-900' : 'text-slate-600'
    }`}
    aria-label={label}
    aria-current={active ? 'page' : undefined}
  >
    {React.cloneElement(icon, { active: active, className: "w-6 h-6" })}
    <span className={`text-xs font-medium mt-1 ${active ? 'font-bold' : ''}`}>{label}</span>
  </button>
);

const ProfileBottomNav: React.FC<{ activeTab: ProfileTab; onTabClick: (tab: ProfileTab) => void }> = ({ activeTab, onTabClick }) => (
  <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 sm:hidden z-10">
    <div className="grid grid-cols-5 h-full">
      {TABS.map(tab => (
        <ProfileBottomNavItem 
          key={tab.name}
          icon={tab.icon}
          label={tab.name}
          active={activeTab === tab.name}
          onClick={() => onTabClick(tab.name)}
        />
      ))}
    </div>
  </nav>
);


export const ProfilePage: React.FC<ProfilePageProps> = ({ allVideos, onSelectVideo, onGoBack }) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('Home');
  const [sortOrder, setSortOrder] = useState<'Latest' | 'Popular'>('Latest');
  
  const channelData = useMemo(() => {
    const ownVideos = allVideos.filter(v => v.channelName === CURRENT_USER_CHANNEL_NAME);
    const popularVideo = [...ownVideos].sort((a,b) => b.viewCount - a.viewCount)[0];
    const latestVideos = [...ownVideos].sort((a,b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    const firstVideo = latestVideos[latestVideos.length - 1];

    return {
        ownVideos,
        popularVideo,
        latestVideos,
        followerCount: 1250000,
        videoCount: ownVideos.length,
        joinDate: firstVideo ? new Date(firstVideo.uploadDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'}) : 'N/A',
        totalViews: allVideos.reduce((acc, v) => v.channelName === CURRENT_USER_CHANNEL_NAME ? acc + v.viewCount : acc, 0)
    }
  }, [allVideos]);

  const sortedUploadedVideos = useMemo(() => {
    if (sortOrder === 'Popular') {
        return [...channelData.ownVideos].sort((a, b) => b.viewCount - a.viewCount);
    }
    return channelData.latestVideos;
  }, [channelData.ownVideos, channelData.latestVideos, sortOrder]);

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return (
            <div className="animate-fade-in">
                {channelData.popularVideo && (
                    <section className="py-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">For you</h2>
                        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                            <div className="md:w-1/2 flex-shrink-0">
                                <VideoCard video={channelData.popularVideo} onSelectVideo={onSelectVideo} />
                            </div>
                            <div className="md:w-1/2">
                                <p className="text-sm text-slate-500">{formatTimeAgo(channelData.popularVideo.uploadDate)}</p>
                                <h3 className="text-2xl font-bold text-slate-900 mt-2">{channelData.popularVideo.title}</h3>
                                <p className="text-slate-600 mt-3 line-clamp-4">{channelData.popularVideo.description}</p>
                            </div>
                        </div>
                    </section>
                )}
                <HorizontalSection title="Uploads">
                    {channelData.latestVideos.slice(0, 10).map(video => (
                        <div key={video.id} className="w-64 flex-shrink-0">
                            <VideoCard video={video} onSelectVideo={onSelectVideo} />
                        </div>
                    ))}
                </HorizontalSection>
                 <HorizontalSection title="Created Playlists">
                    {MOCK_PLAYLISTS.slice(0, 10).map(playlist => (
                        <div key={playlist.id} className="w-64 flex-shrink-0">
                            <PlaylistCard playlist={playlist} />
                        </div>
                    ))}
                </HorizontalSection>
            </div>
        );
      case 'Videos':
        return (
            <div className="animate-fade-in">
                <div className="flex justify-end mb-4">
                    <div className="relative">
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as 'Latest' | 'Popular')}
                            className="appearance-none cursor-pointer bg-slate-200 text-slate-800 font-semibold rounded-lg pl-4 pr-10 py-2 hover:bg-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                            <option value="Latest">Sort by: Latest</option>
                            <option value="Popular">Sort by: Popular</option>
                        </select>
                        <ChevronDownIcon className="w-5 h-5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
                    {sortedUploadedVideos.map((video, index) => (
                        <div key={video.id} className="video-card-enter" style={{ animationDelay: `${index * 30}ms` }}>
                            <VideoCard video={video} onSelectVideo={onSelectVideo} />
                        </div>
                    ))}
                </div>
            </div>
        );
      case 'Playlists':
         return (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8 animate-fade-in">
                {MOCK_PLAYLISTS.map((playlist, index) => (
                    <div key={playlist.id} className="video-card-enter" style={{ animationDelay: `${index * 30}ms` }}>
                        <PlaylistCard playlist={playlist} />
                    </div>
                ))}
            </div>
         );
      case 'Following':
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 animate-fade-in">
                {MOCK_FOLLOWED_CHANNELS.map(channel => <ChannelCard key={channel.name} channel={channel} />)}
            </div>
        );
      case 'About':
        return (
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm animate-fade-in grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Description</h3>
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                      Master React Hooks with this comprehensive guide. We cover useState, useEffect, useContext, useReducer, and custom hooks with practical examples and best practices for building modern, efficient React applications.
                      {"\n\n"}
                      Join us for live coding sessions, deep dives into modern web technologies, and tutorials that will level up your coding skills.
                    </p>
                </div>
                <div>
                     <h3 className="text-xl font-bold text-slate-900 mb-3">Stats</h3>
                     <div className="space-y-3 text-slate-600 border-t border-slate-200 pt-3">
                        <p>Joined {channelData.joinDate}</p>
                        <p>{formatCompactNumber(channelData.totalViews)} views</p>
                    </div>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  if (allVideos.length === 0) {
      return (
        <div className="flex justify-center items-center h-full">
            <SpinnerIcon className="w-12 h-12 text-amber-500 animate-spin" />
        </div>
      )
  }

  return (
    <div className="bg-slate-50 min-h-full pb-16 sm:pb-0">
        <header className="relative bg-white pb-6">
            <div className="h-32 sm:h-48 md:h-64 bg-slate-200 relative">
                <img 
                    src="https://picsum.photos/seed/banner/1500/400" 
                    alt="Channel banner"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                
                <button 
                    onClick={onGoBack} 
                    className="absolute top-4 left-4 z-10 p-2 bg-black/40 rounded-full text-white hover:bg-black/60 transition-colors"
                    aria-label="Go back"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <button 
                    className="absolute top-4 right-4 z-10 p-2 bg-black/40 rounded-full text-white hover:bg-black/60 transition-colors"
                    aria-label="Share channel"
                >
                    <ShareIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20">
                    <div className="flex-shrink-0">
                        <img
                            src="https://picsum.photos/seed/ch2/128/128"
                            alt="Channel Avatar"
                            className="h-28 w-28 sm:h-40 sm:w-40 rounded-full ring-4 ring-white shadow-lg bg-slate-300"
                        />
                    </div>
                    <div className="flex-grow sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{CURRENT_USER_CHANNEL_NAME}</h1>
                        <div className="flex items-center justify-center sm:justify-start flex-wrap gap-x-4 gap-y-1 text-slate-500 mt-2">
                            <span>@codemasters</span>
                            <span className="hidden sm:inline">&middot;</span>
                            <span>{formatCompactNumber(channelData.followerCount)} subscribers</span>
                            <span className="hidden sm:inline">&middot;</span>
                            <span>{channelData.videoCount} videos</span>
                        </div>
                    </div>
                    <div className="flex-shrink-0 mt-4 sm:pb-2 w-full sm:w-auto">
                        <button className="flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-3 text-base font-semibold rounded-full transition-colors bg-slate-100 text-slate-800 hover:bg-slate-200">
                            <UserCogIcon className="w-5 h-5"/>
                            Manage
                        </button>
                    </div>
                </div>
            </div>
        </header>
       <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-slate-200">
          <nav className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
              <div className="category-scroll hidden sm:flex items-center overflow-x-auto gap-2" role="tablist">
                  {TABS.map(tab => (
                    <TabButton 
                        key={tab.name}
                        label={tab.name}
                        icon={tab.icon}
                        isActive={activeTab === tab.name} 
                        onClick={() => setActiveTab(tab.name)} 
                    />
                  ))}
              </div>
          </nav>
       </div>
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {renderContent()}
      </main>
      <ProfileBottomNav activeTab={activeTab} onTabClick={setActiveTab} />
    </div>
  );
};