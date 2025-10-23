import React from 'react';
import { ShortsIcon } from './icons/ShortsIcon';

export const ShortsPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <ShortsIcon className="w-16 h-16 text-slate-300" />
            <h1 className="mt-4 text-4xl font-bold text-slate-900">Shorts</h1>
            <p className="mt-2 text-lg text-slate-500">
                Short-form video content is coming soon!
            </p>
        </div>
    );
};
