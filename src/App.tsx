import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Home from './components/Home';
import DetailPage from './components/DetailPage';
import ListAnime from './components/ListAnime';
import WatchPage from './components/WatchPage';
import Login from './components/Login';
import Register from './components/Register';
import Footer from './components/Footer';
import FavoritesPage from './components/FavoritesPage';
import AiChatBox from './chat/AiChatBox';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-[#0b0f1a]">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/"                  element={<Home />} />
            <Route path="/phim/:slug"        element={<DetailPage />} />
            <Route path="/xem-phim/:slug"    element={<WatchPage />} />
            <Route path="/danh-sach"         element={<ListAnime />} />
            <Route path="/danh-sach/:slug"   element={<ListAnime />} />
            <Route path="/the-loai/:slug"    element={<ListAnime />} />
            <Route path="/tim-kiem/:keyword" element={<ListAnime />} />
            <Route path="/yeu-thich"         element={<FavoritesPage />} />
            <Route path="/dang-nhap"         element={<Login />} />
            <Route path="/dang-ky"           element={<Register />} />
          </Routes>
        </main>
        <Footer />
        <AiChatBox />
      </div>
    </BrowserRouter>
  );
}

export default App;