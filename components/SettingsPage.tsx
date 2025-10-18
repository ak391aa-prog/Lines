import React from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { UserCogIcon } from './icons/UserCogIcon';
import { CogIcon } from './icons/CogIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { DataSavingIcon } from './icons/DataSavingIcon';
import { BellIcon } from './icons/BellIcon';
import { InfoCircleIcon } from './icons/InfoCircleIcon';
import { HelpCircleIcon } from './icons/HelpCircleIcon';
import { HistoryIcon } from './icons/HistoryIcon';

interface SettingsPageProps {
  onGoBack: () => void;
  onShowToast: (message: string) => void;
}

const SettingItem: React.FC<{
  // FIX: Update icon prop type to allow passing a className.
  icon: React.ReactElement<{ className?: string }>;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-100 rounded-lg transition-colors group"
  >
    <div className="flex-shrink-0 text-slate-500 group-hover:text-slate-800 transition-colors">
      {React.cloneElement(icon, { className: 'w-7 h-7' })}
    </div>
    <div className="flex-grow">
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
    <ChevronRightIcon className="w-6 h-6 text-slate-400 flex-shrink-0" />
  </button>
);

export const SettingsPage: React.FC<SettingsPageProps> = ({ onGoBack, onShowToast }) => {
  const handleSettingClick = () => {
    onShowToast('This feature is coming soon!');
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 py-4 animate-fade-in">
      <header className="flex items-center gap-4 mb-6">
        <button
          onClick={onGoBack}
          className="p-3 rounded-full hover:bg-slate-100 transition-colors -ml-3"
          aria-label="Back to previous page"
        >
          <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Settings</h1>
      </header>
      
      <main className="space-y-8">
        <section>
          <h2 className="px-4 pb-2 text-base font-bold text-slate-500 tracking-wide uppercase">Account</h2>
          <div className="space-y-1">
            <SettingItem icon={<UserCogIcon />} title="Manage your Account" description="Update your profile, password, and channel details" onClick={handleSettingClick} />
          </div>
        </section>
        
        <section>
          <h2 className="px-4 pb-2 text-base font-bold text-slate-500 tracking-wide uppercase">General</h2>
          <div className="space-y-1">
            <SettingItem icon={<CogIcon />} title="Playback and Performance" description="Control video quality and autoplay settings" onClick={handleSettingClick} />
            <SettingItem icon={<DataSavingIcon />} title="Data Saving" description="Reduce data usage on mobile networks" onClick={handleSettingClick} />
            <SettingItem icon={<BellIcon />} title="Notifications" description="Manage your push and email notifications" onClick={handleSettingClick} />
          </div>
        </section>
        
        <section>
          <h2 className="px-4 pb-2 text-base font-bold text-slate-500 tracking-wide uppercase">Privacy & Data</h2>
          <div className="space-y-1">
            <SettingItem icon={<ShieldCheckIcon />} title="Privacy" description="Control what information you share" onClick={handleSettingClick} />
            <SettingItem icon={<HistoryIcon />} title="Manage History" description="View or clear your watch and search history" onClick={handleSettingClick} />
          </div>
        </section>

        <section>
          <h2 className="px-4 pb-2 text-base font-bold text-slate-500 tracking-wide uppercase">Support</h2>
          <div className="space-y-1">
            <SettingItem icon={<InfoCircleIcon />} title="About" description="App version, licenses, and terms of service" onClick={handleSettingClick} />
            <SettingItem icon={<HelpCircleIcon />} title="Help & Feedback" description="Find answers or send us your feedback" onClick={handleSettingClick} />
          </div>
        </section>
      </main>
    </div>
  );
};
