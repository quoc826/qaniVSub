import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            display_name: name,
          }
        }
      });

      if (error) throw error;

      // Sign out ngay để tránh Supabase tự đăng nhập sau signUp
      await supabase.auth.signOut();

      alert("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
      navigate('/dang-nhap');
    } catch (error: any) {
      alert("Lỗi đăng ký: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0b0f1a] px-4 font-roboto pb-20">
      <div className="w-full max-w-md p-8 bg-[#111622] border border-white/5 rounded-sm shadow-2xl mt-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-wide text-white uppercase font-oswald">Đăng Ký Tài Khoản</h2>
          <p className="mt-2 text-sm text-gray-400">Tham gia cộng đồng Anime lớn nhất</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Tên hiển thị"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 text-sm text-white bg-black border border-white/10 rounded-sm focus:outline-none focus:border-[#d9534f] transition-colors"
            required
          />
          <input
            type="email"
            placeholder="Email của bạn"
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
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 text-sm text-white bg-black border border-white/10 rounded-sm focus:outline-none focus:border-[#d9534f] transition-colors"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 text-sm font-bold text-white uppercase transition-colors bg-[#d9534f] rounded-sm font-oswald hover:bg-white hover:text-black shadow-[0_0_15px_rgba(217,83,79,0.3)] disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Đăng Ký Ngay"}
          </button>
        </form>

        <p className="mt-8 text-sm text-center text-gray-400">
          Đã có tài khoản?{' '}
          <Link to="/dang-nhap" className="font-bold text-white hover:text-[#d9534f] transition-colors uppercase font-oswald">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}