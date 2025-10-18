import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Video, Playlist } from '../types';
import { RecommendedVideos } from './RecommendedVideos';
import { CommentSection } from './CommentSection';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { LikeIcon } from './icons/LikeIcon';
import { DislikeIcon } from './icons/DislikeIcon';
import { ShareIcon } from './icons/ShareIcon';
import { SaveIcon } from './icons/SaveIcon';
import { EyeIcon } from './icons/EyeIcon';
import { ClockIcon } from './icons/ClockIcon';
import { ShareModal } from './ShareModal';
import { SavePlaylistMenu } from './SavePlaylistMenu';
import { formatTimeAgo } from '../utils/timeUtils';
import { CURRENT_USER_CHANNEL_NAME } from '../services/videoService';

// Video Player related imports
import { PlayPauseIcon } from './icons/PlayPauseIcon';
import { VolumeIcon } from './icons/VolumeIcon';
import { MuteIcon } from './icons/MuteIcon';
import { FullScreenIcon } from './icons/FullScreenIcon';
import { ExitFullScreenIcon } from './icons/ExitFullScreenIcon';
import { CogIcon } from './icons/CogIcon';
import { NextIcon } from './icons/NextIcon';
import { PreviousIcon } from './icons/PreviousIcon';
import { SubtitlesIcon } from './icons/SubtitlesIcon';
import { AnimatedCount } from './AnimatedCount';
import { KebabMenuIcon } from './icons/KebabMenuIcon';
import { MiniplayerIcon } from './icons/MiniplayerIcon';
import { TheaterModeIcon } from './icons/TheaterModeIcon';
import { ExitTheaterModeIcon } from './icons/ExitTheaterModeIcon';
import { StarIcon } from './icons/StarIcon';
import { EditIcon } from './icons/EditIcon';


interface VideoPlayerPageProps {
  video: Video;
  allVideos: Video[];
  onSelectVideo: (video: Video) => void;
  onGoBack: () => void;
}

const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
};

const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '00:00';
    const date = new Date(0);
    date.setSeconds(seconds);
    const timeString = date.toISOString().substr(11, 8);
    // Don't show hours if video is less than an hour
    if (timeString.startsWith('00:')) {
        return timeString.substr(3);
    }
    return timeString;
};

