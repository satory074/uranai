import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router';
import './index.css';
import { AppRoutes } from './AppRoutes';

// #root にはビルド時に事前描画したホーム (scripts/prerender.mjs) が入っている。
// hydrateRoot ではなく createRoot で描き直す: 入力欄の既定の年月日は new Date() から決まり、
// ビルドした日と見ている日で違うので、事前描画は「JS が動くまでの見本」として丸ごと置き換える。
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  </StrictMode>,
);
