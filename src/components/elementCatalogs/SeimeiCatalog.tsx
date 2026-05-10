// 五格それぞれの意味の解説。engine.ts には計算ロジックしかなく、
// 「何を表すか」の説明はカタログ側でのみ持つ。
const GOKAKU_INFO: { name: string; key: string; calc: string; meaning: string }[] = [
  {
    name: '天格',
    key: 'てんかく',
    calc: '姓の画数の合計（1 文字姓のときは霊数 1 を補う）',
    meaning: '家系から受け継いだ姓そのものの画数。本人の運勢の判定には直接は使わず、家系の性質や姓の印象を表すと考えられています。',
  },
  {
    name: '人格',
    key: 'じんかく',
    calc: '姓の最後の文字＋名の最初の文字の画数',
    meaning: '名前の中央にあたり、性格・才能・人柄の中心となる画数。本人の核として最も重視されます。',
  },
  {
    name: '地格',
    key: 'ちかく',
    calc: '名の画数の合計（1 文字名のときは霊数 1 を補う）',
    meaning: '幼少期から青年期にかけての運や、私生活・健康面に映る画数。基礎となる土台です。',
  },
  {
    name: '外格',
    key: 'がいかく',
    calc: '総格から人格を引いたもの（1 文字姓・1 文字名のときは霊数を補う）',
    meaning: '対人関係・社会的な印象・周囲からの評価を表す画数。人と関わる場面での雰囲気を映します。',
  },
  {
    name: '総格',
    key: 'そうかく',
    calc: '姓と名のすべての画数の合計',
    meaning: '人生全体を通した総合的な印象。中年期以降の運勢や、生涯を通したテーマを示すとされます。',
  },
];

export function SeimeiCatalog() {
  return (
    <div>
      <p className="text-xs text-ink/55 mb-3 leading-relaxed">
        本サイトの姓名判断で使う 5 つの「格」の内訳。新字体（現代の常用漢字・人名用漢字を中心とする字体）の画数だけで計算します。
      </p>
      <div className="space-y-2.5">
        {GOKAKU_INFO.map((g) => (
          <article
            key={g.name}
            className="rounded-lg bg-mist/40 border border-amber-900/10 p-4"
          >
            <header className="mb-2 flex flex-wrap items-baseline gap-x-2">
              <h4 className="font-serif text-base text-plum">{g.name}</h4>
              <span className="text-[11px] tracking-widest text-ink/50">{g.key}</span>
            </header>
            <dl className="text-xs space-y-1.5">
              <div className="grid grid-cols-[5em_1fr] gap-2">
                <dt className="text-ink/55">計算方法</dt>
                <dd className="text-ink/80 leading-relaxed">{g.calc}</dd>
              </div>
              <div className="grid grid-cols-[5em_1fr] gap-2">
                <dt className="text-ink/55">表すもの</dt>
                <dd className="text-ink/85 leading-relaxed">{g.meaning}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-ink/55 leading-relaxed">
        画数の数え方は流派により差があります。本サイトでは新字体ベースで計算し、辞書に無い文字が含まれる場合は判定を見送ります。
      </p>
    </div>
  );
}
