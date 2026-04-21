import { useNavigate } from "react-router-dom";
import { Plus, TrendingUp, Leaf, Truck, Building2, HeartHandshake, Bike } from "lucide-react";
import { PhoneFrame } from "@/components/app/PhoneFrame";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/app/StatusBadge";
import { getUser, getDonations, getImpact } from "@/lib/annaStore";

const Home = () => {
  const navigate = useNavigate();
  const user = getUser();
  if (!user) { navigate("/app/login", { replace: true }); return null; }

  const donations = getDonations();
  const impact = getImpact();
  const role = user.role;

  const myActive = donations.filter(d => d.status !== "delivered").slice(0, 2);
  const incoming = donations.filter(d => d.status === "posted").slice(0, 3); // for NGO
  const myJobs = donations.filter(d => d.status === "assigned" || d.status === "picked_up").slice(0, 3); // for driver

  const greetings = role === "ngo" ? "Live food alerts near you" : role === "driver" ? "Today's pickup jobs" : "Ready to share surplus today?";
  const malayalam = role === "ngo" ? "സജീവ അലേർട്ടുകൾ" : role === "driver" ? "ഇന്നത്തെ പിക്ക്അപ്പുകൾ" : "ഇന്ന് ഭക്ഷണം പങ്കിടൂ";

  return (
    <PhoneFrame title={`Namaskaram, ${user.name.split(" ")[0]}`} subtitle={user.org}>
      {/* Greeting card */}
      <div className="kerala-card p-4 mb-4 animate-fade-up">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-accent">{malayalam}</p>
            <h2 className="font-display text-xl text-maroon mt-0.5 leading-tight">{greetings}</h2>
          </div>
          <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center shadow-gold text-maroon">
            {role === "restaurant" ? <Building2 className="w-5 h-5" /> : role === "ngo" ? <HeartHandshake className="w-5 h-5" /> : <Bike className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Primary CTA */}
      {role === "restaurant" && (
        <Button
          variant="hero"
          size="lg"
          className="w-full mb-5 animate-fade-up"
          onClick={() => navigate("/app/donate")}
        >
          <Plus className="w-5 h-5" /> Post surplus food
        </Button>
      )}
      {role === "ngo" && (
        <Button variant="hero" size="lg" className="w-full mb-5 animate-fade-up" onClick={() => navigate("/app/nearby")}>
          See nearby donations
        </Button>
      )}
      {role === "driver" && (
        <Button variant="hero" size="lg" className="w-full mb-5 animate-fade-up" onClick={() => navigate("/app/donations")}>
          View my pickup jobs
        </Button>
      )}

      {/* Impact strip */}
      <button
        onClick={() => navigate("/app/impact")}
        className="w-full kerala-card p-4 mb-5 animate-fade-up grid grid-cols-3 gap-2 text-left"
      >
        <Stat icon={<Leaf className="w-4 h-4" />} value={impact.meals.toLocaleString()} label="Meals" />
        <Stat icon={<Truck className="w-4 h-4" />} value={impact.totalPosts.toString()} label="Pickups" />
        <Stat icon={<TrendingUp className="w-4 h-4" />} value={`${impact.co2Kg}kg`} label="CO₂ saved" />
      </button>

      {/* Restaurant: my active donations */}
      {role === "restaurant" && (
        <Section title="Your active donations" emptyMsg="No active donations yet. Post your first surplus.">
          {myActive.map(d => (
            <button key={d.id} onClick={() => navigate(`/app/track/${d.id}`)} className="w-full kerala-card p-3.5 text-left hover:shadow-elegant transition-smooth">
              <div className="flex justify-between items-start mb-1.5">
                <div>
                  <h4 className="font-display text-base text-maroon leading-tight">{d.foodName}</h4>
                  <p className="text-[11px] text-muted-foreground">{d.servings} servings · {d.foodType.toUpperCase()}</p>
                </div>
                <StatusBadge status={d.status} />
              </div>
              {d.ngoName && <p className="text-[11px] text-foreground/70">→ {d.ngoName}</p>}
            </button>
          ))}
        </Section>
      )}

      {/* NGO: incoming */}
      {role === "ngo" && (
        <Section title="Incoming food alerts" emptyMsg="No live alerts. Check back soon.">
          {incoming.map(d => (
            <button key={d.id} onClick={() => navigate("/app/nearby")} className="w-full kerala-card p-3.5 text-left">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h4 className="font-display text-base text-maroon leading-tight">{d.foodName}</h4>
                  <p className="text-[11px] text-muted-foreground">{d.donorOrg} · {d.servings} servings</p>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-terracotta">Live</span>
              </div>
              <p className="text-[11px] text-foreground/70">Pickup by {d.pickupBy}</p>
            </button>
          ))}
        </Section>
      )}

      {/* Driver: jobs */}
      {role === "driver" && (
        <Section title="Pickup jobs assigned to you" emptyMsg="No assigned pickups yet.">
          {myJobs.map(d => (
            <button key={d.id} onClick={() => navigate(`/app/pickup/${d.id}`)} className="w-full kerala-card p-3.5 text-left">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h4 className="font-display text-base text-maroon leading-tight">{d.foodName}</h4>
                  <p className="text-[11px] text-muted-foreground">{d.donorOrg} → {d.ngoName}</p>
                </div>
                <StatusBadge status={d.status} />
              </div>
            </button>
          ))}
        </Section>
      )}
    </PhoneFrame>
  );
};

const Stat = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <div className="text-center">
    <div className="text-primary mx-auto w-fit mb-1">{icon}</div>
    <div className="font-display text-lg text-maroon leading-none">{value}</div>
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
  </div>
);

const Section = ({ title, emptyMsg, children }: { title: string; emptyMsg: string; children: React.ReactNode }) => {
  const arr = Array.isArray(children) ? children : [children];
  const hasContent = arr.filter(Boolean).length > 0;
  return (
    <div className="mb-4">
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-2 px-1">{title}</div>
      {hasContent ? <div className="space-y-2">{children}</div> : (
        <div className="text-center text-xs text-muted-foreground py-6 border border-dashed border-accent/30 rounded-lg">{emptyMsg}</div>
      )}
    </div>
  );
};

export default Home;
