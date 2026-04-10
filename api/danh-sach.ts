import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { slug = 'hoat-hinh', page = 1, limit = 40 } = req.query;
  try {
    const response = await fetch(`https://phimapi.com/v1/api/danh-sach/${slug}?page=${page}&limit=${limit}`);
    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=86400');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
}