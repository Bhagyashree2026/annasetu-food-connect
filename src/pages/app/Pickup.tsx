import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PhoneFrame } from "@/components/app/PhoneFrame";
import { Button } from "@/components/ui/button";
import { confirmPickup, getDonation, markDelivered } from "@/lib/annaStore";
import { useToast } from "@/hooks/use-toast";
import { Check, ShieldCheck, KeyRound } from "lucide-react";

const Pickup = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const d = getDonation(id);
  const [otp, setOtp] = useState("");

  if (!d) {
    return (
      <PhoneFrame title="Pickup" showBack hideTabs>
        <Button variant="hero" className="w-full" onClick={() => navigate("/app/home")}>Back home</Button>
      </PhoneFrame>
    );
  }

  const tryConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const res = confirmPickup(d.id, otp);
    if (res.ok) {
      toast({ title: "Pickup confirmed", description: "Drive safely. Mark delivered when food reaches the NGO." });
    } else {
      toast({ title: "Could not confirm", description: res.reason, variant: "destructive" });
    }
  };

  // Build a faux QR (CSS grid pattern) seeded by donation id+otp
  const qrCells = Array.from({ length: 169 }).map((_, i) => {
    const seed = (d.id.charCodeAt(i % d.id.length) + d.otp.charCodeAt(i % d.otp.length) + i * 7) % 7;
    return seed > 3;
  });

  return (
    <PhoneFrame title="Pickup confirmation" subtitle="പിക്ക്അപ്പ് സ്ഥിരീകരണം" showBack hideTabs>
      <div className="kerala-card p-4 mb-4 animate-fade-up">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-display text-xl text-maroon leading-tight">{d.foodName}</h2>
            <p className="text-xs text-muted-foreground">{d.donorOrg} → {d.ngoName ?? "—"}</p>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-primary flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />Verified
          </span>
        </div>
      </div>

      {d.status === "assigned" && (
        <>
          <div className="kerala-card p-4 mb-4 text-center">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">Scan QR or ask the donor for the OTP</p>
            <div className="mx-auto w-44 h-44 p-2 bg-card rounded-lg border border-accent/30">
              <div className="grid grid-cols-13 gap-px w-full h-full" style={{ gridTemplateColumns: "repeat(13, 1fr)" }}>
                {qrCells.map((on, i) => (
                  <div key={i} className={on ? "bg-maroon" : "bg-card"} />
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={tryConfirm} className="kerala-card p-4 space-y-3">
            <label className="block">
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <KeyRound className="w-3 h-3" /> Enter 4-digit OTP from donor
              </span>
              <input
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                inputMode="numeric"
                placeholder="••••"
                className="mt-2 w-full text-center font-display text-3xl tracking-[0.5em] py-2 rounded-md border border-input bg-background text-maroon focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <Button type="submit" variant="hero" className="w-full" disabled={otp.length !== 4}>
              Confirm pickup
            </Button>
            <p className="text-[10px] text-center text-muted-foreground">Demo OTP: <span className="font-mono text-maroon">{d.otp}</span></p>
          </form>
        </>
      )}

      {d.status === "picked_up" && (
        <div className="kerala-card p-5 text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full gradient-leaf flex items-center justify-center text-primary-foreground">
            <Check className="w-7 h-7" />
          </div>
          <h3 className="font-display text-xl text-maroon mb-1">Picked up</h3>
          <p className="text-sm text-muted-foreground mb-5">Deliver to {d.ngoName} and mark complete.</p>
          <Button variant="hero" className="w-full" onClick={() => { markDelivered(d.id); navigate(`/app/track/${d.id}`); }}>
            Mark as delivered
          </Button>
        </div>
      )}

      {d.status === "delivered" && (
        <div className="kerala-card p-5 text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full gradient-gold flex items-center justify-center text-maroon shadow-gold">
            <Check className="w-7 h-7" />
          </div>
          <h3 className="font-display text-xl text-maroon mb-1">Delivered · Thank you</h3>
          <p className="text-sm text-muted-foreground mb-5">{d.servings} meals reached {d.ngoName}.</p>
          <Button variant="hero" className="w-full" onClick={() => navigate("/app/home")}>Back to home</Button>
        </div>
      )}
    </PhoneFrame>
  );
};

export default Pickup;
