import React from 'react';
import { Video } from '../types';
import { LazyImage } from './LazyImage';
import { RankingBadge } from './RankingBadge';

interface RecommendedVideosProps {
  videos: Video[];
  onSelectVideo: (video: Video) => void;
  isAutoplayEnabled: boolean;
  onToggleAutoplay: () => void;
  nextVideoId?: string;
  showCountdown: boolean;
  countdown: number;
  remainingTime: number;
}

const RecommendedVideoCardComponent: React.FC<{ 
  video: Video; 
  onSelectVideo: (video: Video) => void;
  isNextUp: boolean;
  showCountdown: boolean;
  countdown: number;
  remainingTime: number;
}> = ({ video, onSelectVideo, isNextUp, showCountdown, countdown, remainingTime }) => {
    
    const isCountingDown = isNextUp && showCountdown;

    return (
        <button 
        type="button" 
        className={`flex gap-3 group text-left w-full p-1.5 rounded-lg transition-all duration-300 transform ${isCountingDown ? 'bg-amber-50 border border-amber-400 shadow-lg shadow-amber-500/20 scale-105' : 'hover:bg-slate-100'}`} 
        onClick={() => onSelectVideo(video)} 
        aria-label={`Watch ${video.title}`}
        >
            <div className="w-40 flex-shrink-0 relative">
                <RankingBadge rank={video.rank} countryCode={video.countryCode} />
                <LazyImage src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105" />
                <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1.5 py-0.5 rounded">{video.duration}</span>
                {isCountingDown && (
                    <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center rounded-lg animate-fade-in text-white p-2">
                        <p className="font-bold text-xs tracking-widest opacity-90">UP NEXT</p>
                        <div className="relative w-14 h-14 mt-1.5">
                            <svg className="absolute inset-0" viewBox="0 0 44 44">
                                <circle
                                    cx="22" cy="22" r="20"
                                    className="stroke-current text-white/20"
                                    strokeWidth="2"
                                    fill="transparent"
                                />
                                <circle
                                    cx="22" cy="22" r="20"
                                    className="stroke-current text-white transform -rotate-90 origin-center"
                                    strokeWidth="3"
                                    fill="transparent"
                                    strokeDasharray={2 * Math.PI * 20}
                                    style={{
                                        strokeDashoffset: (2 * Math.PI * 20) * (1 - Math.max(0, remainingTime / 5)),
                                        transition: 'stroke-dashoffset 0.1s linear',
                                    }}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center font-bold text-xl tracking-tighter" style={{fontVariantNumeric: 'tabular-nums'}}>
                                {countdown}
                            </span>
                        </div>
                    </div>
                )}
            </div>
            <div>
                <h4 className={`text-sm font-semibold text-slate-800 line-clamp-2 leading-snug ${isCountingDown ? 'text-amber-700' : ''}`}>{video.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{video.channelName}</p>
                <div className="text-xs text-slate-500">
                    <span>{video.viewCount.toLocaleString()} views</span>
                </div>
            </div>
        </button>
    );
};

const RecommendedVideoCard = React.memo(RecommendedVideoCardComponent);


export const RecommendedVideos: React.FC<RecommendedVideosProps> = ({ videos, onSelectVideo, isAutoplayEnabled, onToggleAutoplay, nextVideoId, showCountdown, countdown, remainingTime }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-2 px-1.5">
          <h2 className="text-xl font-bold text-slate-900">Up Next</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">Autoplay</span>
            <button
                onClick={onToggleAutoplay}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                    isAutoplayEnabled ? 'bg-slate-800' : 'bg-slate-300'
                }`}
                aria-pressed={isAutoplayEnabled}
            >
                <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isAutoplayEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
                />
            </button>
          </div>
      </div>
      <div className="flex flex-col gap-2">
        {videos.map(video => (
          <RecommendedVideoCard 
            key={video.id} 
            video={video} 
            onSelectVideo={onSelectVideo} 
            isNextUp={video.id === nextVideoId}
            showCountdown={showCountdown}
            countdown={countdown}
            remainingTime={remainingTime}
          />
        ))}
      </div>
    </div>
  );
};