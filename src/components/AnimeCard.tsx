import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LazyImage from './LazyImage';
import { supabase } from '../services/supabaseClient';
import { phimApi } from '../services/phimApi';

export default function AnimeCard({ anime, priority = false }: { anime: any, priority?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [movieDetail, setMovieDetail] = useState<any>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('anime_slug', anime.slug)
          .single();
        if (data) setIsFavorite(true);
      }
    };
    checkStatus();
    return () => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); };
  }, [anime.slug]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return alert("Vui lòng đăng nhập!");

    if (isFavorite) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('anime_slug', anime.slug);
      setIsFavorite(false);
    } else {
      await supabase.from('favorites').insert([{
        user_id: user.id,
        anime_slug: anime.slug,
        anime_title: anime.title,
        anime_image: anime.image,
        anime_episodes: anime.episodes
      }]);
      setIsFavorite(true);
    }
  };

  const handleMouseEnter = async () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(true);
    if (!movieDetail && !isLoadingContent) {
      setIsLoadingContent(true);
      const data = await phimApi.getAnimeDetail(anime.slug);
      if (data.movie) setMovieDetail(data.movie);
      setIsLoadingContent(false);
    }
  };

  const cleanContent = movieDetail?.content ? movieDetail.content.replace(/<[^>]*>?/gm, '') : "Đang tải...";

  return (
    <div 
      className="relative flex flex-col cursor-pointer font-roboto group" 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={() => { hoverTimeoutRef.current = setTimeout(() => setIsHovered(false), 150); }}
    >
      <Link to={`/phim/${anime.slug}`}>
        <div className="relative aspect-[2/3] overflow-hidden bg-[#1a1a1a] rounded-sm">
          <LazyImage 
            src={anime.image} 
            alt={anime.title} 
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" 
            priority={priority} // TRUYỀN PRIORITY VÀO ĐÂY
          />
          
          <button 
            onClick={toggleFavorite} 
            className={`absolute top-2 right-2 z-30 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 border border-white/10 transition-opacity 
              ${isHovered ? 'opacity-100' : 'opacity-100 md:opacity-0'} 
              ${isFavorite ? 'text-[#d9534f]' : 'text-white'}`}
          >
            <span className="text-lg">{isFavorite ? '♥' : '♡'}</span>
          </button>
          
          <div className="absolute top-2 left-2 z-20 flex flex-col items-center bg-[#d9534f] text-white text-[9px] font-oswald px-1.5 py-0.5 shadow-md">
            <span className="leading-none tracking-widest uppercase">Tập</span>
            <span className="text-[13px] font-bold leading-none mt-0.5">{anime.episodes}</span>
          </div>
        </div>

        <div className="pt-2 pb-1">
          <h2 className="text-[14px] font-bold text-[#e5e5e5] line-clamp-2 leading-[1.3] mt-1 group-hover:text-[#d9534f] transition-colors">
            {anime.title}
          </h2>
        </div>
      </Link>

      {isHovered && (
        <div className="absolute top-0 z-50 hidden w-[280px] pl-2 md:block left-full animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#111622] p-4 border shadow-2xl border-white/10 rounded-sm">
            <h3 className="text-[#d9534f] font-oswald font-bold text-base uppercase mb-2">{anime.title}</h3>
            <p className="text-[12px] text-gray-400 line-clamp-4 leading-relaxed mb-4">{cleanContent}</p>
            <button 
              onClick={toggleFavorite} 
              className={`w-full py-2 font-bold text-center text-[12px] uppercase transition-colors rounded-sm border ${isFavorite ? 'bg-[#d9534f] border-[#d9534f] text-white' : 'bg-transparent border-white/20 text-white hover:bg-[#d9534f]'}`}
            >
              {isFavorite ? '♥ Đã Yêu Thích' : '♡ Thêm Yêu Thích'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}