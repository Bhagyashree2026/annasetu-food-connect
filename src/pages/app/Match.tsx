import { useNavigate, useParams } from "react-router-dom";
import { PhoneFrame } from "@/components/app/PhoneFrame";
import { Button } from "@/components/ui/button";
import { acceptDonation, getDonation, getUser, SEED_NGOS } from "@/lib/annaStore";
import { ShieldCheck, Sparkles, MapPin } from "lucide-react";

// For the restaurant: shows nearby NGOs + a Demo button to simulate auto-acceptance
// For the NGO viewing the post via "nearby" page: also routed here for accept action

const Match = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const user = getUser();
  const donation = getDonation(id);

  if (!donation) {
    return (
      <PhoneFrame title="Donation not found" showBack hideTabs>
        <p className="text-sm text-muted-foreground">This donation doesn't exist anymore.</p>
        <Button onClick={() => navigate("/app/home")} className="mt-4 w-full" variant="hero">Back home</Button>
      </PhoneFrame>
    );
  }

  const accept = (ngo: typeof SEED_NGOS[number]) => {
    acceptDonation(donation.id, ngo);
    navigate(`/app/track/${donation.id}`);
  };

  return (
    <PhoneFrame title="Best NGO matches" subtitle="ഏറ്റവും അടുത്ത പങ്കാളികൾ" showBack hideTabs>
      <div className="kerala-card p-4 mb-4 animate-fade-up">
        <p className="text-[11px] uppercase tracking-widest text-accent mb-1">Posted</p>
        <h2 className="font-display text-xl text-maroon leading-tight">{donation.foodName}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{donation.servings} servings · {donation.foodType.toUpperCase()} · pickup by {donation.pickupBy}</p>
        <p className="text-xs text-foreground/75 flex items-center gap-1 mt-1.5"><MapPin className="w-3 h-3" />{donation.address}</p>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-accent" />
        <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">AI-ranked nearby NGOs</span>
      </div>

      <div className="space-y-3">
        {SEED_NGOS.map((ngo, i) => (
          <div key={ngo.id} className="kerala-card p-4 animate-fade-up" style={{ animationDelay: `${0.05 * i}s` }}>
            <div className="flex justify-between items-start mb-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-lg text-maroon leading-tight truncate">{ngo.name}</h3>
                  {ngo.verified && <ShieldCheck className="w-4 h-4 text-primary shrink-0" />}
                </div>
                <p className="text-[11px] text-accent">{ngo.malayalam} · {ngo.area}</p>
              </div>
              <span className="text-xs font-semibold text-accent shrink-0">★ {ngo.rating}</span>
            </div>
            <div className="flex justify-between text-[11px] text-muted-foreground mb-3">
              <span>{ngo.distanceKm} km away</span>
              <span>Capacity: {ngo.capacity} meals</span>
              {i === 0 && <span className="text-primary font-semibold">Best match</span>}
            </div>
            {user?.role === "restaurant" ? (
              <Button variant="ghost-gold" size="sm" className="w-full" onClick={() => accept(ngo)}>
                Send request to {ngo.name.split(" ")[0]}
              </Button>
            ) : (
              <Button variant="hero" size="sm" className="w-full" onClick={() => accept(ngo)}>
                Accept on behalf of {ngo.name.split(" ")[0]}
              </Button>
            )}
          </div>
        ))}
      </div>

      <p className="text-[11px] text-muted-foreground text-center mt-4">
        In a production app, only the NGO accepts. The button is enabled here so you can demo the full flow.
      </p>
    </PhoneFrame>
  );
};

export default Match;
