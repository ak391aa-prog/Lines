import React, { useState, useEffect } from 'react';
import { Video } from '../types';
import { backendService } from '../services/backendService';
import { FireIcon } from './icons/FireIcon';
import { MusicNoteIcon } from './icons/MusicNoteIcon';
import { GamingIcon } from './icons/GamingIcon';
import { FilmIcon } from './icons/FilmIcon';
import { TrendingVideoCard } from './TrendingVideoCard';

interface TrendingPageProps {
  onSelectVideo: (video: Video) => void;
}

type TrendingCategory = 'Now' | 'Music' | 'Gaming' | 'Movies';
const TRENDING_CATEGORIES: { name: TrendingCategory, icon: React.ReactElement }[] = [
    { name: 'Now', icon: <FireIcon className="w-5 h-5" /> },
    { name: 'Music', icon: <MusicNoteIcon className="w-5 h-5" /> },
    { name: 'Gaming', icon: <GamingIcon className="w-5 h-5" /> },
    { name: 'Movies', icon: <FilmIcon className="w-5 h-5" /> },
];

const CategoryButton: React.FC<{
  icon: React.ReactElement;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    aria-pressed={isActive}
    className={`px-4 py-2 text-base font-semibold rounded-lg transition-colors flex items-center gap-2 ${
        isActive ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
    }`}
  >
    {icon}
    {label}
  </button>
);

// --- NEW SKELETON COMPONENT ---
const Shimmer: React.FC = () => <div className="absolute inset-0 animate-shimmer"></div>;

const TrendingVideoCardSkeleton: React.FC = () => {
  return (
    <div className="flex gap-4 w-full p-2">
        <div className="flex items-center justify-center w-12 flex-shrink-0">
            <div className="relative overflow-hidden w-8 h-8 bg-slate-200 rounded-md"><Shimmer /></div>
        </div>
        <div className="relative overflow-hidden sm:w-64 md:w-80 flex-shrink-0 bg-slate-200 rounded-lg aspect-video">
            <Shimmer />
        </div>
        <div className="flex flex-col flex-grow pt-1 space-y-3">
            <div className="relative overflow-hidden w-3/4 h-5 bg-slate-200 rounded"><Shimmer /></div>
            <div className="relative overflow-hidden w-1/2 h-4 bg-slate-200 rounded"><Shimmer /></div>
            <div className="relative overflow-hidden w-1/3 h-4 bg-slate-200 rounded"><Shimmer /></div>
            <div className="hidden md:block space-y-2 pt-2">
                <div className="relative overflow-hidden w-full h-3 bg-slate-200 rounded"><Shimmer /></div>
                <div className="relative overflow-hidden w-5/6 h-3 bg-slate-200 rounded"><Shimmer /></div>
            </div>
        </div>
    </div>
  );
};


export const TrendingPage: React.FC<TrendingPageProps> = ({ onSelectVideo }) => {
    const [activeCategory, setActiveCategory] = useState<TrendingCategory>('Now');
    const [location, setLocation] = useState<'Regional' | 'Global'>('Regional');
    const [trendingVideos, setTrendingVideos] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTrendingVideos = async () => {
            setIsLoading(true);
            
            const categoryMap: Record<string, string> = { 
                'Now': 'Trending', 
                'Music': 'Music', 
                'Gaming': 'Gaming', 
                'Movies': 'Technology' 
            };
            const apiCategory = categoryMap[activeCategory] || 'Trending';

            // Simulate a slightly longer network request to make skeleton more visible
            await new Promise(res => setTimeout(res, 300));

            const { videos } = await backendService.getVideos({
                category: apiCategory,
                limit: 20,
                location: location,
            });
            
            setTrendingVideos(videos);
            setIsLoading(false);
        };
        fetchTrendingVideos();
    }, [activeCategory, location]);
    
    return (
        <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
            <header className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-full">
                        <FireIcon className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Trending</h1>
                </div>
                <div className="p-1 bg-slate-200 rounded-lg flex items-center self-start sm:self-center">
                    <button
                        onClick={() => setLocation('Regional')}
                        className={`px-4 py-1.5 text-base font-semibold rounded-md transition-colors ${location === 'Regional' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        Regional
                    </button>
                    <button
                        onClick={() => setLocation('Global')}
                        className={`px-4 py-1.5 text-base font-semibold rounded-md transition-colors ${location === 'Global' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        Global
                    </button>
                </div>
            </header>

            <nav className="flex items-center gap-3 overflow-x-auto py-2 mb-6">
                {TRENDING_CATEGORIES.map(({ name, icon }) => (
                    <CategoryButton
                        key={name}
                        icon={icon}
                        label={name}
                        isActive={activeCategory === name}
                        onClick={() => setActiveCategory(name)}
                    />
                ))}
            </nav>
            
            <main>
                {isLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <TrendingVideoCardSkeleton key={index} />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {trendingVideos.map((video, index) => (
                             <div key={video.id} className="video-card-enter" style={{ animationDelay: `${index * 50}ms` }}>
                                <TrendingVideoCard video={video} rank={index + 1} onSelectVideo={onSelectVideo} location={location} />
                             </div>
                        ))}
                         {trendingVideos.length === 0 && (
                            <div className="text-center py-16 px-4">
                                <h2 className="text-2xl font-bold text-slate-800">No trending videos found</h2>
                                <p className="text-slate-500 mt-2">Check back later for the latest trends.</p>
                            </div>
                         )}
                    </div>
                )}
            </main>
        </div>
    );
};
