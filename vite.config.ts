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
      '/api': {
        target: 'https://phimapi.com', 
        changeOrigin: true,
        secure: false,
        // Dòng này bắt buộc phải có để xóa chữ "/api" khi gọi sang server phim
        rewrite: (path) => path.replace(/^\/api/, '') 
      }
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