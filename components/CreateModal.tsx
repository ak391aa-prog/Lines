import React from 'react';
import { XIcon } from './icons/XIcon';
import { UploadIcon } from './icons/UploadIcon';
import { GoLiveIcon } from './icons/GoLiveIcon';
import { ShortsIcon } from './icons/ShortsIcon';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// FIX: The 'icon' prop type is made more specific to ensure it can accept a 'className',
// which is required by React.cloneElement to prevent a TypeScript error.
const CreateOption: React.FC<{ icon: React.ReactElement<{ className?: string }>; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center gap-6 p-4 text-left hover:bg-slate-100 rounded-lg transition-colors">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
            {React.cloneElement(icon, { className: 'w-7 h-7 text-slate-600' })}
        </div>
        <span className="text-lg font-medium text-slate-800">{label}</span>
    </button>
);

export const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center" role="dialog" aria-modal="true" aria-labelledby="create-dialog-title">
      <div className="modal-backdrop" onClick={onClose}></div>
      
      <div className="relative z-50 bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-sm animate-modal-content">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
             <h2 id="create-dialog-title" className="text-xl font-bold text-slate-900">
                Create
            </h2>
            <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-800"
                aria-label="Close create dialog"
            >
                <XIcon className="w-6 h-6" />
            </button>
        </div>

        <div className="p-4">
            <div className="space-y-2">
                <CreateOption icon={<UploadIcon />} label="Upload a video" onClick={onClose} />
                <CreateOption icon={<ShortsIcon />} label="Create a Short" onClick={onClose} />
                <CreateOption icon={<GoLiveIcon />} label="Go live" onClick={onClose} />
            </div>
        </div>
      </div>
    </div>
  );
};
