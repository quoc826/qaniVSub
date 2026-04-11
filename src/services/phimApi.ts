const API_BASE_URL = '/api';

// Hàm tạo blur placeholder (LQIP)
export const generateBlurDataUrl = (width: number = 10, height: number = 15) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
    ctx.fillRect(0, 0, width, height);
  }
  return canvas.toDataURL();
};

export const phimApi = {
  getAnimeList: async (slug: string = 'hoat-hinh', page: number = 1, limit: number = 40) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/api/danh-sach/${slug}?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Error');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getAnimeByCategory: async (categorySlug: string, page: number = 1, limit: number = 40) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/api/the-loai/${categorySlug}?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Error');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  searchAnime: async (keyword: string, page: number = 1, limit: number = 40) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/api/tim-kiem?keyword=${keyword}&page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Error');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getAnimeDetail: async (slug: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/phim/${slug}`);
      if (!response.ok) throw new Error('Error');
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
      blurDataUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 10 15%22%3E%3Crect fill=%22%231a1a2e%22 width=%2210%22 height=%2215%22/%3E%3C/svg%3E',
      rating: "9.5", 
      episodes: item.episode_current || "01",
      views: item.view ? item.view.toLocaleString() : Math.floor(Math.random() * 500000).toLocaleString(),
      status: item.quality ? `${item.quality} ${item.lang || ''}` : "Hoàn tất",
      isCompleted: item.status === 'completed' || (item.episode_current && item.episode_current.toLowerCase().includes('full')),
      countries: countries 
    };
  }
};