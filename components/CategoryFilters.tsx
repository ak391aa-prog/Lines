import React from 'react';
import { FireIcon } from './icons/FireIcon';

interface CategoryFiltersProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="sticky top-0 bg-slate-50/90 backdrop-blur-md z-10 border-b border-slate-200">
      <div className="relative flex items-center p-2 md:px-6">
        <div className="category-scroll flex items-center gap-3 overflow-x-auto whitespace-nowrap py-2 mx-auto px-2">
          {categories.map(category => {
            const isTrending = category === 'Trending';
            const isActive = selectedCategory === category;

            let buttonClasses = 'px-4 py-2 text-base font-medium rounded-full transition-colors flex items-center gap-2';
            if (isActive && !isTrending) { // Trending is handled by its own page, so it shouldn't look active here
                buttonClasses += ' bg-slate-900 text-white';
            } else {
              buttonClasses += ' bg-slate-200 text-slate-800 hover:bg-slate-300';
            }
             if (isTrending) {
                buttonClasses += ' hover:bg-red-500/10 hover:text-red-600';
            }


            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                aria-pressed={isActive && !isTrending}
                className={buttonClasses}
              >
                {isTrending && <FireIcon className="w-5 h-5" />}
                {category}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
};
