import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      alert("Chào mừng " + (data.user?.user_metadata?.display_name || "bạn") + " trở lại!");
      navigate('/');
    } catch (error: any) {
      alert("Lỗi đăng nhập: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0b0f1a] px-4 font-roboto pb-20">
      <div className="w-full max-w-md p-8 bg-[#111622] border border-white/5 rounded-sm shadow-2xl mt-12">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block mb-4">
            <img src="/shigy.gif" alt="Logo" className="h-16 mx-auto" />
          </Link>
          <h2 className="text-3xl font-bold tracking-wide text-white uppercase font-oswald">Đăng Nhập</h2>
          <p className="mt-2 text-sm text-gray-400">Lưu lịch sử xem và nhận thông báo anime mới</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email đăng nhập"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 text-sm text-white bg-black border border-white/10 rounded-sm focus:outline-none focus:border-[#d9534f] transition-colors"
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 text-sm text-white bg-black border border-white/10 rounded-sm focus:outline-none focus:border-[#d9534f] transition-colors"
            required
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-400 transition-colors cursor-pointer hover:text-white">
              <input type="checkbox" className="mr-2 accent-[#d9534f]" defaultChecked /> Ghi nhớ đăng nhập
            </label>
            <a href="#" className="text-[#d9534f] hover:text-white transition-colors">Quên mật khẩu?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 text-sm font-bold text-white uppercase transition-colors bg-[#d9534f] rounded-sm font-oswald hover:bg-white hover:text-black shadow-[0_0_15px_rgba(217,83,79,0.3)] disabled:opacity-50"
          >
            {loading ? "Đang kiểm tra..." : "Đăng Nhập"}
          </button>
        </form>

        <p className="mt-8 text-sm text-center text-gray-400">
          Chưa có tài khoản?{' '}
          <Link to="/dang-ky" className="font-bold text-[#d9534f] hover:text-white transition-colors uppercase font-oswald">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}