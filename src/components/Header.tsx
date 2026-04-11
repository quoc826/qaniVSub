import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  const dananimeItems = [
    { label: 'Anime Bộ', slug: 'phim-bo' },
    { label: 'Anime Lẻ (Movie)', slug: 'phim-le' },
    { label: 'Anime Mới Cập Nhật', slug: 'hoat-hinh' },
  ];

  const categoryItems = [
    { label: 'Hành Động', slug: 'hanh-dong' },
    { label: 'Phiêu Lưu', slug: 'phieu-luu' },
    { label: 'Hài Hước', slug: 'hai-huoc' },
    { label: 'Chuyển Sinh', slug: 'isekai' },
    { label: 'Tình Cảm', slug: 'tinh-cam' },
    { label: 'Học Đường', slug: 'hoc-duong' },
    { label: 'Phép Thuật', slug: 'phep-thuat' },
    { label: 'Kinh Dị', slug: 'kinh-di' },
  ];

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/tim-kiem/${encodeURIComponent(keyword.trim())}`);
      setKeyword('');
      setOpenDropdown(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-black border-b shadow-xl border-white/10" ref={headerRef}>
      <div className="flex items-center justify-between h-20 gap-3 px-4 mx-auto max-w-7xl font-roboto">
        <Link to="/">
          <img src="/shigy.gif" alt="Logo" className="flex-shrink-0 h-10 transition-transform sm:h-14 hover:scale-105" />
        </Link>

        <nav className="items-center hidden space-x-2 text-sm font-bold uppercase lg:flex font-oswald">
          <Link to="/" className="px-3 py-2 text-white hover:text-[#d9534f]">Trang Chủ</Link>
          
          <div className="relative group">
            <button onClick={() => setOpenDropdown(openDropdown === 'danime' ? null : 'danime')} className="flex items-center gap-1 px-3 py-2 text-white hover:text-[#d9534f]">
              Dạng Anime <span className="text-[10px]">▼</span>
            </button>
            {openDropdown === 'danime' && (
              <div className="absolute left-0 w-48 py-2 bg-gray-900 border rounded-sm shadow-2xl top-full border-white/5">
                {dananimeItems.map(i => (
                  <Link key={i.slug} to={`/danh-sach/${i.slug}`} onClick={() => setOpenDropdown(null)} className="block px-4 py-2 text-gray-300 hover:bg-[#d9534f] hover:text-white">{i.label}</Link>
                ))}
              </div>
            )}
          </div>

          <div className="relative group">
            <button onClick={() => setOpenDropdown(openDropdown === 'cate' ? null : 'cate')} className="flex items-center gap-1 px-3 py-2 text-white hover:text-[#d9534f]">
              Thể Loại <span className="text-[10px]">▼</span>
            </button>
            {openDropdown === 'cate' && (
              <div className="absolute left-0 grid grid-cols-2 py-2 text-sm normal-case bg-gray-900 border rounded-sm shadow-2xl top-full w-80 border-white/5 font-roboto">
                {categoryItems.map(i => (
                  <Link key={i.slug} to={`/the-loai/${i.slug}`} onClick={() => setOpenDropdown(null)} className="block px-4 py-2 text-gray-300 hover:bg-[#d9534f] hover:text-white">{i.label}</Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center justify-end flex-1 gap-2 sm:gap-4">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-[120px] sm:max-w-64">
            <input 
              type="text" 
              value={keyword} 
              onChange={(e) => setKeyword(e.target.value)} 
              placeholder="Tìm Anime..." 
              className="bg-[#1a1a1a] border border-white/10 text-white text-[11px] sm:text-sm px-3 sm:px-4 py-2 w-full focus:border-[#d9534f] outline-none rounded-sm transition-all" 
            />
          </form>
          
          {user ? (
            <div className="flex items-center flex-shrink-0 gap-3 sm:gap-5">
              {/* MỤC YÊU THÍCH - HIỂN THỊ TRÊN CẢ MOBILE VÀ PC */}
              <Link 
                to="/yeu-thich" 
                className="flex items-center gap-1.5 group transition-all"
                title="Danh sách yêu thích"
              >
                <span className="text-[#d9534f] text-lg sm:text-xl group-hover:scale-125 transition-transform drop-shadow-[0_0_8px_rgba(217,83,79,0.5)]">♥</span>
                <span className="hidden sm:inline text-[12px] font-bold uppercase font-oswald text-gray-300 group-hover:text-white">
                  Yêu Thích
                </span>
              </Link>

              <div className="hidden sm:block w-[1px] h-6 bg-white/10"></div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-white text-[10px] sm:text-[12px] font-bold uppercase font-oswald leading-none max-w-[60px] sm:max-w-none truncate">
                    Hi, {user.user_metadata?.display_name || "Thành viên"}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="text-[#d9534f] text-[9px] sm:text-[10px] uppercase font-bold hover:text-white transition-colors mt-1"
                  >
                    Đăng xuất
                  </button>
                </div>
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#d9534f] to-[#b03a37] flex items-center justify-center text-white font-bold text-[10px] sm:text-xs border border-white/20 shadow-lg">
                  {user.user_metadata?.display_name?.charAt(0).toUpperCase() || "U"}
                </div>
              </div>
            </div>
          ) : (
            <Link 
              to="/dang-nhap" 
              className="bg-[#d9534f] text-white px-3 sm:px-5 py-2 sm:py-2.5 font-oswald font-bold uppercase text-[10px] sm:text-xs hover:bg-white hover:text-black transition-all shadow-[0_0_10px_rgba(217,83,79,0.3)] rounded-sm flex-shrink-0"
            >
              Đăng Nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}