const API_BASE_URL = '/api';

// ─── Cấu hình TTL ─────────────────────────────────────────────────────────────
const MEM_TTL  = 5 * 60 * 1000;        // Memory cache: 5 phút
const LS_TTL   = 60 * 60 * 1000;       // localStorage cache: 1 giờ
const LS_PREFIX = 'qani_cache_';

// ─── Memory cache (tốc độ cao nhất, mất khi reload) ──────────────────────────
const memCache = new Map<string, { data: any; ts: number }>();

// ─── localStorage cache (persist qua reload, load tức thì lần sau) ────────────
function lsGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > LS_TTL) {
      localStorage.removeItem(LS_PREFIX + key);
      return null;
    }
    return data as T;
  } catch { return null; }
}

function lsSet(key: string, data: any) {
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // localStorage đầy → xóa cache cũ nhất rồi thử lại
    clearOldCache();
    try { localStorage.setItem(LS_PREFIX + key, JSON.stringify({ data, ts: Date.now() })); } catch {}
  }
}

function clearOldCache() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith(LS_PREFIX));
  if (keys.length > 20) {
    // Xóa một nửa các key cũ nhất
    keys.slice(0, 10).forEach(k => localStorage.removeItem(k));
  }
}

// ─── Hàm fetch thông minh: memory → localStorage → network ──────────────────
async function cached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  // 1. Memory cache (tức thì, không async)
  const memHit = memCache.get(key);
  if (memHit && Date.now() - memHit.ts < MEM_TTL) return memHit.data as T;

  // 2. localStorage (persist qua reload, trả về ngay + fetch mới ngầm)
  const lsHit = lsGet<T>(key);
  if (lsHit) {
    // Cập nhật memory cache
    memCache.set(key, { data: lsHit, ts: Date.now() });
    // Fetch mới ngầm (stale-while-revalidate pattern)
    fetcher().then(fresh => {
      memCache.set(key, { data: fresh, ts: Date.now() });
      lsSet(key, fresh);
    }).catch(() => {});
    return lsHit;
  }

  // 3. Network fetch (lần đầu tiên)
  const data = await fetcher();
  memCache.set(key, { data, ts: Date.now() });
  lsSet(key, data);
  return data;
}

// ─── API ──────────────────────────────────────────────────────────────────────
// Tất cả requests đi qua serverless functions (/api/danh-sach, /api/phim, v.v.)
// để có Cache-Control: s-maxage=14400 → Cloudflare cache dùng chung cho mọi user
export const phimApi = {
  getAnimeByCategory: (slug: string, page = 1, limit = 40) =>
    cached(`category:${slug}:${page}:${limit}`, () =>
      fetch(`/api/the-loai?slug=${encodeURIComponent(slug)}&page=${page}&limit=${limit}`)
        .then(r => { if (!r.ok) throw new Error('Error'); return r.json(); })
    ),

  getAnimeList: (slug = 'hoat-hinh', page = 1, limit = 40) =>
    cached(`list:${slug}:${page}:${limit}`, () =>
      fetch(`/api/danh-sach?slug=${encodeURIComponent(slug)}&page=${page}&limit=${limit}`)
        .then(r => { if (!r.ok) throw new Error('Error'); return r.json(); })
    ),

  getAnimeDetail: (slug: string) =>
    cached(`detail:${slug}`, () =>
      fetch(`/api/phim?slug=${encodeURIComponent(slug)}`)
        .then(r => { if (!r.ok) throw new Error('Error'); return r.json(); })
    ),

  searchAnime: (keyword: string, page = 1, limit = 40) =>
    cached(`search:${keyword}:${page}`, () =>
      fetch(`/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}&limit=${limit}`)
        .then(r => { if (!r.ok) throw new Error('Error'); return r.json(); })
    ),

  formatAnimeData: (item: any, imageDomain = 'https://phimimg.com') => {
    const getImgUrl = (urlPath: string) => {
      if (!urlPath) return 'https://placehold.co/300x450/1a1a2e/white?text=No+Image';
      if (urlPath.startsWith('http')) return urlPath;
      return `${imageDomain}/${urlPath}`;
    };
    return {
      id: item._id || item.slug || Math.random().toString(),
      slug: item.slug || '',
      title: item.name || item.origin_name || 'Anime',
      content: item.content || '',
      image: getImgUrl(item.thumb_url || item.poster_url),
      banner: getImgUrl(item.poster_url || item.thumb_url),
      rating: '9.5',
      episodes: item.episode_current || '01',
      views: item.view ? item.view.toLocaleString() : '0',
      countries: item.country?.map((c: any) => c.slug) || [],
    };
  },
};