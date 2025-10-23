import React, { useState } from 'react';
import { XIcon } from './icons/XIcon';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const isCreateDisabled = name.trim().length === 0;

  const handleCreate = () => {
    if (!isCreateDisabled) {
      onCreate(name.trim());
      setName('');
      onClose();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleCreate();
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="create-playlist-title">
      <div className="modal-backdrop" onClick={onClose}></div>
      
      <div className="relative z-50 bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-modal-content">
        <div className="flex items-center justify-between mb-4">
            <h2 id="create-playlist-title" className="text-xl font-bold text-slate-900">
                New playlist
            </h2>
            <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-800"
                aria-label="Close"
            >
                <XIcon className="w-6 h-6" />
            </button>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
            <label htmlFor="playlist-name" className="text-sm font-medium text-slate-700">Name</label>
            <input 
                id="playlist-name"
                type="text"
                placeholder="Enter playlist name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="mt-1 w-full bg-slate-100 border border-slate-300 rounded-lg py-2.5 px-4 text-base 
                           focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                autoFocus
                maxLength={50}
            />
        </form>
        
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2.5 font-semibold text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={isCreateDisabled}
            className={`px-4 py-2.5 font-semibold text-white rounded-full transition-colors ${isCreateDisabled ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-black'}`}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};
