import { PhoneFrame } from "@/components/app/PhoneFrame";
import { getImpact, getDonations } from "@/lib/annaStore";
import { Leaf, Truck, TrendingUp, Users } from "lucide-react";

const Impact = () => {
  const i = getImpact();
  const donations = getDonations();

  // Aggregate by day for a tiny bar chart
  const byDay = new Map<string, number>();
  donations.filter(d => d.status === "delivered").forEach(d => {
    const k = new Date(d.createdAt).toLocaleDateString([], { day: "2-digit", month: "short" });
    byDay.set(k, (byDay.get(k) ?? 0) + d.servings);
  });
  const days = Array.from(byDay.entries()).slice(-7);
  const maxDay = Math.max(1, ...days.map(([, v]) => v));

  return (
    <PhoneFrame title="Your impact" subtitle="നിങ്ങളുടെ പ്രഭാവം">
      <div className="grid grid-cols-2 gap-3 mb-4 animate-fade-up">
        <Big icon={<Leaf />} value={i.meals.toLocaleString()} label="Meals rescued" tint="leaf" />
        <Big icon={<TrendingUp />} value={`${i.co2Kg} kg`} label="CO₂ saved" tint="gold" />
        <Big icon={<Truck />} value={i.totalPosts.toString()} label="Pickups" tint="leaf" />
        <Big icon={<Users />} value={i.ngos.toString()} label="NGOs served" tint="gold" />
      </div>

      <div className="kerala-card p-4 mb-4 animate-fade-up">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">Last 7 deliveries</p>
        {days.length === 0 ? (
          <p className="text-xs text-muted-foreground py-6 text-center">Complete a delivery to see trends.</p>
        ) : (
          <div className="flex items-end gap-2 h-32">
            {days.map(([day, val]) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full gradient-gold rounded-t-md shadow-soft"
                    style={{ height: `${(val / maxDay) * 100}%` }}
                  />
                </div>
                <span className="text-[9px] text-muted-foreground">{day}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="kerala-card p-4 animate-fade-up">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">SDG alignment</p>
        <Sdg n={2} title="Zero Hunger" />
        <Sdg n={12} title="Responsible Consumption" />
        <Sdg n={13} title="Climate Action" />
      </div>
    </PhoneFrame>
  );
};

const Big = ({ icon, value, label, tint }: { icon: React.ReactNode; value: string; label: string; tint: "leaf" | "gold" }) => (
  <div className={`kerala-card p-4 ${tint === "leaf" ? "" : ""}`}>
    <div className={`w-9 h-9 rounded-lg ${tint === "leaf" ? "gradient-leaf text-primary-foreground" : "gradient-gold text-maroon"} flex items-center justify-center mb-2 shadow-soft`}>
      {icon}
    </div>
    <div className="font-display text-2xl text-maroon leading-none">{value}</div>
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
  </div>
);

const Sdg = ({ n, title }: { n: number; title: string }) => (
  <div className="flex items-center gap-3 py-2 border-b border-accent/15 last:border-0">
    <div className="w-8 h-8 rounded gradient-leaf flex items-center justify-center text-primary-foreground font-bold text-xs">
      {n}
    </div>
    <span className="text-sm text-maroon font-medium">SDG {n} · {title}</span>
  </div>
);

export default Impact;
