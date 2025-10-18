import React from 'react';
import { CheckCircleIcon } from './CheckCircleIcon';

interface SaveIconProps extends React.SVGProps<SVGSVGElement> {
  isSaved: boolean;
}

export const SaveIcon: React.FC<SaveIconProps> = ({ isSaved, ...props }) => {
  if (isSaved) {
    return (
        <CheckCircleIcon {...props} />
    );
  }
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
};