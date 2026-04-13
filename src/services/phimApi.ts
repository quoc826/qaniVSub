const API_BASE_URL = '/api';

// ─── In-memory cache ─────────────────────────────────────────────────────────
const cache = new Map<string, { data: any; ts: number }>();
const TTL = 5 * 60 * 1000; // 5 phút

async function cached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < TTL) return hit.data as T;
  const data = await fetcher();
  cache.set(key, { data, ts: Date.now() });
  return data;
}
// ─────────────────────────────────────────────────────────────────────────────

export const phimApi = {
  getAnimeList: (slug = 'hoat-hinh', page = 1, limit = 40) =>
    cached(`list:${slug}:${page}:${limit}`, () =>
      fetch(`${API_BASE_URL}/v1/api/danh-sach/${slug}?page=${page}&limit=${limit}`)
        .then(r => { if (!r.ok) throw new Error('Error'); return r.json(); })
    ),

  getAnimeDetail: (slug: string) =>
    cached(`detail:${slug}`, () =>
      fetch(`${API_BASE_URL}/phim/${slug}`)
        .then(r => { if (!r.ok) throw new Error('Error'); return r.json(); })
    ),

  searchAnime: (keyword: string, page = 1, limit = 40) =>
    cached(`search:${keyword}:${page}`, () =>
      fetch(`${API_BASE_URL}/v1/api/tim-kiem?keyword=${keyword}&page=${page}&limit=${limit}`)
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