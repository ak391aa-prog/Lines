import React, { useEffect, useRef } from 'react';
import { ChannelIcon } from './icons/ChannelIcon';
import { UserCogIcon } from './icons/UserCogIcon';
import { SignOutIcon } from './icons/SignOutIcon';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToProfile: () => void;
  onNavigateToSettings: () => void;
}

// FIX: Update icon prop type to allow passing a className.
const MenuItem: React.FC<{ icon: React.ReactElement<{ className?: string }>; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-4 p-3 text-left text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
    role="menuitem"
  >
    {React.cloneElement(icon, { className: "w-6 h-6 text-slate-600" })}
    <span className="font-medium text-base">{label}</span>
  </button>
);

export const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onClose, onNavigateToProfile, onNavigateToSettings }) => {
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
  
  const handleNavigateToProfile = () => {
    onNavigateToProfile();
    onClose();
  };

  const handleNavigateToSettings = () => {
    onNavigateToSettings();
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 z-50 p-2 animate-menu-pop-in"
      role="menu"
      aria-orientation="vertical"
    >
      <div className="flex items-center gap-4 p-3 border-b border-slate-200 mb-2">
        <img
          src="https://picsum.photos/seed/user-avatar/40/40"
          alt="User Avatar"
          className="h-12 w-12 rounded-full"
        />
        <div>
          <h3 className="font-bold text-slate-800">John Doe</h3>
          <p className="text-sm text-slate-500">@johndoe</p>
        </div>
      </div>
      <div role="none">
        <MenuItem icon={<ChannelIcon />} label="Your Channel" onClick={handleNavigateToProfile} />
        <MenuItem icon={<UserCogIcon />} label="Settings" onClick={handleNavigateToSettings} />
        <MenuItem icon={<SignOutIcon />} label="Sign Out" onClick={onClose} />
      </div>
    </div>
  );
};
