import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { phimApi } from '../services/phimApi';

export default function WatchPage() {
  const { slug } = useParams<{ slug: string }>();
  const [movie, setMovie] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [currentServer, setCurrentServer] = useState<number>(0); // Index server đang chọn
  const [currentEpisode, setCurrentEpisode] = useState<any>(null); // Tập phim đang xem
  const [searchEpisode, setSearchEpisode] = useState(''); // Tìm kiếm tập phim
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await phimApi.getAnimeDetail(slug);
        
        if (data.status) {
          setMovie(data.movie);
          
          // PhimAPI thường trả về mảng các server trong episodes
          // Ví dụ: data.episodes = [{ server_name: 'Vietsub #1', server_data: [{ name: '1', link_embed: '...' }, ...] }]
          if (data.episodes && data.episodes.length > 0) {
            setEpisodes(data.episodes);
            
            // Mặc định chọn server đầu tiên và tập đầu tiên
            const defaultServer = data.episodes[0];
            if (defaultServer.server_data && defaultServer.server_data.length > 0) {
              setCurrentEpisode(defaultServer.server_data[0]);
            }
          }
        } else {
          setError("Không tìm thấy phim.");
        }
      } catch (err) {
        setError("Lỗi kết nối dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [slug]);

  // Hàm chuyển server
  const handleServerChange = (index: number) => {
    setCurrentServer(index);
    const selectedServerData = episodes[index].server_data;
    
    // Khi đổi server, cố gắng tìm tập tương ứng với tập hiện tại đang xem
    if (currentEpisode && selectedServerData) {
      const matchEp = selectedServerData.find((ep: any) => ep.name === currentEpisode.name);
      setCurrentEpisode(matchEp || selectedServerData[0]);
    }
  };

  // Lọc tập phim dựa theo ô tìm kiếm
  const serverData = episodes[currentServer]?.server_data || [];
  const filteredEpisodes = serverData.filter((ep: any) => 
    ep.name.toLowerCase().includes(searchEpisode.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0f1a]">
      <div className="w-10 h-10 border-2 border-[#d9534f] border-t-transparent animate-spin rounded-full"></div>
    </div>
  );

  if (error || !movie) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0b0f1a] text-white">
      <h2 className="text-2xl font-oswald text-[#d9534f]">{error || "Lỗi không xác định"}</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white font-roboto pb-24 selection:bg-[#d9534f]">
      
      {/* Container chính */}
      <div className="px-4 pt-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 pb-3 mb-6 text-sm text-gray-400 border-b border-white/10">
          <Link to="/" className="hover:text-[#d9534f] transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link to={`/phim/${slug}`} className="hover:text-[#d9534f] transition-colors">{movie.name}</Link>
          <span>/</span>
          <span className="text-[#d9534f]">Tập {currentEpisode?.name}</span>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          
          {/* CỘT TRÁI: VIDEO PLAYER & THÔNG TIN */}
          <div className="flex-1 w-full lg:w-2/3">
            
            {/* Khung Player */}
            <div className="relative w-full mb-4 overflow-hidden bg-black border rounded-sm shadow-2xl border-white/10 aspect-video">
              {currentEpisode ? (
                <iframe
                  src={currentEpisode.link_embed}
                  title="Player"
                  className="w-full h-full border-0"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="flex items-center justify-center h-full">Đang tải video...</div>
              )}
            </div>

            {/* Khung Hành Động Dưới Player */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#111622] border border-white/5 mb-8 text-sm text-gray-400">
              <button className="flex items-center gap-1 transition-colors hover:text-white">
                <span className="text-xl leading-none">⏭</span> Tập tiếp
              </button>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 transition-colors hover:text-white">
                  <span>💬</span> Bình luận
                </button>
                <button className="flex items-center gap-1 transition-colors hover:text-white">
                  <span>💡</span> Tắt đèn
                </button>
                <button className="flex items-center gap-1 transition-colors hover:text-white">
                  <span>🔖</span> Theo dõi
                </button>
                <button className="flex items-center gap-1 transition-colors hover:text-white">
                  <span>⬇️</span> Tải về
                </button>
              </div>
            </div>

            {/* Thông tin Phim Rút Gọn */}
            <div className="flex gap-4 p-4 border bg-black/30 border-white/5">
              <div className="flex-shrink-0 w-24">
                <img 
                  src={`https://phimimg.com/${movie.thumb_url}`} 
                  alt={movie.name} 
                  className="w-full aspect-[2/3] object-cover rounded-sm shadow-md"
                />
              </div>
              <div>
                <h1 className="text-2xl font-oswald font-bold text-[#d9534f] uppercase mb-1">
                  {movie.name}
                </h1>
                <h2 className="mb-3 text-sm italic text-gray-400">{movie.origin_name}</h2>
                <div 
                  className="text-sm leading-relaxed text-gray-300 line-clamp-4"
                  dangerouslySetInnerHTML={{ __html: movie.content }}
                />
              </div>
            </div>

          </div>

          {/* CỘT PHẢI: SERVER & DANH SÁCH TẬP */}
          <div className="w-full lg:w-1/3">
            
            {/* Chọn Server */}
            <div className="mb-6 bg-[#111622] border border-white/5 p-4">
              <h3 className="pb-2 mb-3 text-lg font-bold text-white border-b font-oswald border-white/10">Chọn Server:</h3>
              <div className="flex flex-wrap gap-2">
                {episodes.map((server: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleServerChange(index)}
                    className={`px-4 py-1.5 text-xs font-bold uppercase transition-colors rounded-sm ${
                      currentServer === index 
                        ? 'bg-[#d9534f] text-white shadow-[0_0_10px_rgba(217,83,79,0.3)]' 
                        : 'bg-[#1a1a1a] text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {server.server_name}
                  </button>
                ))}
              </div>
            </div>

            {/* Khung Danh sách tập */}
            <div className="bg-[#111622] border border-white/5 p-4">
              <h3 className="mb-3 text-lg font-bold text-white font-oswald">Danh Sách Tập</h3>
              
              {/* Ô tìm kiếm tập */}
              <input 
                type="text" 
                placeholder="🔍 Tìm tập theo số (VD: 1, 12...)" 
                value={searchEpisode}
                onChange={(e) => setSearchEpisode(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-black border border-white/10 rounded-sm mb-4 text-white focus:outline-none focus:border-[#d9534f] transition-colors"
              />

              {/* Danh sách nút bấm */}
              <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex flex-wrap gap-1.5">
                  {filteredEpisodes.length > 0 ? (
                    filteredEpisodes.map((ep: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentEpisode(ep)}
                        className={`w-[45px] h-9 text-xs font-bold transition-colors rounded-sm ${
                          currentEpisode?.name === ep.name
                            ? 'bg-[#d9534f] text-white'
                            : 'bg-[#1a1a1a] text-gray-300 border border-white/5 hover:bg-gray-700 hover:text-white hover:border-gray-500'
                        }`}
                        title={`Tập ${ep.name}`}
                      >
                        {ep.name}
                      </button>
                    ))
                  ) : (
                    <div className="w-full py-4 text-sm text-center text-gray-500">
                      Không tìm thấy tập "{searchEpisode}"
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Style phụ cho thanh cuộn danh sách tập */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d9534f; 
        }
      `}} />
    </div>
  );
}