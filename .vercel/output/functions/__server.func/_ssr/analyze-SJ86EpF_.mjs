import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { i as formatMiles } from "./utils-BOIfZi7B.mjs";
import { t as buildDossier } from "./engine-CoB_AfSa.mjs";
import { a as number, n as any, o as object, r as array, s as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analyze-SJ86EpF_.js
function pinSchema(p) {
	return object({
		id: string(),
		label: string(),
		address: string(),
		city: string(),
		state: string(),
		postcode: string(),
		lat: number(),
		lng: number(),
		neighborhood: string().optional(),
		county: string().optional(),
		source: _enum([
			"search",
			"map",
			"geofence",
			"sample",
			"locate"
		])
	}).parse(p);
}
async function grokJson(system, user, maxTokens = 1400) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return null;
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .3,
			max_tokens: maxTokens,
			response_format: { type: "json_object" },
			messages: [{
				role: "system",
				content: system
			}, {
				role: "user",
				content: user
			}]
		})
	});
	if (!res.ok) return null;
	const text = (await res.json()).choices?.[0]?.message?.content ?? "";
	try {
		return JSON.parse(text);
	} catch {
		const m = text.match(/\{[\s\S]*\}/);
		if (!m) return null;
		try {
			return JSON.parse(m[0]);
		} catch {
			return null;
		}
	}
}
async function grokText(system, user, maxTokens = 700) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return null;
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .35,
			max_tokens: maxTokens,
			messages: [{
				role: "system",
				content: system
			}, {
				role: "user",
				content: user
			}]
		})
	});
	if (!res.ok) return null;
	return (await res.json()).choices?.[0]?.message?.content ?? null;
}
var analyzeProperty_createServerFn_handler = createServerRpc({
	id: "cb60ffc417e2f673aac2abf8539118c94ba583d8fa3828887a8028ba38648258",
	name: "analyzeProperty",
	filename: "src/lib/server/analyze.ts"
}, (opts) => analyzeProperty.__executeServer(opts));
var analyzeProperty = createServerFn({ method: "POST" }).validator((input) => ({
	pin: pinSchema(input.pin),
	amenities: (input.amenities ?? []).slice(0, 24),
	nearby: (input.nearby ?? []).slice(0, 12),
	ground: input.ground ?? null
})).handler(analyzeProperty_createServerFn_handler, async ({ data }) => {
	const dossier = buildDossier(data.pin, data.nearby, data.ground);
	const nearby = data.amenities.slice(0, 12).map((a) => `${a.name} (${a.kind}, ${formatMiles(a.distanceM)})`).join("; ");
	const json = await grokJson("You are PropertyInsight, a real-estate and renovation strategist for ODASI / VIVELLA. Return JSON only. Be numeric, cited, and conservative. Never invent a specific sold-comp address you cannot know; speak in ranges and neighborhood patterns. Keys: thesis (string), narrative (string, 90-140 words), occupancyNote (string), extraRisks (array of {label, severity: low|moderate|high|critical, detail}), playNotes (object mapping feature id to a 1-sentence local note).", `Parcel: ${data.pin.label}
Coords: ${data.pin.lat}, ${data.pin.lng}
Neighborhood: ${data.pin.neighborhood ?? "unknown"}
Modeled profile: ${JSON.stringify(dossier.profile)}
Valuation: ${JSON.stringify(dossier.valuation)}
DPS: ${dossier.dps.score} ${dossier.dps.tier}
Cap rate as-is: ${(dossier.scenarios[0].proForma.capRate * 100).toFixed(2)}%
Metro: ${dossier.metro.name} median ${dossier.metro.medianValue} yoy ${dossier.metro.yoyAppreciation}
Top plays: ${dossier.plays.slice(0, 4).map((p) => `${p.id} roi ${p.roiPct} cost ${p.costMid}`).join(", ")}
Nearby: ${nearby || "none returned"}`, 1600);
	if (json) {
		if (typeof json.thesis === "string") dossier.thesis = json.thesis;
		if (typeof json.narrative === "string") dossier.narrative = json.narrative;
		if (typeof json.occupancyNote === "string") dossier.occupancyNote = json.occupancyNote;
		if (Array.isArray(json.extraRisks)) {
			const extra = json.extraRisks;
			dossier.risks = [...dossier.risks, ...extra].slice(0, 8);
		}
		if (json.playNotes && typeof json.playNotes === "object") {
			const notes = json.playNotes;
			dossier.plays = dossier.plays.map((p) => notes[p.id] ? {
				...p,
				narrative: notes[p.id]
			} : p);
		}
		dossier.enriched = true;
		dossier.evidence.sources.push({
			sourceType: "llm",
			sourceId: "grok-4.5",
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			meta: { role: "narrative overlay" }
		});
		dossier.evidence.modelVersions.narrative = { version: "grok-4.5" };
	}
	return {
		ok: true,
		dossier
	};
});
function nearestOf(amenities, re) {
	return amenities.find((a) => re.test(a.kind) || re.test(a.name.toLowerCase())) ?? null;
}
var analyzeNeighborhood_createServerFn_handler = createServerRpc({
	id: "f1968ec9ed2448ddbc30f2267e08ba6473adc249a6a7f57593229511d6b085dc",
	name: "analyzeNeighborhood",
	filename: "src/lib/server/analyze.ts"
}, (opts) => analyzeNeighborhood.__executeServer(opts));
var analyzeNeighborhood = createServerFn({ method: "POST" }).validator((input) => ({
	pin: pinSchema(input.pin),
	amenities: (input.amenities ?? []).slice(0, 40),
	ground: input.ground ?? null
})).handler(analyzeNeighborhood_createServerFn_handler, async ({ data }) => {
	const counts = /* @__PURE__ */ new Map();
	for (const a of data.amenities) counts.set(a.kind, (counts.get(a.kind) ?? 0) + 1);
	const clusters = [...counts.entries()].map(([kind, count]) => ({
		kind,
		count
	})).sort((a, b) => b.count - a.count).slice(0, 10);
	const schoolCount = data.amenities.filter((a) => /school|kindergarten|university/.test(a.kind)).length;
	const parkCount = data.amenities.filter((a) => /park|playground/.test(a.kind)).length;
	const transitCount = data.amenities.filter((a) => /station|bus_stop|tram/.test(a.kind)).length;
	const shopCount = data.amenities.filter((a) => /supermarket|convenience|cafe|restaurant/.test(a.kind)).length;
	const walkScore = Math.max(18, Math.min(96, Math.round(32 + data.amenities.length * 1.1 + parkCount * 3 + transitCount * 4)));
	const transitScore = Math.max(8, Math.min(94, 12 + transitCount * 14 + shopCount * 2));
	const amenityScore = Math.max(12, Math.min(96, data.amenities.length * 2 + parkCount * 4 + schoolCount * 3));
	const school = nearestOf(data.amenities, /school|kindergarten|university/);
	const park = nearestOf(data.amenities, /park|playground/);
	const grocery = nearestOf(data.amenities, /supermarket|convenience/);
	const transit = nearestOf(data.amenities, /station|bus_stop|tram/);
	const nearest = [
		school ? {
			label: "School",
			name: school.name,
			distanceM: school.distanceM
		} : null,
		park ? {
			label: "Park",
			name: park.name,
			distanceM: park.distanceM
		} : null,
		grocery ? {
			label: "Grocery",
			name: grocery.name,
			distanceM: grocery.distanceM
		} : null,
		transit ? {
			label: "Transit",
			name: transit.name,
			distanceM: transit.distanceM
		} : null
	].filter((x) => Boolean(x));
	const intel = {
		pin: data.pin,
		summary: `${data.pin.neighborhood || data.pin.city || "This tract"} shows ${data.amenities.length} mapped points of interest within the search radius — ${schoolCount} education, ${parkCount} parks, ${transitCount} transit.`,
		walkScore,
		transitScore,
		amenityScore,
		amenities: data.amenities.slice(0, 40),
		clusters,
		nearest,
		schoolsNote: schoolCount > 0 ? `${schoolCount} education POIs in radius. Treat ratings as a follow-up, not a fact in this pass.` : "No school nodes returned in this radius — widen the geofence or verify district maps.",
		laborNote: "Commute and wage bands are inferred from metro ACS-style benchmarks until a tract overlay is licensed.",
		zoningNote: "Municipal zoning is not parsed live. Flag any planned ADU, short-term rental, or overlay district before bidding.",
		trend: "Use metro appreciation as the prior; parcel-level residuals come from condition, not from this neighborhood layer.",
		enriched: false,
		census: data.ground?.census ?? null,
		flood: data.ground?.flood ?? null,
		building: data.ground?.building ?? null,
		scorecard: null
	};
	if (data.ground?.census) {
		const c = data.ground.census;
		intel.laborNote = c.medianIncome ? `ACS tract ${c.geoid}: median household income ${c.medianIncome.toLocaleString("en-US", {
			style: "currency",
			currency: "USD",
			maximumFractionDigits: 0
		})}, bachelor+ ${c.bachelorPlusPct?.toFixed(0) ?? "n/a"}%, poverty ${c.povertyPct?.toFixed(1) ?? "n/a"}%.` : intel.laborNote;
		intel.zoningNote = data.ground.flood?.sfha ? `FEMA ${data.ground.flood.zone} is a Special Flood Hazard Area. Confirm elevation certificate before any envelope spend.` : intel.zoningNote;
	}
	const json = await grokJson("You are a spatial demographer. JSON keys: summary (90-130 words), schoolsNote, laborNote, zoningNote, trend (40-70 words). Be honest about uncertainty. No fake school ratings.", `Location ${data.pin.label} (${data.pin.lat}, ${data.pin.lng}). POI clusters: ${JSON.stringify(clusters)}. WalkScore proxy ${walkScore}. Transit ${transitScore}. ACS: ${JSON.stringify({
		geoid: data.ground?.census?.geoid,
		income: data.ground?.census?.medianIncome,
		value: data.ground?.census?.medianHomeValue,
		rent: data.ground?.census?.medianRent,
		owner: data.ground?.census?.ownerOccPct,
		vacancy: data.ground?.census?.vacancyPct,
		bachelor: data.ground?.census?.bachelorPlusPct,
		poverty: data.ground?.census?.povertyPct
	})}. FEMA: ${data.ground?.flood?.zone ?? "n/a"} sfha=${data.ground?.flood?.sfha ?? false}.`, 900);
	if (json) {
		if (typeof json.summary === "string") intel.summary = json.summary;
		if (typeof json.schoolsNote === "string") intel.schoolsNote = json.schoolsNote;
		if (typeof json.laborNote === "string") intel.laborNote = json.laborNote;
		if (typeof json.zoningNote === "string") intel.zoningNote = json.zoningNote;
		if (typeof json.trend === "string") intel.trend = json.trend;
		intel.enriched = true;
	}
	return {
		ok: true,
		intel
	};
});
var generateCampaign_createServerFn_handler = createServerRpc({
	id: "ea17c7b19480b7b20f8e9acb28c21eb16498146191b7e49388a282048c4b0ec5",
	name: "generateCampaign",
	filename: "src/lib/server/analyze.ts"
}, (opts) => generateCampaign.__executeServer(opts));
var generateCampaign = createServerFn({ method: "POST" }).validator((input) => ({
	pins: array(any()).max(12).parse(input.pins),
	industry: string().max(80).parse(input.industry || "Garage Doors"),
	neighborhood: string().max(80).parse(input.neighborhood || "the target zone")
})).handler(generateCampaign_createServerFn_handler, async ({ data }) => {
	const fallback = () => data.pins.map((p, i) => ({
		id: p.id || `pg_${i}`,
		address: p.address || p.label,
		headline: `${data.industry} that photographs on ${p.address || "this street"}`,
		summary: `Personalized ${data.industry.toLowerCase()} one-pager for ${p.label} in ${data.neighborhood}. Before/after render, modeled ROI, and a same-week inspect CTA.`,
		cta: "Book a 15-minute site check"
	}));
	const json = await grokJson("Return JSON { items: [{ address, headline, summary, cta }] } — one item per address. Headlines under 10 words, no emoji, contractor-credible.", `Industry: ${data.industry}. Neighborhood: ${data.neighborhood}. Addresses:\n${data.pins.map((p) => p.label).join("\n")}`, 1200);
	if (json && Array.isArray(json.items)) {
		const items = json.items;
		return {
			ok: true,
			pages: data.pins.map((p, i) => ({
				id: p.id,
				address: items[i]?.address || p.address,
				headline: items[i]?.headline || `${data.industry} for ${p.address}`,
				summary: items[i]?.summary || "",
				cta: items[i]?.cta || "Request a site check"
			}))
		};
	}
	return {
		ok: true,
		pages: fallback()
	};
});
var askAnalyst_createServerFn_handler = createServerRpc({
	id: "b9e2a7d9b54e536476a3788c5f7a1c30e5dd66333cd9fc179f5272b1068690a4",
	name: "askAnalyst",
	filename: "src/lib/server/analyze.ts"
}, (opts) => askAnalyst.__executeServer(opts));
var askAnalyst = createServerFn({ method: "POST" }).validator((input) => ({
	question: string().trim().min(4).max(600).parse(input.question),
	context: string().max(8e3).parse(input.context)
})).handler(askAnalyst_createServerFn_handler, async ({ data }) => {
	return {
		ok: true,
		text: await grokText("You are PropertyInsight's underwriting analyst for ODASI. Answer in 120-180 words. Use the provided dossier numbers. Never invent sold comps. No emoji. Be direct: cheapest highest-return option first, then risks.", `DOSSIER:\n${data.context}\n\nQUESTION:\n${data.question}`, 500) || "I can underwrite from the modeled dossier even without the live model: cheapest class-lift first, do not over-improve, and treat insurance and access as gates. Re-ask after a parcel is selected if this looks empty."
	};
});
//#endregion
export { analyzeNeighborhood_createServerFn_handler, analyzeProperty_createServerFn_handler, askAnalyst_createServerFn_handler, generateCampaign_createServerFn_handler };
