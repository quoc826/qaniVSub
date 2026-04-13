import { useState, useRef, useEffect } from 'react';
import { getAnimeSuggestion } from './chat';

export default function AiChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Chào bạn! Bạn quên tên bộ Anime nào đó? Hãy miêu tả nội dung, mình sẽ tìm giúp bạn nhé! 🧙‍♂️' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // Gọi AI từ file chat.ts
      const reply = await getAnimeSuggestion(userMsg);
      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Xin lỗi, AI đang bận hoặc bị lỗi kết nối!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed z-50 bottom-6 right-6 font-roboto">
      {/* Nút mở Chatbox */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(217,83,79,0.5)] hover:scale-110 transition-transform cursor-pointer overflow-hidden border-2 border-white/20 animate-bounce"
        >
          <img src="/shigy.gif" alt="Qani Bot" className="w-full h-full object-cover" />
        </button>
      )}

      {/* Cửa sổ Chat */}
      {isOpen && (
        <div className="w-[320px] sm:w-[380px] h-[500px] bg-[#111622] border border-white/10 shadow-2xl rounded-sm flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#d9534f] p-3 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <img src="/shigy.gif" alt="Qani Bot" className="w-7 h-7 rounded-full object-cover" />
              <h3 className="text-sm font-bold tracking-wide uppercase font-oswald">Qani AI Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="px-2 font-bold text-white transition-colors hover:text-black">✕</button>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto text-sm bg-black/50 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-sm leading-relaxed ${
                  msg.role === 'user' ? 'bg-[#d9534f] text-white' : 'bg-[#1a1a1a] text-gray-200 border border-white/5'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#1a1a1a] border border-white/5 p-3 rounded-sm text-gray-400 flex gap-1 items-center">
                  <div className="w-2 h-2 bg-[#d9534f] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#d9534f] rounded-full animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-2 h-2 bg-[#d9534f] rounded-full animate-bounce [animation-delay:-.5s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="p-3 bg-[#111622] border-t border-white/10 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Vd: Phim có ông thầy giáo là bạch tuộc..."
              className="flex-1 bg-black border border-white/10 text-white px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#d9534f]"
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()} className="bg-[#d9534f] text-white px-4 py-2 font-bold uppercase text-xs rounded-sm hover:bg-white hover:text-black disabled:opacity-50 transition-colors">
              Gửi
            </button>
          </form>
        </div>
      )}
    </div>
  );
}