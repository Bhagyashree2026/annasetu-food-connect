import { Building2, HeartHandshake, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";

const roles = [
  {
    icon: Building2,
    tag: "For Hotels & Kitchens",
    title: "Turn waste into goodwill",
    desc: "Post surplus in under 30 seconds. Track every plate to its destination. Earn a verified social-impact badge.",
    cta: "Register kitchen",
  },
  {
    icon: HeartHandshake,
    tag: "For NGOs",
    title: "Receive what you need, when you need it",
    desc: "Set capacity, dietary preferences and pickup hours. Get matched only to relevant, fresh donations.",
    cta: "Onboard your NGO",
  },
  {
    icon: Bike,
    tag: "For Delivery Partners",
    title: "Drive change, literally",
    desc: "Pick up nearby surplus on your route. Earn micro-incentives. Confirm with a tap and a photo.",
    cta: "Become a partner",
  },
];

export const Partners = () => (
  <section id="partners" className="py-24 md:py-32 bg-background">
    <div className="container mx-auto px-6">
      <div className="max-w-2xl mb-14">
        <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-4">Built for everyone in the chain</p>
        <h2 className="font-display text-4xl md:text-6xl text-maroon">
          Three roles. <span className="italic text-primary">One mission.</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {roles.map((r) => (
          <div key={r.title} className="kerala-card p-8 flex flex-col hover:shadow-elegant transition-smooth">
            <div className="w-14 h-14 rounded-xl gradient-leaf flex items-center justify-center text-primary-foreground mb-6 shadow-soft">
              <r.icon className="w-6 h-6" />
            </div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-accent font-semibold mb-2">{r.tag}</p>
            <h3 className="font-display text-2xl text-maroon mb-3 leading-tight">{r.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{r.desc}</p>
            <Button variant="ghost-gold" className="self-start">{r.cta} →</Button>
          </div>
        ))}
      </div>
    </div>
  </section>
);
