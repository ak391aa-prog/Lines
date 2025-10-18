import React from 'react';
import { NotificationLevel } from '../types';
import { BellRingingIcon } from './icons/BellRingingIcon';
import { BellIcon } from './icons/BellIcon';
import { BellOffIcon } from './icons/BellOffIcon';

interface NotificationBellMenuProps {
  isOpen: boolean;
  onSelect: (level: NotificationLevel) => void;
  currentLevel: NotificationLevel;
}

const options: { level: NotificationLevel, icon: React.ReactElement, label: string, description: string }[] = [
    {
        level: 'all',
        icon: <BellRingingIcon className="w-6 h-6" />,
        label: 'All',
        description: "You'll get all notifications.",
    },
    {
        level: 'personalized',
        icon: <BellIcon className="w-6 h-6" />,
        label: 'Personalized',
        description: "You'll get some notifications.",
    },
    {
        level: 'none',
        icon: <BellOffIcon className="w-6 h-6" />,
        label: 'None',
        description: "You won't get any notifications.",
    },
];

export const NotificationBellMenu: React.FC<NotificationBellMenuProps> = ({ isOpen, onSelect, currentLevel }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-30 p-2 animate-menu-pop-in"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="bell-menu-button"
    >
      {options.map(option => (
        <button
          key={option.level}
          onClick={() => onSelect(option.level)}
          className={`w-full flex items-center gap-4 p-3 text-left rounded-lg transition-colors ${
            currentLevel === option.level ? 'bg-slate-100' : 'hover:bg-slate-100'
          }`}
          role="menuitemradio"
          aria-checked={currentLevel === option.level}
        >
          <div className={`flex-shrink-0 ${currentLevel === option.level ? 'text-slate-900' : 'text-slate-500'}`}>
            {option.icon}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{option.label}</p>
            <p className="text-sm text-slate-600">{option.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
};