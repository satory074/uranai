import { Route, Routes } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';

// ルートの組み立ては 1 か所だけ。ブラウザ (main.tsx の HashRouter) と
// ビルド時の事前描画 (entry-server.tsx の StaticRouter) が同じものを使う。
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
}
