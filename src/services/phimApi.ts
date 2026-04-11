const API_BASE_URL = '/api';

export const phimApi = {
  // Lấy danh sách phim (Cái này CÓ THỂ cache để web load nhanh)
  getAnimeList: async (slug: string = 'hoat-hinh', page: number = 1, limit: number = 40) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/api/danh-sach/${slug}?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Error');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết phim (CÓ THỂ cache)
  getAnimeDetail: async (slug: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/phim/${slug}`);
      if (!response.ok) throw new Error('Error');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Tìm kiếm phim (KHÔNG NÊN cache sâu vì từ khóa thay đổi liên tục)
  searchAnime: async (keyword: string, page: number = 1, limit: number = 40) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/api/tim-kiem?keyword=${keyword}&page=${page}&limit=${limit}`);
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
    return {
      id: item._id || item.slug || Math.random().toString(),
      slug: item.slug || "", 
      title: item.name || item.origin_name || "Anime",
      content: item.content || "", 
      image: getImgUrl(item.thumb_url || item.poster_url),
      banner: getImgUrl(item.poster_url || item.thumb_url),
      rating: "9.5", 
      episodes: item.episode_current || "01",
      views: item.view ? item.view.toLocaleString() : "0",
      countries: item.country?.map((c: any) => c.slug) || []
    };
  }
};