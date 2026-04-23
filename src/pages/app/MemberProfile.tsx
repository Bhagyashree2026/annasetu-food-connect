import { useNavigate, useParams } from "react-router-dom";
import { PhoneFrame } from "@/components/app/PhoneFrame";
import { findProfile } from "@/lib/directory";
import {
  Verified, MapPin, Star, Heart, MessageCircle, Leaf, Truck, Award, Users, Building2, Share2, UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const MemberProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const profile = id ? findProfile(id) : undefined;

  if (!profile) {
    return (
      <PhoneFrame title="Profile" showBack>
        <div className="kerala-card p-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">This profile is not available.</p>
          <Button variant="hero" onClick={() => navigate("/app/search")}>Back to search</Button>
        </div>
      </PhoneFrame>
    );
  }

  const initials = profile.name.split(" ").slice(0, 2).map(s => s[0]).join("").toUpperCase();
  const Icon = profile.role === "ngo" ? Building2 : Users;
  const roleLabel =
    profile.role === "ngo" ? "NGO partner" :
    profile.role === "restaurant" ? "Donor organisation" : "Volunteer";

  return (
    <PhoneFrame title={profile.name} showBack>
      {/* Hero card */}
      <div className="kerala-card overflow-hidden mb-4 animate-fade-up">
        <div className="h-20 gradient-leaf" />
        <div className="px-4 pb-4 -mt-9">
          <div className="w-16 h-16 rounded-full gradient-gold flex items-center justify-center text-maroon font-display text-xl shadow-gold border-4 border-card mb-2">
            {initials || "AS"}
          </div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-display text-xl text-maroon truncate">{profile.name}</h1>
                {profile.verified && <Verified className="w-4 h-4 text-primary shrink-0" />}
              </div>
              {profile.malayalam && (
                <p className="text-xs text-muted-foreground">{profile.malayalam}</p>
              )}
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold shrink-0">
              {roleLabel}
            </span>
          </div>

          <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
            <Icon className="w-3 h-3" /> {profile.org}
          </p>

          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground mb-3">
            {profile.area && (
              <span className="inline-flex items-center gap-0.5">
                <MapPin className="w-3 h-3" /> {profile.area}{profile.distanceKm !== undefined && ` · ${profile.distanceKm} km away`}
              </span>
            )}
            {profile.rating !== undefined && (
              <span className="inline-flex items-center gap-0.5">
                <Star className="w-3 h-3 text-accent fill-current" /> {profile.rating} rating
              </span>
            )}
            {profile.capacity !== undefined && (
              <span>Capacity {profile.capacity}/day</span>
            )}
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="hero" className="flex-1">
              <UserPlus className="w-4 h-4" /> Follow
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Share2 className="w-4 h-4" /> Share
            </Button>
          </div>
        </div>
      </div>

      {/* About */}
      <section className="kerala-card p-4 mb-4 animate-fade-up">
        <h2 className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">About</h2>
        <p className="text-sm text-foreground/90 leading-relaxed">{profile.about}</p>
      </section>

      {/* Impact stats */}
      <section className="grid grid-cols-3 gap-3 mb-4 animate-fade-up">
        <Stat icon={<Leaf />} value={profile.mealsImpact.toLocaleString()} label="Meals" tint="leaf" />
        <Stat icon={<Truck />} value={profile.pickupsCount.toString()} label="Pickups" tint="gold" />
        <Stat icon={<Award />} value={(profile.rating ?? 5).toFixed(1)} label="Rating" tint="leaf" />
      </section>

      {/* Recent activity / posts */}
      <section className="mb-4">
        <h2 className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2 px-1">
          Recent activity
        </h2>

        {profile.posts.length === 0 && profile.recentDonations.length === 0 && (
          <div className="kerala-card p-6 text-center text-xs text-muted-foreground">
            No public activity yet.
          </div>
        )}

        <div className="space-y-3">
          {profile.posts.map(p => (
            <article key={p.id} className="kerala-card p-3 animate-fade-up">
              <p className="text-sm text-foreground/90 leading-relaxed mb-2 whitespace-pre-line">
                {p.caption}
              </p>
              {p.hashtags?.length > 0 && (
                <div className="flex flex-wrap gap-x-2 gap-y-0.5 mb-2">
                  {p.hashtags.map(h => (
                    <span key={h} className="text-[11px] text-accent font-medium">{h}</span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                {typeof p.meals === "number" && (
                  <span className="text-primary font-semibold">{p.meals} meals</span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Heart className="w-3 h-3" /> {p.likes}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" /> {p.comments.length}
                </span>
                <span className="ml-auto">{relativeTime(p.at)}</span>
              </div>
            </article>
          ))}

          {profile.recentDonations.map(d => (
            <article key={d.id} className="kerala-card p-3 flex items-center gap-3 animate-fade-up">
              <div className="w-9 h-9 rounded-lg gradient-leaf text-primary-foreground flex items-center justify-center shrink-0">
                <Leaf className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-maroon truncate">
                  {d.foodName} · {d.servings} meals
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  From {d.donorOrg} · {new Date(d.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-maroon font-semibold shrink-0">
                {d.status}
              </span>
            </article>
          ))}
        </div>
      </section>
    </PhoneFrame>
  );
};

const Stat = ({ icon, value, label, tint }: { icon: React.ReactNode; value: string; label: string; tint: "leaf" | "gold" }) => (
  <div className="kerala-card p-3 text-center">
    <div className={`w-8 h-8 mx-auto mb-1.5 rounded-lg ${tint === "leaf" ? "gradient-leaf text-primary-foreground" : "gradient-gold text-maroon"} flex items-center justify-center shadow-soft`}>
      {icon}
    </div>
    <div className="font-display text-lg text-maroon leading-none tabular-nums">{value}</div>
    <div className="text-[9px] uppercase tracking-wider text-muted-foreground mt-0.5">{label}</div>
  </div>
);

function relativeTime(at: number) {
  const diff = Date.now() - at;
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export default MemberProfile;
