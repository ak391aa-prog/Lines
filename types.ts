export interface Comment {
  id: string;
  authorId: string; // New: To identify the author for actions like edit/delete
  author: string;
  avatarUrl: string;
  text: string;
  timestamp: string;
  date: string;
  likes: number;
  replies: Comment[];
}

export type NotificationLevel = 'all' | 'personalized' | 'none';

export interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  channelName: string;
  channelAvatarUrl: string;
  views: string;
  viewCount: number;
  uploadedAt: string;
  uploadDate: string; // New: For accurate sorting
  duration: string;
  description: string;
  comments: Comment[];
  likes: number;
  dislikes: number;
  followers: number;
  category: string;
  badge?: 'live' | '4k';
  rank?: number;
  countryCode?: string;
  tags?: string[];
  visibility?: 'public' | 'unlisted' | 'private';
  isMadeForKids?: boolean;
}

export interface FollowedChannel {
  name: string;
  handle: string;
  avatarUrl: string;
  subscriberCount: number;
  isLive?: boolean;
  notificationLevel?: NotificationLevel;
}

export interface Playlist {
  id: string;
  name: string;
  videoIds: Set<string>;
  thumbnailUrl: string;
  videoCount: number;
}

export type Page = 'home' | 'shorts' | 'trending' | 'following' | 'library' | 'notifications' | 'video' | 'search' | 'profile' | 'settings';

// --- NEW --- Unified Search Suggestion Types
export type SuggestionType = 'video' | 'channel' | 'keyword' | 'query';

export interface BaseSuggestion {
  type: SuggestionType;
}

export interface VideoSuggestion extends BaseSuggestion {
  type: 'video';
  video: Video;
}

export interface ChannelSuggestion extends BaseSuggestion {
  type: 'channel';
  channel: FollowedChannel;
}

export interface KeywordSuggestion extends BaseSuggestion {
  type: 'keyword';
  keyword: string;
}

export interface QuerySuggestion extends BaseSuggestion {
  type: 'query';
  query: string;
}

export type Suggestion = VideoSuggestion | ChannelSuggestion | KeywordSuggestion | QuerySuggestion;