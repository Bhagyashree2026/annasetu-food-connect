import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnnaSetuLogo } from "@/components/AnnaSetuLogo";
import { Ornament } from "@/components/Ornament";
import { getUser } from "@/lib/annaStore";

const QUOTES = [
  "There is no exercise better for the heart than reaching down and lifting people up.",
  "The simplest acts of kindness are more powerful than a thousand prayers.",
  "A full plate means nothing if someone nearby is still hungry.",
  "What we waste today could have been someone's tomorrow.",
  "Food is dignity shared.",
  "Your extra can be someone's enough.",
  "Sharing is the real innovation.",
];

const Splash = () => {
  const navigate = useNavigate();
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  useEffect(() => {
    const t = setTimeout(() => {
      navigate(getUser() ? "/app/home" : "/app/login", { replace: true });
    }, 4500);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen gradient-leaf flex flex-col items-center justify-center text-primary-foreground px-6 relative overflow-hidden">
      {/* Quote drops down from top to logo */}
      <div
        className="absolute top-0 left-0 right-0 px-8 pt-16 flex justify-center"
        style={{
          animation: "quote-drop 1.6s ease-out 0.3s both",
        }}
      >
        <p className="font-display italic text-lg md:text-xl text-center max-w-md leading-relaxed text-primary-foreground/95">
          &ldquo;{quote}&rdquo;
        </p>
      </div>

      <div className="animate-fade-up flex flex-col items-center mt-20">
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

      <style>{`
        @keyframes quote-drop {
          0% {
            opacity: 0;
            transform: translateY(-60px);
          }
          60% {
            opacity: 1;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Splash;
