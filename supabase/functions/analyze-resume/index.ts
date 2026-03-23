import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const resumeText = body.resumeText || "";

    if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length < 20) {
      return new Response(
        JSON.stringify({ error: "Please provide a resume with at least 20 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert career coach and resume analyst. Analyze the provided resume and return a JSON response with exactly these 4 sections. Be specific, actionable, and encouraging.

IMPORTANT FORMATTING RULES:
- For "improvedResume": Return the resume in clean MARKDOWN format with proper headings (## for sections like Summary, Technical Skills, Experience, Projects, Achievements, Education), bullet points, bold text for names/titles, and clear spacing. Do NOT return it as a single paragraph. Use line breaks and structure it like a real professional resume.

For skillGaps: identify 4-6 missing or weak skills compared to industry standards. For each skill gap, provide 1-2 recommended study resources (like a YouTube video link, a free course, or official documentation) with a title, type, and URL.
For careerSuggestions: suggest 3-4 roles with match percentage (0-100). For each role, include 3-5 real companies that actively hire for that role, with their careers page URL.
For roadmap: create a 30-day plan split into 6-8 phases with specific, actionable tasks.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Here is my resume:\n\n${resumeText.slice(0, 8000)}` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_resume",
              description: "Return structured resume analysis",
              parameters: {
                type: "object",
                properties: {
                  improvedResume: { type: "string", description: "Professionally rewritten resume in markdown" },
                  skillGaps: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        skill: { type: "string" },
                        importance: { type: "string", enum: ["high", "medium", "low"] },
                        reason: { type: "string" },
                        recommendedResources: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              title: { type: "string" },
                              type: { type: "string", enum: ["video", "article", "course", "other"] },
                              url: { type: "string" }
                            },
                            required: ["title", "type", "url"]
                          }
                        }
                      },
                      required: ["skill", "importance", "reason"],
                    },
                  },
                  careerSuggestions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        role: { type: "string" },
                        match: { type: "number" },
                        reason: { type: "string" },
                        skills: { type: "array", items: { type: "string" } },
                        companies: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              name: { type: "string" },
                              url: { type: "string" },
                            },
                            required: ["name", "url"],
                          },
                        },
                      },
                      required: ["role", "match", "reason", "skills", "companies"],
                    },
                  },
                  roadmap: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        day: { type: "string" },
                        title: { type: "string" },
                        tasks: { type: "array", items: { type: "string" } },
                        timeEstimate: { type: "string" },
                      },
                      required: ["day", "title", "tasks", "timeEstimate"],
                    },
                  },
                },
                required: ["improvedResume", "skillGaps", "careerSuggestions", "roadmap"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_resume" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No structured response from AI");
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-resume error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
