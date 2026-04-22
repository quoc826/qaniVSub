// Skeleton card – hiển thị trong khi đợi API
export default function SkeletonCard() {
  return (
    <div className="relative flex flex-col animate-pulse">
      {/* Ảnh thumbnail */}
      <div className="aspect-[2/3] rounded-sm bg-[#1e2438]" />
      {/* Tiêu đề */}
      <div className="pt-2 pb-1 space-y-1.5">
        <div className="h-3 bg-[#1e2438] rounded w-full" />
        <div className="h-3 bg-[#1e2438] rounded w-3/4" />
      </div>
    </div>
  );
}

// Grid nhiều skeleton card
export function SkeletonGrid({ count = 18 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// Skeleton cho trang detail
export function SkeletonDetail() {
  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white pb-24 animate-pulse">
      {/* Banner mờ */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[#1e2438] opacity-30" />
      <div className="relative z-10 px-4 pt-8 mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 mt-16 md:flex-row">
          {/* Poster */}
          <div className="flex-shrink-0 w-full md:w-64">
            <div className="aspect-[2/3] bg-[#1e2438] rounded-sm" />
          </div>
          {/* Thông tin */}
          <div className="flex-1 space-y-4">
            <div className="h-10 bg-[#1e2438] rounded w-3/4" />
            <div className="h-6 bg-[#1e2438] rounded w-1/2" />
            <div className="h-24 bg-[#1e2438] rounded w-full" />
            <div className="h-4 bg-[#1e2438] rounded w-full" />
            <div className="h-4 bg-[#1e2438] rounded w-5/6" />
            <div className="h-4 bg-[#1e2438] rounded w-4/6" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton cho banner swiper lớn
export function SkeletonBanner() {
  return (
    <div className="h-[320px] md:h-[580px] bg-[#1e2438] rounded-sm animate-pulse mb-24 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 p-8 md:p-24 space-y-4 w-full max-w-xl">
        <div className="h-4 bg-[#2a3050] rounded w-24" />
        <div className="h-16 bg-[#2a3050] rounded w-3/4" />
        <div className="h-12 bg-[#2a3050] rounded w-40" />
      </div>
    </div>
  );
}

// Skeleton swiper nhỏ (phim mới cập nhật)
export function SkeletonSwiper({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 mb-20 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-[2/3] bg-[#1e2438] rounded-sm" />
      ))}
    </div>
  );
}
