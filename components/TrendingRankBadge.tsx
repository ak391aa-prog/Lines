import React from 'react';

interface TrendingRankBadgeProps {
  rank: number;
}

export const TrendingRankBadge: React.FC<TrendingRankBadgeProps> = ({ rank }) => {
  if (rank === 1) {
    return (
      <div
        className="relative flex items-center justify-center w-12 h-14 bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-800
                   font-black text-2xl shadow-lg shadow-yellow-500/20 overflow-hidden
                   transform group-hover:scale-110 transition-transform duration-300"
        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
      >
        <div className="absolute inset-0 animate-shimmer-badge"></div>
        <span className="z-10">1</span>
      </div>
    );
  }

  if (rank === 2) {
    return (
      <div
        className="relative flex items-center justify-center w-12 h-12
                   transform group-hover:scale-110 transition-transform duration-300"
      >
        <div className="absolute w-8 h-8 bg-gradient-to-br from-slate-400 via-slate-200 to-slate-400
                     shadow-lg shadow-slate-500/20 overflow-hidden transform rotate-45 rounded-md">
             <div className="absolute inset-0 animate-shimmer-badge opacity-80"></div>
        </div>
        <span className="relative z-10 font-bold text-2xl text-slate-800">{rank}</span>
      </div>
    );
  }

  if (rank === 3) {
    return (
      <div
        className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-600 text-white/90
                   font-bold text-2xl rounded-lg shadow-lg shadow-amber-600/20 overflow-hidden
                   transform group-hover:scale-110 transition-transform duration-300
                   animate-fade-in-out-badge"
      >
        <span className="z-10">3</span>
      </div>
    );
  }

  return (
    <span className="text-3xl font-bold text-slate-400 group-hover:text-amber-500 transition-colors">
      {rank.toString().padStart(2, '0')}
    </span>
  );
};