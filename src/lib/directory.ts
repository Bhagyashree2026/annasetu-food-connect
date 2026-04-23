// Profile lookup helpers — assemble a "LinkedIn-style" view for any
// NGO/donor/volunteer using the existing seed NGOs, donations and posts.
// All data is local to the prototype.

import {
  SEED_NGOS,
  getDonations,
  getPosts,
  type Ngo,
  type CommunityPost,
  type Donation,
  type Role,
} from "@/lib/annaStore";

export interface MemberProfile {
  id: string;             // slug, e.g. "snehalaya-trust"
  name: string;
  org: string;
  role: Role;
  area?: string;
  malayalam?: string;
  rating?: number;
  capacity?: number;
  verified?: boolean;
  distanceKm?: number;
  about: string;
  mealsImpact: number;
  pickupsCount: number;
  posts: CommunityPost[];
  recentDonations: Donation[];
  source: "ngo" | "post";
}

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

/** Build the unified directory of members from seeded NGOs + post authors. */
export function getDirectory(): MemberProfile[] {
  const donations = getDonations();
  const posts = getPosts();

  // Index donations by NGO name to compute impact.
  const mealsByNgo = new Map<string, number>();
  const pickupsByNgo = new Map<string, number>();
  donations.forEach(d => {
    if (!d.ngoName) return;
    if (d.status === "delivered") {
      mealsByNgo.set(d.ngoName, (mealsByNgo.get(d.ngoName) ?? 0) + d.servings);
    }
    pickupsByNgo.set(d.ngoName, (pickupsByNgo.get(d.ngoName) ?? 0) + 1);
  });

  // 1) Seeded NGOs
  const ngoProfiles: MemberProfile[] = SEED_NGOS.map((n: Ngo) => {
    const ngoPosts = posts.filter(p => p.authorOrg.toLowerCase().includes(n.name.toLowerCase().split(" ")[0]));
    return {
      id: slug(n.name),
      name: n.name,
      org: `${n.name} · NGO`,
      role: "ngo",
      area: n.area,
      malayalam: n.malayalam,
      rating: n.rating,
      capacity: n.capacity,
      verified: n.verified,
      distanceKm: n.distanceKm,
      about: `${n.name} is a verified NGO partner in ${n.area}, serving up to ${n.capacity} meals per day. Rated ${n.rating}★ by the AnnaSetu community.`,
      mealsImpact: mealsByNgo.get(n.name) ?? Math.round(n.capacity * (12 + Math.random() * 18)),
      pickupsCount: pickupsByNgo.get(n.name) ?? Math.round(8 + Math.random() * 24),
      posts: ngoPosts,
      recentDonations: donations.filter(d => d.ngoName === n.name).slice(0, 6),
      source: "ngo",
    };
  });

  // 2) Authors from community posts not already covered above.
  const seen = new Set(ngoProfiles.map(p => p.name.toLowerCase()));
  const postAuthors = new Map<string, MemberProfile>();
  posts.forEach(p => {
    const key = p.authorName.toLowerCase();
    if (seen.has(key) || postAuthors.has(key)) return;
    postAuthors.set(key, {
      id: slug(p.authorName),
      name: p.authorName,
      org: p.authorOrg,
      role: p.authorRole,
      about: `${p.authorOrg} shares stories on AnnaSetu and contributes to food rescue across Kerala.`,
      mealsImpact: posts.filter(x => x.authorName === p.authorName).reduce((s, x) => s + (x.meals ?? 0), 0),
      pickupsCount: 0,
      posts: posts.filter(x => x.authorName === p.authorName),
      recentDonations: [],
      source: "post",
    });
  });

  return [...ngoProfiles, ...Array.from(postAuthors.values())];
}

export function findProfile(id: string): MemberProfile | undefined {
  return getDirectory().find(p => p.id === id);
}

/** Free-text search across name, org, area, hashtags and post captions. */
export function searchDirectory(query: string): MemberProfile[] {
  const all = getDirectory();
  const q = query.trim().toLowerCase();
  if (!q) return all;
  return all.filter(p => {
    const haystack = [
      p.name, p.org, p.area ?? "", p.malayalam ?? "", p.about,
      ...p.posts.flatMap(x => [x.caption, ...(x.hashtags ?? [])]),
    ].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}
