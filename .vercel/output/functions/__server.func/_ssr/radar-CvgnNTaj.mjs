import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { a as number } from "../_libs/zod.mjs";
import { n as nearestNexrad } from "./nexrad-sites-DRRFcsfk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/radar-CvgnNTaj.js
var UA = "PropertyInsight/1.0 (ODASI; property-intelligence; contact@odasi.local)";
function ringFromGeom(geom) {
	if (!geom || typeof geom !== "object") return {
		ring: null,
		centroid: null
	};
	const g = geom;
	let coords = null;
	if (g.type === "Polygon" && Array.isArray(g.coordinates)) coords = g.coordinates[0];
	else if (g.type === "MultiPolygon" && Array.isArray(g.coordinates)) coords = g.coordinates[0]?.[0] ?? null;
	if (!coords || coords.length < 3) return {
		ring: null,
		centroid: null
	};
	const ring = [];
	let slat = 0;
	let slng = 0;
	for (const pt of coords) {
		const lng = Number(pt[0]);
		const lat = Number(pt[1]);
		if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
		ring.push([lat, lng]);
		slat += lat;
		slng += lng;
	}
	if (ring.length < 3) return {
		ring: null,
		centroid: null
	};
	return {
		ring,
		centroid: {
			lat: slat / ring.length,
			lng: slng / ring.length
		}
	};
}
var STORM_EVENTS = /tornado|thunderstorm|flash flood|hurricane|tropical storm|severe weather/i;
var fetchRadarCatalog_createServerFn_handler = createServerRpc({
	id: "e07c6632c3f5d3f9bc0661daeb34542946e946611a977270ecc8365b695c5eac",
	name: "fetchRadarCatalog",
	filename: "src/lib/server/radar.ts"
}, (opts) => fetchRadarCatalog.__executeServer(opts));
var fetchRadarCatalog = createServerFn({ method: "POST" }).handler(fetchRadarCatalog_createServerFn_handler, async () => {
	const res = await fetch("https://api.rainviewer.com/public/weather-maps.json", { headers: {
		Accept: "application/json",
		"User-Agent": UA
	} });
	if (!res.ok) return {
		ok: false,
		error: `Radar catalog ${res.status}`
	};
	const json = await res.json();
	const host = json.host || "https://tilecache.rainviewer.com";
	const past = (json.radar?.past ?? []).map((f) => ({
		...f,
		kind: "past"
	}));
	const nowcast = (json.radar?.nowcast ?? []).map((f) => ({
		...f,
		kind: "nowcast"
	}));
	const infrared = (json.satellite?.infrared ?? []).map((f) => ({
		time: f.time,
		path: f.path
	}));
	return {
		ok: true,
		host,
		frames: [...past, ...nowcast],
		infrared
	};
});
function mapNwsFeature(f) {
	const p = f.properties ?? {};
	const event = String(p.event ?? "");
	if (!STORM_EVENTS.test(event)) return null;
	const { ring, centroid } = ringFromGeom(f.geometry);
	const instruction = String(p.instruction ?? p.description ?? "").slice(0, 420);
	return {
		id: String(f.id ?? p.id ?? Math.random()),
		event,
		headline: String(p.headline ?? event),
		severity: String(p.severity ?? "Unknown"),
		urgency: String(p.urgency ?? ""),
		certainty: String(p.certainty ?? ""),
		area: String(p.areaDesc ?? "").slice(0, 160),
		sent: String(p.sent ?? p.effective ?? ""),
		expires: p.expires ? String(p.expires) : null,
		instruction,
		source: "nws",
		centroid,
		ring
	};
}
async function nwsAlerts() {
	const res = await fetch("https://api.weather.gov/alerts/active?status=actual&message_type=alert&event=Tornado%20Warning,Severe%20Thunderstorm%20Warning,Tornado%20Watch,Severe%20Thunderstorm%20Watch,Flash%20Flood%20Warning,Hurricane%20Warning,Tropical%20Storm%20Warning", { headers: {
		"User-Agent": UA,
		Accept: "application/geo+json"
	} });
	if (!res.ok) throw new Error(`NWS ${res.status}`);
	const json = await res.json();
	const out = [];
	for (const f of json.features ?? []) {
		const a = mapNwsFeature(f);
		if (a) out.push(a);
		if (out.length >= 80) break;
	}
	return out;
}
async function iemAlerts() {
	const res = await fetch("https://mesonet.agron.iastate.edu/geojson/sbw.geojson", { headers: {
		"User-Agent": UA,
		Accept: "application/json"
	} });
	if (!res.ok) throw new Error(`IEM ${res.status}`);
	const json = await res.json();
	const out = [];
	for (const f of json.features ?? []) {
		const p = f.properties ?? {};
		const event = String(p.ps ?? p.wfo ?? p.phenomena ?? "Severe");
		const { ring, centroid } = ringFromGeom(f.geometry);
		out.push({
			id: `iem_${f.id ?? out.length}`,
			event: String(p.ps_name ?? p.event ?? event),
			headline: String(p.ps_name ?? event),
			severity: /TOR|tornado/i.test(String(p.phenomena ?? p.ps ?? "")) ? "Extreme" : "Severe",
			urgency: "Immediate",
			certainty: "Observed",
			area: String(p.wfo ?? ""),
			sent: String(p.issue ?? p.valid ?? ""),
			expires: p.expire ? String(p.expire) : null,
			instruction: "",
			source: "iem",
			centroid,
			ring
		});
		if (out.length >= 80) break;
	}
	return out;
}
var fetchStormAlerts_createServerFn_handler = createServerRpc({
	id: "dcbac4e0f07ebfd489c0027d24534914a4dd8c0d2c2cde3bf1d1870217671935",
	name: "fetchStormAlerts",
	filename: "src/lib/server/radar.ts"
}, (opts) => fetchStormAlerts.__executeServer(opts));
var fetchStormAlerts = createServerFn({ method: "POST" }).handler(fetchStormAlerts_createServerFn_handler, async () => {
	try {
		const alerts = await nwsAlerts();
		if (alerts.length) return {
			ok: true,
			alerts,
			source: "nws"
		};
	} catch {}
	try {
		return {
			ok: true,
			alerts: await iemAlerts(),
			source: "iem"
		};
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : "Alerts failed",
			alerts: []
		};
	}
});
var fetchNhcStorms_createServerFn_handler = createServerRpc({
	id: "1906309b02009289551e47815683f9964e9bff579a933c64b16a3ff6fa684a11",
	name: "fetchNhcStorms",
	filename: "src/lib/server/radar.ts"
}, (opts) => fetchNhcStorms.__executeServer(opts));
var fetchNhcStorms = createServerFn({ method: "POST" }).handler(fetchNhcStorms_createServerFn_handler, async () => {
	try {
		const res = await fetch("https://www.nhc.noaa.gov/CurrentStorms.json", { headers: {
			"User-Agent": UA,
			Accept: "application/json"
		} });
		if (!res.ok) return {
			ok: true,
			storms: []
		};
		return {
			ok: true,
			storms: ((await res.json()).activeStorms ?? []).map((s) => ({
				id: String(s.id ?? s.name ?? ""),
				name: String(s.name ?? "Unnamed"),
				lat: Number(s.latitude),
				lng: Number(s.longitude),
				class: String(s.classification ?? "")
			})).filter((s) => Number.isFinite(s.lat) && Number.isFinite(s.lng))
		};
	} catch {
		return {
			ok: true,
			storms: []
		};
	}
});
var nearestRadars_createServerFn_handler = createServerRpc({
	id: "ac145873f96ff06f1988ec02e19f10d881e32015f37b4c2373ea448ab668c7e9",
	name: "nearestRadars",
	filename: "src/lib/server/radar.ts"
}, (opts) => nearestRadars.__executeServer(opts));
var nearestRadars = createServerFn({ method: "POST" }).validator((input) => ({
	lat: number().min(-90).max(90).parse(input.lat),
	lng: number().min(-180).max(180).parse(input.lng)
})).handler(nearestRadars_createServerFn_handler, async ({ data }) => {
	return {
		ok: true,
		sites: nearestNexrad(data.lat, data.lng, 6)
	};
});
//#endregion
export { fetchNhcStorms_createServerFn_handler, fetchRadarCatalog_createServerFn_handler, fetchStormAlerts_createServerFn_handler, nearestRadars_createServerFn_handler };
