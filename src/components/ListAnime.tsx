import { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { phimApi } from '../services/phimApi';

const filterAnime = (animeList: any[]) => {
  const seen = new Set();
  return animeList.filter((anime) => {
    // LOẠI BỎ PHIM KHÔNG PHẢI NHẬT BẢN
    if (!anime.countries.includes('nhat-ban')) return false;

    // LỌC TRÙNG LẶP
    const coreName = anime.title.toLowerCase()
      .replace(/(season|phần|part|ss|mùa)\s*\d+/g, '')
      .replace(/\d+(st|nd|rd|th)\s*(season|mùa)/g, '')
      .replace(/\s*(ss\d+|s\d+)\s*/g, '').trim();
    if (seen.has(coreName)) return false; 
    seen.add(coreName);
    return true;
  });
};

export default function ListAnime() {
  const { slug, keyword } = useParams();
  const location = useLocation(); 
  
  const [gridCards, setGridCards] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('Danh Sách Anime');

  const perPage = 24; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        let res;
        let currentTitle = 'Danh Sách Anime';

        // Fetch max limit = 64 (giới hạn an toàn của server)
        const fetchLimit = 64; 

        if (location.pathname.includes('/tim-kiem')) {
          res = await phimApi.searchAnime(keyword || '', currentPage, fetchLimit);
          currentTitle = `Tìm kiếm: ${keyword}`;
        } 
        else if (location.pathname.includes('/the-loai')) {
          res = await phimApi.getAnimeByCategory(slug || '', currentPage, fetchLimit);
          const formattedTitle = slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '';
          currentTitle = `Thể loại: ${formattedTitle}`;
        } 
        else if (location.pathname.includes('/danh-sach')) {
          res = await phimApi.getAnimeList(slug || 'hoat-hinh', currentPage, fetchLimit);
          if (slug === 'phim-bo') currentTitle = 'Anime Bộ';
          else if (slug === 'phim-le') currentTitle = 'Anime Lẻ (Movie)';
          else currentTitle = 'Anime Mới Cập Nhật';
        }
        else {
          res = await phimApi.getAnimeList('hoat-hinh', currentPage, fetchLimit);
        }

        setTitle(currentTitle);

        const items = res?.data?.items || [];
        const domain = res?.data?.APP_DOMAIN_CDN_IMAGE || 'https://phimimg.com';
        
        let mapped = items.map((item: any) => phimApi.formatAnimeData(item, domain));
        
        setGridCards(filterAnime(mapped).slice(0, perPage));

        const pagination = res?.data?.params?.pagination;
        if (pagination) {
          setTotalPages(Math.ceil(pagination.totalItems / pagination.totalItemsPerPage));
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        setError("Không tìm thấy dữ liệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, keyword, currentPage, location.pathname]);

  useEffect(() => { setCurrentPage(1); }, [slug, keyword, location.pathname]);

  const getPageNumbers = () => {
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  if (loading && currentPage === 1) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0f1a]">
      <div className="w-10 h-10 border-2 border-[#d9534f] border-t-transparent animate-spin rounded-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white pb-24 font-roboto selection:bg-[#d9534f]">
      <div className="px-4 pt-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
            <h1 className="text-3xl tracking-wide text-[#d9534f] uppercase border-l-4 font-oswald font-bold border-[#d9534f] pl-4">
              {title}
            </h1>
        </div>

        {error && <div className="mb-8 font-bold text-center text-red-500">{error}</div>}

        <div className={`transition-opacity duration-300 ${loading ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {gridCards.map((anime, index) => (
              <Link to={`/phim/${anime.slug}`} key={`${anime.id}-${index}`} className="relative flex flex-col block cursor-pointer group">
                <div className="relative aspect-[2/3] overflow-hidden bg-[#1a1a1a]">
                  <img src={anime.image} className="object-cover w-full h-full" alt={anime.title} />
                  <div className="absolute top-2 left-2 z-20 flex flex-col items-center bg-[#d9534f] text-white text-[9px] font-oswald px-1.5 py-0.5 shadow-md">
                    <span className="leading-none tracking-widest uppercase">Tập</span>
                    <span className="text-[13px] font-bold leading-none mt-0.5">{anime.episodes}</span>
                  </div>
                  <div className="absolute bottom-2 right-2 z-20 bg-black/80 text-white text-[11px] font-bold px-1.5 py-0.5 flex items-center gap-1">
                    <span className="text-[#f1c40f] text-[10px]">★</span> {anime.rating}
                  </div>
                </div>
                <div className="pt-2 pb-1">
                  <h2 className="text-[14px] font-bold text-[#e5e5e5] line-clamp-2 leading-[1.3] font-roboto mt-1 group-hover:text-[#d9534f] transition-colors">
                    {anime.title}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-16 mb-8 font-oswald">
            <span className="px-4 py-2 text-sm font-bold text-gray-400 bg-[#1a1a1a] border border-white/5 uppercase select-none">
              Trang {currentPage} / {totalPages}
            </span>
            {getPageNumbers().map(num => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                disabled={loading}
                className={`w-10 h-10 flex items-center justify-center text-sm font-bold transition-colors border ${
                  currentPage === num
                    ? 'bg-[#d9534f] text-white border-[#d9534f] shadow-[0_0_10px_rgba(217,83,79,0.4)]'
                    : 'bg-[#1a1a1a] text-gray-400 border-white/5 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || loading}
              className="px-4 py-2 text-sm font-bold text-white uppercase transition-colors bg-[#1a1a1a] border border-white/5 hover:bg-[#d9534f] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Cuối
            </button>
          </div>
        )}
      </div>
    </div>
  );
}