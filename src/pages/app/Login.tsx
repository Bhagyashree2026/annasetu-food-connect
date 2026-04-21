import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnnaSetuLogo } from "@/components/AnnaSetuLogo";
import { setUser } from "@/lib/annaStore";

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const onContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.length < 4) return;
    // partial save — role chosen on next screen
    setUser({ name: name.trim(), org: "", role: "restaurant", phone });
    navigate("/app/role");
  };

  return (
    <div className="min-h-screen gradient-ivory flex flex-col px-6 pt-12 pb-8">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-8 animate-fade-up">
          <AnnaSetuLogo size={40} />
          <div>
            <h1 className="font-display text-2xl text-maroon leading-none">Welcome</h1>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">സ്വാഗതം · Sign in to continue</p>
          </div>
        </div>

        <form onSubmit={onContinue} className="kerala-card p-6 space-y-4 animate-fade-up">
          <div>
            <Label htmlFor="name" className="text-maroon">Your name</Label>
            <Input
              id="name"
              placeholder="e.g. Ravi Menon"
              value={name}
              onChange={e => setName(e.target.value)}
              className="mt-1.5 bg-background"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-maroon">Phone number</Label>
            <div className="mt-1.5 flex gap-2">
              <span className="flex items-center px-3 rounded-md border border-input bg-background text-sm text-muted-foreground">+91</span>
              <Input
                id="phone"
                inputMode="numeric"
                placeholder="98xxxxxxxx"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="bg-background"
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">We'll send a verification code (skipped in demo).</p>
          </div>
          <Button type="submit" variant="hero" className="w-full">Continue</Button>
        </form>

        <div className="mt-6 ornament-divider text-[11px] uppercase tracking-widest text-muted-foreground">or</div>

        <div className="mt-6 grid gap-3 animate-fade-up">
          <Button variant="ghost-gold" onClick={() => { setUser({ name: "Demo User", org: "", role: "restaurant", phone: "9999999999" }); navigate("/app/role"); }}>
            Try the demo without sign-up
          </Button>
        </div>

        <p className="mt-auto text-center text-[11px] text-muted-foreground pt-8">
          By continuing you agree to our terms · A Solution Challenge prototype
        </p>
      </div>
    </div>
  );
};

export default Login;
