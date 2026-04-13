import { useState, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderSrc?: string;
  priority?: boolean; // Thêm prop này để xác định ảnh quan trọng
}

export default function LazyImage({
  src,
  alt,
  className = '',
  placeholderSrc = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 10 15%22%3E%3Crect fill=%2216213e%22 width=%2210%22 height=%2215%22/%3E%3C/svg%3E',
  priority = false // Mặc định là false (vẫn lazy load cho các ảnh bên dưới)
}: LazyImageProps) {
  // Nếu là ảnh priority, mặc định cho isLoaded = true để không bị hiệu ứng chớp mờ
  const [isLoaded, setIsLoaded] = useState(priority);

  // MẸO PRO: Sử dụng weserv.nl để tự động convert ảnh sang định dạng WebP siêu nhẹ
  // Giúp giảm 50-70% dung lượng ảnh mà không mờ đi
  const getOptimizedUrl = (url: string) => {
    if (!url || !url.startsWith('http')) return url;
    // Bỏ qua tối ưu nếu ảnh là gif
    if (url.toLowerCase().endsWith('.gif')) return url;
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=webp&q=80`;
  };

  const optimizedSrc = getOptimizedUrl(src);

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      // Nếu priority: Bỏ luôn transition để hiện ngay lập tức
      // Nếu không: Giảm duration xuống 200ms cho mượt mà không bị cảm giác rề rà
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} ${!priority ? 'transition-opacity duration-200' : ''}`}
      loading={priority ? 'eager' : 'lazy'} // Eager: Tải ngay lập tức, Lazy: Cuộn tới mới tải
      fetchPriority={priority ? 'high' : 'auto'} // Báo cho trình duyệt dồn tài nguyên tải ảnh này trước
      onLoad={() => setIsLoaded(true)}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=No+Image';
        setIsLoaded(true);
      }}
      style={!isLoaded ? {
        backgroundImage: `url(${placeholderSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : {}}
    />
  );
}