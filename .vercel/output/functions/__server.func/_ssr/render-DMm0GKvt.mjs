import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { r as FEATURE_STYLES } from "./knowledge-_ynDysTG.mjs";
import { s as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/render-DMm0GKvt.js
var FEATURES = [
	"garage_door",
	"roof",
	"windows",
	"siding",
	"paint",
	"landscaping"
];
var composeRender_createServerFn_handler = createServerRpc({
	id: "6c31d9013620abc66d8483e7a74ad81a492d23f7d72b3b34f2f50587987fa31d",
	name: "composeRender",
	filename: "src/lib/server/render.ts"
}, (opts) => composeRender.__executeServer(opts));
var composeRender = createServerFn({ method: "POST" }).validator((input) => ({
	feature: _enum(FEATURES).parse(input.feature),
	style: string().min(1).max(80).parse(input.style),
	imageDataUrl: string().min(32).max(65e5).parse(input.imageDataUrl),
	context: string().max(400).optional().parse(input.context)
})).handler(composeRender_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "Image rendering is unavailable in this environment."
	};
	const styles = FEATURE_STYLES[data.feature];
	const style = styles.find((s) => s.id === data.style) ?? styles[0];
	const prompt = [
		"Photorealistic architectural photograph of the SAME house, SAME camera angle, SAME lens, SAME time of day and lighting.",
		`Replace only the ${data.feature.replace("_", " ")} with ${style.prompt}.`,
		"Keep landscaping, sky, driveway, neighboring houses, parked cars, and perspective identical.",
		"Do not add people, text, logos, or watermarks. Professional listing photography, natural color, no HDR glow.",
		data.context ? `Additional context: ${data.context}` : ""
	].filter(Boolean).join(" ");
	const res = await fetch("https://api.x.ai/v1/images/edits", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-imagine-image-2.0",
			prompt,
			image: {
				url: data.imageDataUrl,
				type: "image_url"
			},
			n: 1,
			resolution: "1k"
		})
	});
	if (!res.ok) {
		const errText = await res.text().catch(() => "");
		return {
			ok: false,
			error: `Render failed (${res.status}). ${errText.slice(0, 180)}`
		};
	}
	const first = (await res.json()).data?.[0];
	let after = null;
	if (first?.url) after = first.url;
	else if (first?.b64_json) after = `data:image/png;base64,${first.b64_json}`;
	if (!after) return {
		ok: false,
		error: "Renderer returned no image."
	};
	return {
		ok: true,
		afterUrl: after,
		prompt,
		styleLabel: style.label
	};
});
var composeCopy_createServerFn_handler = createServerRpc({
	id: "44a84b2c3e0798b51490767dbf19d3b012f64f7b0318831056f4165a8415cd62",
	name: "composeCopy",
	filename: "src/lib/server/render.ts"
}, (opts) => composeCopy.__executeServer(opts));
var composeCopy = createServerFn({ method: "POST" }).validator((input) => ({
	feature: _enum(FEATURES).parse(input.feature),
	style: string().parse(input.style),
	address: input.address ? string().max(160).parse(input.address) : void 0,
	roiPct: typeof input.roiPct === "number" ? input.roiPct : void 0
})).handler(composeCopy_createServerFn_handler, async ({ data }) => {
	const fallback = {
		headline: `See this ${data.feature.replace("_", " ")} on your elevation`,
		body: `A photographed ${data.style} replacement is the cheapest way to change how this house is read from the curb. Pair the render with a same-week site check.`,
		roiStatement: data.roiPct ? `Modeled resale ROI near ${data.roiPct.toFixed(0)}% for this category, before insurance or energy effects.` : "Modeled ROI follows the 2024 Cost vs. Value category benchmarks, localized by metro cost index."
	};
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: true,
		...fallback
	};
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .4,
			max_tokens: 400,
			response_format: { type: "json_object" },
			messages: [{
				role: "system",
				content: "Return JSON {headline, body, roiStatement}. No emoji. Contractor-credible, 1 headline under 12 words, body 2 sentences."
			}, {
				role: "user",
				content: `Feature ${data.feature}, style ${data.style}, address ${data.address ?? "the property"}, roi ${data.roiPct ?? "n/a"}.`
			}]
		})
	});
	if (!res.ok) return {
		ok: true,
		...fallback
	};
	const body = await res.json();
	try {
		const parsed = JSON.parse(body.choices?.[0]?.message?.content ?? "{}");
		return {
			ok: true,
			headline: parsed.headline || fallback.headline,
			body: parsed.body || fallback.body,
			roiStatement: parsed.roiStatement || fallback.roiStatement
		};
	} catch {
		return {
			ok: true,
			...fallback
		};
	}
});
//#endregion
export { composeCopy_createServerFn_handler, composeRender_createServerFn_handler };
