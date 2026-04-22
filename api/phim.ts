import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { slug } = req.query;
  try {
    const response = await fetch(`https://phimapi.com/phim/${slug}`);
    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=14400, stale-while-revalidate=86400');
    res.setHeader('CDN-Cache-Control', 'max-age=14400');
    res.setHeader('Vercel-CDN-Cache-Control', 'max-age=14400');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
}