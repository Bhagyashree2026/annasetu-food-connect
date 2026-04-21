import { Ornament } from "@/components/Ornament";
import keralaMotif from "@/assets/kerala-motif.png";

const stats = [
  { value: "12,480", label: "Meals rescued", caption: "across 96 partner kitchens" },
  { value: "3.2t", label: "CO₂ emissions saved", caption: "vs landfill disposal" },
  { value: "840kg", label: "Food diverted from waste", caption: "in the last 30 days" },
  { value: "18 min", label: "Avg pickup time", caption: "from post to handoff" },
];

export const Impact = () => (
  <section id="impact" className="py-24 md:py-32 gradient-ivory relative overflow-hidden">
    <img
      src={keralaMotif}
      alt=""
      aria-hidden="true"
      className="absolute -right-32 top-1/2 -translate-y-1/2 w-[640px] opacity-[0.07] pointer-events-none"
    />

    <div className="container mx-auto px-6 relative">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-4">Our impact so far</p>
          <h2 className="font-display text-4xl md:text-6xl text-maroon leading-tight mb-6">
            Numbers tell <span className="italic text-primary">a story</span> — but every meal tells a name.
          </h2>
          <p className="text-foreground/70 text-lg leading-relaxed mb-8">
            Aligned with UN Sustainable Development Goals 2 (Zero Hunger) and 12 (Responsible Consumption),
            AnnaSetu turns surplus into sustenance — one verified pickup at a time.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold">SDG 2 · Zero Hunger</span>
            <span className="px-4 py-2 rounded-full bg-accent/15 border border-accent/40 text-accent-foreground text-sm font-semibold">SDG 12 · Responsible Consumption</span>
            <span className="px-4 py-2 rounded-full bg-maroon/10 border border-maroon/30 text-maroon text-sm font-semibold">SDG 13 · Climate Action</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="kerala-card p-6 text-center hover:shadow-elegant transition-smooth"
              style={{ transform: i % 2 === 1 ? 'translateY(20px)' : 'none' }}
            >
              <div className="font-display text-5xl text-shimmer-gold mb-1">{s.value}</div>
              <div className="text-sm font-semibold text-maroon mb-1">{s.label}</div>
              <div className="text-xs text-muted-foreground">{s.caption}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-accent/70 mt-20">
        <Ornament className="mx-auto w-72" />
      </div>
    </div>
  </section>
);
