import React, { useEffect } from 'react';
import { XIcon } from './icons/XIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      // Automatically close after a few seconds to simulate not hearing anything
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);
    
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="voice-search-title">
      <div className="modal-backdrop" onClick={onClose}></div>
      
      <div className="relative z-50 flex flex-col items-center justify-center w-full h-full p-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
            aria-label="Close voice search"
        >
            <XIcon className="w-7 h-7" />
        </button>

        <div className="text-center text-white animate-fade-in">
            <h2 id="voice-search-title" className="text-3xl font-bold">Listening...</h2>
            <p className="mt-2 text-lg opacity-80">Start speaking to search</p>
        </div>

        <div className="relative mt-12">
            <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse-live"></div>
            <div className="relative w-32 h-32 bg-red-600 rounded-full flex items-center justify-center">
                <MicrophoneIcon className="w-16 h-16 text-white"/>
            </div>
        </div>

      </div>
    </div>
  );
};
