import { resolveColor } from '../lib/japaneseColors';

type Size = 'sm' | 'md';

const SIZE_CLASS: Record<Size, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
};

export function ColorSwatch({ name, size = 'md' }: { name: string; size?: Size }) {
  const hexes = resolveColor(name);
  if (hexes.length === 0) return null;

  const background =
    hexes.length === 1
      ? hexes[0]
      : `linear-gradient(90deg, ${hexes[0]} 0 50%, ${hexes[1]} 50% 100%)`;

  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 rounded-full border border-amber-900/20 shadow-sm ${SIZE_CLASS[size]}`}
      style={{ background }}
    />
  );
}
