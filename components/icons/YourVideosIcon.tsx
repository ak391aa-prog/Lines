import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  active?: boolean;
}

export const YourVideosIcon: React.FC<IconProps> = ({ active, ...props }) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75h-7.5a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 12 3 2.25-3 2.25v-4.5Z" />
  </svg>
);