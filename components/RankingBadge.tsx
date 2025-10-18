import React from 'react';

interface RankingBadgeProps {
  rank?: number;
  countryCode?: string;
  small?: boolean;
  showFlag?: boolean;
}

export const RankingBadge: React.FC<RankingBadgeProps> = ({ rank, countryCode, small = false, showFlag = true }) => {
  if (!rank) {
    return null;
  }

  const flagUrl = countryCode ? `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png` : '';

  let rankColor = 'text-slate-200';
  if (rank === 1) rankColor = 'text-yellow-300';
  else if (rank === 2) rankColor = 'text-slate-300';
  else if (rank === 3) rankColor = 'text-orange-400';
  
  const containerClasses = small
    ? 'absolute top-1 right-1 z-10 bg-black/60 backdrop-blur-sm text-white font-bold px-1 py-0.5 rounded flex items-center gap-1'
    : 'absolute top-2 right-2 z-10 bg-black/60 backdrop-blur-sm text-white font-bold px-2 py-1 rounded-md flex items-center gap-1.5';
    
  const rankClasses = small
    ? `font-black text-xs ${rankColor}`
    : `font-black text-sm ${rankColor}`;

  const flagClasses = small ? 'w-3 h-auto rounded-sm' : 'w-4 h-auto rounded-sm';

  return (
    <div className={containerClasses} aria-label={`Rank: ${rank}`}>
      <span className={rankClasses}>#{rank}</span>
      {showFlag && countryCode && (
        <img src={flagUrl} alt={`${countryCode} flag`} className={flagClasses} />
      )}
    </div>
  );
};