// Lightweight localStorage-backed store for the AnnaSetu MVP prototype.
// Simulates a backend so the rescue flow is fully demoable without a server.

import { useEffect, useState, useCallback } from "react";

export type Role = "restaurant" | "ngo" | "driver";
export type DonationStatus = "posted" | "accepted" | "assigned" | "picked_up" | "delivered";

export interface User {
  name: string;
  org: string;
  role: Role;
  phone?: string;
}

export interface Ngo {
  id: string;
  name: string;
  malayalam?: string;
  distanceKm: number;
  capacity: number;
  rating: number;
  verified: boolean;
  area: string;
}

export interface Donation {
  id: string;
  createdAt: number;
  donorOrg: string;
  foodName: string;
  foodType: "veg" | "non-veg" | "mixed";
  servings: number;
  cookedAt: string; // HH:MM
  pickupBy: string; // HH:MM
  address: string;
  notes?: string;
  ngoId?: string;
  ngoName?: string;
  driverName?: string;
  status: DonationStatus;
  otp: string;
  history: { status: DonationStatus; at: number }[];
}

export interface Notification {
  id: string;
  donationId?: string;
  title: string;
  body: string;
  at: number;
  read: boolean;
  forRole: Role | "all";
}

const KEY_USER = "annasetu.user";
const KEY_DONATIONS = "annasetu.donations";
const KEY_NOTIFS = "annasetu.notifications";
const KEY_POSTS = "annasetu.posts";

export interface CommunityPost {
  id: string;
  at: number;
  authorName: string;
  authorOrg: string;
  authorRole: Role;
  caption: string;
  hashtags: string[];
  location?: string; // "Kaloor, Kochi"
  meals?: number;
  likes: number;
  likedByMe: boolean;
  comments: { id: string; at: number; author: string; text: string }[];
}

export const SEED_NGOS: Ngo[] = [
  { id: "ngo-1", name: "Snehalaya Trust", malayalam: "സ്നേഹാലയ", distanceKm: 1.2, capacity: 120, rating: 4.9, verified: true, area: "Kaloor" },
  { id: "ngo-2", name: "Akshaya Patra", malayalam: "അക്ഷയപാത്ര", distanceKm: 2.6, capacity: 300, rating: 4.8, verified: true, area: "Edappally" },
  { id: "ngo-3", name: "Karunya Trust", malayalam: "കാരുണ്യ", distanceKm: 3.4, capacity: 80, rating: 4.7, verified: true, area: "Vyttila" },
  { id: "ngo-4", name: "Annadanam Society", malayalam: "അന്നദാനം", distanceKm: 4.8, capacity: 200, rating: 4.6, verified: true, area: "Tripunithura" },
];

// ---------- low-level helpers ----------
function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, val: T) {
  localStorage.setItem(key, JSON.stringify(val));
  window.dispatchEvent(new Event("annasetu:change"));
}

const newId = () => Math.random().toString(36).slice(2, 9);
const newOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

// ---------- user/auth ----------
export function getUser(): User | null { return read<User | null>(KEY_USER, null); }
export function setUser(u: User | null) { u ? write(KEY_USER, u) : (localStorage.removeItem(KEY_USER), window.dispatchEvent(new Event("annasetu:change"))); }

// ---------- notifications ----------
export function getNotifications(): Notification[] {
  return read<Notification[]>(KEY_NOTIFS, []).sort((a, b) => b.at - a.at);
}
function pushNotification(n: Omit<Notification, "id" | "at" | "read">) {
  const all = read<Notification[]>(KEY_NOTIFS, []);
  all.unshift({ ...n, id: newId(), at: Date.now(), read: false });
  write(KEY_NOTIFS, all.slice(0, 50));
}
export function markAllNotificationsRead() {
  const all = read<Notification[]>(KEY_NOTIFS, []).map(n => ({ ...n, read: true }));
  write(KEY_NOTIFS, all);
}

// ---------- donations ----------
export function getDonations(): Donation[] {
  return read<Donation[]>(KEY_DONATIONS, []).sort((a, b) => b.createdAt - a.createdAt);
}

export function getDonation(id: string): Donation | undefined {
  return getDonations().find(d => d.id === id);
}

