import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { FEATURE_STYLES } from "@/lib/knowledge";
import type { FeatureKey } from "@/lib/types";

const FEATURES = ["garage_door", "roof", "windows", "siding", "paint", "landscaping"] as const;

export const composeRender = createServerFn({ method: "POST" })
  .validator((input: { feature: FeatureKey; style: string; imageDataUrl: string; context?: string }) => ({
    feature: z.enum(FEATURES).parse(input.feature),
    style: z.string().min(1).max(80).parse(input.style),
    imageDataUrl: z.string().min(32).max(6_500_000).parse(input.imageDataUrl),
    context: z.string().max(400).optional().parse(input.context),
  }))
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "Image rendering is unavailable in this environment." };
    }

    const styles = FEATURE_STYLES[data.feature];
    const style = styles.find((s) => s.id === data.style) ?? styles[0]!;
    const prompt = [
      "Photorealistic architectural photograph of the SAME house, SAME camera angle, SAME lens, SAME time of day and lighting.",
      `Replace only the ${data.feature.replace("_", " ")} with ${style.prompt}.`,
      "Keep landscaping, sky, driveway, neighboring houses, parked cars, and perspective identical.",
      "Do not add people, text, logos, or watermarks. Professional listing photography, natural color, no HDR glow.",
      data.context ? `Additional context: ${data.context}` : "",
    ]
      .filter(Boolean)
      .join(" ");

    const res = await fetch("https://api.x.ai/v1/images/edits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-imagine-image-2.0",
        prompt,
        image: { url: data.imageDataUrl, type: "image_url" },
        n: 1,
        resolution: "1k",
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return { ok: false as const, error: `Render failed (${res.status}). ${errText.slice(0, 180)}` };
    }

    const body = (await res.json()) as {
      data?: { url?: string; b64_json?: string }[];
    };
    const first = body.data?.[0];
    let after: string | null = null;
    if (first?.url) after = first.url;
    else if (first?.b64_json) after = `data:image/png;base64,${first.b64_json}`;
    if (!after) return { ok: false as const, error: "Renderer returned no image." };

    return { ok: true as const, afterUrl: after, prompt, styleLabel: style.label };
  });

export const composeCopy = createServerFn({ method: "POST" })
  .validator((input: { feature: FeatureKey; style: string; address?: string; roiPct?: number }) => ({
    feature: z.enum(FEATURES).parse(input.feature),
    style: z.string().parse(input.style),
    address: input.address ? z.string().max(160).parse(input.address) : undefined,
    roiPct: typeof input.roiPct === "number" ? input.roiPct : undefined,
  }))
  .handler(async ({ data }) => {
    const fallback = {
      headline: `See this ${data.feature.replace("_", " ")} on your elevation`,
      body: `A photographed ${data.style} replacement is the cheapest way to change how this house is read from the curb. Pair the render with a same-week site check.`,
      roiStatement: data.roiPct
        ? `Modeled resale ROI near ${data.roiPct.toFixed(0)}% for this category, before insurance or energy effects.`
        : "Modeled ROI follows the 2024 Cost vs. Value category benchmarks, localized by metro cost index.",
    };
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: true as const, ...fallback };

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.4,
        max_tokens: 400,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "Return JSON {headline, body, roiStatement}. No emoji. Contractor-credible, 1 headline under 12 words, body 2 sentences.",
          },
          {
            role: "user",
            content: `Feature ${data.feature}, style ${data.style}, address ${data.address ?? "the property"}, roi ${data.roiPct ?? "n/a"}.`,
          },
        ],
      }),
    });
    if (!res.ok) return { ok: true as const, ...fallback };
    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    try {
      const parsed = JSON.parse(body.choices?.[0]?.message?.content ?? "{}") as Record<string, string>;
      return {
        ok: true as const,
        headline: parsed.headline || fallback.headline,
        body: parsed.body || fallback.body,
        roiStatement: parsed.roiStatement || fallback.roiStatement,
      };
    } catch {
      return { ok: true as const, ...fallback };
    }
  });
