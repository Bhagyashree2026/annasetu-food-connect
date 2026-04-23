import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "@/components/app/PhoneFrame";
import { Input } from "@/components/ui/input";
import { searchDirectory } from "@/lib/directory";
import { Search as SearchIcon, MapPin, Star, Verified, Users, Building2, X } from "lucide-react";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "ngo", label: "NGOs" },
  { id: "restaurant", label: "Donors" },
  { id: "driver", label: "Volunteers" },
] as const;

type Filter = (typeof FILTERS)[number]["id"];

const Search = () => {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const results = useMemo(() => {
    const base = searchDirectory(q);
    return filter === "all" ? base : base.filter(r => r.role === filter);
  }, [q, filter]);

  return (
    <PhoneFrame title="Search" subtitle="NGOs · Donors · Volunteers">
      {/* Search bar */}
      <div className="relative mb-3 animate-fade-up">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          autoFocus
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search NGO, donor, area or hashtag…"
          className="pl-9 pr-9 h-11"
        />
        {q && (
          <button
            onClick={() => setQ("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-accent/15 text-muted-foreground"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-4 overflow-x-auto -mx-1 px-1 pb-1 animate-fade-up">
        {FILTERS.map(f => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-smooth ${
                active
                  ? "gradient-leaf text-primary-foreground border-transparent shadow-soft"
                  : "border-accent/30 text-maroon hover:bg-accent/10"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Result count */}
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
        {results.length} {results.length === 1 ? "result" : "results"}
      </p>

      {/* Result list */}
      <div className="space-y-2.5">
        {results.map(p => {
          const initials = p.name.split(" ").slice(0, 2).map(s => s[0]).join("").toUpperCase();
          const Icon = p.role === "ngo" ? Building2 : Users;
          return (
            <button
              key={p.id}
              onClick={() => navigate(`/app/profile/${p.id}`)}
              className="kerala-card w-full text-left p-3 flex items-center gap-3 hover:shadow-elegant transition-smooth"
            >
              <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center text-maroon font-display text-sm shadow-gold shrink-0">
                {initials || "AS"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-base text-maroon truncate">{p.name}</h3>
                  {p.verified && <Verified className="w-3.5 h-3.5 text-primary shrink-0" />}
                </div>
                <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                  <Icon className="w-3 h-3" /> {p.org}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-0.5">
                  {p.area && (
                    <span className="inline-flex items-center gap-0.5">
                      <MapPin className="w-3 h-3" /> {p.area}
                    </span>
                  )}
                  {p.rating !== undefined && (
                    <span className="inline-flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-accent fill-current" /> {p.rating}
                    </span>
                  )}
                  {p.mealsImpact > 0 && (
                    <span className="text-primary font-semibold">{p.mealsImpact} meals</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}

        {results.length === 0 && (
          <div className="text-center text-xs text-muted-foreground py-12 border border-dashed border-accent/30 rounded-lg">
            No matches. Try another keyword or area.
          </div>
        )}
      </div>
    </PhoneFrame>
  );
};

export default Search;
