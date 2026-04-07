import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) navigate(`/tim-kiem/${keyword.trim()}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-black border-b shadow-xl border-white/10" ref={headerRef}>
      <div className="flex items-center justify-between h-20 px-4 mx-auto max-w-7xl font-roboto">
        <Link to="/"><img src="/shigy.gif" alt="Logo" className="h-14" /></Link>

        <nav className="items-center hidden space-x-2 text-sm uppercase md:flex font-oswald">
          <Link to="/" className="px-3 py-2 text-white hover:text-[#d9534f]">Trang Chủ</Link>
          
          {/* Dạng Anime */}
          <div className="relative">
            <button onClick={() => setOpenDropdown(openDropdown === 'danime' ? null : 'danime')} className="flex items-center gap-1 px-3 py-2 text-white">
              Dạng Anime <span className="text-[10px]">▼</span>
            </button>
            {openDropdown === 'danime' && (
              <div className="absolute left-0 w-48 py-2 bg-gray-900 border shadow-2xl top-full border-white/5">
                {dananimeItems.map(i => (
                  <Link key={i.slug} to={`/danh-sach/${i.slug}`} onClick={() => setOpenDropdown(null)} className="block px-4 py-2 text-gray-300 hover:bg-[#d9534f] hover:text-white">{i.label}</Link>
                ))}
              </div>
            )}
          </div>

          {/* Thể Loại */}
          <div className="relative">
            <button onClick={() => setOpenDropdown(openDropdown === 'cate' ? null : 'cate')} className="flex items-center gap-1 px-3 py-2 text-white">
              Thể Loại <span className="text-[10px]">▼</span>
            </button>
            {openDropdown === 'cate' && (
              <div className="absolute left-0 grid grid-cols-2 py-2 text-sm normal-case bg-gray-900 border shadow-2xl top-full w-80 border-white/5 font-roboto">
                {categoryItems.map(i => (
                  <Link key={i.slug} to={`/the-loai/${i.slug}`} onClick={() => setOpenDropdown(null)} className="block px-4 py-2 text-gray-300 hover:bg-[#d9534f] hover:text-white">{i.label}</Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Tìm Anime..." className="bg-[#1a1a1a] border border-white/10 text-white text-sm px-4 py-2 w-64 focus:border-[#d9534f] outline-none" />
          </form>
          <button className="bg-[#d9534f] text-white px-5 py-2 font-oswald font-bold uppercase text-xs hover:bg-white hover:text-black transition-all">Đăng Nhập</button>
        </div>
      </div>
    </header>
  );
}