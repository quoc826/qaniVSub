import { createClient } from '@supabase/supabase-js';

// Thêm "as string" vào cuối mỗi dòng để ép kiểu
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Lỗi: Thiếu biến môi trường Supabase. Hãy kiểm tra file .env");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || ''); 