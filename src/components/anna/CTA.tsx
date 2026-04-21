import { Button } from "@/components/ui/button";
import { AnnaSetuLogo } from "@/components/AnnaSetuLogo";
import { Ornament } from "@/components/Ornament";
import keralaMotif from "@/assets/kerala-motif.png";

export const CTA = () => (
  <section className="relative py-24 md:py-32 overflow-hidden gradient-leaf">
    <img
      src={keralaMotif}
      alt=""
      aria-hidden="true"
      className="absolute -top-20 -left-20 w-[480px] opacity-[0.10] pointer-events-none"
    />
    <img
      src={keralaMotif}
      alt=""
      aria-hidden="true"
      className="absolute -bottom-20 -right-20 w-[480px] opacity-[0.10] rotate-180 pointer-events-none"
    />

    <div className="container mx-auto px-6 relative text-center">
      <AnnaSetuLogo className="mx-auto mb-6" size={64} />
      <div className="text-accent">
        <Ornament className="mx-auto w-56 mb-8" />
      </div>
      <h2 className="font-display text-4xl md:text-7xl text-primary-foreground leading-tight mb-6 max-w-3xl mx-auto">
        No food deserves a bin <br/>when a child has an <span className="italic text-shimmer-gold">empty plate.</span>
      </h2>
      <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-10">
        Join 96 kitchens and NGOs already turning surplus into sustenance every single day.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button size="lg" variant="gold">Start donating today</Button>
        <Button size="lg" variant="outline-light">Watch the demo</Button>
      </div>
    </div>
  </section>
);
