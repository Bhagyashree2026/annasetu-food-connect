import { Button } from "@/components/ui/button";
import { AnnaSetuLogo } from "@/components/AnnaSetuLogo";
import { Ornament } from "@/components/Ornament";
import keralaMotif from "@/assets/kerala-motif.png";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => (
  <section className="relative overflow-hidden gradient-ivory">
    {/* corner motif decorations */}
    <img
      src={keralaMotif}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute -top-20 -left-24 w-[420px] opacity-[0.08] select-none"
    />
    <img
      src={keralaMotif}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-24 -right-24 w-[420px] opacity-[0.08] rotate-180 select-none"
    />

    <div className="container relative mx-auto px-6 pt-10 pb-24 md:pt-16 md:pb-32">
      {/* Top bar */}
      <nav className="flex items-center justify-between mb-16 animate-fade-up">
        <div className="flex items-center gap-3">
          <AnnaSetuLogo size={42} />
          <div>
            <h2 className="font-display text-2xl leading-none text-maroon">AnnaSetu</h2>
            <p className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground">അന്നസേതു · Bridge of Food</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-foreground/80">
          <a href="#how" className="hover:text-primary transition-smooth">How it works</a>
          <a href="#impact" className="hover:text-primary transition-smooth">Impact</a>
          <a href="#partners" className="hover:text-primary transition-smooth">Partners</a>
          <Button asChild variant="outline" size="sm" className="border-maroon/40 text-maroon hover:bg-maroon hover:text-maroon-foreground">
            <Link to="/app">Open app</Link>
          </Button>
        </div>
      </nav>

      {/* Hero content */}
      <div className="grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-maroon/10 border border-maroon/20 text-maroon text-xs tracking-wider uppercase mb-7">
            <Sparkles className="w-3.5 h-3.5" />
            Built for Google Solution Challenge · SDG 2 & 12
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.02] text-maroon mb-6">
            From every <span className="text-shimmer-gold italic">surplus plate</span><br />
            to every <span className="italic text-primary">empty hand.</span>
          </h1>

          <p className="text-lg text-foreground/75 max-w-xl mb-8 leading-relaxed">
            AnnaSetu is the bridge between hotels, kitchens and event halls with extra food —
            and the NGOs serving those who need it most. Verified, traceable, dignified.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button asChild size="lg" variant="hero" className="group">
              <Link to="/app">
                Try the live prototype
                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-smooth" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost-gold">
              <Link to="/app">I'm an NGO partner</Link>
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-8 text-sm">
            <div>
              <div className="font-display text-3xl text-maroon">12,480</div>
              <div className="text-muted-foreground text-xs uppercase tracking-wider">Meals rescued</div>
            </div>
            <div className="w-px h-10 bg-accent/40" />
            <div>
              <div className="font-display text-3xl text-maroon">96</div>
              <div className="text-muted-foreground text-xs uppercase tracking-wider">NGO partners</div>
            </div>
            <div className="w-px h-10 bg-accent/40" />
            <div>
              <div className="font-display text-3xl text-maroon">3.2t</div>
              <div className="text-muted-foreground text-xs uppercase tracking-wider">CO₂ saved</div>
            </div>
          </div>
        </div>

        {/* Phone mockup */}
        <div className="lg:col-span-5 relative animate-fade-up" style={{ animationDelay: '0.25s' }}>
          <PhoneMockup />
        </div>
      </div>

      <div className="mt-20 text-accent/70">
        <Ornament className="mx-auto w-72" />
      </div>
    </div>
  </section>
);

const PhoneMockup = () => (
  <div className="relative mx-auto w-[300px] md:w-[340px]">
    <div className="absolute -inset-8 gradient-leaf opacity-20 blur-3xl rounded-full" />
    <div className="relative rounded-[2.5rem] bg-maroon p-3 shadow-elegant">
      <div className="rounded-[2rem] gradient-ivory overflow-hidden h-[640px] relative">
        {/* notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-maroon rounded-full z-10" />

        <div className="px-5 pt-12 pb-6">
          <div className="flex items-center justify-between text-xs text-foreground/60 mb-6">
            <span>9:41</span>
            <span>● ● ●</span>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <AnnaSetuLogo size={28} />
            <span className="font-display text-xl text-maroon">AnnaSetu</span>
          </div>
          <p className="text-xs text-muted-foreground mb-6">Good evening, Hotel Malabar 🌿</p>

          {/* Active donation card */}
          <div className="kerala-card p-4 mb-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-primary font-semibold">Live · Pickup en route</div>
                <div className="font-display text-lg text-maroon leading-tight">Sambar Sadhya · 80 plates</div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground text-[10px] font-semibold">VEG</span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className="h-full w-3/4 gradient-gold rounded-full pulse-glow" />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
              <span>Snehalaya NGO</span><span>ETA 8 min</span>
            </div>
          </div>

          {/* Quick action */}
          <button className="w-full gradient-leaf text-primary-foreground rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 shadow-soft mb-4">
            <span className="text-lg">＋</span> Post new surplus
          </button>

          <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Nearby NGOs</div>
          <NgoMini name="Snehalaya" distance="1.2 km" rating="★ 4.9" capacity="120 meals" />
          <NgoMini name="Akshaya Patra" distance="2.6 km" rating="★ 4.8" capacity="300 meals" />
          <NgoMini name="Karunya Trust" distance="3.4 km" rating="★ 4.7" capacity="80 meals" />
        </div>
      </div>
    </div>
  </div>
);

const NgoMini = ({ name, distance, rating, capacity }: { name: string; distance: string; rating: string; capacity: string }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-accent/15 last:border-0">
    <div>
      <div className="text-sm font-semibold text-foreground">{name}</div>
      <div className="text-[10px] text-muted-foreground">{distance} · {capacity}</div>
    </div>
    <span className="text-xs text-accent font-semibold">{rating}</span>
  </div>
);
