import React, { useState, useCallback } from 'react';
import { XIcon } from './icons/XIcon';
import { LinkIcon } from './icons/LinkIcon';
import { EmbedIcon } from './icons/EmbedIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  videoTitle: string;
}

const SocialButton: React.FC<{ href: string; icon: React.ReactElement; label: string; bgColor: string; }> = ({ href, icon, label, bgColor }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-opacity ${bgColor} group-hover:opacity-90`}>
            {icon}
        </div>
        <span className="text-sm text-slate-600">{label}</span>
    </a>
);


export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, videoUrl, videoTitle }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  
  const handleCopy = useCallback((textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus('idle'), 2000);
    });
  }, []);

  const embedCode = `<iframe width="560" height="315" src="${videoUrl.replace('watch?v=', 'embed/')}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="share-dialog-title">
      <div className="modal-backdrop" onClick={onClose}></div>
      
      <div className="relative z-50 bg-white rounded-2xl shadow-xl w-full max-w-lg animate-modal-content">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
             <h2 id="share-dialog-title" className="text-xl font-bold text-slate-900">
                Share
            </h2>
            <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-800"
                aria-label="Close share dialog"
            >
                <XIcon className="w-6 h-6" />
            </button>
        </div>

        <div className="p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Share on social media</h3>
            <div className="flex items-center justify-around gap-4">
                <SocialButton 
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(videoUrl)}&text=${encodeURIComponent(videoTitle)}`} 
                    icon={<TwitterIcon className="w-7 h-7 text-white" />} 
                    label="Twitter"
                    bgColor="bg-[#1DA1F2]"
                />
                <SocialButton 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`} 
                    icon={<FacebookIcon className="w-7 h-7 text-white" />} 
                    label="Facebook"
                    bgColor="bg-[#1877F2]"
                />
                <SocialButton 
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(videoTitle + ' ' + videoUrl)}`}
                    icon={<WhatsAppIcon className="w-7 h-7 text-white" />} 
                    label="WhatsApp"
                    bgColor="bg-[#25D366]"
                />
            </div>

            <hr className="my-6 border-slate-200" />
            
            <h3 className="font-semibold text-slate-800 mb-2">Or copy link</h3>
            <div className="flex items-center gap-2 p-2 bg-slate-100 border border-slate-200 rounded-lg">
                <LinkIcon className="w-5 h-5 text-slate-500 flex-shrink-0" />
                <input 
                    type="text" 
                    readOnly 
                    value={videoUrl} 
                    className="flex-1 bg-transparent text-slate-700 text-sm focus:outline-none" 
                    aria-label="Video URL"
                />
                <button
                    onClick={() => handleCopy(videoUrl)}
                    className="px-4 py-2 text-sm font-semibold text-white bg-slate-800 hover:bg-black rounded-md transition-colors w-24"
                >
                    {copyStatus === 'copied' ? (
                        <span className="flex items-center justify-center gap-1.5"><CheckIcon className="w-5 h-5" /> Copied</span>
                    ) : (
                        'Copy'
                    )}
                </button>
            </div>
            
            <details className="mt-4 group">
                <summary className="cursor-pointer flex items-center gap-2 font-semibold text-slate-800 list-none">
                    <EmbedIcon className="w-5 h-5 text-slate-500" />
                    Embed
                    <ChevronRightIcon className="w-5 h-5 text-slate-500 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-2 flex items-center gap-2 p-2 bg-slate-100 border border-slate-200 rounded-lg">
                    <textarea
                        readOnly
                        value={embedCode}
                        className="flex-1 bg-transparent text-slate-700 text-sm focus:outline-none font-mono h-24 resize-none"
                        aria-label="Embed code"
                    />
                    <button
                        onClick={() => handleCopy(embedCode)}
                        className="self-start px-4 py-2 text-sm font-semibold text-white bg-slate-800 hover:bg-black rounded-md transition-colors w-24"
                    >
                         {copyStatus === 'copied' ? (
                            <span className="flex items-center justify-center gap-1.5"><CheckIcon className="w-5 h-5" /> Copied</span>
                        ) : (
                            'Copy'
                        )}
                    </button>
                </div>
            </details>
        </div>
      </div>
    </div>
  );
};
