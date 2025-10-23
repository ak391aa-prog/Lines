import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Video, Playlist } from '../types';
import { XIcon } from './icons/XIcon';
import { UploadCloudIcon } from './icons/UploadCloudIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { FilmIcon } from './icons/FilmIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { EditIcon } from './icons/EditIcon';

interface UploadPageProps {
  onClose: () => void;
  onUpload: (videoData: Omit<Video, 'id'>) => void;
  playlists: Playlist[];
  categories: string[];
}

type Stage = 'selecting' | 'uploading' | 'processing' | 'details';

const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '00:00';
    const date = new Date(0);
    date.setSeconds(seconds);
    const timeString = date.toISOString().substr(11, 8);
    return timeString.startsWith('00:') ? timeString.substr(3) : timeString;
};

export const UploadPage: React.FC<UploadPageProps> = ({ onClose, onUpload, playlists, categories }) => {
  const [stage, setStage] = useState<Stage>('selecting');
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<Video['visibility']>('public');
  const [category, setCategory] = useState(categories[0] || '');
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState('');
  const [videoDuration, setVideoDuration] = useState('00:00');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isPublishable = title.trim() !== '' && selectedThumbnail !== '';
  
  const generateThumbnails = useCallback((videoElement: HTMLVideoElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const generatedThumbs: string[] = [];
  
    const captureFrame = (time: number): Promise<string> => {
      return new Promise((resolve) => {
        videoElement.currentTime = time;
        videoElement.onseeked = () => {
          if (ctx) {
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg'));
          }
        };
      });
    };
  
    const duration = videoElement.duration;
    const capturePoints = [duration * 0.1, duration * 0.5, duration * 0.9];
  
    (async () => {
      for (const time of capturePoints) {
        const thumb = await captureFrame(time);
        generatedThumbs.push(thumb);
      }
      setThumbnails(generatedThumbs);
      setSelectedThumbnail(generatedThumbs[1] || generatedThumbs[0] || '');
      setStage('details');
    })();
  }, []);

  useEffect(() => {
    if (videoUrl && videoRef.current) {
        videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
                setVideoDuration(formatTime(videoRef.current.duration));
                generateThumbnails(videoRef.current);
            }
        };
    }
  }, [videoUrl, generateThumbnails]);


  const handleFileSelect = useCallback((selectedFile: File | null) => {
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile);
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
      setStage('uploading');
      setIsUploading(true);

      // Simulate upload
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const next = prev + 5;
          if (next >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            setVideoUrl(URL.createObjectURL(selectedFile));
            return 100;
          }
          return next;
        });
      }, 100);
    } else {
      alert('Please select a valid video file.');
    }
  }, []);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    handleFileSelect(droppedFile || null);
  };
  
  const handlePublish = () => {
    if (!isPublishable || !file) return;
    const videoData: Omit<Video, 'id'> = {
        title,
        description,
        thumbnailUrl: selectedThumbnail,
        videoUrl: videoUrl || '',
        category,
        visibility,
        duration: videoDuration,
        // Mock data for fields not in the form
        views: '0',
        viewCount: 0,
        uploadedAt: 'just now',
        uploadDate: new Date().toISOString(),
        channelName: 'CodeMasters',
        channelAvatarUrl: 'https://picsum.photos/seed/ch2/48/48',
        comments: [],
        likes: 0,
        dislikes: 0,
        followers: 1250000,
    };
    onUpload(videoData);
  };

  const renderContent = () => {
    switch (stage) {
      case 'selecting':
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center" onDragOver={handleDragOver} onDrop={handleDrop}>
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 rounded-2xl w-full max-w-lg h-80">
                <UploadCloudIcon className="w-20 h-20 text-slate-400 mb-4"/>
                <h2 className="text-2xl font-bold text-slate-800">Drag and drop video files to upload</h2>
                <p className="text-slate-500 mt-2">Your videos will be private until you publish them.</p>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-6 px-8 py-3 text-lg font-semibold text-white bg-amber-500 rounded-full hover:bg-amber-600 transition-colors"
                >
                    Select Files
                </button>
            </div>
            <p className="text-xs text-slate-400 mt-6">By submitting your videos to Lines, you acknowledge that you agree to Lines's Terms of Service and Community Guidelines.</p>
          </div>
        );
      case 'uploading':
      case 'processing':
      case 'details':
        return (
            <div className="p-4 sm:p-6 md:p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-6">Details</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title */}
                        <div className="relative">
                            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Title (required)</label>
                            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} maxLength={100} className="w-full bg-slate-100 border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                            <span className="absolute bottom-2 right-3 text-xs text-slate-400">{title.length}/100</span>
                        </div>
                        {/* Description */}
                        <div className="relative">
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} maxLength={5000} rows={5} className="w-full bg-slate-100 border border-slate-300 rounded-lg p-3 resize-y focus:outline-none focus:ring-2 focus:ring-amber-500" />
                            <span className="absolute bottom-2 right-3 text-xs text-slate-400">{description.length}/5000</span>
                        </div>
                        {/* Thumbnails */}
                        <div>
                            <h3 className="text-sm font-medium text-slate-700 mb-2">Thumbnail</h3>
                            <p className="text-xs text-slate-500 mb-2">Select or upload a picture that shows what's in your video. A good thumbnail stands out and draws viewers' attention.</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {thumbnails.map((thumb, index) => (
                                    <button key={index} onClick={() => setSelectedThumbnail(thumb)} className={`relative aspect-video rounded-lg overflow-hidden border-2 ${selectedThumbnail === thumb ? 'border-amber-500 ring-2 ring-amber-500' : 'border-transparent hover:border-slate-400'}`}>
                                        <img src={thumb} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                                <button className="flex flex-col items-center justify-center aspect-video bg-slate-100 hover:bg-slate-200 rounded-lg border-2 border-dashed border-slate-300">
                                    <UploadIcon className="w-8 h-8 text-slate-500"/>
                                    <span className="text-sm font-semibold text-slate-700 mt-1">Upload thumbnail</span>
                                </button>
                            </div>
                        </div>
                         {/* Category & Visibility */}
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <div className="relative">
                                    <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="w-full appearance-none bg-slate-100 border border-slate-300 rounded-lg p-3 pr-8 focus:outline-none focus:ring-2 focus:ring-amber-500">
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <ChevronDownIcon className="w-5 h-5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="visibility" className="block text-sm font-medium text-slate-700 mb-1">Visibility</label>
                                <div className="relative">
                                     <select id="visibility" value={visibility} onChange={e => setVisibility(e.target.value as Video['visibility'])} className="w-full appearance-none bg-slate-100 border border-slate-300 rounded-lg p-3 pr-8 focus:outline-none focus:ring-2 focus:ring-amber-500">
                                        <option value="public">Public</option>
                                        <option value="unlisted">Unlisted</option>
                                        <option value="private">Private</option>
                                    </select>
                                    <ChevronDownIcon className="w-5 h-5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                         </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-slate-800 rounded-lg overflow-hidden sticky top-8">
                             {videoUrl ? (
                                <video ref={videoRef} src={videoUrl} className="w-full aspect-video bg-black" controls={false} muted autoPlay={false} />
                             ) : (
                                <div className="w-full aspect-video bg-black flex items-center justify-center">
                                    <SpinnerIcon className="w-8 h-8 text-white animate-spin"/>
                                </div>
                             )}
                             <div className="p-4 text-white">
                                <p className="text-sm text-slate-300">Video link</p>
                                <a href="#" className="text-amber-400 text-sm hover:underline break-all">https://lines.io/watch/placeholder-id</a>
                                <p className="text-sm text-slate-300 mt-3">Filename</p>
                                <p className="text-sm text-white break-all">{file?.name}</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        );
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="upload-dialog-title">
      <header className="flex-shrink-0 flex items-center justify-between p-3 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <h2 id="upload-dialog-title" className="text-xl font-bold text-slate-900">
          {stage === 'selecting' ? 'Upload videos' : title || 'Untitled video'}
        </h2>
        <div>
            {stage === 'details' && (
                <button
                    onClick={handlePublish}
                    disabled={!isPublishable}
                    className={`px-5 py-2.5 text-base font-bold rounded-full transition-colors ${isPublishable ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
                >
                    Publish
                </button>
            )}
            <button
                onClick={onClose}
                className="p-2 ml-2 rounded-full hover:bg-slate-200 transition-colors text-slate-500 hover:text-slate-800"
                aria-label="Close upload dialog"
            >
                <XIcon className="w-6 h-6" />
            </button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        <input type="file" ref={fileInputRef} onChange={e => handleFileSelect(e.target.files?.[0] || null)} accept="video/*" className="hidden" />
        {renderContent()}
      </main>
      {stage !== 'selecting' && stage !== 'details' && (
        <footer className="flex-shrink-0 p-4 border-t border-slate-200 bg-white">
             <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                    {isUploading ? <SpinnerIcon className="w-8 h-8 text-amber-500 animate-spin" /> : <CheckCircleIcon className="w-8 h-8 text-green-500" />}
                </div>
                <div className="flex-grow">
                    <p className="font-semibold text-slate-800">
                        {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload complete. Processing...'}
                    </p>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                </div>
            </div>
        </footer>
      )}
    </div>
  );
};
