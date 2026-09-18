import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { a as haversineMeters, o as id } from "./utils-BOIfZi7B.mjs";
import { a as number, s as string } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/geo-BiuCPRG_.js
var UA = "PropertyInsight/1.0 (ODASI; property-intelligence; contact@odasi.local)";
var lastNominatim = 0;
async function nominatimGate() {
	const wait = 1100 - (Date.now() - lastNominatim);
	if (wait > 0) await new Promise((r) => setTimeout(r, wait));
	lastNominatim = Date.now();
}
function hitFromNominatim(row, i) {
	const a = row.address ?? {};
	const house = [a.house_number, a.road].filter(Boolean).join(" ");
	const city = a.city || a.town || a.village || a.municipality || a.county || "";
	const state = a.state_code || a.state || "";
	const label = String(row.display_name ?? "");
	return {
		id: String(row.place_id ?? `geo_${i}`),
		label,
		address: house || label.split(",")[0] || "Pinned location",
		city,
		state: state.length === 2 ? state : abbreviateState(state),
		postcode: a.postcode || "",
		lat: Number(row.lat),
		lng: Number(row.lon),
		neighborhood: a.neighbourhood || a.suburb || a.quarter || void 0,
		county: a.county
	};
}
function abbreviateState(name) {
	return {
		Texas: "TX",
		Florida: "FL",
		Oklahoma: "OK",
		Arizona: "AZ",
		Colorado: "CO",
		Georgia: "GA",
		Illinois: "IL",
		California: "CA",
		"New York": "NY",
		Ohio: "OH",
		Pennsylvania: "PA",
		Michigan: "MI",
		"North Carolina": "NC",
		"South Carolina": "SC",
		Virginia: "VA",
		Washington: "WA",
		Oregon: "OR",
		Nevada: "NV",
		Tennessee: "TN",
		Missouri: "MO",
		Kansas: "KS",
		Nebraska: "NE",
		Louisiana: "LA",
		Alabama: "AL",
		Mississippi: "MS",
		Arkansas: "AR",
		Minnesota: "MN",
		Wisconsin: "WI",
		Indiana: "IN",
		Kentucky: "KY",
		Maryland: "MD",
		Massachusetts: "MA",
		"New Jersey": "NJ",
		Utah: "UT",
		"New Mexico": "NM",
		Iowa: "IA",
		Connecticut: "CT"
	}[name] || name.slice(0, 2).toUpperCase();
}
var searchAddress_createServerFn_handler = createServerRpc({
	id: "b3efc04aff8c4069056ac148ae822f19c19c0cc0728b8876fe34f1aa056b9a21",
	name: "searchAddress",
	filename: "src/lib/server/geo.ts"
}, (opts) => searchAddress.__executeServer(opts));
var searchAddress = createServerFn({ method: "POST" }).validator((input) => {
	return { q: string().trim().min(2).max(180).parse(input.q) };
}).handler(searchAddress_createServerFn_handler, async ({ data }) => {
	await nominatimGate();
	const url = new URL("https://nominatim.openstreetmap.org/search");
	url.searchParams.set("q", data.q);
	url.searchParams.set("format", "jsonv2");
	url.searchParams.set("addressdetails", "1");
	url.searchParams.set("limit", "6");
	url.searchParams.set("countrycodes", "us");
	const res = await fetch(url, { headers: {
		"User-Agent": UA,
		Accept: "application/json"
	} });
	if (!res.ok) return {
		ok: false,
		error: `Geocoder ${res.status}`
	};
	return {
		ok: true,
		hits: (await res.json()).map(hitFromNominatim)
	};
});
var reverseGeocode_createServerFn_handler = createServerRpc({
	id: "6aca30eeffc03e3b8e7fa2fde75f248da391620a2d5de592a10406a13c4305dc",
	name: "reverseGeocode",
	filename: "src/lib/server/geo.ts"
}, (opts) => reverseGeocode.__executeServer(opts));
var reverseGeocode = createServerFn({ method: "POST" }).validator((input) => ({
	lat: number().min(-90).max(90).parse(input.lat),
	lng: number().min(-180).max(180).parse(input.lng)
})).handler(reverseGeocode_createServerFn_handler, async ({ data }) => {
	await nominatimGate();
	const url = new URL("https://nominatim.openstreetmap.org/reverse");
	url.searchParams.set("lat", String(data.lat));
	url.searchParams.set("lon", String(data.lng));
	url.searchParams.set("format", "jsonv2");
	url.searchParams.set("addressdetails", "1");
	url.searchParams.set("zoom", "18");
	const res = await fetch(url, { headers: {
		"User-Agent": UA,
		Accept: "application/json"
	} });
	if (!res.ok) return {
		ok: true,
		hit: {
			id: id("pin"),
			label: `${data.lat.toFixed(5)}, ${data.lng.toFixed(5)}`,
			address: "Dropped pin",
			city: "",
			state: "",
			postcode: "",
			lat: data.lat,
			lng: data.lng
		},
		degraded: true
	};
	const hit = hitFromNominatim(await res.json(), 0);
	hit.lat = data.lat;
	hit.lng = data.lng;
	return {
		ok: true,
		hit,
		degraded: false
	};
});
async function overpass(query) {
	const endpoints = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter"];
	let lastErr = "Overpass unavailable";
	for (const ep of endpoints) try {
		const res = await fetch(ep, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"User-Agent": UA
			},
			body: `data=${encodeURIComponent(query)}`
		});
		if (!res.ok) {
			lastErr = `Overpass ${res.status}`;
			continue;
		}
		return (await res.json()).elements ?? [];
	} catch (e) {
		lastErr = e instanceof Error ? e.message : "Overpass failed";
	}
	throw new Error(lastErr);
}
function elCoord(el) {
	return {
		lat: el.lat ?? el.center?.lat ?? 0,
		lng: el.lon ?? el.center?.lon ?? 0
	};
}
function amenityKind(tags) {
	if (!tags) return "place";
	return tags.amenity || tags.leisure || tags.shop || tags.railway || tags.public_transport || tags.highway || "place";
}
var fetchAmenities_createServerFn_handler = createServerRpc({
	id: "b7bcf0e48cdb6783cd5366ceb0a6db6de6fe672fff6009aa4400afbe69232141",
	name: "fetchAmenities",
	filename: "src/lib/server/geo.ts"
}, (opts) => fetchAmenities.__executeServer(opts));
var fetchAmenities = createServerFn({ method: "POST" }).validator((input) => ({
	lat: number().parse(input.lat),
	lng: number().parse(input.lng),
	radiusM: number().min(80).max(4e3).parse(input.radiusM)
})).handler(fetchAmenities_createServerFn_handler, async ({ data }) => {
	const q = `[out:json][timeout:18];
(
  node["amenity"~"school|kindergarten|university|library|hospital|clinic|pharmacy|cafe|restaurant|bank|place_of_worship|fuel"](around:${data.radiusM},${data.lat},${data.lng});
  node["leisure"~"park|playground|fitness_centre|recreation_ground"](around:${data.radiusM},${data.lat},${data.lng});
  node["shop"~"supermarket|convenience|hardware|doityourself"](around:${data.radiusM},${data.lat},${data.lng});
  node["public_transport"="station"](around:${data.radiusM},${data.lat},${data.lng});
  node["railway"~"station|tram_stop"](around:${data.radiusM},${data.lat},${data.lng});
  node["highway"="bus_stop"](around:${data.radiusM},${data.lat},${data.lng});
);
out body 90;`;
	try {
		return {
			ok: true,
			amenities: (await overpass(q)).map((el) => {
				const { lat, lng } = elCoord(el);
				return {
					id: `${el.type}/${el.id}`,
					name: el.tags?.name || amenityKind(el.tags),
					kind: amenityKind(el.tags),
					lat,
					lng,
					distanceM: haversineMeters({
						lat: data.lat,
						lng: data.lng
					}, {
						lat,
						lng
					})
				};
			}).filter((a) => a.lat && a.lng).sort((a, b) => a.distanceM - b.distanceM).slice(0, 60)
		};
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : "Amenities failed",
			amenities: []
		};
	}
});
var scanGeofence_createServerFn_handler = createServerRpc({
	id: "d74fa70d7d149500ae13ad308c37cebb78104aa55f623595be00c7a799f1cb78",
	name: "scanGeofence",
	filename: "src/lib/server/geo.ts"
}, (opts) => scanGeofence.__executeServer(opts));
var scanGeofence = createServerFn({ method: "POST" }).validator((input) => ({
	lat: number().parse(input.lat),
	lng: number().parse(input.lng),
	radiusM: number().min(120).max(3200).parse(input.radiusM)
})).handler(scanGeofence_createServerFn_handler, async ({ data }) => {
	const q = `[out:json][timeout:20];
(
  way["building"]["addr:housenumber"](around:${data.radiusM},${data.lat},${data.lng});
  node["addr:housenumber"]["addr:street"](around:${data.radiusM},${data.lat},${data.lng});
);
out center 48;`;
	try {
		const els = await overpass(q);
		const seen = /* @__PURE__ */ new Set();
		const hits = [];
		for (const el of els) {
			const { lat, lng } = elCoord(el);
			const tags = el.tags ?? {};
			const street = [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" ");
			if (!street || seen.has(street)) continue;
			seen.add(street);
			const city = tags["addr:city"] || "";
			const state = tags["addr:state"] || "";
			hits.push({
				id: `${el.type}/${el.id}`,
				label: `${street}${city ? `, ${city}` : ""}`,
				address: street,
				city,
				state: state.length === 2 ? state : abbreviateState(state),
				postcode: tags["addr:postcode"] || "",
				lat,
				lng,
				source: "geofence"
			});
			if (hits.length >= 36) break;
		}
		return {
			ok: true,
			hits
		};
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : "Scan failed",
			hits: []
		};
	}
});
//#endregion
export { fetchAmenities_createServerFn_handler, reverseGeocode_createServerFn_handler, scanGeofence_createServerFn_handler, searchAddress_createServerFn_handler };
