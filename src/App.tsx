import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header'; 
import Home from './components/Home';
import DetailPage from './components/DetailPage';
import ListAnime from './components/ListAnime';
import WatchPage from './components/WatchPage';
import Login from './components/Login';
import Register from './components/Register';
import Footer from './components/Footer'; // Import Footer mới tạo

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-[#0b0f1a]">
        <Header />
        
        {/* flex-grow giúp nội dung chính đẩy Footer xuống đáy trang khi nội dung ít */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/phim/:slug" element={<DetailPage />} />
            <Route path="/xem-phim/:slug" element={<WatchPage />} />
            <Route path="/danh-sach" element={<ListAnime />} />
            <Route path="/danh-sach/:slug" element={<ListAnime />} /> 
            <Route path="/the-loai/:slug" element={<ListAnime />} />
            <Route path="/tim-kiem/:keyword" element={<ListAnime />} />
            
            {/* Routes cho Đăng nhập / Đăng ký */}
            <Route path="/dang-nhap" element={<Login />} />
            <Route path="/dang-ky" element={<Register />} />
          </Routes>
        </main>

        <Footer /> 
      </div>
    </BrowserRouter>
  );
}

export default App;