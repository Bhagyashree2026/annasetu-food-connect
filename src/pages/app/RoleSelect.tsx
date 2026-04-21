import { useNavigate } from "react-router-dom";
import { Building2, HeartHandshake, Bike, ShieldCheck, ChevronRight } from "lucide-react";
import { PhoneFrame } from "@/components/app/PhoneFrame";
import { getUser, setUser, Role } from "@/lib/annaStore";

const ROLES: { id: Role; title: string; malayalam: string; desc: string; icon: any; defaultOrg: string }[] = [
  { id: "restaurant", title: "Restaurant / Hotel", malayalam: "ഹോട്ടൽ", desc: "Post your surplus food after service or events.", icon: Building2, defaultOrg: "Hotel Malabar" },
  { id: "ngo", title: "NGO partner", malayalam: "എൻ‌ജി‌ഒ", desc: "Receive nearby food alerts and accept pickups.", icon: HeartHandshake, defaultOrg: "Snehalaya Trust" },
  { id: "driver", title: "Driver / Pickup partner", malayalam: "ഡ്രൈവർ", desc: "Pick up donations and deliver them safely.", icon: Bike, defaultOrg: "AnnaSetu Logistics" },
];

const RoleSelect = () => {
  const navigate = useNavigate();
  const user = getUser();

  const choose = (r: typeof ROLES[number]) => {
    setUser({
      name: user?.name ?? "Demo User",
      phone: user?.phone,
      role: r.id,
      org: r.defaultOrg,
    });
    navigate("/app/home", { replace: true });
  };

  return (
    <PhoneFrame title="Choose your role" subtitle="നിങ്ങൾ ആരാണ്?" hideTabs hideHeader={false}>
      <p className="text-sm text-foreground/75 mb-5 animate-fade-up">
        Pick the role that matches you. You can switch anytime from your profile.
      </p>

      <div className="space-y-3">
        {ROLES.map((r, i) => {
          const Icon = r.icon;
          return (
            <button
              key={r.id}
              onClick={() => choose(r)}
              style={{ animationDelay: `${0.05 * i}s` }}
              className="kerala-card w-full p-4 flex items-center gap-4 text-left animate-fade-up hover:shadow-elegant transition-smooth"
            >
              <div className="w-12 h-12 rounded-xl gradient-leaf flex items-center justify-center text-primary-foreground shadow-soft shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-lg text-maroon leading-tight">{r.title}</h3>
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                </div>
                <p className="text-[11px] uppercase tracking-wider text-accent">{r.malayalam}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-snug">{r.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          );
        })}
      </div>
    </PhoneFrame>
  );
};

export default RoleSelect;
