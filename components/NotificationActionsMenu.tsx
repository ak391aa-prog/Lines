import React, { useEffect, useRef } from 'react';
import { CheckIcon } from './icons/CheckIcon';
import { BellOffIcon } from './icons/BellOffIcon';
import { EyeOffIcon } from './icons/EyeOffIcon';
import { TrashIcon } from './icons/TrashIcon';

interface NotificationActionsMenuProps {
  isOpen: boolean;
  isUnread: boolean;
  onClose: () => void;
  onToggleRead: () => void;
  onMuteChannel: () => void;
  onRemove: () => void;
}

export const NotificationActionsMenu: React.FC<NotificationActionsMenuProps> = ({ isOpen, onClose, isUnread, onToggleRead, onMuteChannel, onRemove }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className="absolute top-full right-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-slate-200 z-20 p-2 animate-menu-pop-in"
      role="menu"
      aria-orientation="vertical"
    >
      <button
        onClick={() => { onToggleRead(); onClose(); }}
        className="w-full flex items-center gap-3 p-2 text-left text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
        role="menuitem"
      >
        {isUnread ? <CheckIcon className="w-5 h-5" /> : <EyeOffIcon className="w-5 h-5" />}
        <span className="font-medium">{isUnread ? 'Mark as read' : 'Mark as unread'}</span>
      </button>
      <button
        onClick={() => { onMuteChannel(); onClose(); }}
        className="w-full flex items-center gap-3 p-2 text-left text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
        role="menuitem"
      >
        <BellOffIcon className="w-5 h-5" />
        <span className="font-medium">Turn off notifications for this channel</span>
      </button>
       <button
        onClick={() => { onRemove(); onClose(); }}
        className="w-full flex items-center gap-3 p-2 text-left text-red-600 hover:bg-red-50 rounded-md transition-colors"
        role="menuitem"
      >
        <TrashIcon className="w-5 h-5" />
        <span className="font-medium">Remove this notification</span>
      </button>
    </div>
  );
};
