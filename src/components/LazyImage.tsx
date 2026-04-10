import { useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderSrc?: string;
  width?: number;
  height?: number;
}

export default function LazyImage({
  src,
  alt,
  className = '',
  placeholderSrc = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 10 15%22%3E%3Crect fill=%2216213e%22 width=%2210%22 height=%2215%22/%3E%3C/svg%3E',
  width,
  height
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
      width={width}
      height={height}
      loading="lazy"
      onLoad={() => setIsLoaded(true)}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=No+Image';
        setIsLoaded(true);
      }}
      style={{
        backgroundImage: `url(${placeholderSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
}
