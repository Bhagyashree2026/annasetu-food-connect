import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "@/components/app/PhoneFrame";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  addPostComment,
  createPost,
  getPosts,
  getUser,
  togglePostLike,
  useAnnaStore,
} from "@/lib/annaStore";
import { supabase } from "@/integrations/supabase/client";
import {
  Heart, MessageCircle, Sparkles, Send, Plus, X, Loader2, Users,
} from "lucide-react";

const Community = () => {
  const navigate = useNavigate();
  useAnnaStore();
  const [composerOpen, setComposerOpen] = useState(false);

  const user = getUser();
  if (!user) { navigate("/app/login", { replace: true }); return null; }

  const posts = getPosts();

  return (
    <PhoneFrame title="Community" subtitle="കമ്മ്യൂണിറ്റി">
      {/* Header card */}
      <div className="kerala-card p-4 mb-4 animate-fade-up flex items-center gap-3">
        <div className="w-11 h-11 rounded-full gradient-leaf flex items-center justify-center text-primary-foreground shadow-elegant">
          <Users className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-lg text-maroon leading-tight">NGO & donor stories</h2>
          <p className="text-[11px] text-muted-foreground">See what partners across Kerala are doing today.</p>
        </div>
        <Button size="sm" variant="hero" onClick={() => setComposerOpen(true)}>
          <Plus className="w-4 h-4" /> Post
        </Button>
      </div>

      {/* Composer */}
      {composerOpen && (
        <Composer onClose={() => setComposerOpen(false)} />
      )}

      {/* Feed */}
      <div className="space-y-4">
        {posts.map(p => (
          <PostCard
            key={p.id}
            post={p}
            currentUserName={user.name}
          />
        ))}
        {posts.length === 0 && (
          <div className="text-center text-xs text-muted-foreground py-10 border border-dashed border-accent/30 rounded-lg">
            No community posts yet. Be the first to share.
          </div>
        )}
      </div>
    </PhoneFrame>
  );
};

// ---------------- Composer ----------------
const Composer = ({ onClose }: { onClose: () => void }) => {
  const user = getUser()!;
  const [idea, setIdea] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [meals, setMeals] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);

  const runAI = async () => {
    if (idea.trim().length < 4) {
      toast.error("Add a few words about what you did first.");
      return;
    }
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("community-caption", {
        body: { idea, org: user.org, tone: "warm" },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setCaption(data.caption ?? "");
      setHashtags(Array.isArray(data.hashtags) ? data.hashtags : []);
      toast.success("Caption drafted by Gemini AI");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "AI assist failed";
      toast.error(msg);
    } finally {
      setAiLoading(false);
    }
  };

  const submit = () => {
    const finalCaption = (caption || idea).trim();
    if (finalCaption.length < 6) {
      toast.error("Write a short caption first.");
      return;
    }
    createPost({
      authorName: user.name,
      authorOrg: user.org,
      authorRole: user.role,
      caption: finalCaption,
      hashtags,
      meals: meals ? Number(meals) : undefined,
    });
    toast.success("Posted to community feed");
    onClose();
  };

  return (
    <div className="kerala-card p-4 mb-4 animate-fade-up">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-maroon">Share an activity</h3>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-accent/15 text-muted-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
        What happened today?
      </label>
      <Textarea
        value={idea}
        onChange={e => setIdea(e.target.value)}
        placeholder="e.g. Served 80 dinner packs in Vyttila with surplus from Hotel Saravana"
        className="mt-1 mb-2"
        rows={2}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full mb-3"
        onClick={runAI}
        disabled={aiLoading}
      >
        {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-accent" />}
        {aiLoading ? "Drafting with Gemini AI…" : "Polish with Gemini AI"}
      </Button>

      <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
        Caption
      </label>
      <Textarea
        value={caption}
        onChange={e => setCaption(e.target.value)}
        placeholder="Your post will appear here. You can edit anything the AI suggests."
        className="mt-1 mb-2"
        rows={4}
      />

      {hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {hashtags.map(h => (
            <span key={h} className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              {h}
            </span>
          ))}
        </div>
      )}

      <div className="mb-3">
        <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Meals served (optional)</label>
        <Input type="number" value={meals} onChange={e => setMeals(e.target.value)} placeholder="e.g. 80" className="mt-1" />
      </div>

      <Button variant="hero" className="w-full" onClick={submit}>
        <Send className="w-4 h-4" /> Post to community
      </Button>
    </div>
  );
};

