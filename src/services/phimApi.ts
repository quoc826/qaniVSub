const API_BASE_URL = '/api';

export const phimApi = {
  getAnimeList: async (slug: string = 'hoat-hinh', page: number = 1, limit: number = 40) => {
    try {
      const response = await fetch(`${API_BASE_URL}/danh-sach?slug=${slug}&page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Lỗi');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getAnimeByCategory: async (categorySlug: string, page: number = 1, limit: number = 40) => {
    try {
      const response = await fetch(`${API_BASE_URL}/the-loai?slug=${categorySlug}&page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Lỗi');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  searchAnime: async (keyword: string, page: number = 1, limit: number = 40) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tim-kiem?keyword=${keyword}&page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Lỗi');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getAnimeDetail: async (slug: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/phim?slug=${slug}`);
      if (!response.ok) throw new Error('Lỗi');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  formatAnimeData: (item: any, imageDomain: string = 'https://phimimg.com') => {
    const getImgUrl = (urlPath: string) => {
      if (!urlPath) return "https://via.placeholder.com/300x450";
      if (urlPath.startsWith('http')) return urlPath;
      return `${imageDomain}/${urlPath}`;
    };

    const countries = item.country?.map((c: any) => c.slug) || [];

    return {
      id: item._id || item.slug || Math.random().toString(),
      slug: item.slug || "", 
      title: item.name || item.origin_name || "Anime",
      image: getImgUrl(item.thumb_url || item.poster_url),
      banner: getImgUrl(item.poster_url || item.thumb_url),
      rating: "9.5", 
      episodes: item.episode_current || "01",
      views: item.view ? item.view.toLocaleString() : Math.floor(Math.random() * 500000).toLocaleString(),
      status: item.quality ? `${item.quality} ${item.lang || ''}` : "Hoàn tất",
      isCompleted: item.status === 'completed' || (item.episode_current && item.episode_current.toLowerCase().includes('full')),
      countries: countries 
    };
  }
};