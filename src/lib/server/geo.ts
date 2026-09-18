import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Amenity, GeocodeHit, PropertyPin } from "@/lib/types";
import { haversineMeters, id } from "@/lib/utils";

const UA = "PropertyInsight/1.0 (ODASI; property-intelligence; contact@odasi.local)";

let lastNominatim = 0;
async function nominatimGate() {
  const wait = 1100 - (Date.now() - lastNominatim);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastNominatim = Date.now();
}

function hitFromNominatim(row: Record<string, unknown>, i: number): GeocodeHit {
  const a = (row.address ?? {}) as Record<string, string>;
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
    neighborhood: a.neighbourhood || a.suburb || a.quarter || undefined,
    county: a.county,
  };
}

function abbreviateState(name: string): string {
  const map: Record<string, string> = {
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
    Connecticut: "CT",
  };
  return map[name] || name.slice(0, 2).toUpperCase();
}

export const searchAddress = createServerFn({ method: "POST" })
  .validator((input: { q: string }) => {
    const q = z.string().trim().min(2).max(180).parse(input.q);
    return { q };
  })
  .handler(async ({ data }) => {
    await nominatimGate();
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", data.q);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("limit", "6");
    url.searchParams.set("countrycodes", "us");
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
    if (!res.ok) return { ok: false as const, error: `Geocoder ${res.status}` };
    const json = (await res.json()) as Record<string, unknown>[];
    return { ok: true as const, hits: json.map(hitFromNominatim) };
  });

export const reverseGeocode = createServerFn({ method: "POST" })
  .validator((input: { lat: number; lng: number }) => ({
    lat: z.number().min(-90).max(90).parse(input.lat),
    lng: z.number().min(-180).max(180).parse(input.lng),
  }))
  .handler(async ({ data }) => {
    await nominatimGate();
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("lat", String(data.lat));
    url.searchParams.set("lon", String(data.lng));
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("zoom", "18");
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
    if (!res.ok) {
      const hit: GeocodeHit = {
        id: id("pin"),
        label: `${data.lat.toFixed(5)}, ${data.lng.toFixed(5)}`,
        address: "Dropped pin",
        city: "",
        state: "",
        postcode: "",
        lat: data.lat,
        lng: data.lng,
      };
      return { ok: true as const, hit, degraded: true };
    }
    const json = (await res.json()) as Record<string, unknown>;
    const hit = hitFromNominatim(json, 0);
    hit.lat = data.lat;
    hit.lng = data.lng;
    return { ok: true as const, hit, degraded: false };
  });

type OsmEl = {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

async function overpass(query: string): Promise<OsmEl[]> {
  const endpoints = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
  ];
  let lastErr = "Overpass unavailable";
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": UA },
        body: `data=${encodeURIComponent(query)}`,
      });
      if (!res.ok) {
        lastErr = `Overpass ${res.status}`;
        continue;
      }
      const json = (await res.json()) as { elements?: OsmEl[] };
      return json.elements ?? [];
    } catch (e) {
      lastErr = e instanceof Error ? e.message : "Overpass failed";
    }
  }
  throw new Error(lastErr);
}

function elCoord(el: OsmEl) {
  return {
    lat: el.lat ?? el.center?.lat ?? 0,
    lng: el.lon ?? el.center?.lon ?? 0,
  };
}

function amenityKind(tags: Record<string, string> | undefined): string {
  if (!tags) return "place";
  return (
    tags.amenity ||
    tags.leisure ||
    tags.shop ||
    tags.railway ||
    tags.public_transport ||
    tags.highway ||
    "place"
  );
}

export const fetchAmenities = createServerFn({ method: "POST" })
  .validator((input: { lat: number; lng: number; radiusM: number }) => ({
    lat: z.number().parse(input.lat),
    lng: z.number().parse(input.lng),
    radiusM: z.number().min(80).max(4000).parse(input.radiusM),
  }))
  .handler(async ({ data }) => {
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
      const els = await overpass(q);
      const amenities: Amenity[] = els
        .map((el) => {
          const { lat, lng } = elCoord(el);
          return {
            id: `${el.type}/${el.id}`,
            name: el.tags?.name || amenityKind(el.tags),
            kind: amenityKind(el.tags),
            lat,
            lng,
            distanceM: haversineMeters({ lat: data.lat, lng: data.lng }, { lat, lng }),
          };
        })
        .filter((a) => a.lat && a.lng)
        .sort((a, b) => a.distanceM - b.distanceM)
        .slice(0, 60);
      return { ok: true as const, amenities };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Amenities failed", amenities: [] as Amenity[] };
    }
  });

export const scanGeofence = createServerFn({ method: "POST" })
  .validator((input: { lat: number; lng: number; radiusM: number; polygon?: [number, number][] }) => ({
    lat: z.number().parse(input.lat),
    lng: z.number().parse(input.lng),
    radiusM: z.number().min(120).max(3200).parse(input.radiusM),
    polygon: input.polygon
      ? z.array(z.tuple([z.number(), z.number()])).min(3).max(24).parse(input.polygon)
      : undefined,
  }))
  .handler(async ({ data }) => {
    const spatial = data.polygon
      ? `(poly:"${data.polygon.map(([lat, lng]) => `${lat} ${lng}`).join(" ")}")`
      : `(around:${data.radiusM},${data.lat},${data.lng})`;
    const q = `[out:json][timeout:25];
(
  way["building"]["addr:housenumber"]${spatial};
  node["addr:housenumber"]["addr:street"]${spatial};
);
out center 64;`;
    try {
      const els = await overpass(q);
      const seen = new Set<string>();
      const hits: PropertyPin[] = [];
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
          source: "geofence",
        });
        if (hits.length >= 48) break;
      }
      return { ok: true as const, hits };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Scan failed", hits: [] as PropertyPin[] };
    }
  });
