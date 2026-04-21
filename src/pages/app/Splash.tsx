import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnnaSetuLogo } from "@/components/AnnaSetuLogo";
import { Ornament } from "@/components/Ornament";
import { getUser } from "@/lib/annaStore";

const Splash = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => {
      navigate(getUser() ? "/app/home" : "/app/login", { replace: true });
    }, 1400);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen gradient-leaf flex flex-col items-center justify-center text-primary-foreground px-6">
      <div className="animate-fade-up flex flex-col items-center">
        <div className="p-4 rounded-full bg-primary-foreground/10 backdrop-blur shadow-gold mb-6 pulse-glow">
          <AnnaSetuLogo size={84} />
        </div>
        <h1 className="font-display text-5xl mb-1 text-shimmer-gold">AnnaSetu</h1>
        <p className="font-display text-xl opacity-90">അന്നസേതു</p>
        <p className="text-xs uppercase tracking-[0.3em] opacity-75 mt-3">Bridge of Food</p>
        <div className="mt-10 text-accent w-56">
          <Ornament />
        </div>
        <p className="text-xs opacity-70 mt-8">From every surplus plate to every empty hand.</p>
      </div>
    </div>
  );
};

export default Splash;
