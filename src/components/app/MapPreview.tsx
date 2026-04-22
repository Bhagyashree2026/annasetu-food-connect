import { MapPin } from "lucide-react";

interface Props {
  query: string; // e.g. "Kaloor, Kochi"
  height?: number;
}

// Lightweight Google Maps embed. Uses the public embed endpoint (no API key needed
// for the basic ?q= variant) so the prototype works without secrets.
export const MapPreview = ({ query, height = 140 }: Props) => {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=13&output=embed`;
  return (
    <div className="rounded-xl overflow-hidden border border-accent/25 bg-secondary/30 relative">
      <iframe
        title={`Map of ${query}`}
        src={src}
        loading="lazy"
        style={{ height, width: "100%", border: 0 }}
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-card/90 backdrop-blur text-[10px] font-semibold text-maroon border border-accent/30">
        <MapPin className="w-3 h-3 text-terracotta" /> {query}
      </div>
    </div>
  );
};
