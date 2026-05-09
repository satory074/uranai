import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router';
import './index.css';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { OmikujiPage } from './pages/OmikujiPage';
import { TarotOnePage } from './pages/TarotOnePage';
import { TarotThreePage } from './pages/TarotThreePage';
import { SeimeiPage } from './pages/SeimeiPage';
import { AstrologyPage } from './pages/AstrologyPage';
import { KyuseiPage } from './pages/KyuseiPage';
import { ShichuPage } from './pages/ShichuPage';
import { SanmeiPage } from './pages/SanmeiPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="omikuji" element={<OmikujiPage />} />
          <Route path="tarot-one" element={<TarotOnePage />} />
          <Route path="tarot-three" element={<TarotThreePage />} />
          <Route path="seimei" element={<SeimeiPage />} />
          <Route path="astrology" element={<AstrologyPage />} />
          <Route path="kyusei" element={<KyuseiPage />} />
          <Route path="shichu" element={<ShichuPage />} />
          <Route path="sanmei" element={<SanmeiPage />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
);
