import { Link } from 'react-router';
import { FORTUNES } from '../fortunes/types';

export function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
      <section className="text-center mb-12">
        <p className="text-xs tracking-[0.4em] text-plum mb-3">URANAI HYAKKA</p>
        <h1 className="font-serif text-4xl md:text-5xl text-ink mb-4 leading-tight">
          8つの占いを、<br className="md:hidden" />ひと所で。
        </h1>
        <p className="text-sm md:text-base text-ink/70 max-w-xl mx-auto">
          おみくじから西洋占星術、東洋の命式タイプ診断まで。
          結果文はすべてオリジナル。さまざまな占いを気軽に楽しめます。
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FORTUNES.map((f) => (
          <Link
            key={f.id}
            to={f.path}
            className="group block rounded-2xl border border-amber-900/10 bg-white/70 hover:bg-white hover:shadow-md transition overflow-hidden"
          >
            <div className={`h-2 bg-gradient-to-r ${f.accent}`} />
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl" aria-hidden>{f.emoji}</span>
                <div>
                  <div className="font-serif text-lg text-ink leading-tight">
                    {f.displayName}
                  </div>
                  <div className="text-[11px] text-ink/50 mt-0.5">
                    {f.traditionalName}
                  </div>
                </div>
              </div>
              <p className="text-xs text-ink/70 leading-relaxed">{f.tagline}</p>
              <div className="mt-4 text-xs text-plum group-hover:underline">
                占う →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
