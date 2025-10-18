import { Video, FollowedChannel, Suggestion } from '../types';

const now = new Date();

// The current user's ID, matching the main avatar in the app
export const CURRENT_USER_ID = 'current-user';
export const CURRENT_USER_AVATAR = 'https://picsum.photos/seed/user-avatar/40/40';
export const CURRENT_USER_NAME = 'John Doe';
export const CURRENT_USER_CHANNEL_NAME = 'CodeMasters';


const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Exploring the Alps: A 4K Drone Film',
    thumbnailUrl: 'https://picsum.photos/seed/alps/640/360',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channelName: 'Nature Explorers',
    channelAvatarUrl: 'https://picsum.photos/seed/ch1/48/48',
    views: '1.2M',
    viewCount: 1200000,
    uploadedAt: '3 weeks ago',
    uploadDate: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    duration: '15:45',
    description: 'Join us on an epic journey through the breathtaking landscapes of the Swiss Alps. Filmed entirely in 4K with state-of-the-art drones, this film captures the majestic beauty of the mountains like never before. From serene lakes to towering peaks, experience the Alps from a new perspective.',
    comments: [
      { 
        id: 'c1', 
        authorId: 'user1',
        author: 'Travel Bug', 
        avatarUrl: 'https://picsum.photos/seed/user1/40/40', 
        text: 'Absolutely stunning cinematography!', 
        timestamp: '2 weeks ago',
        date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        likes: 243,
        replies: [
          {
            id: 'c1-r1',
            authorId: 'ch1',
            author: 'Nature Explorers',
            avatarUrl: 'https://picsum.photos/seed/ch1/48/48',
            text: 'Thank you! We really appreciate the feedback.',
            timestamp: '2 weeks ago',
            date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000 + 1000).toISOString(),
            likes: 45,
            replies: []
          },
          {
            id: 'c1-r2',
            authorId: 'user2',
            author: 'Mountain Man',
            avatarUrl: 'https://picsum.photos/seed/user2/40/40',
            text: 'I agree, the drone shots were breathtaking.',
            timestamp: '1 week ago',
            date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            likes: 18,
            replies: []
          }
        ]
      },
      { 
        id: 'c2', 
        authorId: 'user2',
        author: 'Mountain Man', 
        avatarUrl: 'https://picsum.photos/seed/user2/40/40', 
        text: 'Makes me want to pack my bags and go hiking right now.', 
        timestamp: '1 week ago',
        date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000 + 1000).toISOString(),
        likes: 88,
        replies: []
      },
      {
        id: 'c-current-user-1',
        authorId: CURRENT_USER_ID,
        author: CURRENT_USER_NAME,
        avatarUrl: CURRENT_USER_AVATAR,
        text: "This is a comment from the current user. It should be editable and deletable.",
        timestamp: '3 days ago',
        date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        likes: 15,
        replies: []
      }
    ],
    likes: 120000,
    dislikes: 1500,
    followers: 2300000,
    category: 'Travel',
    badge: '4k',
    rank: 3,
    countryCode: 'ch',
  },
  {
    id: '2',
    title: 'Ultimate Guide to React Hooks in 2024',
    thumbnailUrl: 'https://picsum.photos/seed/react/640/360',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channelName: 'CodeMasters',
    channelAvatarUrl: 'https://picsum.photos/seed/ch2/48/48',
    views: '890K',
    viewCount: 890000,
    uploadedAt: '1 month ago',
    uploadDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    duration: '45:10',
    description: 'Master React Hooks with this comprehensive guide. We cover useState, useEffect, useContext, useReducer, and custom hooks with practical examples and best practices for building modern, efficient React applications.',
    comments: [
       { 
         id: 'c3', 
         authorId: 'user3',
         author: 'DevDude', 
         avatarUrl: 'https://picsum.photos/seed/user3/40/40', 
         text: 'This is the best explanation of hooks I have ever seen.', 
         timestamp: '3 weeks ago',
         date: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(),
         likes: 512,
         replies: []
        },
    ],
    likes: 45000,
    dislikes: 300,
    followers: 1250000,
    category: 'Coding',
    rank: 4,
    countryCode: 'de',
  },
  {
    id: '3',
    title: 'The Art of Minimalist Web Design',
    thumbnailUrl: 'https://picsum.photos/seed/design/640/360',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channelName: 'DesignScapes',
    channelAvatarUrl: 'https://picsum.photos/seed/ch3/48/48',
    views: '540K',
    viewCount: 540000,
    uploadedAt: '2 months ago',
    uploadDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    duration: '22:30',
    description: 'Discover the principles of minimalist web design. Learn how to create beautiful, functional, and user-friendly websites by focusing on simplicity, whitespace, and typography. Less is more!',
    comments: [],
    likes: 23000,
    dislikes: 120,
    followers: 780000,
    category: 'Design',
  },
  {
    id: '4',
    title: 'Cyberpunk City - A Cinematic Journey',
    thumbnailUrl: 'https://picsum.photos/seed/cyberpunk/640/360',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channelName: 'FutureVisions',
    channelAvatarUrl: 'https://picsum.photos/seed/ch4/48/48',
    views: '2.5M',
    viewCount: 2500000,
    uploadedAt: '1 week ago',
    uploadDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    duration: '8:12',
    description: 'Immerse yourself in a dystopian future with this cinematic exploration of a cyberpunk city. Neon lights, flying vehicles, and towering skyscrapers create a visually stunning experience.',
    comments: [
      { 
        id: 'c4',
        authorId: 'user4', 
        author: 'SciFiFan', 
        avatarUrl: 'https://picsum.photos/seed/user4/40/40', 
        text: 'The visuals are insane! Great work.', 
        timestamp: '5 days ago',
        date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        likes: 302,
        replies: []
      },
      { 
        id: 'c5',
        authorId: 'user5', 
        author: 'GamerGirl', 
        avatarUrl: 'https://picsum.photos/seed/user5/40/40', 
        text: 'Reminds me of Blade Runner. Love it!', 
        timestamp: '2 days ago',
        date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        likes: 198,
        replies: []
      },
    ],
    likes: 250000,
    dislikes: 5000,
    followers: 4100000,
    category: 'Gaming',
    rank: 1,
    countryCode: 'jp',
  },
  {
    id: '5',
    title: 'Cooking the Perfect Steak',
    thumbnailUrl: 'https://picsum.photos/seed/steak/640/360',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channelName: 'Gourmet Chef',
    channelAvatarUrl: 'https://picsum.photos/seed/ch5/48/48',
    views: '980K',
    viewCount: 980000,
    uploadedAt: '4 days ago',
    uploadDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    duration: '12:05',
    description: 'Learn the secrets to cooking the perfect steak every time. From selecting the right cut of meat to achieving the perfect sear and internal temperature, this guide covers it all.',
    comments: [],
    likes: 80000,
    dislikes: 850,
    followers: 950000,
    category: 'Cooking',
    badge: 'live',
    rank: 5,
    countryCode: 'fr',
  },
  {
    id: '6',
    title: 'Introduction to 3D Modeling with Blender',
    thumbnailUrl: 'https://picsum.photos/seed/blender/640/360',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channelName: '3DArts',
    channelAvatarUrl: 'https://picsum.photos/seed/ch6/48/48',
    views: '320K',
    viewCount: 320000,
    uploadedAt: '3 months ago',
    uploadDate: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    duration: '1:15:20',
    description: 'A beginner-friendly introduction to the world of 3D modeling using Blender. Learn the interface, basic modeling techniques, and create your first 3D object from scratch.',
    comments: [
      { 
        id: 'c6',
        authorId: 'user6', 
        author: 'Newbie Modeler', 
        avatarUrl: 'https://picsum.photos/seed/user6/40/40', 
        text: 'Finally, a tutorial I can understand!', 
        timestamp: '1 month ago',
        date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        likes: 76,
        replies: []
      },
    ],
    likes: 15000,
    dislikes: 200,
    followers: 450000,
    category: 'Design',
  },
  {
    id: '7',
    title: 'Peaceful Morning Yoga Flow',
    thumbnailUrl: 'https://picsum.photos/seed/yoga/640/360',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channelName: 'ZenLife',
    channelAvatarUrl: 'https://picsum.photos/seed/ch7/48/48',
    views: '410K',
    viewCount: 410000,
    uploadedAt: '2 weeks ago',
    uploadDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    duration: '25:00',
    description: 'Start your day with this gentle and peaceful morning yoga flow. This practice is designed to awaken your body, calm your mind, and set a positive tone for the day ahead. Suitable for all levels.',
    comments: [],
    likes: 18000,
    dislikes: 90,
    followers: 620000,
    category: 'Health',
  },
  {
    id: '8',
    title: 'The Rise of AI: What to Expect',
    thumbnailUrl: 'https://picsum.photos/seed/ai/640/360',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channelName: 'TechExplained',
    channelAvatarUrl: 'https://picsum.photos/seed/ch8/48/48',
    views: '1.8M',
    viewCount: 1800000,
    uploadedAt: '23 hours ago',
    uploadDate: new Date(now.getTime() - 23 * 60 * 60 * 1000).toISOString(),
    duration: '32:40',
    description: 'Artificial Intelligence is evolving at an unprecedented pace. In this documentary, we explore the current state of AI, its potential impact on society, and what the future may hold. A deep dive into machine learning, neural networks, and the ethical questions surrounding AI.',
    comments: [
       { 
         id: 'c7',
         authorId: 'user7', 
         author: 'Future Is Now', 
         avatarUrl: 'https://picsum.photos/seed/user7/40/40', 
         text: 'Mind-blowing and a little scary at the same time.', 
         timestamp: '15 minutes ago',
         date: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
         likes: 420,
         replies: []
        },
       { 
         id: 'c8',
         authorId: 'user8',
         author: 'Curious Mind', 
         avatarUrl: 'https://picsum.photos/seed/user8/40/40', 
         text: 'Very well-researched and presented. Thanks!', 
         timestamp: '1 hour ago',
         date: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
         likes: 215,
         replies: []
        },
    ],
    likes: 150000,
    dislikes: 7000,
    followers: 3100000,
    category: 'Technology',
    rank: 2,
    countryCode: 'us',
  },
    {
    id: '9',
    title: 'How to make Sourdough Bread',
    thumbnailUrl: 'https://picsum.photos/seed/sourdough/640/360',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channelName: 'Gourmet Chef',
    channelAvatarUrl: 'https://picsum.photos/seed/ch5/48/48',
    views: '550K',
    viewCount: 550000,
    uploadedAt: '6 hours ago',
    uploadDate: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
    duration: '18:30',
    description: 'Your complete guide to baking delicious sourdough bread at home. From starter to final bake.',
    comments: [],
    likes: 45000,
    dislikes: 400,
    followers: 950000,
    category: 'Cooking',
  },
  {
    id: '10',
    title: 'Live Coding: Building a React Component Library',
    thumbnailUrl: 'https://picsum.photos/seed/livecode/640/360',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channelName: 'CodeMasters',
    channelAvatarUrl: 'https://picsum.photos/seed/ch2/48/48',
    views: '12K',
    viewCount: 12000,
    uploadedAt: 'just now',
    uploadDate: new Date(now.getTime() - 30 * 1000).toISOString(), // 30 seconds ago
    duration: '2:30:15',
    description: 'Join me live as I build a new component library from scratch using React and TypeScript.',
    comments: [],
    likes: 2000,
    dislikes: 50,
    followers: 1250000,
    category: 'Coding',
  },
];

