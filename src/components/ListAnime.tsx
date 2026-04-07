import { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { phimApi } from '../services/phimApi';

const filterUniqueAnime = (animeList: any[]) => {
  const seen = new Set();
  return animeList.filter((anime) => {
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
  const { slug, keyword } = useParams(); // Lấy slug hoặc keyword từ URL
  const location = useLocation(); // Để biết đang ở route /the-loai hay /tim-kiem
  
  const [gridCards, setGridCards] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('Danh Sách Anime');

  const perPage = 24; 

  // Mỗi khi đổi slug, keyword hoặc trang, thực hiện load lại
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        let res;

        // Phân loại API dựa trên đường dẫn URL
        if (location.pathname.includes('/tim-kiem')) {
          res = await phimApi.searchAnime(keyword || '', currentPage, 40);
          setTitle(`Kết quả tìm kiếm: ${keyword}`);
        } else if (location.pathname.includes('/the-loai')) {
          res = await phimApi.getAnimeByCategory(slug || '', currentPage, 40);
          setTitle(`Thể loại: ${slug?.replace(/-/g, ' ')}`);
        } else {
          // Mặc định hoặc theo dạng phim (phim-bo, phim-le)
          res = await phimApi.getAnimeList(currentPage, 40); 
          setTitle('Danh Sách Anime Mới');
        }

        const items = res?.data?.items || [];
        const domain = res?.data?.APP_DOMAIN_CDN_IMAGE || 'https://phimimg.com';
        let mapped = items.map((item: any) => phimApi.formatAnimeData(item, domain));
        
        setGridCards(filterUniqueAnime(mapped).slice(0, perPage));

        const pagination = res?.data?.params?.pagination;
        setTotalPages(pagination?.totalItems ? Math.ceil(pagination.totalItems / pagination.totalItemsPerPage) : 10);

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        setError("Không tìm thấy dữ liệu phù hợp.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, keyword, currentPage, location.pathname]);

  // Reset trang về 1 khi đổi danh mục
  useEffect(() => { setCurrentPage(1); }, [slug, keyword]);

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
            <h1 className="text-3xl tracking-wide text-[#d9534f] uppercase border-l-4 font-oswald font-bold border-[#d9534f] pl-4">{title}</h1>
            <div className="h-[1px] flex-1 bg-[#d9534f]/20"></div>
        </div>

        <div className={`transition-opacity duration-300 ${loading ? 'opacity-30' : 'opacity-100'}`}>
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
                    <span className="text-[#f1c40f]">★</span> {anime.rating}
                  </div>
                </div>
                <div className="pt-2 pb-1">
                  <h2 className="text-[14px] font-bold text-[#e5e5e5] line-clamp-2 font-roboto mt-1 group-hover:text-[#d9534f]">{anime.title}</h2>
                  <span className="block mt-1 text-[12px] text-[#888]">Lượt xem: {anime.views}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-16 font-oswald">
            <span className="px-4 py-2 text-sm font-bold text-gray-400 bg-[#1a1a1a] border border-white/5 uppercase">Trang {currentPage} / {totalPages}</span>
            {getPageNumbers().map(num => (
              <button key={num} onClick={() => setCurrentPage(num)} className={`w-10 h-10 font-bold border ${currentPage === num ? 'bg-[#d9534f] text-white border-[#d9534f]' : 'bg-[#1a1a1a] text-gray-400 border-white/5'}`}>{num}</button>
            ))}
            <button onClick={() => setCurrentPage(totalPages)} className="px-4 py-2 text-sm font-bold text-white uppercase bg-[#1a1a1a] border border-white/5 hover:bg-[#d9534f]">Cuối</button>
          </div>
        )}
      </div>
    </div>
  );
}