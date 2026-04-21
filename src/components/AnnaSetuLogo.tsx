interface Props { className?: string; size?: number }

export const AnnaSetuLogo = ({ className = "", size = 48 }: Props) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="AnnaSetu logo"
  >
    {/* Banana leaf silhouette */}
    <defs>
      <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="hsl(145 60% 22%)" />
        <stop offset="100%" stopColor="hsl(130 50% 38%)" />
      </linearGradient>
      <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="hsl(45 85% 60%)" />
        <stop offset="100%" stopColor="hsl(30 70% 45%)" />
      </linearGradient>
    </defs>
    <path
      d="M32 4 C44 14 54 24 54 36 C54 50 44 60 32 60 C20 60 10 50 10 36 C10 24 20 14 32 4 Z"
      fill="url(#leafGrad)"
    />
    {/* Veins */}
    <path d="M32 8 L32 58" stroke="hsl(45 80% 65%)" strokeWidth="1.2" opacity="0.7" />
    <path d="M32 18 L20 30 M32 26 L18 38 M32 34 L20 44 M32 18 L44 30 M32 26 L46 38 M32 34 L44 44"
      stroke="hsl(45 80% 65%)" strokeWidth="0.8" opacity="0.55" />
    {/* Bridge / setu arc — symbolic */}
    <path d="M18 44 Q32 32 46 44" stroke="url(#goldGrad)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    <circle cx="32" cy="38" r="2.2" fill="url(#goldGrad)" />
  </svg>
);
