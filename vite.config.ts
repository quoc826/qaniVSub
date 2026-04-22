import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 3000, 
    open: true, 
    
    proxy: {
      // /api/danh-sach?slug=hoat-hinh&page=1&limit=40
      '/api/danh-sach': {
        target: 'https://phimapi.com',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost');
          const slug = url.searchParams.get('slug') || 'hoat-hinh';
          const page = url.searchParams.get('page') || '1';
          const limit = url.searchParams.get('limit') || '40';
          return `/v1/api/danh-sach/${slug}?page=${page}&limit=${limit}`;
        },
      },
      '/api/the-loai': {
        target: 'https://phimapi.com',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost');
          const slug = url.searchParams.get('slug') || '';
          const page = url.searchParams.get('page') || '1';
          const limit = url.searchParams.get('limit') || '40';
          return `/v1/api/the-loai/${slug}?page=${page}&limit=${limit}`;
        },
      },
      '/api/phim': {
        target: 'https://phimapi.com',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost');
          const slug = url.searchParams.get('slug') || '';
          return `/phim/${slug}`;
        },
      },
      '/api/tim-kiem': {
        target: 'https://phimapi.com',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost');
          const keyword = url.searchParams.get('keyword') || '';
          const page = url.searchParams.get('page') || '1';
          const limit = url.searchParams.get('limit') || '40';
          return `/v1/api/tim-kiem?keyword=${keyword}&page=${page}&limit=${limit}`;
        },
      },
    }
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  build: {
    chunkSizeWarningLimit: 1000,
  }
});