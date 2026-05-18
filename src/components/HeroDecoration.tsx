type Props = { className?: string };

export function HeroDecoration({ className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={`text-gold ${className}`}
      fill="currentColor"
      aria-hidden="true"
      role="presentation"
    >
      <g className="float-soft">
        <path
          d="M 178 48 A 56 56 0 1 0 178 160 A 40 40 0 1 1 178 48 Z"
          opacity="0.42"
        />
        <circle cx="168" cy="68" r="2.5" opacity="0.55" />
        <circle cx="172" cy="92" r="1.8" opacity="0.45" />
      </g>
      <circle cx="38" cy="52" r="1.9" opacity="0.6" />
      <circle cx="92" cy="28" r="1.2" opacity="0.5" />
      <circle cx="22" cy="118" r="1.6" opacity="0.55" />
      <circle cx="72" cy="178" r="1.3" opacity="0.5" />
      <circle cx="128" cy="208" r="1.8" opacity="0.6" />
      <circle cx="200" cy="198" r="1.4" opacity="0.5" />
      <circle cx="46" cy="222" r="1.0" opacity="0.4" />
      <path
        d="M 110 100 L 113 110 L 123 113 L 113 116 L 110 126 L 107 116 L 97 113 L 107 110 Z"
        opacity="0.35"
      />
      <path
        d="M 56 152 L 58 158 L 64 160 L 58 162 L 56 168 L 54 162 L 48 160 L 54 158 Z"
        opacity="0.4"
      />
    </svg>
  );
}
