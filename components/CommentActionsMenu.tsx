import React, { useEffect, useRef } from 'react';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';

interface CommentActionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const CommentActionsMenu: React.FC<CommentActionsMenuProps> = ({ isOpen, onClose, onEdit, onDelete }) => {
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
      className="absolute top-full right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 z-10 p-2 animate-menu-pop-in"
      role="menu"
      aria-orientation="vertical"
    >
      <button
        onClick={onEdit}
        className="w-full flex items-center gap-3 p-2 text-left text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
        role="menuitem"
      >
        <EditIcon className="w-5 h-5" />
        <span className="font-medium">Edit</span>
      </button>
      <button
        onClick={onDelete}
        className="w-full flex items-center gap-3 p-2 text-left text-red-600 hover:bg-red-50 rounded-md transition-colors"
        role="menuitem"
      >
        <TrashIcon className="w-5 h-5" />
        <span className="font-medium">Delete</span>
      </button>
    </div>
  );
};
