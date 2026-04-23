import { useEffect, useState } from "react";
import { Bike, MapPin, Navigation } from "lucide-react";

interface Props {
  origin: string;        // e.g. "Hotel Saravana, Kaloor"
  destination: string;   // e.g. "Snehalaya Trust, Edappally"
  driverName?: string;
  etaMin?: number;       // minutes
  /**
   * Progress 0..1. If omitted, the component animates the rider automatically.
   */
  progress?: number;
}

/**
 * Zepto-style live delivery tracking widget.
 *
 * Renders a Google Maps embed for visual context with an overlaid animated
 * route line, origin/destination pins and a moving rider marker. No API key
 * required — uses the public maps embed endpoint.
 */
export const LiveTrackMap = ({ origin, destination, driverName = "Driver", etaMin = 8, progress }: Props) => {
  const [autoP, setAutoP] = useState(0);
  useEffect(() => {
    if (progress !== undefined) return;
    const id = setInterval(() => {
      setAutoP(p => (p >= 1 ? 0.05 : +(p + 0.012).toFixed(3)));
    }, 220);
    return () => clearInterval(id);
  }, [progress]);

  const p = progress ?? autoP;

  // Centre the map roughly between origin and destination using a directions query.
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(destination)}&z=13&output=embed`;

  // Animated rider position along an SVG path.
  // Path: gentle S-curve from bottom-left (origin) to top-right (destination).
  const pathD = "M 30 220 C 110 180, 130 120, 200 120 S 320 60, 370 40";
  const pointAt = (t: number) => {
    // simple cubic bezier sampling along the two cubic segments stitched together
    // segment 1: from (30,220) to (200,120) with controls (110,180) and (130,120)
    // segment 2: from (200,120) to (370,40) with controls (270,120) and (320,60)
    const seg = t < 0.5 ? 0 : 1;
    const lt = seg === 0 ? t / 0.5 : (t - 0.5) / 0.5;
    const cubic = (a: number, b: number, c: number, d: number, u: number) =>
      Math.pow(1 - u, 3) * a +
      3 * Math.pow(1 - u, 2) * u * b +
      3 * (1 - u) * u * u * c +
      u * u * u * d;
    if (seg === 0) {
      return { x: cubic(30, 110, 130, 200, lt), y: cubic(220, 180, 120, 120, lt) };
    }
    return { x: cubic(200, 270, 320, 370, lt), y: cubic(120, 120, 60, 40, lt) };
  };
  const pos = pointAt(p);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-accent/25 bg-secondary/30 shadow-elegant">
      {/* Map background */}
      <iframe
        title="Live delivery map"
        src={mapSrc}
        loading="lazy"
        style={{ height: 280, width: "100%", border: 0, filter: "saturate(0.9) contrast(0.95)" }}
        referrerPolicy="no-referrer-when-downgrade"
      />

      {/* Tinted overlay so route is readable */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-card/10 via-transparent to-card/30" />

      {/* SVG route + rider */}
      <svg
        viewBox="0 0 400 280"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <defs>
          <linearGradient id="routeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--terracotta))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
        </defs>

        {/* Soft glow under route */}
        <path d={pathD} stroke="hsl(var(--card))" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.85" />
        {/* Main route */}
        <path
          d={pathD}
          stroke="url(#routeGrad)"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="9 7"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-32" dur="1.2s" repeatCount="indefinite" />
        </path>

        {/* Origin pin */}
        <g transform="translate(30 220)">
          <circle r="9" fill="hsl(var(--card))" stroke="hsl(var(--terracotta))" strokeWidth="2.5" />
          <circle r="3.5" fill="hsl(var(--terracotta))" />
        </g>

        {/* Destination pin */}
        <g transform="translate(370 40)">
          <circle r="11" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2.5" />
          <circle r="4.5" fill="hsl(var(--primary))" />
        </g>

        {/* Rider marker */}
        <g transform={`translate(${pos.x} ${pos.y})`}>
          <circle r="16" fill="hsl(var(--accent) / 0.25)">
            <animate attributeName="r" values="14;20;14" dur="1.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0.1;0.7" dur="1.6s" repeatCount="indefinite" />
          </circle>
          <circle r="11" fill="hsl(var(--accent))" stroke="hsl(var(--card))" strokeWidth="2.5" />
        </g>
      </svg>

      {/* Top-left: origin chip */}
      <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-card/95 backdrop-blur text-[10px] font-semibold text-maroon border border-accent/30 max-w-[55%] truncate shadow-sm">
        <MapPin className="w-3 h-3 text-terracotta shrink-0" />
        <span className="truncate">{origin}</span>
      </div>

      {/* Top-right: destination chip */}
      <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-card/95 backdrop-blur text-[10px] font-semibold text-maroon border border-primary/30 max-w-[55%] truncate shadow-sm">
        <Navigation className="w-3 h-3 text-primary shrink-0" />
        <span className="truncate">{destination}</span>
      </div>

      {/* Bottom: driver + ETA card (Zepto-style) */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-3 p-2.5 rounded-xl bg-card/95 backdrop-blur border border-accent/25 shadow-elegant">
        <div className="w-9 h-9 rounded-full gradient-leaf flex items-center justify-center text-primary-foreground shadow-elegant shrink-0">
          <Bike className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-maroon leading-tight truncate">{driverName}</p>
          <p className="text-[10px] text-muted-foreground">On the way · Live tracking</p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-display text-lg text-maroon leading-none">{etaMin}<span className="text-xs ml-0.5">min</span></p>
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">ETA</p>
        </div>
      </div>
    </div>
  );
};
