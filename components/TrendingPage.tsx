import React, { useState, useEffect } from 'react';
import { Video } from '../types';
import { videoService } from '../services/videoService';
import { FireIcon } from './icons/FireIcon';
import { MusicNoteIcon } from './icons/MusicNoteIcon';
import { GamingIcon } from './icons/GamingIcon';
import { FilmIcon } from './icons/FilmIcon';
import { TrendingVideoCard } from './TrendingVideoCard';
import { SpinnerIcon } from './icons/SpinnerIcon';

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

            const { videos } = await videoService.getVideos({
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
                    <div className="flex justify-center items-center p-10">
                        <SpinnerIcon className="w-10 h-10 text-amber-500 animate-spin" />
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