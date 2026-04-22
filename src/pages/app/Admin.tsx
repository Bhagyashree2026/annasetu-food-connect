import { useState } from "react";
import { PhoneFrame } from "@/components/app/PhoneFrame";
import { Button } from "@/components/ui/button";
import { SEED_NGOS, Ngo } from "@/lib/annaStore";
import { useToast } from "@/hooks/use-toast";
import { Building2, Check, MapPin, ShieldAlert, ShieldCheck, X } from "lucide-react";

interface PendingApplicant {
  id: string;
  name: string;
  malayalam?: string;
  type: "NGO" | "Restaurant";
  area: string;
  registrationNo: string;
  capacity?: number;
  contact: string;
}

const SEED_PENDING: PendingApplicant[] = [
  { id: "p-1", name: "Ammachi Annapoorna", malayalam: "അമ്മച്ചി അന്നപൂർണ", type: "NGO", area: "Aluva", registrationNo: "KER/NGO/2021/4421", capacity: 90, contact: "+91 98470 12345" },
  { id: "p-2", name: "Hotel Malabar Court", type: "Restaurant", area: "MG Road, Kochi", registrationNo: "FSSAI 11221234500098", contact: "+91 98461 22210" },
  { id: "p-3", name: "Daya Nilayam", malayalam: "ദയാ നിലയം", type: "NGO", area: "Thrippunithura", registrationNo: "KER/NGO/2019/1180", capacity: 60, contact: "+91 99956 77781" },
];

const Admin = () => {
  const { toast } = useToast();
  const [pending, setPending] = useState<PendingApplicant[]>(SEED_PENDING);
  const [verified, setVerified] = useState<Array<Ngo & { type: "NGO" | "Restaurant" }>>(
    SEED_NGOS.map(n => ({ ...n, type: "NGO" as const }))
  );

  const decide = (a: PendingApplicant, approve: boolean) => {
    setPending(prev => prev.filter(p => p.id !== a.id));
    if (approve) {
      const n: Ngo & { type: "NGO" | "Restaurant" } = {
        id: a.id,
        name: a.name,
        malayalam: a.malayalam,
        distanceKm: 0,
        capacity: a.capacity ?? 0,
        rating: 5,
        verified: true,
        area: a.area,
        type: a.type,
      };
      setVerified(prev => [n, ...prev]);
      toast({ title: "Approved", description: `${a.name} is now verified.` });
    } else {
      toast({ title: "Rejected", description: `${a.name} has been declined.`, variant: "destructive" });
    }
  };

  return (
    <PhoneFrame title="Admin · Verification" subtitle="പങ്കാളി പരിശോധന" showBack hideTabs>
      <div className="kerala-card p-4 mb-4 animate-fade-up flex items-start gap-3">
        <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center text-maroon shadow-gold shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-display text-lg text-maroon leading-tight">Trust & Safety review</h2>
          <p className="text-[11px] text-muted-foreground">Approve NGOs and food businesses before they can operate on AnnaSetu.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-5">
        <Stat value={pending.length} label="Pending" tone="accent" />
        <Stat value={verified.length} label="Verified" tone="primary" />
        <Stat value={0} label="Flagged" tone="terracotta" />
      </div>

      <Section title="Pending verification" empty="No applications waiting for review.">
        {pending.map((a, i) => (
          <div key={a.id} className="kerala-card p-4 animate-fade-up" style={{ animationDelay: `${0.05 * i}s` }}>
            <div className="flex justify-between items-start mb-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-lg text-maroon leading-tight truncate">{a.name}</h3>
                  <ShieldAlert className="w-4 h-4 text-terracotta shrink-0" />
                </div>
                {a.malayalam && <p className="text-[11px] text-accent">{a.malayalam}</p>}
              </div>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-semibold shrink-0">
                {a.type}
              </span>
            </div>
            <div className="text-[11px] text-foreground/75 space-y-0.5 mb-3">
              <p className="flex items-center gap-1"><MapPin className="w-3 h-3" />{a.area}</p>
              <p className="flex items-center gap-1"><Building2 className="w-3 h-3" />{a.registrationNo}</p>
              {a.capacity != null && <p>Daily capacity: {a.capacity} meals</p>}
              <p className="text-muted-foreground">{a.contact}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="hero" size="sm" className="flex-1" onClick={() => decide(a, true)}>
                <Check className="w-4 h-4" /> Approve
              </Button>
              <Button variant="ghost-gold" size="sm" onClick={() => decide(a, false)}>
                <X className="w-4 h-4" /> Reject
              </Button>
            </div>
          </div>
        ))}
      </Section>

      <Section title="Verified partners" empty="No verified partners yet.">
        {verified.map(v => (
          <div key={v.id} className="kerala-card p-3.5 flex justify-between items-center">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-display text-base text-maroon truncate">{v.name}</h4>
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              </div>
              <p className="text-[11px] text-muted-foreground">{v.type} · {v.area}</p>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-primary">Active</span>
          </div>
        ))}
      </Section>
    </PhoneFrame>
  );
};

const Stat = ({ value, label, tone }: { value: number; label: string; tone: "accent" | "primary" | "terracotta" }) => {
  const cls = tone === "accent"
    ? "bg-accent/15 text-accent-foreground"
    : tone === "primary"
    ? "bg-primary/10 text-primary"
    : "bg-terracotta/10 text-terracotta";
  return (
    <div className={`kerala-card p-3 text-center ${cls}`}>
      <div className="font-display text-2xl leading-none">{value}</div>
      <div className="text-[10px] uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
};

const Section = ({ title, empty, children }: { title: string; empty: string; children: React.ReactNode }) => {
  const arr = Array.isArray(children) ? children : [children];
  const has = arr.filter(Boolean).length > 0;
  return (
    <div className="mb-5">
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-2 px-1">{title}</div>
      {has ? <div className="space-y-2">{children}</div> : (
        <div className="text-center text-xs text-muted-foreground py-6 border border-dashed border-accent/30 rounded-lg">{empty}</div>
      )}
    </div>
  );
};

export default Admin;
