import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

function stringifyFields(v: unknown): Record<string, string> {
  if (!v || typeof v !== "object" || Array.isArray(v)) return {};
  const out: Record<string, string> = {};
  for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
    if (val == null) continue;
    out[k] = typeof val === "string" ? val : JSON.stringify(val);
  }
  return out;
}

function asDamage(v: unknown): { feature: string; severity: string; note: string }[] {
  if (!Array.isArray(v)) return [];
  return v.slice(0, 12).map((row) => {
    const r = (row ?? {}) as Record<string, unknown>;
    return {
      feature: String(r.feature ?? ""),
      severity: String(r.severity ?? ""),
      note: String(r.note ?? ""),
    };
  });
}

export const readDocument = createServerFn({ method: "POST" })
  .validator((input: { imageDataUrl: string; hint?: string }) => ({
    imageDataUrl: z.string().min(32).max(6_500_000).parse(input.imageDataUrl),
    hint: input.hint ? z.string().max(240).parse(input.hint) : undefined,
  }))
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "Vision is unavailable in this environment." };

    const system = `You are a field OCR and condition analyst for restoration and real estate.
Read the image. If it is a document (estimate, invoice, work order, CMR, insurance FNOL, proposal), extract structured fields.
If it is a property photo, describe the exterior condition of roof, siding, garage, windows, paint.
Return JSON only.`;

    const userText = data.hint
      ? `Operator hint: ${data.hint}\nExtract all readable text and a condition/damage assessment.`
      : "Extract all readable text and a property or document assessment.";

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.2,
        max_tokens: 900,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `${userText}
JSON keys:
kind: "document" | "facade" | "other"
docType: string
address: string | null
summary: string
text: string (raw OCR, truncated)
fields: object of labeled string values
damage: array of { feature, severity (low|moderate|high|critical), note }
conditionScore: number 0-100
suggestedPlay: string
`,
              },
              { type: "image_url", image_url: { url: data.imageDataUrl } },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      return { ok: false as const, error: `Vision ${res.status}. ${err.slice(0, 160)}` };
    }
    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const raw = body.choices?.[0]?.message?.content ?? "";
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      return {
        ok: true as const,
        kind: String(parsed.kind ?? "other"),
        docType: String(parsed.docType ?? "unknown"),
        address: parsed.address ? String(parsed.address) : null,
        summary: String(parsed.summary ?? ""),
        text: String(parsed.text ?? "").slice(0, 4000),
        fields: stringifyFields(parsed.fields),
        damage: asDamage(parsed.damage),
        conditionScore: typeof parsed.conditionScore === "number" ? parsed.conditionScore : null,
        suggestedPlay: String(parsed.suggestedPlay ?? ""),
      };
    } catch {
      return {
        ok: true as const,
        kind: "other",
        docType: "unparsed",
        address: null as string | null,
        summary: raw.slice(0, 400),
        text: raw.slice(0, 4000),
        fields: {} as Record<string, string>,
        damage: [] as { feature: string; severity: string; note: string }[],
        conditionScore: null as number | null,
        suggestedPlay: "",
      };
    }
  });
