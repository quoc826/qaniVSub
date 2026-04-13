import { useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export default function LazyImage({
  src,
  alt,
  className = '',
  priority = false,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(priority);

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} ${!priority ? 'transition-opacity duration-200' : ''}`}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onLoad={() => setIsLoaded(true)}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/300x450/1a1a2e/white?text=No+Image';
        setIsLoaded(true);
      }}
      style={!isLoaded ? { backgroundColor: '#16213e' } : {}}
    />
  );
}