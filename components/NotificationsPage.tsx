import React, { useMemo, useState } from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { KebabMenuIcon } from './icons/KebabMenuIcon';
import { CommentIcon } from './icons/CommentIcon';
import { LikeIcon } from './icons/LikeIcon';
import { SubscriptionsIcon } from './icons/SubscriptionsIcon';
import { BellIcon } from './icons/BellIcon';
import { CheckCheckIcon } from './icons/CheckCheckIcon';
import { AtSymbolIcon } from './icons/AtSymbolIcon';
import { NotificationActionsMenu } from './NotificationActionsMenu';


type NotificationType = 'new_video' | 'comment_reply' | 'live' | 'mention' | 'liked_comment';

interface Notification {
  id: number;
  author: string;
  authorAvatar: string;
  type: NotificationType;
  timestamp: string;
  isUnread: boolean;
  videoThumbnailUrl?: string;
  videoTitle?: string;
  commentText?: string;
}

const initialMockNotifications: Notification[] = [
    { 
        id: 1, 
        author: 'CodeMasters',
        authorAvatar: 'https://picsum.photos/seed/ch2/48/48',
        type: 'new_video', 
        videoTitle: 'Advanced TypeScript Tips & Tricks',
        timestamp: '2 hours ago', 
        isUnread: true, 
        videoThumbnailUrl: 'https://picsum.photos/seed/thumb-1/120/68' 
    },
    { 
        id: 2, 
        author: 'Nature Explorers',
        authorAvatar: 'https://picsum.photos/seed/ch1/48/48',
        type: 'liked_comment', 
        commentText: 'Absolutely stunning cinematography!',
        timestamp: '5 hours ago', 
        isUnread: true, 
        videoThumbnailUrl: 'https://picsum.photos/seed/thumb-2/120/68'
    },
    { 
        id: 3, 
        author: 'Travel Bug',
        authorAvatar: 'https://picsum.photos/seed/user1/40/40',
        type: 'mention', 
        commentText: '@user That\'s a great point about the lighting!',
        timestamp: '1 day ago', 
        isUnread: false, 
        videoThumbnailUrl: 'https://picsum.photos/seed/thumb-3/120/68'
    },
    { 
        id: 4, 
        author: 'DesignScapes',
        authorAvatar: 'https://picsum.photos/seed/ch3/48/48',
        type: 'live', 
        videoTitle: 'Designing with Grids: A Masterclass',
        timestamp: '2 days ago', 
        isUnread: false, 
        videoThumbnailUrl: 'https://picsum.photos/seed/thumb-4/120/68' 
    },
    { 
        id: 5, 
        author: 'Mountain Man',
        authorAvatar: 'https://picsum.photos/seed/user2/40/40',
        type: 'comment_reply', 
        commentText: 'I agree, the drone shots were breathtaking.',
        timestamp: '5 days ago', 
        isUnread: false, 
        videoThumbnailUrl: 'https://picsum.photos/seed/thumb-5/120/68'
    },
    { 
        id: 6, 
        author: 'Lines',
        authorAvatar: 'https://picsum.photos/seed/lines-logo/48/48',
        type: 'new_video', 
        videoTitle: 'Your upload has finished processing: "My First Vlog"',
        timestamp: '8 days ago', 
        isUnread: false, 
        videoThumbnailUrl: 'https://picsum.photos/seed/thumb-6/120/68' 
    },
];

const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
        case 'new_video': return <SubscriptionsIcon className="w-6 h-6 text-slate-500" />;
        case 'comment_reply': return <CommentIcon className="w-6 h-6 text-slate-500" />;
        case 'live': return <BellIcon className="w-6 h-6 text-slate-500" />;
        case 'mention': return <AtSymbolIcon className="w-6 h-6 text-slate-500" />;
        case 'liked_comment': return <LikeIcon className="w-6 h-6 text-red-500" />;
        default: return null;
    }
};

const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
        case 'new_video': return <>uploaded: <span className="font-semibold text-slate-900">{notification.videoTitle}</span></>;
        case 'live': return <>is live now: <span className="font-semibold text-slate-900">{notification.videoTitle}</span></>;
        case 'comment_reply': return <>replied: <span className="text-slate-600 italic">"{notification.commentText}"</span></>;
        case 'mention': return <>mentioned you: <span className="text-slate-600 italic">"{notification.commentText}"</span></>;
        case 'liked_comment': return <>liked your comment: <span className="text-slate-600 italic">"{notification.commentText}"</span></>;
        default: return null;
    }
}


