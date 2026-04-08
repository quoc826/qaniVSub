import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#080b13] border-t border-white/5 pt-12 pb-8 font-roboto">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
          
          <div className="space-y-4">
            <Link to="/">
              <img src="/shigy.gif" alt="Logo" className="h-12 transition-opacity opacity-80 hover:opacity-100" />
            </Link>
            <p className="text-sm text-gray-400">
              © Copyright {currentYear} <span className="text-[#d9534f] font-bold">QaniVietSub.TV</span>. All rights reserved.
            </p>
          </div>

          <div className="text-gray-500 text-[13px] leading-relaxed">
            <h4 className="mb-3 tracking-wider text-white uppercase font-oswald">Miễn trừ trách nhiệm</h4>
            <p className="mb-3">
              Trang web này cung cấp nội dung anime chỉ với mục đích giải trí và 
              <span className="text-gray-400"> không chịu trách nhiệm</span> về bất kỳ nội dung quảng cáo, liên kết của bên thứ ba hiển thị trên trang web của chúng tôi.
            </p>
            <p>
              Tất cả thông tin và hình ảnh trên website đều được thu thập từ internet. Chúng tôi không chịu trách nhiệm về bất kỳ nội dung nào. 
              Nếu bạn hoặc tổ chức của bạn có vấn đề gì liên quan đến nội dung hiển thị trên website, vui lòng liên hệ với chúng tôi để được giải quyết.
            </p>
          </div>
        </div>

        {/* --- KHỐI SEO VÔ HÌNH (INVISIBLE SEO) --- */}
        {/* Khối này có opacity-0 và pointer-events-none để người dùng không thấy và không bấm vào được */}
        <div className="opacity-0 pointer-events-none h-0 overflow-hidden select-none text-[2px]">
          <h2>anime, anime vietsub, xem anime online, anime hay, anime moi nhat, animevietsub tv, 
              one piece vietsub, naruto, boruto, dragon ball super, luffy, zoro, 
              hoat hinh nhat ban, anime hd, thien phong anime, vuighe, animehay, 
              hh3d, anime full hd, anime moi nhat 2026, qanivietsub, qani anime</h2>
        </div>

        <div className="pt-8 mt-8 text-center border-t border-white/5">
          <p className="text-xs text-gray-600">
            Trang web vận hành bởi <span className="hover:text-[#d9534f] cursor-pointer">Qani</span>
          </p>
        </div>
      </div>
    </footer>
  );
}