const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export const VideoPlayerPage: React.FC<VideoPlayerPageProps> = ({ video, allVideos, onSelectVideo, onGoBack }) => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [likeCount, setLikeCount] = useState(video.likes);
    const [showFullDescription, setShowFullDescription] = useState(false);

    const [likeAnimation, setLikeAnimation] = useState(false);
    const [dislikeAnimation, setDislikeAnimation] = useState(false);
    
    const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(true);
    const [showCountdown, setShowCountdown] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const countdownIntervalRef = useRef<number | undefined>();
    const videoEndedTimeoutRef = useRef<number | undefined>();

    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    
    const [isSaveMenuOpen, setIsSaveMenuOpen] = useState(false);
    const [playlists, setPlaylists] = useState<Playlist[]>([
        { id: 'pl-1', name: 'Watch Later', videoIds: new Set(['2']), thumbnailUrl: 'https://picsum.photos/seed/pl-watch-later/400/225', videoCount: 1 },
        { id: 'pl-2', name: 'Favorites', videoIds: new Set(), thumbnailUrl: 'https://picsum.photos/seed/pl-favs/400/225', videoCount: 0 },
        { id: 'pl-3', name: 'React Tutorials', videoIds: new Set(['2']), thumbnailUrl: 'https://picsum.photos/seed/pl-react/400/225', videoCount: 1 },
    ]);
    const isSaved = useMemo(() => playlists.some(p => p.videoIds.has(video.id)), [playlists, video.id]);

    const handleTogglePlaylist = (playlistId: string) => {
        setPlaylists(prev => prev.map(p => {
            if (p.id === playlistId) {
                const newVideoIds = new Set(p.videoIds);
                if (newVideoIds.has(video.id)) {
                    newVideoIds.delete(video.id);
                } else {
                    newVideoIds.add(video.id);
                }
                return { ...p, videoIds: newVideoIds, videoCount: newVideoIds.size };
            }
            return p;
        }));
    };
    
    // Video player state
    const videoRef = useRef<HTMLVideoElement>(null);
    const previewVideoRef = useRef<HTMLVideoElement>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const timelineContainerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [buffered, setBuffered] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef<number | null>(null);
    const [videoEnded, setVideoEnded] = useState(false);
    const [isVolumeSliderVisible, setIsVolumeSliderVisible] = useState(false);
    const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [isFullScreen, setIsFullScreen] = useState(!!document.fullscreenElement);

    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [previewTime, setPreviewTime] = useState(0);
    const [previewPosition, setPreviewPosition] = useState(0);
    const [isTheaterMode, setIsTheaterMode] = useState(false);

    const isOwnVideo = video.channelName === CURRENT_USER_CHANNEL_NAME;

    const recommendedVideos = useMemo(() => {
        return allVideos
            .filter(v => v.id !== video.id)
            .slice(0, 15);
    }, [allVideos, video.id]);
    
    const currentVideoIndex = useMemo(() => allVideos.findIndex(v => v.id === video.id), [allVideos, video.id]);
    const nextVideo = useMemo(() => currentVideoIndex !== -1 && currentVideoIndex < allVideos.length - 1 ? allVideos[currentVideoIndex + 1] : null, [allVideos, currentVideoIndex]);
    const previousVideo = useMemo(() => currentVideoIndex > 0 ? allVideos[currentVideoIndex - 1] : null, [allVideos, currentVideoIndex]);

    const remainingTimeForCountdown = countdown;

    const startCountdown = useCallback(() => {
        if (!isAutoplayEnabled || !nextVideo) return;
        
        setShowCountdown(true);
        setCountdown(5);
        
        countdownIntervalRef.current = window.setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownIntervalRef.current!);
                    // FIX: Pass nextVideo to onSelectVideo and ensure it's not null.
                    if (nextVideo) {
                        onSelectVideo(nextVideo);
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

    }, [isAutoplayEnabled, nextVideo, onSelectVideo]);


    const handleVideoEnded = useCallback(() => {
        setVideoEnded(true);
        setIsPlaying(false);
        if (isAutoplayEnabled && nextVideo) {
             videoEndedTimeoutRef.current = window.setTimeout(startCountdown, 2000);
        }
    }, [isAutoplayEnabled, nextVideo, startCountdown]);
    
    const handleReplay = useCallback(() => {
        if (videoRef.current) {
            setVideoEnded(false);
            videoRef.current.currentTime = 0;
            videoRef.current.play();
            setIsPlaying(true);
            setShowCountdown(false);
            if(countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            if(videoEndedTimeoutRef.current) clearTimeout(videoEndedTimeoutRef.current);
        }
    }, []);
    
    const handlePlayPause = useCallback(() => {
        if (videoRef.current) {
            if (videoEnded) {
                handleReplay();
                return;
            }
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    }, [videoEnded, handleReplay]);
    
    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
        setCurrentTime(videoRef.current.currentTime);
        
        if (videoRef.current.buffered.length > 0) {
            const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
            setBuffered((bufferedEnd / videoRef.current.duration) * 100);
        }
    };
    
    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (videoRef.current && timelineContainerRef.current) {
            const timeline = timelineContainerRef.current;
            const rect = timeline.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            videoRef.current.currentTime = pos * duration;
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            videoRef.current.muted = newVolume === 0;
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            const newMutedState = !isMuted;
            videoRef.current.muted = newMutedState;
            setIsMuted(newMutedState);
            if (!newMutedState && volume === 0) {
                setVolume(0.5); 
                videoRef.current.volume = 0.5;
            } else if (newMutedState) {
                setVolume(0);
            }
        }
    };
    
    const toggleFullScreen = () => {
        if (!playerContainerRef.current) return;
        if (!document.fullscreenElement) {
            playerContainerRef.current.requestFullscreen().catch(err => console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`));
        } else {
            document.exitFullscreen();
        }
    };

    const togglePictureInPicture = async () => {
        if (!videoRef.current) return;
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        } else if (document.pictureInPictureEnabled) {
            await videoRef.current.requestPictureInPicture();
        }
    };

    const changePlaybackSpeed = (speed: number) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = speed;
            setPlaybackSpeed(speed);
            setIsSettingsMenuOpen(false);
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        if (isPlaying) {
            controlsTimeoutRef.current = window.setTimeout(() => {
                setShowControls(false);
                setIsVolumeSliderVisible(false);
                setIsSettingsMenuOpen(false);
            }, 3000);
        }
    };

    const handleTimelineHover = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!previewVideoRef.current || !timelineContainerRef.current || !previewCanvasRef.current) return;
        
        const rect = e.currentTarget.getBoundingClientRect();
        const hoverX = e.clientX - rect.left;
        const percentage = hoverX / rect.width;
        const time = duration * percentage;

        setPreviewTime(time);
        
        const previewWidth = 160;
        const newPosition = Math.max(0, Math.min(hoverX - previewWidth / 2, rect.width - previewWidth));
        setPreviewPosition(newPosition);

        if (!isPreviewVisible) setIsPreviewVisible(true);
        
        if (Math.abs(time - previewVideoRef.current.currentTime) > 0.5) {
             previewVideoRef.current.currentTime = time;
        }
    };
    
    const drawPreviewFrame = () => {
        if (previewVideoRef.current && previewCanvasRef.current) {
            const canvas = previewCanvasRef.current;
            const video = previewVideoRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }
        }
    };
    
    const handleLike = () => {
        if (isLiked) {
            setIsLiked(false);
            setLikeCount(prev => prev - 1);
        } else {
            setIsLiked(true);
            setLikeCount(prev => prev + 1);
            if (isDisliked) setIsDisliked(false);
            setLikeAnimation(true);
        }
    };

    const handleDislike = () => {
        if (isDisliked) {
            setIsDisliked(false);
        } else {
            setIsDisliked(true);
            if (isLiked) {
                setIsLiked(false);
                setLikeCount(prev => prev - 1);
            }
            setDislikeAnimation(true);
        }
    };

    const handlePreviousVideo = () => previousVideo && onSelectVideo(previousVideo);
    const handleNextVideo = () => nextVideo && onSelectVideo(nextVideo);

     const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const activeElement = document.activeElement;
        const isTyping = activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement;
        if (isTyping) return;

        switch(e.key.toLowerCase()) {
            case ' ': case 'k': e.preventDefault(); handlePlayPause(); break;
            case 'f': e.preventDefault(); toggleFullScreen(); break;
            case 't': e.preventDefault(); setIsTheaterMode(p => !p); break;
            case 'i': e.preventDefault(); togglePictureInPicture(); break;
            case 'm': e.preventDefault(); toggleMute(); break;
            case 'arrowleft': case 'j': e.preventDefault(); if (videoRef.current) videoRef.current.currentTime -= 10; break;
            case 'arrowright': case 'l': e.preventDefault(); if (videoRef.current) videoRef.current.currentTime += 10; break;
            case 'n': e.preventDefault(); handleNextVideo(); break;
            case 'p': e.preventDefault(); handlePreviousVideo(); break;
        }
    }, [handlePlayPause, handleNextVideo, handlePreviousVideo]);

     useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
    
    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.addEventListener('ended', handleVideoEnded);
            videoElement.addEventListener('timeupdate', handleTimeUpdate);
            videoElement.addEventListener('progress', handleTimeUpdate);
            videoElement.addEventListener('loadedmetadata', () => setDuration(videoElement.duration));
            
            videoElement.play().catch(error => {
                console.warn("Autoplay was prevented:", error);
                setIsPlaying(false);
            });
        }

        const previewVideoElement = previewVideoRef.current;
        if (previewVideoElement) {
            previewVideoElement.addEventListener('seeked', drawPreviewFrame);
        }
        
        const handleFullScreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullScreenChange);

        return () => {
            if (videoElement) {
                videoElement.removeEventListener('ended', handleVideoEnded);
                videoElement.removeEventListener('timeupdate', handleTimeUpdate);
                videoElement.removeEventListener('progress', handleTimeUpdate);
            }
            if (previewVideoElement) {
                 previewVideoElement.removeEventListener('seeked', drawPreviewFrame);
            }
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            if (videoEndedTimeoutRef.current) clearTimeout(videoEndedTimeoutRef.current);
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        };
    }, [video.id, handleVideoEnded]);
    
    return (
    <div className={`animate-fade-in ${isTheaterMode ? 'bg-black' : ''}`}>
        <div className={`flex flex-col ${!isTheaterMode ? 'lg:flex-row' : ''} gap-6 ${!isTheaterMode ? 'p-2 sm:p-4 lg:p-6' : ''}`}>
            {/* Main Content */}
            <div className="flex-grow">
                {/* Video Player */}
                <div 
                    ref={playerContainerRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => { 
                        if (isPlaying) setShowControls(false);
                        setIsPreviewVisible(false);
                    }}
                    className={`relative aspect-video w-full bg-black group/player overflow-hidden ${!isTheaterMode ? 'rounded-lg md:rounded-2xl' : ''}`}
                >
                    <video
                        ref={videoRef}
                        src={video.videoUrl}
                        className="w-full h-full"
                        onClick={handlePlayPause}
                        onDoubleClick={toggleFullScreen}
                    />
                    <video ref={previewVideoRef} src={video.videoUrl} muted className="hidden" crossOrigin="anonymous" />
                    
                    <div className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
                    </div>

                    <div className={`absolute top-0 left-0 right-0 p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="flex items-start gap-4">
                             <button
                                onClick={onGoBack}
                                className={`p-2 bg-black/40 rounded-full text-white hover:bg-black/60 transition-colors`}
                                aria-label="Go back"
                            >
                                <ArrowLeftIcon className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-white shadow-black [text-shadow:0_1px_4px_var(--tw-shadow-color)] line-clamp-1">{video.title}</h1>
                                <p className="text-sm text-white/80 shadow-black [text-shadow:0_1px_4px_var(--tw-shadow-color)]">{video.channelName}</p>
                            </div>
                        </div>
                    </div>

                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                            <button
                                onClick={handlePlayPause}
                                className="pointer-events-auto p-4 bg-black/40 rounded-full text-white backdrop-blur-sm transform transition-transform active:scale-90"
                                aria-label={videoEnded ? "Replay" : "Play"}
                            >
                                <PlayPauseIcon isPlaying={false} className="w-12 h-12 animate-fade-in" />
                            </button>
                        </div>
                    )}

                    <div className={`absolute bottom-0 left-0 right-0 z-20 p-2 sm:p-4 transition-all duration-300 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
                        {isPreviewVisible && (
                             <div 
                                className="absolute bottom-16 left-0 w-40 h-auto bg-black border-2 border-white/50 rounded-lg p-1 pointer-events-none animate-fade-in" 
                                style={{ transform: `translateX(${previewPosition}px)` }}
                            >
                               <canvas ref={previewCanvasRef} width="160" height="90" className="rounded-md" />
                               <p className="text-center text-white font-semibold text-sm mt-1">{formatTime(previewTime)}</p>
                            </div>
                        )}
                         <div
                            ref={timelineContainerRef}
                            className="relative w-full h-2 group/timeline cursor-pointer" 
                            onClick={handleSeek}
                            onMouseMove={handleTimelineHover}
                            onMouseLeave={() => setIsPreviewVisible(false)}
                         >
                            <div className="absolute w-full top-1/2 -translate-y-1/2 h-1 bg-white/30 rounded-full transition-all duration-200 group-hover/timeline:h-2">
                                <div className="absolute top-0 left-0 h-full bg-white/50 rounded-full" style={{ width: `${buffered}%` }}></div>
                                <div className="absolute top-0 left-0 h-full bg-red-600 rounded-full" style={{ width: `${progress}%` }}></div>
                                <div 
                                    className="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-red-600 rounded-full opacity-0 group-hover/timeline:opacity-100 transition-opacity" 
                                    style={{ left: `calc(${progress}% - 0.5rem)` }}
                                ></div>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-white mt-2">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <button onClick={handlePreviousVideo} disabled={!previousVideo} className="disabled:opacity-50"><PreviousIcon className="w-7 h-7" /></button>
                                <button onClick={handlePlayPause}><PlayPauseIcon isPlaying={isPlaying} className="w-8 h-8" /></button>
                                <button onClick={handleNextVideo} disabled={!nextVideo} className="disabled:opacity-50"><NextIcon className="w-7 h-7" /></button>
                                <div className="relative flex items-center group/volume" onMouseLeave={() => setIsVolumeSliderVisible(false)}>
                                    <button onClick={toggleMute} onMouseEnter={() => setIsVolumeSliderVisible(true)}>
                                        {isMuted || volume === 0 ? <MuteIcon className="w-6 h-6" /> : <VolumeIcon className="w-6 h-6" />}
                                    </button>
                                    <div className={`w-24 ml-2 transition-all duration-300 ${isVolumeSliderVisible || 'sm:w-0 sm:opacity-0 sm:group-hover/volume:w-24 sm:group-hover/volume:opacity-100'}`}>
                                        <div className="h-1 bg-white/40 rounded-full relative">
                                            <div className="absolute h-full bg-white rounded-full" style={{width: `${isMuted ? 0 : volume * 100}%`}}></div>
                                            <input type="range" min="0" max="1" step="0.05" value={volume} onChange={handleVolumeChange} className="video-range-slider absolute inset-0 w-full h-full opacity-0" />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm font-mono" style={{fontVariantNumeric: 'tabular-nums'}}>
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-4">
                                <button><SubtitlesIcon className="w-6 h-6" /></button>
                                <div className="relative">
                                    <button onClick={() => setIsSettingsMenuOpen(p => !p)}><CogIcon className="w-6 h-6" /></button>
                                    {isSettingsMenuOpen && (
                                        <div className="absolute bottom-full right-0 mb-2 bg-black/70 backdrop-blur-md rounded-lg p-2 space-y-1 w-40 animate-menu-pop-in">
                                            <div className="px-2 py-1 text-sm font-semibold">Speed</div>
                                            {PLAYBACK_SPEEDS.map(speed => (
                                                <button key={speed} onClick={() => changePlaybackSpeed(speed)} className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${playbackSpeed === speed ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                                                    {speed === 1 ? 'Normal' : `${speed}x`}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => setIsTheaterMode(p => !p)} className="hidden md:flex" aria-label={isTheaterMode ? 'Exit theater mode' : 'Theater mode'}>
                                    {isTheaterMode ? <ExitTheaterModeIcon className="w-6 h-6" /> : <TheaterModeIcon className="w-6 h-6" />}
                                </button>
                                <button onClick={toggleFullScreen} aria-label={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}>
                                    {isFullScreen ? <ExitFullScreenIcon className="w-6 h-6" /> : <FullScreenIcon className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className={`${isTheaterMode ? 'p-4 max-w-4xl mx-auto' : ''}`}>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-4 leading-tight">{video.title}</h1>
                    <div className="flex items-center gap-4 text-slate-500 mt-2">
                        <div className="flex items-center gap-1.5">
                            <EyeIcon className="w-5 h-5"/>
                            <span>{formatViews(video.viewCount)} views</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <ClockIcon className="w-5 h-5" />
                            <span>{formatTimeAgo(video.uploadDate)}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 mt-4 py-4 border-y border-slate-200">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <img src={video.channelAvatarUrl} alt={video.channelName} className="w-12 h-12 rounded-full" />
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">{video.channelName}</h2>
                                    <p className="text-slate-500">{video.followers.toLocaleString()} followers</p>
                                </div>
                            </div>
                            {isOwnVideo ? (
                                <div className="flex-shrink-0 flex items-center justify-end w-full sm:w-auto">
                                    <button className="flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-3 text-base font-semibold rounded-full transition-colors bg-slate-100 text-slate-800 hover:bg-slate-200">
                                        <EditIcon className="w-5 h-5"/>
                                        Manage Video
                                    </button>
                                </div>
                            ) : (
                                <div className="flex-shrink-0 flex items-center gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={() => console.log('Join button clicked!')}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 text-base font-bold rounded-full transition-colors border-2 border-slate-700 text-slate-800 hover:bg-slate-100 flex-1 sm:flex-initial"
                                    >
                                        <StarIcon className="w-5 h-5" />
                                        Join
                                    </button>
                                    <button onClick={() => setIsSubscribed(!isSubscribed)} 
                                        className={`px-5 py-2.5 text-base font-bold rounded-full transition-colors flex-1 sm:flex-initial ${isSubscribed ? 'bg-slate-200 text-slate-800' : 'bg-slate-900 text-white hover:bg-black'}`}>
                                        {isSubscribed ? 'Following' : 'Follow'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="category-scroll flex items-center gap-2 pb-2 -mb-2 overflow-x-auto">
                            <div className="flex items-center bg-slate-100 rounded-full flex-shrink-0">
                                <button 
                                    onClick={handleLike}
                                    onAnimationEnd={() => setLikeAnimation(false)}
                                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-l-full hover:bg-slate-200 transition-colors ${isLiked ? 'text-amber-500' : ''}`}
                                >
                                    <LikeIcon active={isLiked} className={`w-6 h-6 ${likeAnimation ? 'animate-like-bounce' : ''}`} />
                                    <span className="font-semibold" style={{fontVariantNumeric: 'tabular-nums'}}>
                                        <AnimatedCount count={likeCount} />
                                    </span>
                                </button>
                                <div className="w-px h-6 bg-slate-300"></div>
                                <button 
                                    onClick={handleDislike}
                                    onAnimationEnd={() => setDislikeAnimation(false)}
                                    className={`px-4 py-2.5 rounded-r-full hover:bg-slate-200 transition-colors ${isDisliked ? 'text-amber-500' : ''}`}
                                >
                                    <DislikeIcon active={isDisliked} className={`w-6 h-6 ${dislikeAnimation ? 'animate-dislike-jiggle' : ''}`} />
                                </button>
                            </div>
                            <button onClick={() => setIsShareModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors flex-shrink-0">
                                <ShareIcon className="w-6 h-6" />
                                <span className="font-semibold">Share</span>
                            </button>
                            <div className="relative">
                                <button onClick={() => setIsSaveMenuOpen(p => !p)} className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors flex-shrink-0">
                                    <SaveIcon isSaved={isSaved} className="w-6 h-6" />
                                    <span className="font-semibold">{isSaved ? 'Saved' : 'Save'}</span>
                                </button>
                                <SavePlaylistMenu 
                                    isOpen={isSaveMenuOpen} 
                                    onClose={() => setIsSaveMenuOpen(false)}
                                    playlists={playlists}
                                    videoId={video.id}
                                    onTogglePlaylist={handleTogglePlaylist}
                                />
                            </div>
                            <button className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors flex-shrink-0">
                                <KebabMenuIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-100 p-4 rounded-xl mt-4">
                        <p className={`text-slate-700 whitespace-pre-wrap ${!showFullDescription && 'line-clamp-3'}`}>
                            {video.description}
                        </p>
                        <button onClick={() => setShowFullDescription(!showFullDescription)} className="text-sm font-semibold text-slate-800 mt-2">
                            {showFullDescription ? 'Show less' : 'Show more'}
                        </button>
                    </div>

                    <CommentSection initialComments={video.comments} />
                </div>
            </div>

            <div className={`flex-shrink-0 ${!isTheaterMode ? 'lg:w-1/3 lg:max-w-md' : 'w-full px-4'}`}>
                <RecommendedVideos 
                    videos={recommendedVideos} 
                    onSelectVideo={onSelectVideo}
                    isAutoplayEnabled={isAutoplayEnabled}
                    onToggleAutoplay={() => setIsAutoplayEnabled(!isAutoplayEnabled)}
                    nextVideoId={nextVideo?.id}
                    showCountdown={showCountdown}
                    countdown={countdown}
                    remainingTime={remainingTimeForCountdown}
                />
            </div>
        </div>
        <ShareModal 
            isOpen={isShareModalOpen} 
            onClose={() => setIsShareModalOpen(false)} 
            videoUrl={video.videoUrl} 
            videoTitle={video.title} 
        />
    </div>
    );
};
