
const API_BASE_URL = 'https://phimapi.com';

export const phimApi = {
  getAnimeList: async (page: number = 1, limit: number = 18) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/api/danh-sach/hoat-hinh?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Lỗi lấy danh sách anime');
      return await response.json();
    } catch (error) {
      console.error("API Error (getAnimeList):", error);
      throw error;
    }
  },

  getAnimeDetail: async (slug: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/phim/${slug}`);
      if (!response.ok) throw new Error('Lỗi lấy chi tiết anime');
      return await response.json();
    } catch (error) {
      console.error(`API Error (getAnimeDetail - ${slug}):`, error);
      throw error;
    }
  },

  searchAnime: async (keyword: string, page: number = 1, limit: number = 18) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/api/tim-kiem?keyword=${keyword}&page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Lỗi tìm kiếm');
      return await response.json();
    } catch (error) {
      console.error(`API Error (searchAnime - ${keyword}):`, error);
      throw error;
    }
  },

  getAnimeByCategory: async (categorySlug: string, page: number = 1, limit: number = 18) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/api/the-loai/${categorySlug}?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Lỗi lấy anime theo thể loại');
      return await response.json();
    } catch (error) {
      console.error(`API Error (getAnimeByCategory - ${categorySlug}):`, error);
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
      slug: item.slug || "", // Cực kỳ quan trọng: Lấy slug để sau này click vào thẻ thì chuyển sang trang chi tiết
      title: item.name || item.origin_name || "Anime",
      image: getImgUrl(item.thumb_url || item.poster_url),
      banner: getImgUrl(item.poster_url || item.thumb_url),
      rating: "9.5", // Thông tin placeholder cho đẹp UI vì API hiếm khi trả về điểm
      episodes: item.episode_current || "01",
      // Tạo một số lượt xem ngẫu nhiên cho đẹp, nếu API trả về view thật thì dùng nó
      views: item.view ? item.view.toLocaleString() : Math.floor(Math.random() * 500000).toLocaleString(),
      status: item.quality ? `${item.quality} ${item.lang || ''}` : "Hoàn tất"
    };
  }
};