export function createDonation(input: Omit<Donation, "id" | "createdAt" | "status" | "otp" | "history">): Donation {
  const d: Donation = {
    ...input,
    id: newId(),
    createdAt: Date.now(),
    status: "posted",
    otp: newOtp(),
    history: [{ status: "posted", at: Date.now() }],
  };
  const all = read<Donation[]>(KEY_DONATIONS, []);
  all.unshift(d);
  write(KEY_DONATIONS, all);
  pushNotification({
    title: "New surplus food posted",
    body: `${d.donorOrg}: ${d.foodName} · ${d.servings} servings`,
    donationId: d.id,
    forRole: "ngo",
  });
  return d;
}

function updateDonation(id: string, patch: Partial<Donation>) {
  const all = read<Donation[]>(KEY_DONATIONS, []);
  const idx = all.findIndex(d => d.id === id);
  if (idx === -1) return;
  const next = { ...all[idx], ...patch };
  if (patch.status && patch.status !== all[idx].status) {
    next.history = [...all[idx].history, { status: patch.status, at: Date.now() }];
  }
  all[idx] = next;
  write(KEY_DONATIONS, all);
}

export function acceptDonation(id: string, ngo: Ngo) {
  updateDonation(id, { status: "accepted", ngoId: ngo.id, ngoName: ngo.name });
  pushNotification({
    title: "Donation accepted",
    body: `${ngo.name} accepted your donation. Driver will be assigned shortly.`,
    donationId: id,
    forRole: "restaurant",
  });
  // auto-assign driver after a short delay (simulated)
  setTimeout(() => {
    updateDonation(id, { status: "assigned", driverName: "Anand · KL-07-AB-1234" });
    pushNotification({
      title: "Driver assigned",
      body: "Anand is on the way for pickup. ETA ~8 min.",
      donationId: id,
      forRole: "restaurant",
    });
    pushNotification({
      title: "Pickup assigned",
      body: "You have a new pickup. Use OTP at handoff.",
      donationId: id,
      forRole: "driver",
    });
  }, 1200);
}

export function confirmPickup(id: string, otpEntered: string): { ok: boolean; reason?: string } {
  const d = getDonation(id);
  if (!d) return { ok: false, reason: "Donation not found" };
  if (d.otp !== otpEntered) return { ok: false, reason: "Incorrect OTP" };
  updateDonation(id, { status: "picked_up" });
  pushNotification({
    title: "Picked up",
    body: `${d.foodName} picked up by driver. En route to ${d.ngoName}.`,
    donationId: id,
    forRole: "restaurant",
  });
  return { ok: true };
}

export function markDelivered(id: string) {
  updateDonation(id, { status: "delivered" });
  const d = getDonation(id);
  pushNotification({
    title: "Delivered",
    body: `${d?.servings ?? ""} meals delivered to ${d?.ngoName ?? "NGO"}. Thank you!`,
    donationId: id,
    forRole: "restaurant",
  });
}

export function clearAllData() {
  localStorage.removeItem(KEY_USER);
  localStorage.removeItem(KEY_DONATIONS);
  localStorage.removeItem(KEY_NOTIFS);
  localStorage.removeItem(KEY_POSTS);
  window.dispatchEvent(new Event("annasetu:change"));
}

