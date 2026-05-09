import { useState } from 'react';

export function NameInput({
  onSubmit,
  buttonLabel = '占う',
  hint,
}: {
  onSubmit: (name: { sei: string; mei: string }) => void;
  buttonLabel?: string;
  hint?: string;
}) {
  const [sei, setSei] = useState('');
  const [mei, setMei] = useState('');

  return (
    <form
      className="bg-white/80 rounded-2xl border border-amber-900/10 p-5 md:p-6 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        if (!sei.trim() || !mei.trim()) return;
        onSubmit({ sei: sei.trim(), mei: mei.trim() });
      }}
    >
      <div className="text-sm text-ink/70 mb-3">姓と名を入力してください</div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-ink/60">姓</span>
          <input
            type="text"
            value={sei}
            onChange={(e) => setSei(e.target.value)}
            placeholder="山田"
            className="w-32 px-3 py-2 rounded border border-amber-900/20 bg-white"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-ink/60">名</span>
          <input
            type="text"
            value={mei}
            onChange={(e) => setMei(e.target.value)}
            placeholder="花子"
            className="w-32 px-3 py-2 rounded border border-amber-900/20 bg-white"
          />
        </label>
        <button
          type="submit"
          className="ml-auto px-6 py-2 rounded-full bg-plum text-paper hover:bg-rose-800 transition shadow-sm disabled:opacity-50"
          disabled={!sei.trim() || !mei.trim()}
        >
          {buttonLabel}
        </button>
      </div>
      {hint && <p className="text-xs text-ink/50 mt-3">{hint}</p>}
    </form>
  );
}
