import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "@/components/app/PhoneFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createDonation, getUser } from "@/lib/annaStore";
import { Camera, Sparkles } from "lucide-react";

const Donate = () => {
  const navigate = useNavigate();
  const [foodName, setFoodName] = useState("Sambar Sadhya");
  const [foodType, setFoodType] = useState<"veg" | "non-veg" | "mixed">("veg");
  const [servings, setServings] = useState(40);
  const [cookedAt, setCookedAt] = useState(() => new Date().toTimeString().slice(0, 5));
  const [pickupBy, setPickupBy] = useState(() => {
    const d = new Date(Date.now() + 90 * 60_000);
    return d.toTimeString().slice(0, 5);
  });
  const [address, setAddress] = useState("MG Road, Kochi, Kerala");
  const [notes, setNotes] = useState("");
  const [aiTried, setAiTried] = useState(false);
  const user = getUser();
  if (!user) { navigate("/app/login", { replace: true }); return null; }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const d = createDonation({
      donorOrg: user.org || "Hotel Malabar",
      foodName: foodName.trim(),
      foodType,
      servings: Math.max(1, Number(servings) || 1),
      cookedAt, pickupBy, address, notes,
    });
    navigate(`/app/match/${d.id}`, { replace: true });
  };

  const runAi = () => {
    setAiTried(true);
    // simulated vision estimate
    setFoodName("Vegetable Biryani");
    setFoodType("veg");
    setServings(75);
  };

  return (
    <PhoneFrame title="Post surplus food" subtitle="ഭക്ഷണം പങ്കിടൂ" showBack hideTabs>
      <form onSubmit={submit} className="space-y-4 animate-fade-up">
        {/* AI photo estimator */}
        <div className="kerala-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <h3 className="font-display text-base text-maroon">Smart photo estimate</h3>
            <span className="text-[10px] uppercase tracking-wider text-accent ml-auto">AI</span>
          </div>
          <button
            type="button"
            onClick={runAi}
            className="w-full aspect-[4/2] rounded-lg border-2 border-dashed border-accent/40 bg-secondary/40 flex flex-col items-center justify-center text-muted-foreground hover:bg-secondary transition-smooth"
          >
            <Camera className="w-6 h-6 mb-1" />
            <span className="text-xs">{aiTried ? "Re-scan photo" : "Tap to scan food"}</span>
          </button>
          {aiTried && (
            <p className="text-[11px] text-primary mt-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Estimated: Vegetable Biryani · ~75 servings · veg
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="foodName" className="text-maroon">Food item</Label>
          <Input id="foodName" value={foodName} onChange={e => setFoodName(e.target.value)} className="mt-1.5 bg-background" required />
        </div>

        <div>
          <Label className="text-maroon">Type</Label>
          <div className="mt-1.5 grid grid-cols-3 gap-2">
            {(["veg", "non-veg", "mixed"] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setFoodType(t)}
                className={`py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-smooth border ${
                  foodType === t
                    ? "gradient-leaf text-primary-foreground border-transparent shadow-soft"
                    : "bg-background border-input text-muted-foreground hover:border-accent"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="servings" className="text-maroon">Number of servings</Label>
          <Input id="servings" type="number" min={1} value={servings} onChange={e => setServings(Number(e.target.value))} className="mt-1.5 bg-background" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="cookedAt" className="text-maroon">Cooked at</Label>
            <Input id="cookedAt" type="time" value={cookedAt} onChange={e => setCookedAt(e.target.value)} className="mt-1.5 bg-background" />
          </div>
          <div>
            <Label htmlFor="pickupBy" className="text-maroon">Pickup by</Label>
            <Input id="pickupBy" type="time" value={pickupBy} onChange={e => setPickupBy(e.target.value)} className="mt-1.5 bg-background" />
          </div>
        </div>

        <div>
          <Label htmlFor="address" className="text-maroon">Pickup address</Label>
          <Input id="address" value={address} onChange={e => setAddress(e.target.value)} className="mt-1.5 bg-background" />
        </div>

        <div>
          <Label htmlFor="notes" className="text-maroon">Notes (optional)</Label>
          <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Allergens, packaging, etc." className="mt-1.5 bg-background" />
        </div>

        <Button type="submit" variant="hero" size="lg" className="w-full">Find nearby NGOs</Button>
      </form>
    </PhoneFrame>
  );
};

export default Donate;
