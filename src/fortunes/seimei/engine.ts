import type { FortuneResult } from '../types';
import { strokesOfText } from '../../lib/kanjiStrokes';
import { tonalLabelFor } from './judge';

export type SeimeiInput = { sei: string; mei: string };

export type SeimeiCalc = {
  ten: number;     // 天格
  jin: number;     // 人格
  chi: number;     // 地格
  gai: number;     // 外格
  sou: number;     // 総格
  unknownChars: string[];
};

const REISUU = 1;

export function calcGokaku({ sei, mei }: SeimeiInput): SeimeiCalc {
  const seiArr = Array.from(sei);
  const meiArr = Array.from(mei);
  const seiInfo = strokesOfText(sei);
  const meiInfo = strokesOfText(mei);

  const seiStrokes = seiArr.map((ch) => strokesOfText(ch).total);
  const meiStrokes = meiArr.map((ch) => strokesOfText(ch).total);

  // 天格: 姓画数合計（霊数: 1文字姓のとき+1）
  const ten = seiInfo.total + (seiArr.length === 1 ? REISUU : 0);
  // 地格: 名画数合計（霊数: 1文字名のとき+1）
  const chi = meiInfo.total + (meiArr.length === 1 ? REISUU : 0);
  // 人格: 姓の最後 + 名の最初（霊数なし）
  const lastSei = seiStrokes[seiStrokes.length - 1] ?? 0;
  const firstMei = meiStrokes[0] ?? 0;
  const jin = lastSei + firstMei;
  // 総格: 全画数合計（霊数なし）
  const sou = seiInfo.total + meiInfo.total;
  // 外格: 総格 - 人格、ただし1文字姓・1文字名の特例で霊数を補完
  const gaiBase = sou - jin;
  const gai =
    gaiBase + (seiArr.length === 1 ? REISUU : 0) + (meiArr.length === 1 ? REISUU : 0);

  const unknownChars = [
    ...seiInfo.perChar.filter((x) => x.n === null).map((x) => x.ch),
    ...meiInfo.perChar.filter((x) => x.n === null).map((x) => x.ch),
  ];

  return { ten, jin, chi, gai, sou, unknownChars };
}

export function readSeimei(input: SeimeiInput): FortuneResult {
  const calc = calcGokaku(input);
  const fullName = `${input.sei} ${input.mei}`;

  if (calc.unknownChars.length > 0) {
    return {
      title: `${fullName} さん`,
      subtitle: '画数辞書に含まれない文字があります（異体字・環境依存文字など）',
      summary: `「${calc.unknownChars.join('、')}」の画数を判定できませんでした。本サイトの画数辞書は新字体の常用漢字・人名用漢字・JIS第1水準を収録していますが、それ以外の異体字や環境依存文字は対象外です。お手数ですが別の漢字でお試しください。`,
      sections: [
        {
          title: 'ご案内',
          body: '画数判定は流派によって差異があります。当サイトでは新字体ベースで簡易計算しています。結果は「印象」や「傾向」のヒントとしてご活用ください。',
        },
      ],
      meta: {
        姓: input.sei,
        名: input.mei,
        判定不能文字: calc.unknownChars.join('、'),
      },
    };
  }

  const tenT = tonalLabelFor('天', calc.ten);
  const jinT = tonalLabelFor('人', calc.jin);
  const chiT = tonalLabelFor('地', calc.chi);
  const gaiT = tonalLabelFor('外', calc.gai);
  const souT = tonalLabelFor('総', calc.sou);

  const score = Math.round(
    [tenT, jinT, chiT, gaiT, souT].reduce((s, t) => {
      const v = t.tone === 'bright' ? 90 : t.tone === 'mild' ? 75 : t.tone === 'cool' ? 65 : 55;
      return s + v;
    }, 0) / 5,
  );

  return {
    title: `${fullName} さんの名前印象`,
    subtitle: '名前運勢診断（新字体・簡易判定）',
    score,
    summary: `総合的には「${souT.label}」な印象を運ぶお名前です。`,
    sections: [
      {
        title: `天格 ${calc.ten}画 — ${tenT.label}`,
        body: tenT.hint,
      },
      {
        title: `人格 ${calc.jin}画 — ${jinT.label}`,
        body: jinT.hint,
      },
      {
        title: `地格 ${calc.chi}画 — ${chiT.label}`,
        body: chiT.hint,
      },
      {
        title: `外格 ${calc.gai}画 — ${gaiT.label}`,
        body: gaiT.hint,
      },
      {
        title: `総格 ${calc.sou}画 — ${souT.label}`,
        body: souT.hint,
      },
    ],
    advice: '画数判定は流派によって差異があります。当サイトの結果は「ヒント」として、軽やかにご活用ください。',
    meta: {
      天格: `${calc.ten}画`,
      人格: `${calc.jin}画`,
      地格: `${calc.chi}画`,
      外格: `${calc.gai}画`,
      総格: `${calc.sou}画`,
      備考: '霊数を1文字姓・1文字名の特例として補完しています',
    },
  };
}
