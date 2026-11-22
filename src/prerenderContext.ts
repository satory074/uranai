import { createContext } from 'react';

// ビルド時の事前描画 (entry-server.tsx) の中だけ true。
// 事前描画の入力欄は JS が動くと createRoot で丸ごと置き換わり、それまでに打った値が消えるので、
// 事前描画では入力欄と送信ボタンを disabled にして「打てるのに消える」状態を作らない。
export const PrerenderContext = createContext(false);
