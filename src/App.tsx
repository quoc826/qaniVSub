import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Components - Đảm bảo chữ "c" trong components viết thường y hệt thư mục của bạn
import Header from './components/Header'; 
import Home from './components/Home';
import DetailPage from './components/DetailPage';
import ListAnime from './components/ListAnime';
import WatchPage from './components/WatchPage';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="min-h-screen bg-[#0b0f1a]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/phim/:slug" element={<DetailPage />} />
          <Route path="/xem-phim/:slug" element={<WatchPage />} />
          <Route path="/danh-sach" element={<ListAnime />} />
          <Route path="/danh-sach/:slug" element={<ListAnime />} /> 
          <Route path="/the-loai/:slug" element={<ListAnime />} />
          <Route path="/season/:slug" element={<ListAnime />} />
          <Route path="/tim-kiem/:keyword" element={<ListAnime />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;