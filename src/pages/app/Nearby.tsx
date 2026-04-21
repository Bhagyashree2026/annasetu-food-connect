import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "@/components/app/PhoneFrame";
import { Button } from "@/components/ui/button";
import { acceptDonation, getDonations, SEED_NGOS } from "@/lib/annaStore";
import { Clock, MapPin, Utensils } from "lucide-react";

// For the NGO role: lists 'posted' donations that they can accept directly.
const Nearby = () => {
  const navigate = useNavigate();
  const live = getDonations().filter(d => d.status === "posted");
  const myNgo = SEED_NGOS[0];

  return (
    <PhoneFrame title="Nearby food alerts" subtitle="സജീവ അലേർട്ടുകൾ" showBack hideTabs>
      {live.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto rounded-full gradient-leaf flex items-center justify-center text-primary-foreground mb-4">
            <Utensils className="w-7 h-7" />
          </div>
          <h3 className="font-display text-xl text-maroon mb-1">No live alerts</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">When a nearby restaurant posts surplus food, it will appear here instantly.</p>
          <Button variant="ghost-gold" onClick={() => navigate("/app/home")}>Back to home</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {live.map((d, i) => (
            <div key={d.id} className="kerala-card p-4 animate-fade-up" style={{ animationDelay: `${0.05 * i}s` }}>
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-display text-lg text-maroon leading-tight">{d.foodName}</h3>
                  <p className="text-[11px] text-muted-foreground">{d.donorOrg} · {d.foodType.toUpperCase()}</p>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-terracotta">Live</span>
              </div>
              <div className="flex justify-between text-[11px] text-foreground/75 my-2">
                <span className="flex items-center gap-1"><Utensils className="w-3 h-3" />{d.servings} servings</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />by {d.pickupBy}</span>
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1 mb-3"><MapPin className="w-3 h-3" />{d.address}</p>
              <div className="flex gap-2">
                <Button variant="hero" size="sm" className="flex-1" onClick={() => { acceptDonation(d.id, myNgo); navigate(`/app/track/${d.id}`); }}>
                  Accept pickup
                </Button>
                <Button variant="ghost-gold" size="sm" onClick={() => navigate(`/app/track/${d.id}`)}>Details</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PhoneFrame>
  );
};

export default Nearby;
