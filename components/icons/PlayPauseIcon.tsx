import React from 'react';

interface PlayPauseIconProps extends React.SVGProps<SVGSVGElement> {
  isPlaying: boolean;
}

export const PlayPauseIcon: React.FC<PlayPauseIconProps> = ({ isPlaying, ...props }) => {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Play Icon Group */}
      <g
        className={`transition-all duration-300 ease-in-out transform origin-center ${
          isPlaying ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
        }`}
      >
        <path fillRule="evenodd" d="M6.32 4.152C5.08 3.39 4 4.295 4 5.766v12.468c0 1.47 1.08 2.376 2.32 1.614l10.56-6.234c1.24-.732 1.24-2.496 0-3.228L6.32 4.152Z" clipRule="evenodd" />
      </g>
      
      {/* Pause Icon Group */}
      <g
        className={`transition-all duration-300 ease-in-out transform origin-center ${
          isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}
      >
        <path fillRule="evenodd" d="M6 5.25a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6A.75.75 0 0 1 6 5.25Zm9 0a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6A.75.75 0 0 1 15 5.25Z" clipRule="evenodd" />
      </g>
    </svg>
  );
};