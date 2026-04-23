import { useEffect, useState } from "react";
import { PhoneFrame } from "@/components/app/PhoneFrame";
import { getImpact, getDonations, useAnnaStore, STATUS_LABEL, type DonationStatus } from "@/lib/annaStore";
import { Leaf, Truck, TrendingUp, Users, Activity, Clock, Flame, Award } from "lucide-react";

const Impact = () => {
  // Subscribe to store changes so the dashboard reacts in real time.
  useAnnaStore();

  // Tick every second so "moments ago" labels and the live pulse stay fresh.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const i = getImpact();
  const donations = getDonations();
  const delivered = donations.filter(d => d.status === "delivered");
  const active = donations.filter(d => d.status !== "delivered");

  // ---- Aggregations ----
  // Last 7 days of delivered meals
  const byDay = new Map<string, number>();
  delivered.forEach(d => {
    const k = new Date(d.createdAt).toLocaleDateString([], { day: "2-digit", month: "short" });
    byDay.set(k, (byDay.get(k) ?? 0) + d.servings);
  });
  const days = Array.from(byDay.entries()).slice(-7);
  const maxDay = Math.max(1, ...days.map(([, v]) => v));

  // Status breakdown
  const statusCounts: Record<DonationStatus, number> = {
    posted: 0, accepted: 0, assigned: 0, picked_up: 0, delivered: 0,
  };
  donations.forEach(d => { statusCounts[d.status] += 1; });
  const totalForBar = Math.max(1, donations.length);

  // Top NGO partners by meals received
  const ngoTotals = new Map<string, number>();
  delivered.forEach(d => {
    if (!d.ngoName) return;
    ngoTotals.set(d.ngoName, (ngoTotals.get(d.ngoName) ?? 0) + d.servings);
  });
  const topNgos = Array.from(ngoTotals.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const maxNgo = Math.max(1, ...topNgos.map(([, v]) => v));

  // Hourly heat strip for today
  const today = new Date().toDateString();
  const hourly = new Array(12).fill(0) as number[]; // 2-hour buckets, last 24h
  delivered.forEach(d => {
    if (new Date(d.createdAt).toDateString() !== today) return;
    const h = new Date(d.createdAt).getHours();
    hourly[Math.floor(h / 2)] += d.servings;
  });
  const maxHour = Math.max(1, ...hourly);

  // Most recent activity
  const recent = donations.slice(0, 4);

  return (
    <PhoneFrame title="Impact dashboard" subtitle="തത്സമയ പ്രഭാവം">
      {/* Live indicator */}
      <div className="flex items-center justify-between mb-3 animate-fade-up">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-70" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-primary">Live</span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          Updated {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </span>
      </div>

      {/* Hero KPI cards */}
      <div className="grid grid-cols-2 gap-3 mb-4 animate-fade-up">
        <Big icon={<Leaf />} value={i.meals.toLocaleString()} label="Meals rescued" tint="leaf" />
        <Big icon={<TrendingUp />} value={`${i.co2Kg} kg`} label="CO₂ saved" tint="gold" />
        <Big icon={<Truck />} value={i.totalPosts.toString()} label="Pickups" tint="leaf" />
        <Big icon={<Users />} value={i.ngos.toString()} label="NGOs served" tint="gold" />
      </div>

      {/* Live pipeline */}
      <div className="kerala-card p-4 mb-4 animate-fade-up">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Live pipeline</p>
          </div>
          <span className="text-[10px] font-semibold text-maroon">{active.length} active</span>
        </div>
        <div className="space-y-2">
          {(Object.keys(statusCounts) as DonationStatus[]).map(s => {
            const count = statusCounts[s];
            const pct = (count / totalForBar) * 100;
            return (
              <div key={s} className="flex items-center gap-3">
                <span className="text-[10px] text-maroon font-medium w-28 shrink-0">{STATUS_LABEL[s]}</span>
                <div className="flex-1 h-2 rounded-full bg-secondary/60 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${s === "delivered" ? "gradient-leaf" : "gradient-gold"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[11px] tabular-nums text-maroon font-semibold w-6 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7-day trend */}
      <div className="kerala-card p-4 mb-4 animate-fade-up">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">Meals delivered · last 7 days</p>
        {days.length === 0 ? (
          <p className="text-xs text-muted-foreground py-6 text-center">Complete a delivery to see trends.</p>
        ) : (
          <div className="flex items-end gap-2 h-32">
            {days.map(([day, val]) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] tabular-nums text-maroon font-semibold">{val}</span>
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full gradient-gold rounded-t-md shadow-soft transition-all duration-500"
                    style={{ height: `${(val / maxDay) * 100}%` }}
                  />
                </div>
                <span className="text-[9px] text-muted-foreground">{day}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Today's heat strip */}
      <div className="kerala-card p-4 mb-4 animate-fade-up">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-terracotta" />
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Today's rescue heat</p>
          </div>
          <span className="text-[10px] text-muted-foreground">2-hour buckets</span>
        </div>
        <div className="flex gap-1">
          {hourly.map((v, idx) => {
            const intensity = v / maxHour;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full h-7 rounded transition-colors"
                  style={{
                    background: v === 0
                      ? "hsl(var(--secondary) / 0.5)"
                      : `hsl(var(--terracotta) / ${0.25 + intensity * 0.75})`,
                  }}
                  title={`${idx * 2}:00 — ${v} meals`}
                />
                {idx % 2 === 0 && (
                  <span className="text-[8px] text-muted-foreground">{(idx * 2).toString().padStart(2, "0")}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Top NGO partners */}
      {topNgos.length > 0 && (
        <div className="kerala-card p-4 mb-4 animate-fade-up">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-primary" />
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Top NGO partners</p>
          </div>
          <div className="space-y-2.5">
            {topNgos.map(([name, val], idx) => (
              <div key={name} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${idx === 0 ? "gradient-gold text-maroon" : "bg-secondary text-maroon"}`}>
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-maroon truncate">{name}</p>
                  <div className="h-1.5 mt-1 rounded-full bg-secondary/60 overflow-hidden">
                    <div className="h-full gradient-leaf rounded-full" style={{ width: `${(val / maxNgo) * 100}%` }} />
                  </div>
                </div>
                <span className="text-xs font-bold text-maroon tabular-nums">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent activity feed */}
      <div className="kerala-card p-4 mb-4 animate-fade-up">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-primary" />
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Recent activity</p>
        </div>
        {recent.length === 0 ? (
          <p className="text-xs text-muted-foreground py-3 text-center">No donations yet.</p>
        ) : (
          <div className="space-y-2.5">
            {recent.map(d => (
              <div key={d.id} className="flex items-center gap-3 pb-2.5 border-b border-accent/15 last:border-0 last:pb-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${d.status === "delivered" ? "gradient-leaf text-primary-foreground" : "gradient-gold text-maroon"}`}>
                  <Leaf className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-maroon truncate">{d.foodName} · {d.servings} meals</p>
                  <p className="text-[10px] text-muted-foreground truncate">{d.donorOrg} → {d.ngoName ?? "awaiting NGO"}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-semibold text-maroon">{STATUS_LABEL[d.status]}</p>
                  <p className="text-[9px] text-muted-foreground">{timeAgo(d.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SDG */}
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
  <div className="kerala-card p-4">
    <div className={`w-9 h-9 rounded-lg ${tint === "leaf" ? "gradient-leaf text-primary-foreground" : "gradient-gold text-maroon"} flex items-center justify-center mb-2 shadow-soft`}>
      {icon}
    </div>
    <div className="font-display text-2xl text-maroon leading-none tabular-nums">{value}</div>
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

function timeAgo(at: number) {
  const s = Math.max(1, Math.floor((Date.now() - at) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default Impact;
