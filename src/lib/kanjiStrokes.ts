// 漢字画数辞書（新字体ベース）。常用漢字 + 人名用漢字 + JIS X 0208 第1水準を収録。
// KANJI 定数は KANJIDIC2 から自動生成 (`scripts/build_kanji_dict.py`)。
// 未収録の文字（極端な異体字・環境依存文字など）は engine 側で「画数不明」として扱う。
import { KANJI } from './kanjiStrokes.data';

const HIRAGANA: Record<string, number> = {
  あ: 3, い: 2, う: 2, え: 2, お: 3,
  か: 3, き: 4, く: 1, け: 3, こ: 2,
  さ: 3, し: 1, す: 2, せ: 3, そ: 3,
  た: 4, ち: 2, つ: 1, て: 1, と: 2,
  な: 4, に: 3, ぬ: 2, ね: 4, の: 1,
  は: 3, ひ: 1, ふ: 4, へ: 1, ほ: 4,
  ま: 3, み: 2, む: 3, め: 2, も: 3,
  や: 3, ゆ: 2, よ: 2,
  ら: 2, り: 2, る: 1, れ: 1, ろ: 1,
  わ: 2, を: 3, ん: 1,
  が: 5, ぎ: 6, ぐ: 3, げ: 5, ご: 4,
  ざ: 5, じ: 3, ず: 4, ぜ: 5, ぞ: 5,
  だ: 6, ぢ: 4, づ: 3, で: 3, ど: 4,
  ば: 5, び: 3, ぶ: 6, べ: 3, ぼ: 6,
  ぱ: 4, ぴ: 2, ぷ: 5, ぺ: 2, ぽ: 5,
  ぁ: 3, ぃ: 2, ぅ: 2, ぇ: 2, ぉ: 3,
  っ: 1, ゃ: 3, ゅ: 2, ょ: 2,
};

const KATAKANA: Record<string, number> = {
  ア: 2, イ: 2, ウ: 3, エ: 3, オ: 3,
  カ: 2, キ: 3, ク: 2, ケ: 3, コ: 2,
  サ: 3, シ: 3, ス: 2, セ: 2, ソ: 2,
  タ: 3, チ: 3, ツ: 3, テ: 3, ト: 2,
  ナ: 2, ニ: 2, ヌ: 2, ネ: 4, ノ: 1,
  ハ: 2, ヒ: 2, フ: 1, ヘ: 1, ホ: 4,
  マ: 2, ミ: 3, ム: 2, メ: 2, モ: 3,
  ヤ: 2, ユ: 2, ヨ: 3,
  ラ: 2, リ: 2, ル: 2, レ: 1, ロ: 3,
  ワ: 2, ヲ: 3, ン: 2,
  ガ: 4, ギ: 5, グ: 4, ゲ: 5, ゴ: 4,
  ザ: 5, ジ: 5, ズ: 4, ゼ: 4, ゾ: 4,
  ダ: 5, ヂ: 5, ヅ: 5, デ: 5, ド: 4,
  バ: 4, ビ: 4, ブ: 3, ベ: 3, ボ: 6,
  パ: 3, ピ: 3, プ: 2, ペ: 2, ポ: 5,
  ァ: 2, ィ: 2, ゥ: 3, ェ: 3, ォ: 3,
  ッ: 3, ャ: 2, ュ: 2, ョ: 3,
  ー: 1,
};

const STROKES: Record<string, number> = { ...HIRAGANA, ...KATAKANA, ...KANJI };

export function strokeOf(ch: string): number | null {
  const v = STROKES[ch];
  return v ?? null;
}

export function strokesOfText(text: string): { total: number; perChar: { ch: string; n: number | null }[]; unknownCount: number } {
  const perChar = Array.from(text).map((ch) => ({ ch, n: strokeOf(ch) }));
  const total = perChar.reduce((s, x) => s + (x.n ?? 0), 0);
  const unknownCount = perChar.filter((x) => x.n === null).length;
  return { total, perChar, unknownCount };
}
