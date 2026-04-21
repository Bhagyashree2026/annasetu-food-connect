import { Ornament } from "@/components/Ornament";
import { Camera, MapPin, Bike, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Post the surplus",
    desc: "Snap a photo. AI estimates servings, classifies the food, and tags veg / non-veg automatically.",
    num: "01",
  },
  {
    icon: MapPin,
    title: "AI matches the right NGO",
    desc: "We rank nearby partners by capacity, urgency, food type and pickup time — instantly.",
    num: "02",
  },
  {
    icon: Bike,
    title: "Driver pickup",
    desc: "Verified delivery partner accepts, picks up with OTP confirmation and a photo proof.",
    num: "03",
  },
  {
    icon: ShieldCheck,
    title: "Dignified handoff",
    desc: "NGO confirms receipt. Every meal is traceable — no waste, no doubt, just impact.",
    num: "04",
  },
];

export const HowItWorks = () => (
  <section id="how" className="py-24 md:py-32 bg-background relative">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-4">The Bridge in four steps</p>
        <h2 className="font-display text-4xl md:text-6xl text-maroon mb-4">
          From kitchen to <span className="italic text-primary">community</span>
        </h2>
        <div className="text-accent/70 mt-6">
          <Ornament className="mx-auto w-56" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s, i) => (
          <div
            key={s.num}
            className="kerala-card p-7 transition-smooth hover:-translate-y-1 hover:shadow-elegant group"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-xl gradient-leaf flex items-center justify-center text-primary-foreground shadow-soft">
                <s.icon className="w-6 h-6" />
              </div>
              <span className="font-display text-4xl text-accent/40 group-hover:text-accent/70 transition-smooth">{s.num}</span>
            </div>
            <h3 className="font-display text-2xl text-maroon mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
