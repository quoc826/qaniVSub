import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useSWR from 'swr';
import { phimApi } from '../services/phimApi';
import LazyImage from './LazyImage';
import CommentSection from './CommentSection';
import SEO from './SEO'; // <-- ĐÃ THÊM IMPORT SEO

const fetchWatchData = async (slug: string) => {
  const data = await phimApi.getAnimeDetail(slug);
  if (!data.status) throw new Error("Không tìm thấy phim");
  return data;
};

export default function WatchPage() {
  const { slug } = useParams<{ slug: string }>();
  const [currentServer, setCurrentServer] = useState<number>(0);
  const [currentEpisode, setCurrentEpisode] = useState<any>(null);
  const [searchEpisode, setSearchEpisode] = useState('');

  const { data, error, isLoading } = useSWR(slug ? `watch-${slug}` : null, () => fetchWatchData(slug!), {
    revalidateOnFocus: false,
    dedupingInterval: 300000,
  });

  useEffect(() => {
    if (data?.episodes?.length > 0 && !currentEpisode) {
      setCurrentEpisode(data.episodes[0].server_data[0]);
    }
  }, [data, currentEpisode]);

  const handleEpisodeChange = (ep: any) => {
    setCurrentEpisode(ep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0f1a]">
      <div className="w-10 h-10 border-2 border-[#d9534f] border-t-transparent animate-spin rounded-full"></div>
    </div>
  );

  if (error || !data) return <div className="py-20 font-bold text-center text-red-500">Lỗi tải dữ liệu phim!</div>;

  const movie = data.movie;
  const episodes = data.episodes;
  const posterUrl = movie.poster_url?.startsWith('http') ? movie.poster_url : `https://phimimg.com/${movie.poster_url || movie.thumb_url}`;
  
  const filteredEpisodes = (episodes[currentServer]?.server_data || []).filter((ep: any) => 
    ep.name.toLowerCase().includes(searchEpisode.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white font-roboto pb-24">
      {/* KHỐI SEO ĐƯỢC CHÈN VÀO ĐÂY */}
      <SEO 
        title={`Xem ${movie.name} - Tập ${currentEpisode?.name || 'Mới'} Vietsub`}
        description={`Xem anime ${movie.name} Tập ${currentEpisode?.name || 'Mới'} Vietsub HD chất lượng cao, tốc độ nhanh, không giật lag tại QaniVietSub.`}
        keywords={`${movie.name} tập ${currentEpisode?.name}, xem anime ${movie.name}, ${movie.origin_name}`}
        image={posterUrl}
      />

      <div className="px-4 pt-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 pb-3 mb-6 text-sm text-gray-400 border-b border-white/10">
          <Link to="/" className="hover:text-[#d9534f] transition-colors">Trang chủ</Link> <span>/</span>
          <Link to={`/phim/${slug}`} className="hover:text-[#d9534f] transition-colors">{movie.name}</Link> <span>/</span>
          <span className="text-[#d9534f]">{currentEpisode?.name}</span>
        </div>

        <div className="grid items-start grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="relative w-full mb-4 bg-black border rounded-sm shadow-2xl border-white/10 aspect-video">
              <iframe src={currentEpisode?.link_embed} className="w-full h-full border-0 rounded-sm" allowFullScreen></iframe>
            </div>

            <div className="flex flex-wrap justify-between p-3 bg-[#111622] border border-white/5 mb-8 text-sm text-gray-400 rounded-sm">
              <button className="transition-colors hover:text-white">⏭ Tập tiếp</button>
              <div className="flex gap-4">
                <button className="transition-colors hover:text-white">💡 Tắt đèn</button>
                <button className="transition-colors hover:text-white">🔖 Theo dõi</button>
              </div>
            </div>

            <div className="flex flex-col gap-4 p-4 border rounded-sm sm:flex-row bg-black/30 border-white/5">
              <div className="flex-shrink-0 w-32 mx-auto sm:w-40 sm:mx-0">
                <LazyImage src={posterUrl} alt="" className="w-full aspect-[2/3] object-cover border border-white/10 shadow-lg rounded-sm" />
              </div>
              <div className="flex-1 overflow-hidden">
                <h1 className="text-2xl sm:text-3xl font-oswald font-bold text-[#d9534f] uppercase mb-1">{movie.name}</h1>
                <h2 className="mb-4 text-sm italic text-gray-400">{movie.origin_name}</h2>
                <div className="grid grid-cols-1 p-3 mb-4 text-sm text-gray-300 border rounded-sm sm:grid-cols-2 gap-x-4 gap-y-2 bg-black/20 border-white/5">
                  <p><strong className="text-gray-500">Tập mới:</strong> <span className="text-[#d9534f] font-bold">{movie.episode_current}</span></p>
                  <p><strong className="text-gray-500">Chất lượng:</strong> <span className="bg-[#d9534f] px-1.5 py-0.5 text-[10px] uppercase font-bold text-white rounded">{movie.quality}</span></p>
                  <p className="sm:col-span-2"><strong className="text-gray-500">Thể loại:</strong> {movie.category?.map((c:any)=>c.name).join(', ')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full gap-6 lg:col-span-1 lg:row-span-2">
            <div className="bg-[#111622] border border-white/5 p-4 rounded-sm">
              <h3 className="pb-2 mb-3 text-lg font-bold text-white uppercase border-b font-oswald border-white/10">Chọn Server</h3>
              <div className="flex flex-wrap gap-2">
                {episodes.map((s: any, i: number) => (
                  <button key={i} onClick={() => setCurrentServer(i)} className={`px-4 py-1.5 text-xs font-bold uppercase rounded-sm transition-colors ${currentServer === i ? 'bg-[#d9534f] text-white shadow-[0_0_10px_rgba(217,83,79,0.3)]' : 'bg-[#1a1a1a] text-gray-400 hover:bg-gray-700 hover:text-white'}`}>{s.server_name}</button>
                ))}
              </div>
            </div>

            <div className="bg-[#111622] border border-white/5 p-4 rounded-sm">
              <h3 className="mb-3 text-lg font-bold text-white uppercase font-oswald">Danh Sách Tập</h3>
              <input type="text" placeholder="🔍 Tìm tập..." value={searchEpisode} onChange={e => setSearchEpisode(e.target.value)} className="w-full px-3 py-2 text-sm bg-black border border-white/10 mb-4 focus:border-[#d9534f] outline-none text-white rounded-sm transition-colors" />
              <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex flex-wrap gap-1.5">
                  {filteredEpisodes.length > 0 ? (
                    filteredEpisodes.map((ep: any, idx: number) => (
                      <button key={idx} onClick={() => handleEpisodeChange(ep)} className={`w-[45px] h-9 text-xs font-bold rounded-sm transition-colors ${currentEpisode?.name === ep.name ? 'bg-[#d9534f] text-white' : 'bg-[#1a1a1a] text-gray-300 border border-white/5 hover:bg-gray-700 hover:text-white'}`}>{ep.name}</button>
                    ))
                  ) : (
                    <div className="w-full py-4 text-sm text-center text-gray-500">Không tìm thấy tập "{searchEpisode}"</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <CommentSection animeSlug={slug || 'unknown'} />
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `.custom-scrollbar::-webkit-scrollbar { width: 5px; } .custom-scrollbar::-webkit-scrollbar-track { background: #1a1a1a; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #d9534f; }`}} />
    </div>
  );
}