// Expand the video list for infinite scrolling
const allMockVideos: Video[] = [
  ...mockVideos,
  ...mockVideos.map(v => ({...v, id: `${v.id}-clone1`, thumbnailUrl: v.thumbnailUrl.replace('/seed/', '/seed/clone1-')})),
  ...mockVideos.map(v => ({...v, id: `${v.id}-clone2`, thumbnailUrl: v.thumbnailUrl.replace('/seed/', '/seed/clone2-')})),
  ...mockVideos.map(v => ({...v, id: `${v.id}-clone3`, thumbnailUrl: v.thumbnailUrl.replace('/seed/', '/seed/clone3-')})),
  ...mockVideos.map(v => ({...v, id: `${v.id}-clone4`, thumbnailUrl: v.thumbnailUrl.replace('/seed/', '/seed/clone4-')})),
];

export const mockChannels: FollowedChannel[] = [
    { name: 'CodeMasters', handle: '@codemasters', subscriberCount: '1.25M', avatarUrl: 'https://picsum.photos/seed/ch2/48/48' },
    { name: 'Nature Explorers', handle: '@natureexplorers', subscriberCount: '2.3M', avatarUrl: 'https://picsum.photos/seed/ch1/48/48' },
    { name: 'FutureVisions', handle: '@futurevisions', subscriberCount: '4.1M', avatarUrl: 'https://picsum.photos/seed/ch4/48/48' },
    { name: 'DesignScapes', handle: '@designscapes', subscriberCount: '780K', avatarUrl: 'https://picsum.photos/seed/ch3/48/48' },
    { name: 'Gourmet Chef', handle: '@gourmetchef', subscriberCount: '950K', avatarUrl: 'https://picsum.photos/seed/ch5/48/48', isLive: true },
    { name: '3DArts', handle: '@3darts', subscriberCount: '450K', avatarUrl: 'https://picsum.photos/seed/ch6/48/48' },
    { name: 'ZenLife', handle: '@zenlife', subscriberCount: '620K', avatarUrl: 'https://picsum.photos/seed/ch7/48/48' },
    { name: 'TechExplained', handle: '@techexplained', subscriberCount: '3.1M', avatarUrl: 'https://picsum.photos/seed/ch8/48/48' },
];

