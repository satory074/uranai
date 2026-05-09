import { useState } from 'react';

export type DateValue = { year: number; month: number; day: number };

export function DateInput({
  initial,
  onSubmit,
  buttonLabel = '占う',
  hint,
}: {
  initial?: DateValue;
  onSubmit: (v: DateValue) => void;
  buttonLabel?: string;
  hint?: string;
}) {
  const today = new Date();
  const [year, setYear] = useState(initial?.year ?? today.getFullYear() - 30);
  const [month, setMonth] = useState(initial?.month ?? today.getMonth() + 1);
  const [day, setDay] = useState(initial?.day ?? today.getDate());

  return (
    <form
      className="bg-white/80 rounded-2xl border border-amber-900/10 p-5 md:p-6 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ year, month, day });
      }}
    >
      <div className="text-sm text-ink/70 mb-3">生年月日を入力してください</div>
      <div className="flex flex-wrap items-end gap-3">
        <Field label="年">
          <input
            type="number"
            min="1900"
            max="2100"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-24 px-3 py-2 rounded border border-amber-900/20 bg-white"
          />
        </Field>
        <Field label="月">
          <input
            type="number"
            min="1"
            max="12"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="w-20 px-3 py-2 rounded border border-amber-900/20 bg-white"
          />
        </Field>
        <Field label="日">
          <input
            type="number"
            min="1"
            max="31"
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            className="w-20 px-3 py-2 rounded border border-amber-900/20 bg-white"
          />
        </Field>
        <button
          type="submit"
          className="ml-auto px-6 py-2 rounded-full bg-plum text-paper hover:bg-rose-800 transition shadow-sm"
        >
          {buttonLabel}
        </button>
      </div>
      {hint && <p className="text-xs text-ink/50 mt-3">{hint}</p>}
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-ink/60">{label}</span>
      {children}
    </label>
  );
}
