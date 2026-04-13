import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import AnimeCard from './AnimeCard';
import SEO from './SEO';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (data) setFavorites(data); 
        
      }
      setIsLoading(false);
    };
    fetchFavorites();
  }, []);

  if (isLoading) return <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center text-[#d9534f]">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white pb-24 font-roboto">
      <SEO title="Phim Yêu Thích" description="Danh sách anime yêu thích của bạn." />
      <div className="px-4 pt-12 mx-auto max-w-7xl">
        <h1 className="text-3xl font-oswald font-bold text-[#d9534f] uppercase border-l-4 border-[#d9534f] pl-4 mb-10">Tủ Phim Yêu Thích</h1>
        {favorites.length === 0 ? (
          <div className="py-20 text-center text-gray-500">Tủ phim của bạn đang trống.</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {favorites.map((fav) => (
              <AnimeCard key={fav.id} anime={{ 
                slug: fav.anime_slug, 
                title: fav.anime_title, 
                image: fav.anime_image, 
                episodes: fav.anime_episodes 
              }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}