const CATEGORIES = ['All', 'Trending', 'Gaming', 'Music', 'Coding', 'Design', 'Travel', 'Cooking', 'Health', 'Technology'];

interface GetVideosParams {
  page?: number;
  limit?: number;
  category?: string;
  query?: string;
  location?: 'Regional' | 'Global';
}

export const videoService = {
  getVideos: ({ page = 1, limit = 8, category = 'All', query = '', location = 'Global' }: GetVideosParams): Promise<{ videos: Video[], hasMore: boolean }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredVideos;
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime();
        
        const regionalSort = (a: Video, b: Video) => {
            const USER_COUNTRY = 'us'; // Assume user's country is US for mock
            const aIsRecent = new Date(a.uploadDate).getTime() > oneWeekAgo;
            const bIsRecent = new Date(b.uploadDate).getTime() > oneWeekAgo;
            
            const aIsLocal = a.countryCode === USER_COUNTRY;
            const bIsLocal = b.countryCode === USER_COUNTRY;

            // Score = views * (recent_boost) * (local_boost)
            const aScore = a.viewCount * (aIsRecent ? 1.5 : 1) * (aIsLocal ? 2 : 1);
            const bScore = b.viewCount * (bIsRecent ? 1.5 : 1) * (bIsLocal ? 2 : 1);
            return bScore - aScore;
        };
        
        const globalSort = (a: Video, b: Video) => b.viewCount - a.viewCount;

        // Special handling for 'Trending' category or any other category view that needs sorting
        if (category === 'Trending' || category !== 'All') {
          if (category === 'Trending') {
            filteredVideos = [...allMockVideos];
          } else {
            filteredVideos = allMockVideos.filter(video => video.category === category);
          }
          
          const sortFn = location === 'Regional' ? regionalSort : globalSort;
          filteredVideos.sort(sortFn);
          
          // For regional, re-calculate ranks based on the new sort order. Global ranks are the original ones.
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

            // 1. Query suggestion
            suggestions.push({ type: 'query', query });

            // 2. Channel suggestions
            mockChannels
                .filter(channel => channel.name.toLowerCase().includes(lowercasedQuery))
                .slice(0, 2)
                .forEach(channel => suggestions.push({ type: 'channel', channel }));

            // 3. Keyword/Category suggestions
            CATEGORIES.forEach(cat => {
                if (suggestions.length < 10 && cat.toLowerCase().includes(lowercasedQuery) && cat.toLowerCase() !== lowercasedQuery) {
                    suggestions.push({ type: 'keyword', keyword: cat });
                }
            });

            // 4. Video suggestions
            allMockVideos
                .filter(video => video.title.toLowerCase().includes(lowercasedQuery))
                .sort((a,b) => b.viewCount - a.viewCount)
                .slice(0, 4)
                .forEach(video => {
                    if (suggestions.length < 10) {
                        suggestions.push({ type: 'video', video })
                    }
                });

            resolve(suggestions.slice(0, 8)); // limit total suggestions
        }, 200);
    });
  }
};
