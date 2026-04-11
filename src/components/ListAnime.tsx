import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import useSWR from 'swr';
import { phimApi } from '../services/phimApi';
import AnimeCard from './AnimeCard'; // Import AnimeCard mới

const filterAnime = (animeList: any[]) => {
  const seen = new Set();
  return animeList.filter((anime) => {
    if (!anime.countries.includes('nhat-ban')) return false;
    const coreName = anime.title.toLowerCase()
      .replace(/(season|phần|part|ss|mùa)\s*\d+/g, '')
      .replace(/\d+(st|nd|rd|th)\s*(season|mùa)/g, '')
      .replace(/\s*(ss\d+|s\d+)\s*/g, '').trim();
    if (seen.has(coreName)) return false; 
    seen.add(coreName);
    return true;
  });
};

const fetchList = async ([_, path, slug, keyword, page]: any[]) => {
  let res;
  const fetchLimit = 64; 

  if (path.includes('/tim-kiem')) {
    res = await phimApi.searchAnime(keyword || '', page, fetchLimit);
  } else if (path.includes('/the-loai')) {
    res = await phimApi.getAnimeByCategory(slug || '', page, fetchLimit);
  } else if (path.includes('/danh-sach')) {
    res = await phimApi.getAnimeList(slug || 'hoat-hinh', page, fetchLimit);
  } else {
    res = await phimApi.getAnimeList('hoat-hinh', page, fetchLimit);
  }

  const items = res?.data?.items || [];
  const domain = res?.data?.APP_DOMAIN_CDN_IMAGE || 'https://phimimg.com';
  const mapped = items.map((item: any) => phimApi.formatAnimeData(item, domain));
  
  return {
    data: filterAnime(mapped).slice(0, 24),
    pagination: res?.data?.params?.pagination
  };
};

export default function ListAnime() {
  const { slug, keyword } = useParams();
  const location = useLocation(); 
  const [currentPage, setCurrentPage] = useState(1);

  // SWR Cache dựa trên Path, Slug, Keyword và Trang
  const { data, error, isLoading } = useSWR(
    ['list', location.pathname, slug, keyword, currentPage],
    fetchList,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  useEffect(() => { setCurrentPage(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }, [slug, keyword, location.pathname]);

  const gridCards = data?.data || [];
  const totalPages = data?.pagination ? Math.ceil(data.pagination.totalItems / data.pagination.totalItemsPerPage) : 1;

  let title = 'Danh Sách Anime';
  if (location.pathname.includes('/tim-kiem')) title = `Tìm kiếm: ${keyword}`;
  else if (location.pathname.includes('/the-loai')) title = `Thể loại: ${slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : ''}`;
  else if (slug === 'phim-bo') title = 'Anime Bộ';
  else if (slug === 'phim-le') title = 'Anime Lẻ (Movie)';
  else if (slug === 'hoat-hinh') title = 'Anime Mới Cập Nhật';

  const getPageNumbers = () => {
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white pb-24 font-roboto selection:bg-[#d9534f]">
      <div className="px-4 pt-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
            <h1 className="text-3xl tracking-wide text-[#d9534f] uppercase border-l-4 font-oswald font-bold border-[#d9534f] pl-4">
              {title}
            </h1>
        </div>

        {error && <div className="mb-8 font-bold text-center text-red-500">Lỗi không thể tải dữ liệu!</div>}

        <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
          {/* THAY THẾ BẰNG ANIMECARD VỪA TẠO */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {gridCards.map((anime: any, index: number) => (
              <AnimeCard key={`${anime.id}-${index}`} anime={anime} />
            ))}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-16 mb-8 font-oswald">
            <span className="px-4 py-2 text-sm font-bold text-gray-400 bg-[#1a1a1a] border border-white/5 uppercase select-none rounded-sm">
              Trang {currentPage} / {totalPages}
            </span>
            {getPageNumbers().map(num => (
              <button
                key={num}
                onClick={() => { setCurrentPage(num); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={isLoading}
                className={`w-10 h-10 flex items-center justify-center text-sm font-bold transition-colors border rounded-sm ${
                  currentPage === num
                    ? 'bg-[#d9534f] text-white border-[#d9534f] shadow-[0_0_10px_rgba(217,83,79,0.4)]'
                    : 'bg-[#1a1a1a] text-gray-400 border-white/5 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}