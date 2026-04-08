import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

interface Comment {
  id: string;
  content: string;
  user_name: string;
  created_at: string;
}

export default function CommentSection({ animeSlug }: { animeSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState<any>(null);

  // 1. Lấy thông tin user và danh sách bình luận
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const fetchComments = async () => {
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('anime_slug', animeSlug)
        .order('created_at', { ascending: false });
      if (data) setComments(data);
    };

    fetchComments();
  }, [animeSlug]);

  // 2. Hàm gửi bình luận
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const { data, error } = await supabase.from('comments').insert([
      {
        content: newComment,
        user_id: user.id,
        user_name: user.user_metadata.display_name || 'Ẩn danh',
        anime_slug: animeSlug,
      },
    ]).select();

    if (error) {
      alert("Lỗi khi gửi bình luận!");
    } else {
      setComments([data[0], ...comments]);
      setNewComment('');
    }
  };

  return (
    <div className="mt-10 bg-[#111622] p-6 border border-white/5 rounded-sm">
      <h3 className="text-xl font-oswald uppercase text-white mb-6 border-l-4 border-[#d9534f] pl-3">
        Bình Luận
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            className="w-full bg-black border border-white/10 text-white p-4 text-sm rounded-sm focus:border-[#d9534f] outline-none min-h-[100px]"
          />
          <button
            type="submit"
            className="mt-2 bg-[#d9534f] text-white px-6 py-2 font-oswald font-bold uppercase text-xs hover:bg-white hover:text-black transition-all"
          >
            Gửi Bình Luận
          </button>
        </form>
      ) : (
        <div className="p-4 mb-6 text-sm text-center text-gray-400 bg-black/50">
          Vui lòng <a href="/dang-nhap" className="text-[#d9534f] font-bold">Đăng nhập</a> để bình luận.
        </div>
      )}

      <div className="space-y-6">
        {comments.map((cmt) => (
          <div key={cmt.id} className="flex gap-4 pb-4 border-b border-white/5">
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 font-bold text-white uppercase bg-gray-700 rounded-full">
              {cmt.user_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[#d9534f] font-bold text-sm uppercase">{cmt.user_name}</span>
                <span className="text-gray-500 text-[10px]">
                  {new Date(cmt.created_at).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-gray-300">{cmt.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}