// ---------------- Post card ----------------
const PostCard = ({
  post,
  currentUserName,
}: {
  post: ReturnType<typeof getPosts>[number];
  currentUserName: string;
}) => {
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");

  const initials = post.authorName.split(" ").slice(0, 2).map(s => s[0]).join("").toUpperCase();
  const roleLabel =
    post.authorRole === "ngo" ? "NGO partner" :
    post.authorRole === "restaurant" ? "Donor" : "Volunteer";

  const time = relativeTime(post.at);
  const profileSlug = post.authorName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const submitComment = () => {
    if (comment.trim().length < 1) return;
    addPostComment(post.id, currentUserName, comment.trim());
    setComment("");
  };

  return (
    <article className="kerala-card p-4 animate-fade-up">
      <header className="flex items-start gap-3 mb-2.5">
        <button
          onClick={() => navigate(`/app/profile/${profileSlug}`)}
          className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center text-maroon font-display text-sm shadow-gold shrink-0 hover:scale-105 transition-smooth"
          aria-label={`View ${post.authorName}'s profile`}
        >
          {initials || "AS"}
        </button>
        <button
          onClick={() => navigate(`/app/profile/${profileSlug}`)}
          className="flex-1 min-w-0 text-left hover:opacity-80 transition-smooth"
        >
          <h4 className="font-display text-base text-maroon leading-tight truncate">{post.authorName}</h4>
          <p className="text-[11px] text-muted-foreground truncate">{post.authorOrg}</p>
        </button>
        <div className="text-right shrink-0">
          <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold mb-1">
            {roleLabel}
          </span>
          <p className="text-[10px] text-muted-foreground">{time}</p>
        </div>
      </header>

      <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line mb-2">
        {post.caption}
      </p>

      {post.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.hashtags.map(h => (
            <span key={h} className="text-[11px] text-accent font-medium">{h}</span>
          ))}
        </div>
      )}

      {post.meals !== undefined && (
        <div className="flex items-center gap-3 text-[11px] mb-3">
          <span className="inline-flex items-center gap-1 text-primary font-semibold">
            {post.meals} meals served
          </span>
        </div>
      )}

      <div className="flex items-center gap-1 -ml-2">
        <button
          onClick={() => togglePostLike(post.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-smooth ${
            post.likedByMe ? "text-terracotta bg-terracotta/10" : "text-muted-foreground hover:bg-accent/10"
          }`}
        >
          <Heart className={`w-4 h-4 ${post.likedByMe ? "fill-current" : ""}`} /> {post.likes}
        </button>
        <button
          onClick={() => setShowComments(s => !s)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:bg-accent/10 transition-smooth"
        >
          <MessageCircle className="w-4 h-4" /> {post.comments.length}
        </button>
      </div>

      {showComments && (
        <div className="mt-3 pt-3 border-t border-accent/20 space-y-2">
          {post.comments.map(c => (
            <div key={c.id} className="text-xs">
              <span className="font-semibold text-maroon">{c.author}</span>{" "}
              <span className="text-foreground/80">{c.text}</span>
              <span className="text-muted-foreground ml-2 text-[10px]">{relativeTime(c.at)}</span>
            </div>
          ))}
          {post.comments.length === 0 && (
            <p className="text-[11px] text-muted-foreground italic">Be the first to comment.</p>
          )}
          <div className="flex gap-2 pt-1">
            <Input
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Write a comment…"
              className="text-xs h-9"
              onKeyDown={e => { if (e.key === "Enter") submitComment(); }}
            />
            <Button size="sm" variant="outline" onClick={submitComment}>
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </article>
  );
};

function relativeTime(at: number) {
  const diff = Date.now() - at;
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

export default Community;
