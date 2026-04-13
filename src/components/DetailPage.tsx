import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { phimApi } from '../services/phimApi';
import LazyImage from './LazyImage';
import CommentSection from './CommentSection'; 
import SEO from './SEO'; 

const fetchDetail = async (slug: string) => {
  const data = await phimApi.getAnimeDetail(slug);
  if (!data.status) throw new Error("Không tìm thấy phim");
  return data.movie;
};

export default function DetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isNavigatingRandom, setIsNavigatingRandom] = useState(false);

  const { data: movie, error, isLoading } = useSWR(slug ? `detail-${slug}` : null, () => fetchDetail(slug!), {
    revalidateOnFocus: false,
  });

  const getImgUrl = (urlPath: string) => {
    if (!urlPath) return "https://via.placeholder.com/300x450";
    if (urlPath.startsWith('http')) return urlPath;
    return `https://phimimg.com/${urlPath}`;
  };

  const handleRandomAnime = async () => {
    setIsNavigatingRandom(true);
    try {
      const randomPage = Math.floor(Math.random() * 5) + 1;
      const res = await phimApi.getAnimeList('hoat-hinh', randomPage, 40);
      const items = res?.data?.items || [];
      if (items.length > 0) {
        const randomIndex = Math.floor(Math.random() * items.length);
        navigate(`/phim/${items[randomIndex].slug}`);
      }
    } catch (err) {
      alert("Lỗi khi tìm anime ngẫu nhiên!");
    } finally {
      setIsNavigatingRandom(false);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0f1a]">
      <div className="w-10 h-10 border-2 border-[#d9534f] border-t-transparent animate-spin rounded-full"></div>
    </div>
  );

  if (error || !movie) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0b0f1a] text-white">
      <h2 className="text-2xl font-oswald text-[#d9534f]">Không tìm thấy phim!</h2>
    </div>
  );

  const posterUrl = getImgUrl(movie.thumb_url);
  const bannerUrl = getImgUrl(movie.poster_url);
  const cleanDescription = movie.content ? movie.content.replace(/<[^>]*>?/gm, '').substring(0, 160) : "";

  return (
    <div className="relative min-h-screen bg-[#0b0f1a] text-white font-roboto pb-24">
      <SEO title={`Xem ${movie.name}`} description={cleanDescription} image={posterUrl} />

      <div className="absolute top-0 left-0 w-full h-[600px] bg-center bg-cover opacity-20 blur-md" style={{ backgroundImage: `url(${bannerUrl})` }}></div>
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-t from-[#0b0f1a] to-transparent"></div>

      <div className="relative z-10 px-4 pt-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between pb-3 mb-8 border-b border-white/10">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-[#d9534f]">Trang chủ</Link> / <span className="text-[#d9534f]">{movie.name}</span>
          </div>
          <button onClick={handleRandomAnime} disabled={isNavigatingRandom} className="bg-white/5 hover:bg-[#d9534f] text-white px-3 py-1.5 text-xs font-bold uppercase rounded-sm border border-white/10 flex items-center gap-1.5 disabled:opacity-50">
            🎲 {isNavigatingRandom ? 'Đang tìm...' : 'Random Anime'}
          </button>
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex-shrink-0 w-full md:w-64">
            <div className="relative aspect-[2/3] overflow-hidden border-2 border-white/5 shadow-2xl rounded-sm">
              <LazyImage src={posterUrl} alt={movie.name} className="object-cover w-full h-full" priority={true} />
              <Link to={`/xem-phim/${slug}`} className="absolute bottom-0 left-0 block w-full py-3 font-bold text-center bg-[#d9534f] font-oswald hover:bg-white hover:text-black">
                Xem Phim
              </Link>
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-oswald font-bold text-[#d9534f] uppercase mb-2">{movie.name}</h1>
            <div className="flex flex-wrap items-center gap-6 p-4 mb-6 border rounded-sm bg-black/40 border-white/5">
              <div className="flex items-center gap-2"><span className="text-[#f1c40f] text-2xl">★</span><span className="font-bold">8.2/10</span></div>
              <div className="w-[1px] h-8 bg-white/10"></div>
              <div><span className="font-bold text-[#d9534f]">{movie.episode_current}</span><p className="text-[10px] text-gray-500 uppercase">Tập</p></div>
              <div className="w-[1px] h-8 bg-white/10"></div>
              <div><span className="font-bold">{movie.year}</span><p className="text-[10px] text-gray-500 uppercase">Năm</p></div>
              <div className="w-[1px] h-8 bg-white/10"></div>
              <div><span className="font-bold">{movie.view?.toLocaleString() || 0}</span><p className="text-[10px] text-gray-500 uppercase">Lượt xem</p></div>
            </div>
            <div className="bg-black/20 p-5 border-l-4 border-[#d9534f] mb-8 text-gray-300 text-sm" dangerouslySetInnerHTML={{ __html: movie.content }} />
            <CommentSection animeSlug={slug || 'unknown'} />
          </div>
        </div>
      </div>
    </div>
  );
}