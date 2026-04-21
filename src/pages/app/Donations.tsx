import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "@/components/app/PhoneFrame";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/app/StatusBadge";
import { getDonations, getUser } from "@/lib/annaStore";
import { Inbox } from "lucide-react";

const Donations = () => {
  const navigate = useNavigate();
  const user = getUser();
  const all = getDonations();

  const list = user?.role === "driver"
    ? all.filter(d => d.status === "assigned" || d.status === "picked_up" || d.status === "delivered")
    : all;

  return (
    <PhoneFrame title="Activity" subtitle="എല്ലാ ദാനങ്ങളും">
      {list.length === 0 ? (
        <div className="text-center py-16 animate-fade-up">
          <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-4">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="font-display text-xl text-maroon mb-1">Nothing yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
            Your donations and pickups will show up here.
          </p>
          {user?.role === "restaurant" && (
            <Button variant="hero" onClick={() => navigate("/app/donate")}>Post your first surplus</Button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {list.map(d => {
            const target = user?.role === "driver" ? `/app/pickup/${d.id}` : `/app/track/${d.id}`;
            return (
              <button
                key={d.id}
                onClick={() => navigate(target)}
                className="w-full kerala-card p-3.5 text-left animate-fade-up"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <div className="min-w-0">
                    <h4 className="font-display text-base text-maroon leading-tight truncate">{d.foodName}</h4>
                    <p className="text-[11px] text-muted-foreground">
                      {d.donorOrg}{d.ngoName ? ` → ${d.ngoName}` : ""} · {d.servings} servings
                    </p>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {new Date(d.createdAt).toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </PhoneFrame>
  );
};

export default Donations;
