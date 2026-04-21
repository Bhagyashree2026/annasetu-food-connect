import { Hero } from "@/components/anna/Hero";
import { HowItWorks } from "@/components/anna/HowItWorks";
import { AIFeatures } from "@/components/anna/AIFeatures";
import { Impact } from "@/components/anna/Impact";
import { Partners } from "@/components/anna/Partners";
import { CTA } from "@/components/anna/CTA";
import { Footer } from "@/components/anna/Footer";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = "AnnaSetu — Bridge of Food | Surplus food rescue from Kerala";
    const meta = document.querySelector('meta[name="description"]') ?? Object.assign(document.createElement('meta'), { name: 'description' });
    meta.setAttribute('content', 'AnnaSetu connects hotels and event halls with NGOs to rescue surplus food. AI-powered, traceable, dignified — built for Google Solution Challenge.');
    if (!meta.parentElement) document.head.appendChild(meta);
  }, []);

  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <AIFeatures />
      <Impact />
      <Partners />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
