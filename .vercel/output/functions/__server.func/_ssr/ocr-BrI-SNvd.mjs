import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { s as string } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ocr-BrI-SNvd.js
function stringifyFields(v) {
	if (!v || typeof v !== "object" || Array.isArray(v)) return {};
	const out = {};
	for (const [k, val] of Object.entries(v)) {
		if (val == null) continue;
		out[k] = typeof val === "string" ? val : JSON.stringify(val);
	}
	return out;
}
function asDamage(v) {
	if (!Array.isArray(v)) return [];
	return v.slice(0, 12).map((row) => {
		const r = row ?? {};
		return {
			feature: String(r.feature ?? ""),
			severity: String(r.severity ?? ""),
			note: String(r.note ?? "")
		};
	});
}
var readDocument_createServerFn_handler = createServerRpc({
	id: "4408cc41f53107a4e6007eaa58cf68e0df16ab25444040edafaa9a2575a52758",
	name: "readDocument",
	filename: "src/lib/server/ocr.ts"
}, (opts) => readDocument.__executeServer(opts));
var readDocument = createServerFn({ method: "POST" }).validator((input) => ({
	imageDataUrl: string().min(32).max(65e5).parse(input.imageDataUrl),
	hint: input.hint ? string().max(240).parse(input.hint) : void 0
})).handler(readDocument_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "Vision is unavailable in this environment."
	};
	const system = `You are a field OCR and condition analyst for restoration and real estate.
Read the image. If it is a document (estimate, invoice, work order, CMR, insurance FNOL, proposal), extract structured fields.
If it is a property photo, describe the exterior condition of roof, siding, garage, windows, paint.
Return JSON only.`;
	const userText = data.hint ? `Operator hint: ${data.hint}\nExtract all readable text and a condition/damage assessment.` : "Extract all readable text and a property or document assessment.";
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .2,
			max_tokens: 900,
			response_format: { type: "json_object" },
			messages: [{
				role: "system",
				content: system
			}, {
				role: "user",
				content: [{
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
`
				}, {
					type: "image_url",
					image_url: { url: data.imageDataUrl }
				}]
			}]
		})
	});
	if (!res.ok) {
		const err = await res.text().catch(() => "");
		return {
			ok: false,
			error: `Vision ${res.status}. ${err.slice(0, 160)}`
		};
	}
	const raw = (await res.json()).choices?.[0]?.message?.content ?? "";
	try {
		const parsed = JSON.parse(raw);
		return {
			ok: true,
			kind: String(parsed.kind ?? "other"),
			docType: String(parsed.docType ?? "unknown"),
			address: parsed.address ? String(parsed.address) : null,
			summary: String(parsed.summary ?? ""),
			text: String(parsed.text ?? "").slice(0, 4e3),
			fields: stringifyFields(parsed.fields),
			damage: asDamage(parsed.damage),
			conditionScore: typeof parsed.conditionScore === "number" ? parsed.conditionScore : null,
			suggestedPlay: String(parsed.suggestedPlay ?? "")
		};
	} catch {
		return {
			ok: true,
			kind: "other",
			docType: "unparsed",
			address: null,
			summary: raw.slice(0, 400),
			text: raw.slice(0, 4e3),
			fields: {},
			damage: [],
			conditionScore: null,
			suggestedPlay: ""
		};
	}
});
//#endregion
export { readDocument_createServerFn_handler };
