// Edge function: generate a warm, concise community-post caption using Lovable AI (Gemini).
// Returns: { caption: string, hashtags: string[] }

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const idea: string = (body?.idea ?? "").toString().trim();
    const org: string = (body?.org ?? "").toString().trim();
    const tone: string = (body?.tone ?? "warm").toString();

    if (!idea || idea.length < 4) {
      return new Response(JSON.stringify({ error: "Please share a few words about the activity." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are AnnaSetu's community storytelling assistant. Craft short, sincere social posts (max 320 characters) in clear English for NGOs, restaurants and volunteers in Kerala sharing food-rescue activities. Tone: " +
              tone +
              ". Avoid emojis spam, avoid hype, no all-caps. Add 3-5 useful, specific hashtags.",
          },
          {
            role: "user",
            content: `Organization: ${org || "AnnaSetu partner"}\nActivity idea: ${idea}\n\nWrite the post.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "write_post",
              description: "Return a community post caption and hashtags.",
              parameters: {
                type: "object",
                properties: {
                  caption: { type: "string", description: "The post body, <= 320 chars." },
                  hashtags: {
                    type: "array",
                    items: { type: "string", description: "Hashtag without spaces, e.g. #FoodRescue" },
                    minItems: 3,
                    maxItems: 5,
                  },
                },
                required: ["caption", "hashtags"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "write_post" } },
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (resp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in workspace settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await resp.text();
      console.error("AI gateway error", resp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const argsStr = data?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!argsStr) {
      return new Response(JSON.stringify({ error: "No structured response from AI" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let parsed: { caption?: string; hashtags?: string[] } = {};
    try { parsed = JSON.parse(argsStr); } catch {
      return new Response(JSON.stringify({ error: "Could not parse AI response" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("community-caption error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