// ---------- community posts ----------
const SEED_POSTS: CommunityPost[] = [
  {
    id: "p-seed-1",
    at: Date.now() - 1000 * 60 * 60 * 4,
    authorName: "Snehalaya Trust",
    authorOrg: "Snehalaya Trust · NGO",
    authorRole: "ngo",
    caption:
      "Today our volunteers served 240 hot meals at the Kaloor shelter, rescued from a wedding hall surplus. Grateful to AnnaSetu donors for keeping food out of waste bins.",
    hashtags: ["#FoodRescue", "#Kerala", "#AnnaSetu", "#ZeroHunger"],
    location: "Kaloor, Kochi",
    meals: 240,
    likes: 18,
    likedByMe: false,
    comments: [
      { id: "c1", at: Date.now() - 1000 * 60 * 60 * 3, author: "Akshaya Patra", text: "Wonderful effort 🙏" },
    ],
  },
  {
    id: "p-seed-2",
    at: Date.now() - 1000 * 60 * 60 * 26,
    authorName: "Hotel Saravana",
    authorOrg: "Hotel Saravana Bhavan · Donor",
    authorRole: "restaurant",
    caption:
      "We've donated surplus lunch thalis every Friday for 6 weeks straight. A small commitment, a real difference. Join us and post your weekly pledge.",
    hashtags: ["#WeeklyPledge", "#SurplusToService", "#Kochi"],
    location: "Edappally, Kochi",
    meals: 95,
    likes: 31,
    likedByMe: true,
    comments: [],
  },
  {
    id: "p-seed-3",
    at: Date.now() - 1000 * 60 * 60 * 50,
    authorName: "Karunya Volunteers",
    authorOrg: "Karunya Trust · NGO",
    authorRole: "ngo",
    caption:
      "Monsoon relief drive: distributed 60 dinner packs to families displaced near Vyttila underpass. Looking for donors with vegetarian surplus tonight.",
    hashtags: ["#MonsoonRelief", "#Vyttila", "#NeedDonors"],
    location: "Vyttila, Kochi",
    meals: 60,
    likes: 12,
    likedByMe: false,
    comments: [],
  },
];

export function getPosts(): CommunityPost[] {
  const stored = read<CommunityPost[] | null>(KEY_POSTS, null);
  if (stored && stored.length) return [...stored].sort((a, b) => b.at - a.at);
  // first run: seed
  write(KEY_POSTS, SEED_POSTS);
  return [...SEED_POSTS].sort((a, b) => b.at - a.at);
}

export function createPost(input: Omit<CommunityPost, "id" | "at" | "likes" | "likedByMe" | "comments">) {
  const all = read<CommunityPost[]>(KEY_POSTS, SEED_POSTS);
  const post: CommunityPost = {
    ...input,
    id: newId(),
    at: Date.now(),
    likes: 0,
    likedByMe: false,
    comments: [],
  };
  all.unshift(post);
  write(KEY_POSTS, all);
  pushNotification({
    title: "New community update",
    body: `${post.authorName} shared an activity.`,
    forRole: "all",
  });
  return post;
}

export function togglePostLike(id: string) {
  const all = read<CommunityPost[]>(KEY_POSTS, SEED_POSTS);
  const idx = all.findIndex(p => p.id === id);
  if (idx === -1) return;
  const liked = !all[idx].likedByMe;
  all[idx] = { ...all[idx], likedByMe: liked, likes: Math.max(0, all[idx].likes + (liked ? 1 : -1)) };
  write(KEY_POSTS, all);
}

export function addPostComment(id: string, author: string, text: string) {
  const all = read<CommunityPost[]>(KEY_POSTS, SEED_POSTS);
  const idx = all.findIndex(p => p.id === id);
  if (idx === -1) return;
  all[idx] = {
    ...all[idx],
    comments: [...all[idx].comments, { id: newId(), at: Date.now(), author, text }],
  };
  write(KEY_POSTS, all);
}

// ---------- impact ----------
export function getImpact() {
  const ds = getDonations();
  const delivered = ds.filter(d => d.status === "delivered");
  const meals = delivered.reduce((s, d) => s + d.servings, 0);
  const ngos = new Set(delivered.map(d => d.ngoId).filter(Boolean)).size;
  // ~0.5kg CO2 saved per meal rescued (approx illustrative figure)
  const co2Kg = Math.round(meals * 0.5);
  return { meals, ngos, co2Kg, totalPosts: ds.length, inProgress: ds.filter(d => d.status !== "delivered").length };
}

// ---------- React hook ----------
export function useAnnaStore() {
  const [, force] = useState(0);
  const refresh = useCallback(() => force(n => n + 1), []);
  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener("annasetu:change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("annasetu:change", handler);
      window.removeEventListener("storage", handler);
    };
  }, [refresh]);
  return { refresh };
}

export const STATUS_LABEL: Record<DonationStatus, string> = {
  posted: "Posted",
  accepted: "Accepted by NGO",
  assigned: "Driver assigned",
  picked_up: "Picked up",
  delivered: "Delivered",
};

export const STATUS_STEP: Record<DonationStatus, number> = {
  posted: 1, accepted: 2, assigned: 3, picked_up: 4, delivered: 5,
};