const NotificationCard: React.FC<{
    notification: Notification;
    onToggleRead: (id: number) => void;
    onMuteChannel: (author: string) => void;
    onRemove: (id: number) => void;
}> = ({ notification, onToggleRead, onMuteChannel, onRemove }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <li className="list-none relative">
            <a href="#" className={`flex items-start gap-4 p-3 -mx-3 rounded-lg transition-colors group ${notification.isUnread ? 'bg-amber-500/10' : 'hover:bg-slate-100'}`}>
                <div className="w-10 h-10 mt-1 flex-shrink-0 flex items-center justify-center">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <img src={notification.authorAvatar} alt={notification.author} className="w-12 h-12 rounded-full flex-shrink-0" />
                
                <div className="flex-grow">
                    <p className="text-slate-800 text-base leading-snug">
                        <span className="font-semibold">{notification.author}</span>{' '}
                        {getNotificationText(notification)}
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

                <div className="flex items-center gap-2">
                    {notification.isUnread && <div className="w-2.5 h-2.5 bg-amber-500 rounded-full flex-shrink-0" aria-label="Unread"></div>}
                    <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsMenuOpen(p => !p); }} 
                        className="p-2 -mr-2 rounded-full text-slate-500 hover:bg-slate-200/80 hover:text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity" 
                        aria-label="More options"
                    >
                        <KebabMenuIcon className="w-6 h-6" />
                    </button>
                </div>
            </a>
            <NotificationActionsMenu
                isOpen={isMenuOpen}
                isUnread={notification.isUnread}
                onClose={() => setIsMenuOpen(false)}
                onToggleRead={() => onToggleRead(notification.id)}
                onMuteChannel={() => onMuteChannel(notification.author)}
                onRemove={() => onRemove(notification.id)}
            />
        </li>
    );
};

const FilterButton: React.FC<{label: string, isActive: boolean, onClick: () => void}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-base font-semibold rounded-full transition-colors ${
            isActive ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
        }`}
    >
        {label}
    </button>
);


interface NotificationsPageProps {
  onGoBack: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onGoBack }) => {
  const [notifications, setNotifications] = useState(initialMockNotifications);
  const [activeFilter, setActiveFilter] = useState<'all' | 'mentions' | 'unread'>('all');

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
        if (activeFilter === 'unread') return n.isUnread;
        if (activeFilter === 'mentions') return n.type === 'mention';
        return true;
    });
  }, [notifications, activeFilter]);
  
  const groupedNotifications = useMemo(() => {
      const groups: { [key: string]: Notification[] } = {
          'Today': [], 'This Week': [], 'Older': [],
      };
      
      filteredNotifications.forEach(notification => {
          // Mock grouping logic
          if (notification.id <= 2) groups['Today'].push(notification);
          else if (notification.id <= 5) groups['This Week'].push(notification);
          else groups['Older'].push(notification);
      });
      return groups;
  }, [filteredNotifications]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
  };

  const handleToggleRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isUnread: !n.isUnread } : n));
  };
  
  const handleRemove = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMute = (author: string) => {
    setNotifications(prev => prev.filter(n => n.author !== author));
  };

  const renderEmptyState = () => (
    <div className="text-center py-20">
        <BellIcon className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="mt-4 text-2xl font-bold text-slate-800">
            {activeFilter === 'all' && "No notifications yet"}
            {activeFilter === 'mentions' && "No mentions yet"}
            {activeFilter === 'unread' && "All caught up!"}
        </h2>
        <p className="mt-2 text-slate-500">
            {activeFilter === 'all' && "New videos and replies will appear here."}
            {activeFilter === 'mentions' && "When someone mentions you, it'll show up here."}
            {activeFilter === 'unread' && "You've read all your notifications."}
        </p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 lg:px-6 py-4 animate-fade-in">
        <header className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 w-full">
                 <button 
                    onClick={onGoBack} 
                    className="p-3 rounded-full hover:bg-slate-100 transition-colors -ml-3"
                    aria-label="Back to previous page"
                >
                    <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
                </button>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Notifications</h1>
            </div>
            <button 
                onClick={handleMarkAllRead}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 text-base font-semibold rounded-lg transition-colors bg-slate-100 text-slate-700 hover:bg-slate-200 self-end sm:self-center"
            >
                <CheckCheckIcon className="w-5 h-5"/>
                Mark all as read
            </button>
        </header>

        <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-4">
            <FilterButton label="All" isActive={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
            <FilterButton label="Mentions" isActive={activeFilter === 'mentions'} onClick={() => setActiveFilter('mentions')} />
            <FilterButton label="Unread" isActive={activeFilter === 'unread'} onClick={() => setActiveFilter('unread')} />
        </div>
        
        {filteredNotifications.length === 0 ? renderEmptyState() : (
            <div className="space-y-8">
                {/* FIX: Explicitly type the destructured `groupNotifications` as `Notification[]` to resolve TS errors. */}
                {Object.entries(groupedNotifications).map(([groupTitle, groupNotifications]: [string, Notification[]]) => (
                    groupNotifications.length > 0 && (
                        <section key={groupTitle}>
                            <h2 className="text-lg font-bold text-slate-800 mb-2 px-2">{groupTitle}</h2>
                            <ul className="space-y-1">
                                {groupNotifications.map(notification => (
                                <NotificationCard 
                                    key={notification.id} 
                                    notification={notification}
                                    onToggleRead={handleToggleRead}
                                    onMuteChannel={handleMute}
                                    onRemove={handleRemove}
                                />
                                ))}
                            </ul>
                        </section>
                    )
                ))}
            </div>
        )}
    </div>
  );
};
