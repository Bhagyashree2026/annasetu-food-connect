import { AnnaSetuLogo } from "@/components/AnnaSetuLogo";

export const Footer = () => (
  <footer className="bg-maroon text-maroon-foreground py-14">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-10 mb-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <AnnaSetuLogo size={36} />
            <div>
              <h3 className="font-display text-2xl">AnnaSetu</h3>
              <p className="text-[11px] tracking-[0.25em] uppercase opacity-60">അന്നസേതു · Bridge of Food</p>
            </div>
          </div>
          <p className="text-sm opacity-70 max-w-md leading-relaxed">
            A Kerala-born initiative built for Google Solution Challenge — connecting
            surplus food to those who need it, with dignity and traceability.
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-wider text-accent mb-4 font-semibold">Product</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><a href="#how" className="hover:text-accent transition-smooth">How it works</a></li>
            <li><a href="#impact" className="hover:text-accent transition-smooth">Impact</a></li>
            <li><a href="#partners" className="hover:text-accent transition-smooth">Partners</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-wider text-accent mb-4 font-semibold">Aligned with</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li>UN SDG 2 · Zero Hunger</li>
            <li>UN SDG 12 · Responsible Consumption</li>
            <li>Google Solution Challenge 2026</li>
          </ul>
        </div>
      </div>
      <div className="pt-6 border-t border-accent/20 text-xs opacity-60 flex flex-wrap justify-between gap-3">
        <span>© {new Date().getFullYear()} AnnaSetu. Made with care in Kerala.</span>
        <span>Privacy · Terms · Contact</span>
      </div>
    </div>
  </footer>
);
