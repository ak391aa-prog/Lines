import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  active?: boolean;
}

export const ShortsIcon: React.FC<IconProps> = ({ active, ...props }) => {
    if (active) {
        return (
            <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.25 4.533A9.75 9.75 0 0 1 12 4.5c4.78 0 8.75 3.513 9.68 8.014a.75.75 0 0 1-1.48.274A8.25 8.25 0 0 0 12 6a8.25 8.25 0 0 0-8.055 5.571.75.75 0 0 1-1.48-.274A9.75 9.75 0 0 1 11.25 4.533Z" />
                <path d="M12.75 20.667A9.75 9.75 0 0 1 12 21c-4.78 0-8.75-3.513-9.68-8.014a.75.75 0 0 1 1.48-.274A8.25 8.25 0 0 0 12 18a8.25 8.25 0 0 0 8.055-5.571.75.75 0 0 1 1.48.274A9.75 9.75 0 0 1 12.75 20.667Z" />
                <path fillRule="evenodd" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" clipRule="evenodd" />
            </svg>
        )
    }
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
  );
};