import { Video, FollowedChannel, Playlist, Suggestion, NotificationLevel } from '../types';
import { allMockVideos, mockChannels as initialMockChannels, CATEGORIES, CURRENT_USER_ID, CURRENT_USER_AVATAR, CURRENT_USER_NAME } from '../data/mockData';

const LS_KEYS = {
    PLAYLISTS: 'lines-app-playlists',
    LIKED_VIDEOS: 'lines-app-liked-videos',
    DISLIKED_VIDEOS: 'lines-app-disliked-videos',
    FOLLOWED_CHANNELS: 'lines-app-followed-channels',
    WATCH_HISTORY: 'lines-app-watch-history',
};

const MAX_HISTORY_ITEMS = 100;

// --- LocalStorage Helper Functions ---

const readFromLS = <T>(key: string, defaultValue: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        if (!item) return defaultValue;
        
        // Handle Sets serialization
        if (key === LS_KEYS.LIKED_VIDEOS || key === LS_KEYS.DISLIKED_VIDEOS) {
            return new Set(JSON.parse(item)) as T;
        }
        if (key === LS_KEYS.PLAYLISTS) {
            const parsed = JSON.parse(item) as any[];
            return parsed.map(p => ({...p, videoIds: new Set(p.videoIds)})) as T;
        }

        return JSON.parse(item);
    } catch (error) {
        console.error(`Error reading from localStorage key "${key}":`, error);
        return defaultValue;
    }
};

