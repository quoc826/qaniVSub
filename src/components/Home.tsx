import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';

// Import Service API
import { phimApi } from '../services/phimApi';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Hàm lọc phim trùng lặp (Giữ lại phần mới nhất)
const filterUniqueAnime = (animeList: any[]) => {
  const seen = new Set();
  return animeList.filter((anime) => {
    // Rút trích "tên gốc" bằng cách xóa các chữ "season 2", "phần 3", "ss4", "2nd season"...
    const coreName = anime.title.toLowerCase()
      .replace(/(season|phần|part|ss|mùa)\s*\d+/g, '')
      .replace(/\d+(st|nd|rd|th)\s*(season|mùa)/g, '')
      .replace(/\s*(ss\d+|s\d+)\s*/g, '')
      .trim();

    if (seen.has(coreName)) return false; // Nếu đã có tên gốc này rồi -> bỏ qua (bị trùng)
    seen.add(coreName); // Nếu chưa có -> đánh dấu là đã thấy và giữ lại
    return true;
  });
};

export default function Home() {
  const [bannerCards, setBannerCards] = useState<any[]>([]); 
  const [swiperCards, setSwiperCards] = useState<any[]>([]);
  const [gridCards, setGridCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const perPage = 18; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch nhiều hơn (40) để bù đắp cho những phim bị lọc đi do trùng season
        const dataJson = await phimApi.getAnimeList(1, 40);
        const dataList = dataJson?.data?.items || [];
        const imageDomain = dataJson?.data?.APP_DOMAIN_CDN_IMAGE || 'https://phimimg.com';
        
        let mappedData = dataList.map((item: any) => phimApi.formatAnimeData(item, imageDomain));
        
        // Áp dụng bộ lọc trùng lặp
        mappedData = filterUniqueAnime(mappedData);

        // Chia dữ liệu đã lọc sạch cho các khu vực
        setBannerCards(mappedData.slice(0, 6)); 
        setSwiperCards(mappedData.slice(6, 15));
        setGridCards(mappedData.slice(15, 15 + perPage));

      } catch (err: any) {
        setError("Lỗi kết nối dữ liệu từ PhimAPI.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0f1a]">
      <div className="w-10 h-10 border-2 border-[#d9534f] border-t-transparent animate-spin rounded-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white pb-24 selection:bg-[#d9534f]">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        {/* --- BANNER & SLIDER SECTION --- */}
        {bannerCards.length > 0 && (
          <>
            <div className="flex items-center gap-4 pt-12 mb-8">
                <h2 className="text-3xl italic tracking-tighter uppercase font-oswald font-bold text-[#d9534f]">
                  Phim Mới Cập Nhật
                </h2>
                <div className="h-[1px] flex-1 bg-[#d9534f]/20"></div>
            </div>
            
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={18}
              slidesPerView={2}
              breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 6 } }}
              autoplay={{ delay: 3500 }}
              navigation
              className="mb-20 font-roboto"
            >
              {swiperCards.map((anime) => (
                <SwiperSlide key={anime.id}>
                  <Link to={`/phim/${anime.slug}`} className="block relative aspect-[2/3] overflow-hidden shadow-lg group">
                    <img src={anime.image} className="object-cover w-full h-full" alt={anime.title} />
                    <div className="absolute top-2 left-2 bg-[#d9534f] text-[9px] px-2 py-0.5 font-oswald font-bold uppercase shadow-xl">Hot</div>
                    <div className="absolute inset-0 opacity-60 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                    <p className="absolute bottom-2 left-2 right-2 text-[10px] font-bold truncate text-white uppercase italic group-hover:text-[#d9534f] transition-colors">{anime.title}</p>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="mb-24 font-roboto">
              <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                loop={true}
                autoplay={{ delay: 5000 }}
                pagination={{ clickable: true }}
                className="h-[320px] md:h-[580px] overflow-hidden shadow-2xl shadow-black/60"
              >
                {bannerCards.map((anime) => (
                  <SwiperSlide key={anime.id}>
                    <Link to={`/phim/${anime.slug}`} className="relative block w-full h-full group">
                      <img src={anime.banner} className="object-cover w-full h-full" alt={anime.title} />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f1a] via-[#0b0f1a]/40 to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-transparent to-transparent"></div>
                      <div className="absolute bottom-0 left-0 max-w-4xl p-8 md:p-24">
                        <span className="px-4 py-1 text-[10px] font-oswald font-bold bg-[#d9534f] mb-6 inline-block uppercase tracking-[0.2em] shadow-lg">Đề cử tuần</span>
                        <h1 className="mb-8 text-4xl italic font-black leading-none tracking-tighter uppercase md:text-8xl drop-shadow-2xl group-hover:text-[#d9534f] transition-colors">
                            {anime.title}
                        </h1>
                        <button className="px-12 py-4 text-xs font-bold text-white uppercase transition-colors bg-[#d9534f] shadow-2xl font-oswald hover:bg-white hover:text-black">
                          Xem Ngay
                        </button>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </>
        )}

        {/* --- GRID SECTION (Giao diện phẳng, không bo tròn) --- */}
        <div id="grid-section" className="flex items-center gap-4 pt-6 mt-12 mb-8">
            <h2 className="pl-3 text-2xl tracking-wide text-white uppercase border-l-4 font-oswald font-bold border-[#d9534f]">
                Mới Cập Nhật
            </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {gridCards.map((anime, index) => (
            <Link to={`/phim/${anime.slug}`} key={`${anime.id}-${index}`} className="relative flex flex-col block cursor-pointer font-roboto group">
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
                <span className="block mt-1 text-[12px] text-[#888]">Lượt xem: {anime.views}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* --- NÚT XEM TẤT CẢ --- */}
        <div className="flex justify-center mt-12 mb-8">
            <Link 
                to="/danh-sach"
                className="px-10 py-3 text-sm font-bold text-white uppercase transition-colors bg-[#d9534f] font-oswald hover:bg-white hover:text-black shadow-[0_0_15px_rgba(217,83,79,0.3)] inline-block text-center"
            >
                Xem Tất Cả Anime
            </Link>
        </div>

      </div>

      <footer className="py-16 text-center border-t mt-36 border-white/5 opacity-40">
          <p className="text-[10px] font-oswald font-bold uppercase tracking-[2em] text-gray-600">QaniVietSub • Private Library</p>
      </footer>
    </div>
  );
}