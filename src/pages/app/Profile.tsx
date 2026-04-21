import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "@/components/app/PhoneFrame";
import { Button } from "@/components/ui/button";
import { clearAllData, getUser, setUser, Role } from "@/lib/annaStore";
import { ChevronRight, LogOut, ShieldCheck, Languages, Bell, Repeat, RefreshCw } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const user = getUser();
  if (!user) { navigate("/app/login", { replace: true }); return null; }

  const roleLabel: Record<Role, string> = {
    restaurant: "Restaurant / Hotel",
    ngo: "NGO partner",
    driver: "Driver / Pickup partner",
  };

  return (
    <PhoneFrame title="Profile" subtitle="പ്രൊഫൈൽ">
      <div className="kerala-card p-5 mb-4 animate-fade-up text-center">
        <div className="w-20 h-20 mx-auto rounded-full gradient-leaf flex items-center justify-center text-primary-foreground font-display text-3xl mb-3 shadow-elegant">
          {user.name.slice(0, 1).toUpperCase()}
        </div>
        <h2 className="font-display text-2xl text-maroon leading-tight">{user.name}</h2>
        <p className="text-xs text-muted-foreground">{user.org}</p>
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
          <ShieldCheck className="w-3 h-3" /> Verified · {roleLabel[user.role]}
        </div>
      </div>

      <div className="kerala-card divide-y divide-accent/15 mb-4">
        <Row icon={<Repeat className="w-4 h-4" />} label="Switch role" onClick={() => navigate("/app/role")} />
        <Row icon={<Bell className="w-4 h-4" />} label="Notifications" onClick={() => navigate("/app/notifications")} />
        <Row icon={<Languages className="w-4 h-4" />} label="Language" sub="English · മലയാളം" />
      </div>

      <div className="kerala-card divide-y divide-accent/15 mb-4">
        <Row
          icon={<RefreshCw className="w-4 h-4" />}
          label="Reset demo data"
          onClick={() => {
            if (confirm("Clear all donations, notifications, and sign out?")) {
              clearAllData();
              navigate("/app/login", { replace: true });
            }
          }}
        />
        <Row
          icon={<LogOut className="w-4 h-4" />}
          label="Sign out"
          danger
          onClick={() => { setUser(null); navigate("/app/login", { replace: true }); }}
        />
      </div>

      <p className="text-[10px] text-center text-muted-foreground">
        AnnaSetu · Solution Challenge prototype · v0.1
      </p>
    </PhoneFrame>
  );
};

const Row = ({ icon, label, sub, onClick, danger }: { icon: React.ReactNode; label: string; sub?: string; onClick?: () => void; danger?: boolean }) => (
  <button onClick={onClick} className="w-full flex items-center gap-3 p-4 text-left hover:bg-accent/5 transition-smooth">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${danger ? "bg-destructive/15 text-destructive" : "bg-primary/10 text-primary"}`}>
      {icon}
    </div>
    <div className="flex-1">
      <p className={`text-sm font-medium ${danger ? "text-destructive" : "text-maroon"}`}>{label}</p>
      {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
    </div>
    {!danger && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
  </button>
);

export default Profile;
