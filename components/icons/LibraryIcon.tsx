import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  active?: boolean;
}

export const LibraryIcon: React.FC<IconProps> = ({ active, ...props }) => {
  if (active) {
    return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="m5.166 9.521 6.223 3.364a.75.75 0 0 0 .746 0l6.222-3.364a.75.75 0 0 0 0-1.333L12.135 4.82a.75.75 0 0 0-.746 0L5.166 8.188a.75.75 0 0 0 0 1.333Z" />
        <path d="m4.416 12.862 6.223 3.363a.75.75 0 0 0 .746 0l6.222-3.363a.75.75 0 0 0 0-1.332l-6.222-3.364a.75.75 0 0 0-.746 0l-6.223 3.364a.75.75 0 0 0 0 1.332Z" />
        <path d="m4.416 16.202 6.223 3.363a.75.75 0 0 0 .746 0l6.222-3.363a.75.75 0 0 0 0-1.332l-6.222-3.364a.75.75 0 0 0-.746 0l-6.223 3.364a.75.75 0 0 0 0 1.332Z" />
      </svg>
    );
  }
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
       <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  );
};