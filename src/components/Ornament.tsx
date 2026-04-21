interface Props { className?: string }

/** Decorative mehendi-style symmetrical ornament rendered as inline SVG. */
export const Ornament = ({ className = "" }: Props) => (
  <svg
    className={className}
    viewBox="0 0 240 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    fill="none"
  >
    <g stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 12 H100" opacity="0.5" />
      <path d="M140 12 H230" opacity="0.5" />
      <path d="M120 4 C112 4 108 8 108 12 C108 16 112 20 120 20 C128 20 132 16 132 12 C132 8 128 4 120 4 Z" />
      <path d="M120 7 C115 7 113 9 113 12 C113 15 115 17 120 17 C125 17 127 15 127 12 C127 9 125 7 120 7 Z" opacity="0.7" />
      <circle cx="120" cy="12" r="1.6" fill="currentColor" />
      <path d="M100 12 C104 8 108 8 108 12 C108 16 104 16 100 12 Z" />
      <path d="M140 12 C136 8 132 8 132 12 C132 16 136 16 140 12 Z" />
      <path d="M90 12 C92 9 96 9 98 12 M90 12 C92 15 96 15 98 12" opacity="0.7" />
      <path d="M150 12 C148 9 144 9 142 12 M150 12 C148 15 144 15 142 12" opacity="0.7" />
      <circle cx="80" cy="12" r="1.2" fill="currentColor" />
      <circle cx="160" cy="12" r="1.2" fill="currentColor" />
      <circle cx="60" cy="12" r="0.9" fill="currentColor" opacity="0.7" />
      <circle cx="180" cy="12" r="0.9" fill="currentColor" opacity="0.7" />
    </g>
  </svg>
);