const writeToLS = (key: string, value: any): void => {
    try {
        // Handle Sets serialization
        if (value instanceof Set) {
            value = Array.from(value);
        }
        if (key === LS_KEYS.PLAYLISTS && Array.isArray(value)) {
            value = value.map(p => ({ ...p, videoIds: Array.from(p.videoIds) }));
        }

        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing to localStorage key "${key}":`, error);
    }
};

// --- Service Initialization ---

// Initialize state from localStorage or seed with mock data
let playlists: Playlist[] = readFromLS<Playlist[]>(LS_KEYS.PLAYLISTS, [
    { id: 'pl-1', name: 'Watch Later', videoIds: new Set(['2']), thumbnailUrl: 'https://picsum.photos/seed/pl-watch-later/400/225', videoCount: 1 },
    { id: 'pl-2', name: 'Favorites', videoIds: new Set(), thumbnailUrl: 'https://picsum.photos/seed/pl-favs/400/225', videoCount: 0 },
]);
let likedVideoIds: Set<string> = readFromLS<Set<string>>(LS_KEYS.LIKED_VIDEOS, new Set(['1', '4', '8']));
let dislikedVideoIds: Set<string> = readFromLS<Set<string>>(LS_KEYS.DISLIKED_VIDEOS, new Set());
let followedChannels: FollowedChannel[] = readFromLS<FollowedChannel[]>(LS_KEYS.FOLLOWED_CHANNELS, initialMockChannels.slice(0, 4).map(c => ({...c, notificationLevel: 'all'})));
let watchHistory: string[] = readFromLS<string[]>(LS_KEYS.WATCH_HISTORY, ['8', '1', '4', '5']);

// Create a Map for efficient video lookups by ID
const videoMap = new Map(allMockVideos.map(v => [v.id, v]));


// --- Backend Service Definition ---

interface GetVideosParams {
  page?: number;
  limit?: number;
  category?: string;
  query?: string;
  location?: 'Regional' | 'Global';
}

export const backendService = {
  // --- Video & Search ---
  getVideos: ({ page = 1, limit = 8, category = 'All', query = '', location = 'Global' }: GetVideosParams): Promise<{ videos: Video[], hasMore: boolean }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredVideos;
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime();
        
        const regionalSort = (a: Video, b: Video) => {
            const USER_COUNTRY = 'us'; // Assume user's country is US for mock
            const aIsRecent = new Date(a.uploadDate).getTime() > oneWeekAgo;
            const bIsRecent = new Date(b.uploadDate).getTime() > oneWeekAgo;
            
            const aIsLocal = a.countryCode === USER_COUNTRY;
            const bIsLocal = b.countryCode === USER_COUNTRY;

            const aScore = a.viewCount * (aIsRecent ? 1.5 : 1) * (aIsLocal ? 2 : 1);
            const bScore = b.viewCount * (bIsRecent ? 1.5 : 1) * (bIsLocal ? 2 : 1);
            return bScore - aScore;
        };
        
        const globalSort = (a: Video, b: Video) => b.viewCount - a.viewCount;

        if (category === 'Trending' || category !== 'All') {
          if (category === 'Trending') {
            filteredVideos = [...allMockVideos];
          } else {
            filteredVideos = allMockVideos.filter(video => video.category === category);
          }
          
          const sortFn = location === 'Regional' ? regionalSort : globalSort;
          filteredVideos.sort(sortFn);
          
          if (location === 'Regional') {
            filteredVideos = filteredVideos.map((video, index) => ({
                ...video,
                rank: index + 1,
            }));
          }
        } else {
          filteredVideos = allMockVideos;
        }

        if (query.trim() !== '') {
          const lowercasedQuery = query.toLowerCase();
          filteredVideos = filteredVideos.filter(video =>
            video.title.toLowerCase().includes(lowercasedQuery) ||
            video.description.toLowerCase().includes(lowercasedQuery)
          );
        }

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedVideos = filteredVideos.slice(startIndex, endIndex);

        resolve({
          videos: paginatedVideos,
          hasMore: endIndex < filteredVideos.length
        });
      }, 500);
    });
  },
  getVideoById: (id: string): Promise<Video | undefined> => {
     return new Promise((resolve) => {
      setTimeout(() => {
        resolve(allMockVideos.find(v => v.id === id));
      }, 300);
    });
  },
  getSearchSuggestions: (query: string): Promise<Suggestion[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (query.trim() === '') {
                resolve([]);
                return;
            }
            const lowercasedQuery = query.toLowerCase();
            const suggestions: Suggestion[] = [];
            suggestions.push({ type: 'query', query });
            initialMockChannels
                .filter(channel => channel.name.toLowerCase().includes(lowercasedQuery))
                .slice(0, 2)
                .forEach(channel => suggestions.push({ type: 'channel', channel }));
            CATEGORIES.forEach(cat => {
                if (suggestions.length < 10 && cat.toLowerCase().includes(lowercasedQuery) && cat.toLowerCase() !== lowercasedQuery) {
                    suggestions.push({ type: 'keyword', keyword: cat });
                }
            });
            allMockVideos
                .filter(video => video.title.toLowerCase().includes(lowercasedQuery))
                .sort((a,b) => b.viewCount - a.viewCount)
                .slice(0, 4)
                .forEach(video => {
                    if (suggestions.length < 10) {
                        suggestions.push({ type: 'video', video })
                    }
                });
            resolve(suggestions.slice(0, 8));
        }, 200);
    });
  },
  addVideo: (videoData: Omit<Video, 'id'>): Video => {
    const now = new Date();
    const newVideo: Video = {
        id: `video-${Date.now()}`,
        channelName: CURRENT_USER_CHANNEL_NAME,
        channelAvatarUrl: 'https://picsum.photos/seed/ch2/48/48', // Current user's channel avatar
        views: '0',
        viewCount: 0,
        uploadedAt: 'just now',
        uploadDate: now.toISOString(),
        comments: [],
        likes: 0,
        dislikes: 0,
        followers: 1250000,
        ...videoData,
    };
    allMockVideos.unshift(newVideo);
    videoMap.set(newVideo.id, newVideo);
    return newVideo;
  },

  // --- Likes / Dislikes ---
  getLikedVideoIds: (): Set<string> => {
    return likedVideoIds;
  },
  getDislikedVideoIds: (): Set<string> => {
    return dislikedVideoIds;
  },
  toggleLike: (videoId: string): void => {
    if (likedVideoIds.has(videoId)) {
      likedVideoIds.delete(videoId);
    } else {
      likedVideoIds.add(videoId);
      dislikedVideoIds.delete(videoId); // A video cannot be both liked and disliked
    }
    writeToLS(LS_KEYS.LIKED_VIDEOS, likedVideoIds);
    writeToLS(LS_KEYS.DISLIKED_VIDEOS, dislikedVideoIds);
  },
  toggleDislike: (videoId: string): void => {
    if (dislikedVideoIds.has(videoId)) {
      dislikedVideoIds.delete(videoId);
    } else {
      dislikedVideoIds.add(videoId);
      likedVideoIds.delete(videoId); // A video cannot be both liked and disliked
    }
    writeToLS(LS_KEYS.DISLIKED_VIDEOS, dislikedVideoIds);
    writeToLS(LS_KEYS.LIKED_VIDEOS, likedVideoIds);
  },

  // --- Playlists ---
  getPlaylists: (): Playlist[] => {
    // Update video counts and thumbnails before returning
    return playlists.map(p => {
        const firstVideoId = p.videoIds.values().next().value;
        const firstVideo = videoMap.get(firstVideoId);
        return {
            ...p,
            videoCount: p.videoIds.size,
            thumbnailUrl: firstVideo ? firstVideo.thumbnailUrl : p.thumbnailUrl,
        }
    });
  },
  createPlaylist: (name: string, videoIdToAdd?: string): void => {
    const newPlaylist: Playlist = {
        id: `pl-${Date.now()}`,
        name,
        videoIds: new Set(videoIdToAdd ? [videoIdToAdd] : []),
        thumbnailUrl: 'https://picsum.photos/seed/newpl/400/225',
        videoCount: videoIdToAdd ? 1 : 0,
    };
    playlists.push(newPlaylist);
    writeToLS(LS_KEYS.PLAYLISTS, playlists);
  },
  toggleVideoInPlaylist: (playlistId: string, videoId: string): void => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist) {
        if (playlist.videoIds.has(videoId)) {
            playlist.videoIds.delete(videoId);
        } else {
            playlist.videoIds.add(videoId);
        }
        writeToLS(LS_KEYS.PLAYLISTS, playlists);
    }
  },

  // --- History ---
  addToWatchHistory: (videoId: string): void => {
    // Remove if it exists to move it to the front
    const existingIndex = watchHistory.indexOf(videoId);
    if (existingIndex > -1) {
        watchHistory.splice(existingIndex, 1);
    }
    // Add to the front
    watchHistory.unshift(videoId);
    // Trim history to max length
    if (watchHistory.length > MAX_HISTORY_ITEMS) {
        watchHistory.length = MAX_HISTORY_ITEMS;
    }
    writeToLS(LS_KEYS.WATCH_HISTORY, watchHistory);
  },
  getWatchHistory: (): Video[] => {
    const historyWithVideos: Video[] = [];
    watchHistory.forEach(id => {
        const video = videoMap.get(id);
        if (video) {
            historyWithVideos.push(video);
        }
    });
    return historyWithVideos;
  },

  // --- Subscriptions ---
  getFollowedChannels: (): FollowedChannel[] => {
    return followedChannels;
  },
  toggleSubscription: (channelName: string): void => {
    const isFollowed = followedChannels.some(c => c.name === channelName);
    if (isFollowed) {
        followedChannels = followedChannels.filter(c => c.name !== channelName);
    } else {
        const channelToAdd = initialMockChannels.find(c => c.name === channelName);
        if (channelToAdd) {
            followedChannels.push({ ...channelToAdd, notificationLevel: 'all' });
        }
    }
    writeToLS(LS_KEYS.FOLLOWED_CHANNELS, followedChannels);
  },
};