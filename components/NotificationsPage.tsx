import React, { useMemo } from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { KebabMenuIcon } from './icons/KebabMenuIcon';

type NotificationType = 'new_video' | 'comment_reply' | 'live' | 'mention' | 'liked_comment';

interface Notification {
  id: number;
  author: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
  type: NotificationType;
  isUnread: boolean;
  videoThumbnailUrl?: string;
  videoTitle?: string;
}


const mockNotifications: Notification[] = [
    { 
        id: 1, 
        author: 'CodeMasters',
        authorAvatar: 'https://picsum.photos/seed/ch2/48/48',
        text: 'uploaded a new video.', 
        videoTitle: 'Advanced TypeScript Tips & Tricks',
        timestamp: '2 hours ago', 
        type: 'new_video', 
        isUnread: true, 
        videoThumbnailUrl: 'https://picsum.photos/seed/thumb-1/120/68' 
    },
    { 
        id: 2, 
        author: 'Nature Explorers',
        authorAvatar: 'https://picsum.photos/seed/ch1/48/48',
        text: 'liked your comment: "Absolutely stunning cinematography!"', 
        timestamp: '5 hours ago', 
        type: 'liked_comment', 
        isUnread: true, 
        videoThumbnailUrl: 'https://picsum.photos/seed/thumb-2/120/68'
    },
    { 
        id: 3, 
        author: 'Travel Bug',
        authorAvatar: 'https://picsum.photos/seed/user1/40/40',
        text: 'mentioned you in a comment: "@user That\'s a great point!"', 
        timestamp: '1 day ago', 
        type: 'mention', 
        isUnread: false, 
        videoThumbnailUrl: 'https://picsum.photos/seed/thumb-3/120/68'
    },
    { 
        id: 4, 
        author: 'DesignScapes',
        authorAvatar: 'https://picsum.photos/seed/ch3/48/48',
        text: 'is live now!', 
        videoTitle: 'Designing with Grids: A Masterclass',
        timestamp: '2 days ago', 
        type: 'live', 
        isUnread: false, 
        videoThumbnailUrl: 'https://picsum.photos/seed/thumb-4/120/68' 
    },
    { 
        id: 5, 
        author: 'Mountain Man',
        authorAvatar: 'https://picsum.photos/seed/user2/40/40',
        text: 'replied: "I agree, the drone shots were breathtaking."', 
        timestamp: '5 days ago', 
        type: 'comment_reply', 
        isUnread: false, 
        videoThumbnailUrl: 'https://picsum.photos/seed/thumb-5/120/68'
    },
    { 
        id: 6, 
        author: 'Lines',
        authorAvatar: 'https://picsum.photos/seed/lines-logo/48/48',
        text: 'Your upload has finished processing.', 
        videoTitle: 'My First Vlog',
        timestamp: '8 days ago', 
        type: 'new_video', 
        isUnread: false, 
        videoThumbnailUrl: 'https://picsum.photos/seed/thumb-6/120/68' 
    },
];


const NotificationCard: React.FC<{notification: Notification}> = ({ notification }) => {
    return (
        <li className="list-none">
            <a href="#" className={`flex items-start gap-4 p-3 -mx-3 rounded-lg transition-colors group ${notification.isUnread ? 'bg-slate-100' : 'hover:bg-slate-100'}`}>
                <div className="w-4 h-4 mt-1.5 flex-shrink-0 flex items-center justify-center">
                  {notification.isUnread && <div className="w-2 h-2 bg-amber-500 rounded-full" aria-label="Unread"></div>}
                </div>
                
                <img src={notification.authorAvatar} alt={notification.author} className="w-12 h-12 rounded-full flex-shrink-0" />
                
                <div className="flex-grow">
                    <p className="text-slate-800 text-base leading-snug">
                        <span className="font-semibold">{notification.author}</span> {notification.text} {notification.videoTitle && <span className="font-semibold text-slate-900">{notification.videoTitle}</span>}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">{notification.timestamp}</p>
                </div>

                {notification.videoThumbnailUrl && (
                    <img 
                        src={notification.videoThumbnailUrl} 
                        alt="Video thumbnail"
                        className="w-28 h-auto object-cover rounded-md flex-shrink-0 hidden sm:block transition-transform duration-300 group-hover:scale-105"
                    />
                )}
                <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} 
                    className="p-2 -mr-2 rounded-full text-slate-500 hover:bg-slate-200/80 hover:text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity" 
                    aria-label="More options"
                >
                    <KebabMenuIcon className="w-6 h-6" />
                </button>
            </a>
        </li>
    );
};


interface NotificationsPageProps {
  onGoBack: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onGoBack }) => {

  const groupedNotifications = useMemo(() => {
      const groups: { [key: string]: Notification[] } = {
          'Today': [],
          'This Week': [],
          'Older': [],
      };

      const now = new Date();
      const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

      mockNotifications.forEach(notification => {
          // Fake dates for demonstration based on ID
          const notificationDate = new Date(); 
          if(notification.id <= 2) { /* Today */ }
          else if (notification.id <= 5) { notificationDate.setDate(now.getDate() - 3); } // This week
          else { notificationDate.setDate(now.getDate() - 8); } // Older

          if (notification.id <= 2) {
              groups['Today'].push(notification);
          } else if (notificationDate > oneWeekAgo) {
              groups['This Week'].push(notification);
          } else {
              groups['Older'].push(notification);
          }
      });
      return groups;
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
        <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
                 <button 
                    onClick={onGoBack} 
                    className="p-3 rounded-full hover:bg-slate-100 transition-colors -ml-3"
                    aria-label="Back to previous page"
                >
                    <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
                </button>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Notifications</h1>
            </div>
            <button aria-label="Notification settings" className="p-3 rounded-full hover:bg-slate-100 transition-colors">
                <SettingsIcon className="w-6 h-6 text-slate-600" />
            </button>
        </header>
        
        <div className="space-y-8">
            {Object.entries(groupedNotifications).map(([groupTitle, notifications]) => {
                const notificationList = notifications as Notification[];
                return (
                notificationList.length > 0 && (
                    <section key={groupTitle}>
                        <h2 className="text-lg font-bold text-slate-800 mb-2 px-2">{groupTitle}</h2>
                        <ul className="space-y-1">
                            {notificationList.map(notification => (
                               <NotificationCard key={notification.id} notification={notification} />
                            ))}
                        </ul>
                    </section>
                )
            )})}
        </div>
    </div>
  );
};