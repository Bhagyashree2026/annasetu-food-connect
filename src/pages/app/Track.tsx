import { useNavigate, useParams } from "react-router-dom";
import { PhoneFrame } from "@/components/app/PhoneFrame";
import { Button } from "@/components/ui/button";
import { getDonation, STATUS_LABEL, STATUS_STEP, DonationStatus, getUser } from "@/lib/annaStore";
import { Check, Clock, MapPin, Phone, ShieldCheck } from "lucide-react";

const STEPS: DonationStatus[] = ["posted", "accepted", "assigned", "picked_up", "delivered"];

const Track = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const user = getUser();
  const d = getDonation(id);

  if (!d) {
    return (
      <PhoneFrame title="Donation not found" showBack hideTabs>
        <Button onClick={() => navigate("/app/home")} variant="hero" className="w-full">Back home</Button>
      </PhoneFrame>
    );
  }

  const currentStep = STATUS_STEP[d.status];

  return (
    <PhoneFrame title="Donation status" subtitle="തത്സമയ ട്രാക്കിങ്" showBack hideTabs>
      <div className="kerala-card p-4 mb-4 animate-fade-up">
        <div className="flex justify-between items-start">
          <div className="min-w-0">
            <h2 className="font-display text-xl text-maroon leading-tight">{d.foodName}</h2>
            <p className="text-xs text-muted-foreground">{d.servings} servings · {d.foodType.toUpperCase()}</p>
          </div>
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground font-semibold">
            #{d.id.slice(0, 5).toUpperCase()}
          </span>
        </div>
        <p className="text-xs text-foreground/75 flex items-center gap-1 mt-2"><MapPin className="w-3 h-3" />{d.address}</p>
        <p className="text-xs text-foreground/75 flex items-center gap-1"><Clock className="w-3 h-3" />Pickup by {d.pickupBy}</p>
      </div>

      {/* Stepper */}
      <ol className="kerala-card p-4 mb-4">
        {STEPS.map((s, i) => {
          const stepNum = i + 1;
          const done = stepNum < currentStep;
          const active = stepNum === currentStep;
          return (
            <li key={s} className="flex gap-3 items-start">
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  done ? "gradient-leaf text-primary-foreground" :
                  active ? "gradient-gold text-maroon shadow-gold pulse-glow" :
                  "bg-secondary text-muted-foreground"
                }`}>
                  {done ? <Check className="w-3.5 h-3.5" /> : stepNum}
                </div>
                {i < STEPS.length - 1 && <div className={`w-0.5 flex-1 min-h-[28px] ${stepNum < currentStep ? "bg-primary/50" : "bg-border"}`} />}
              </div>
              <div className="pb-4 flex-1">
                <p className={`text-sm font-semibold ${done || active ? "text-maroon" : "text-muted-foreground"}`}>{STATUS_LABEL[s]}</p>
                {d.history.find(h => h.status === s) && (
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(d.history.find(h => h.status === s)!.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Partner info */}
      {d.ngoName && (
        <div className="kerala-card p-4 mb-4">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">NGO partner</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <h3 className="font-display text-lg text-maroon">{d.ngoName}</h3>
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <button className="p-2 rounded-full bg-primary/10 text-primary"><Phone className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {d.driverName && (
        <div className="kerala-card p-4 mb-4">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">Driver</p>
          <div className="flex justify-between items-center">
            <h3 className="font-display text-lg text-maroon">{d.driverName}</h3>
            <button className="p-2 rounded-full bg-primary/10 text-primary"><Phone className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* OTP for restaurant to share at pickup */}
      {(d.status === "assigned" || d.status === "accepted") && user?.role === "restaurant" && (
        <div className="kerala-card p-4 mb-4 text-center">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">Pickup OTP</p>
          <p className="font-display text-4xl tracking-[0.4em] text-maroon">{d.otp}</p>
          <p className="text-[11px] text-muted-foreground mt-2">Share this with the driver at handoff to confirm pickup.</p>
        </div>
      )}

      {/* Driver action shortcut */}
      {user?.role === "driver" && (d.status === "assigned" || d.status === "picked_up") && (
        <Button variant="hero" className="w-full" onClick={() => navigate(`/app/pickup/${d.id}`)}>
          Open pickup screen
        </Button>
      )}
    </PhoneFrame>
  );
};

export default Track;
