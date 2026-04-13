// Lấy key từ file .env.local
const apiKey = import.meta.env.VITE_GROQ_API_KEY as string;

export const getAnimeSuggestion = async (userMessage: string) => {
  if (!apiKey) {
    throw new Error("Chưa cấu hình Groq API Key!");
  }

  const systemPrompt = `Bạn là một chuyên gia về Anime có tên là "Qani Bot", làm việc cho website xem phim QaniVietSub.
Nhiệm vụ duy nhất của bạn là: Khi người dùng miêu tả một bộ phim anime, hãy tìm ra tên bộ phim đó.

Quy tắc trả lời:
1. Luôn vui vẻ, thân thiện.
2. Cung cấp Tên tiếng Việt và Tên gốc.
3. Giải thích ngắn gọn tại sao bạn nghĩ đó là bộ phim này.
4. NẾU người dùng hỏi ngoài lề, hãy TỪ CHỐI khéo léo.`;

  const url = "https://api.groq.com/openai/v1/chat/completions";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 512,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Lỗi từ Groq API:", data);
      throw new Error(data.error?.message || "Lỗi xác thực hoặc API quá tải.");
    }

    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    } else {
      return "Xin lỗi, mình không tìm thấy kết quả nào.";
    }

  } catch (error) {
    console.error("Lỗi kết nối:", error);
    throw error;
  }
};