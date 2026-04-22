import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "@/components/app/PhoneFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createDonation, getUser } from "@/lib/annaStore";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Camera, Loader2, Sparkles, Image as ImageIcon } from "lucide-react";

type Urgency = "low" | "medium" | "high";

const Donate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

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

  const [photo, setPhoto] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{
    foodName: string; foodType: "veg" | "non-veg" | "mixed"; servings: number; urgency: Urgency; summary: string;
  } | null>(null);

  const user = getUser();
  if (!user) { navigate("/app/login", { replace: true }); return null; }

  const onPickPhoto = () => fileRef.current?.click();

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) {
      toast({ title: "Image too large", description: "Please use a photo under 6 MB.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setPhoto(dataUrl);
      await analyze(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const analyze = async (dataUrl: string) => {
    setAnalyzing(true);
    setAiResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-food", {
        body: { imageBase64: dataUrl },
      });
      if (error) throw error;
      if (!data || data.error) throw new Error(data?.error ?? "Analysis failed");
      const result = {
        foodName: String(data.foodName ?? "Surplus food"),
        foodType: (["veg", "non-veg", "mixed"].includes(data.foodType) ? data.foodType : "veg") as "veg" | "non-veg" | "mixed",
        servings: Math.max(1, Math.min(1000, Number(data.servings) || 1)),
        urgency: (["low", "medium", "high"].includes(data.urgency) ? data.urgency : "medium") as Urgency,
        summary: String(data.summary ?? ""),
      };
      setAiResult(result);
      setFoodName(result.foodName);
      setFoodType(result.foodType);
      setServings(result.servings);
      // Tighten pickup window when urgency is high
      if (result.urgency === "high") {
        const d = new Date(Date.now() + 45 * 60_000);
        setPickupBy(d.toTimeString().slice(0, 5));
      }
      toast({ title: "Photo analysed", description: result.summary || "Estimates filled in below." });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not analyse image";
      toast({ title: "AI analysis failed", description: msg, variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

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

  const urgencyTone: Record<Urgency, string> = {
    low: "bg-primary/15 text-primary border-primary/40",
    medium: "bg-accent/20 text-accent-foreground border-accent/40",
    high: "bg-terracotta/15 text-terracotta border-terracotta/40",
  };

  return (
    <PhoneFrame title="Post surplus food" subtitle="ഭക്ഷണം പങ്കിടൂ" showBack hideTabs>
      <form onSubmit={submit} className="space-y-4 animate-fade-up">
        {/* AI photo estimator */}
        <div className="kerala-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <h3 className="font-display text-base text-maroon">Smart photo estimate</h3>
            <span className="text-[10px] uppercase tracking-wider text-accent ml-auto">AI · Gemini</span>
          </div>

          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />

          {photo ? (
            <div className="relative rounded-lg overflow-hidden border border-accent/30 bg-secondary/40">
              <img src={photo} alt="Food preview" className="w-full aspect-[4/2] object-cover" />
              {analyzing && (
                <div className="absolute inset-0 bg-maroon/40 flex flex-col items-center justify-center text-primary-foreground gap-1">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-xs">Analysing food…</span>
                </div>
              )}
              <button
                type="button"
                onClick={onPickPhoto}
                className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-card/90 text-maroon text-[11px] font-semibold shadow-soft flex items-center gap-1"
              >
                <ImageIcon className="w-3 h-3" /> Change
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onPickPhoto}
              disabled={analyzing}
              className="w-full aspect-[4/2] rounded-lg border-2 border-dashed border-accent/40 bg-secondary/40 flex flex-col items-center justify-center text-muted-foreground hover:bg-secondary transition-smooth"
            >
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-xs">Tap to scan or upload food photo</span>
            </button>
          )}

          {/* AI result panel */}
          {aiResult && !analyzing && (
            <div className="mt-3 rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2 animate-fade-up">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-widest text-primary font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI analysis
                </p>
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${urgencyTone[aiResult.urgency]}`}>
                  {aiResult.urgency} urgency
                </span>
              </div>
              <p className="text-sm text-maroon font-medium">{aiResult.foodName}</p>
              <p className="text-[11px] text-muted-foreground">
                ~{aiResult.servings} servings · {aiResult.foodType.toUpperCase()}
              </p>
              {aiResult.summary && <p className="text-xs text-foreground/75 leading-snug">{aiResult.summary}</p>}
            </div>
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

        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={analyzing}>
          {analyzing ? "Analysing photo…" : "Find nearby NGOs"}
        </Button>
      </form>
    </PhoneFrame>
  );
};

export default Donate;
