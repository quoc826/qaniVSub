import { useParams, Link } from 'react-router-dom';
import useSWR from 'swr';
import { phimApi } from '../services/phimApi';
import CommentSection from './CommentSection'; // Import component bình luận

const fetchDetail = async (slug: string) => {
  const data = await phimApi.getAnimeDetail(slug);
  if (!data.status) throw new Error("Không tìm thấy phim");
  return data.movie;
};

export default function DetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: movie, error, isLoading } = useSWR(slug ? `detail-${slug}` : null, () => fetchDetail(slug!), {
    revalidateOnFocus: false,
  });

  const getImgUrl = (urlPath: string) => {
    if (!urlPath) return "https://via.placeholder.com/300x450";
    if (urlPath.startsWith('http')) return urlPath;
    return `https://phimimg.com/${urlPath}`;
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0f1a]">
      <div className="w-10 h-10 border-2 border-[#d9534f] border-t-transparent animate-spin rounded-full"></div>
    </div>
  );

  if (error || !movie) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0b0f1a] text-white">
      <h2 className="text-2xl font-oswald text-[#d9534f]">Không tìm thấy dữ liệu phim!</h2>
    </div>
  );

  const posterUrl = getImgUrl(movie.thumb_url);
  const bannerUrl = getImgUrl(movie.poster_url);

  return (
    <div className="relative min-h-screen bg-[#0b0f1a] text-white font-roboto pb-24">
      {/* BACKGROUND MỜ */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-center bg-cover opacity-20 blur-md" style={{ backgroundImage: `url(${bannerUrl})` }}></div>
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-t from-[#0b0f1a] to-transparent"></div>

      {/* CONTENT CHÍNH */}
      <div className="relative z-10 px-4 pt-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 pb-3 mb-8 text-sm text-gray-400 border-b border-white/10">
          <Link to="/" className="hover:text-[#d9534f] transition-colors">Trang chủ</Link>
          <span>/</span>
          <span className="text-[#d9534f]">{movie.name}</span>
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          {/* CỘT TRÁI: POSTER & NÚT XEM PHIM */}
          <div className="flex-shrink-0 w-full md:w-64">
            <div className="relative aspect-[2/3] overflow-hidden border-2 border-white/5 shadow-2xl bg-[#1a1a1a] rounded-sm">
              <img src={posterUrl} alt={movie.name} className="object-cover w-full h-full" />
              <Link to={`/xem-phim/${slug}`} className="absolute bottom-0 left-0 block w-full py-3 font-bold text-center text-white uppercase transition-colors bg-[#d9534f] font-oswald hover:bg-white hover:text-black shadow-[0_-5px_20px_rgba(217,83,79,0.4)]">
                Xem Phim
              </Link>
            </div>
          </div>

          {/* CỘT PHẢI: CHI TIẾT */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-oswald font-bold text-[#d9534f] uppercase tracking-wide leading-tight mb-2">{movie.name}</h1>
            <h2 className="mb-6 text-xl italic text-gray-400 font-roboto">{movie.origin_name}</h2>

            <div className="flex items-center gap-6 p-4 mb-6 border rounded-sm bg-black/40 border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-[#f1c40f] text-2xl">★</span>
                <div className="flex flex-col">
                  <span className="text-lg font-bold leading-none text-white">8.2/10</span>
                  <span className="text-[10px] text-gray-500 uppercase">Đánh giá</span>
                </div>
              </div>
              <div className="w-[1px] h-8 bg-white/10"></div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none text-[#d9534f]">{movie.episode_current}</span>
                <span className="text-[10px] text-gray-500 uppercase">Tập Phim</span>
              </div>
              <div className="w-[1px] h-8 bg-white/10"></div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none text-white">{movie.year}</span>
                <span className="text-[10px] text-gray-500 uppercase">Năm SX</span>
              </div>
            </div>

            <div className="bg-black/20 p-5 border-l-4 border-[#d9534f] mb-8 leading-relaxed text-gray-300 text-sm md:text-base rounded-r-sm">
              <div dangerouslySetInnerHTML={{ __html: movie.content }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-300 bg-[#111622] p-6 border border-white/5 rounded-sm">
              <p><strong className="text-gray-500">Thời lượng:</strong> {movie.time}</p>
              <p><strong className="text-gray-500">Chất lượng:</strong> <span className="bg-[#d9534f] text-white px-1.5 py-0.5 text-[10px] rounded uppercase font-bold">{movie.quality}</span></p>
              <p className="col-span-1 md:col-span-2"><strong className="text-gray-500">Thể loại:</strong> {movie.category?.map((c: any) => c.name).join(', ') || 'Đang cập nhật'}</p>
              <p className="col-span-1 md:col-span-2"><strong className="text-gray-500">Quốc gia:</strong> {movie.country?.map((c: any) => c.name).join(', ') || 'Đang cập nhật'}</p>
            </div>

            <CommentSection animeSlug={slug || 'unknown'} />
          </div>
        </div>
      </div>
    </div>
  );
}