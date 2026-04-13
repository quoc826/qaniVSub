import { supabase } from './supabaseClient';

// ─── Module-level session cache ───────────────────────────────────────────────
// Tránh gọi getSession() riêng lẻ cho từng AnimeCard (18 cards = 18 lần gọi)
let _sessionPromise: Promise<any> | null = null;

export function getSessionOnce() {
  if (!_sessionPromise) {
    _sessionPromise = supabase.auth.getSession().then(({ data }) => data.session?.user ?? null);
    // Khi auth thay đổi (login/logout) → reset cache
    supabase.auth.onAuthStateChange(() => { _sessionPromise = null; });
  }
  return _sessionPromise;
}
