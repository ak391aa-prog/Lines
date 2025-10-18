import React, { useState, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

const Shimmer: React.FC = () => <div className="absolute inset-0 animate-shimmer"></div>;

export const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Reset loaded state when src changes, for components that might be reused
    setIsLoaded(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-slate-200 ${className}`}>
      {/* Placeholder with shimmer */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200">
          <Shimmer />
        </div>
      )}

      {/* Actual image, hidden until loaded */}
      <img
        src={src}
        alt={alt}
        loading="lazy" // Native lazy loading as a fallback
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};
