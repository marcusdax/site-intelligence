import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { a as number } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/osint-Bm-5MNxU.js
var UA = "PropertyInsight/1.0 (ODASI; property-intelligence; contact@odasi.local)";
var quakeCache = {
	at: 0,
	items: []
};
var flightCache = /* @__PURE__ */ new Map();
var fetchQuakes_createServerFn_handler = createServerRpc({
	id: "bc4e674d2387fe30846b5861036476b6f419d7eb6f97c7b6fd060076aa1515e7",
	name: "fetchQuakes",
	filename: "src/lib/server/osint.ts"
}, (opts) => fetchQuakes.__executeServer(opts));
var fetchQuakes = createServerFn({ method: "POST" }).handler(fetchQuakes_createServerFn_handler, async () => {
	if (Date.now() - quakeCache.at < 6e4 && quakeCache.items.length) return {
		ok: true,
		quakes: quakeCache.items
	};
	const res = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson", { headers: {
		"User-Agent": UA,
		Accept: "application/json"
	} });
	if (!res.ok) return {
		ok: false,
		error: `USGS ${res.status}`,
		quakes: []
	};
	const json = await res.json();
	const quakes = [];
	for (const f of json.features ?? []) {
		const c = f.geometry?.coordinates;
		const mag = Number(f.properties?.mag ?? 0);
		if (!c || mag < 3) continue;
		quakes.push({
			id: String(f.id ?? quakes.length),
			mag,
			place: String(f.properties?.place ?? ""),
			lng: Number(c[0]),
			lat: Number(c[1]),
			depthKm: Number(c[2] ?? 0),
			time: Number(f.properties?.time ?? 0)
		});
		if (quakes.length >= 60) break;
	}
	quakeCache.at = Date.now();
	quakeCache.items = quakes;
	return {
		ok: true,
		quakes
	};
});
var fetchFlights_createServerFn_handler = createServerRpc({
	id: "4548ea896b5b5c4430c1ac320f4d66da6f27e1de32b073712b88a15268b0f7d9",
	name: "fetchFlights",
	filename: "src/lib/server/osint.ts"
}, (opts) => fetchFlights.__executeServer(opts));
var fetchFlights = createServerFn({ method: "POST" }).validator((input) => ({
	lamin: number().parse(input.lamin),
	lomin: number().parse(input.lomin),
	lamax: number().parse(input.lamax),
	lomax: number().parse(input.lomax)
})).handler(fetchFlights_createServerFn_handler, async ({ data }) => {
	const key = [
		data.lamin,
		data.lomin,
		data.lamax,
		data.lomax
	].map((n) => n.toFixed(1)).join(":");
	const hit = flightCache.get(key);
	if (hit && Date.now() - hit.at < 12e3) return {
		ok: true,
		flights: hit.items
	};
	const url = new URL("https://opensky-network.org/api/states/all");
	url.searchParams.set("lamin", String(data.lamin));
	url.searchParams.set("lomin", String(data.lomin));
	url.searchParams.set("lamax", String(data.lamax));
	url.searchParams.set("lomax", String(data.lomax));
	try {
		const res = await fetch(url, { headers: { "User-Agent": UA } });
		if (!res.ok) return {
			ok: true,
			flights: [],
			degraded: true
		};
		const json = await res.json();
		const flights = [];
		for (const s of json.states ?? []) {
			const lat = Number(s[6]);
			const lng = Number(s[5]);
			if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
			flights.push({
				icao: String(s[0] ?? ""),
				callsign: String(s[1] ?? "").trim() || "——",
				lng,
				lat,
				alt: s[7] == null ? null : Number(s[7]),
				heading: s[10] == null ? null : Number(s[10]),
				velocity: s[9] == null ? null : Number(s[9]),
				origin: s[2] ? String(s[2]) : null
			});
			if (flights.length >= 90) break;
		}
		flightCache.set(key, {
			at: Date.now(),
			items: flights
		});
		return {
			ok: true,
			flights
		};
	} catch {
		return {
			ok: true,
			flights: [],
			degraded: true
		};
	}
});
//#endregion
export { fetchFlights_createServerFn_handler, fetchQuakes_createServerFn_handler };
