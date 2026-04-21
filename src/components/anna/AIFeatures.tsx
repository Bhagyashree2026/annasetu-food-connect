import bananaLeaf from "@/assets/banana-leaf.jpg";
import { Brain, Image as ImageIcon, Languages, Route, Clock, MessageCircle } from "lucide-react";

const features = [
  { icon: ImageIcon, title: "Photo → Servings", desc: "Vision model estimates plate counts from a single image." },
  { icon: Brain, title: "Smart NGO matching", desc: "Ranks partners by capacity, distance, urgency and food type." },
  { icon: Clock, title: "Urgency prediction", desc: "Decides whether to dispatch now or schedule a morning pickup." },
  { icon: Route, title: "Route optimisation", desc: "Shortest, safest route for the delivery partner." },
  { icon: Languages, title: "Multilingual alerts", desc: "Malayalam, Tamil, Hindi & English — for every partner." },
  { icon: MessageCircle, title: "Donation summaries", desc: "Auto-generated impact summaries for monthly reports." },
];

export const AIFeatures = () => (
  <section className="relative py-24 md:py-32 overflow-hidden">
    <div className="absolute inset-0">
      <img src={bananaLeaf} alt="" aria-hidden="true" className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-maroon/85" />
    </div>

    <div className="container mx-auto px-6 relative">
      <div className="max-w-2xl mb-14">
        <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-4">Powered by Gemini</p>
        <h2 className="font-display text-4xl md:text-6xl text-maroon-foreground mb-4">
          AI that serves, <span className="italic text-shimmer-gold">never replaces.</span>
        </h2>
        <p className="text-maroon-foreground/75 text-lg">
          Every model in AnnaSetu has one job: remove the friction between a surplus meal and the person who needs it.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f) => (
          <div
            key={f.title}
            className="p-6 rounded-xl border border-accent/25 bg-maroon/40 backdrop-blur-sm hover:bg-maroon/60 hover:border-accent/60 transition-smooth"
          >
            <div className="w-11 h-11 rounded-lg gradient-gold flex items-center justify-center text-maroon mb-4 shadow-gold">
              <f.icon className="w-5 h-5" />
            </div>
            <h3 className="font-display text-2xl text-maroon-foreground mb-1">{f.title}</h3>
            <p className="text-sm text-maroon-foreground/70 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
