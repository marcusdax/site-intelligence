import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const UA = "PropertyInsight/1.0 (ODASI; property-intelligence; contact@odasi.local)";

export type Quake = {
  id: string;
  mag: number;
  place: string;
  lat: number;
  lng: number;
  depthKm: number;
  time: number;
};

export type Flight = {
  icao: string;
  callsign: string;
  lat: number;
  lng: number;
  alt: number | null;
  heading: number | null;
  velocity: number | null;
  origin: string | null;
};

const quakeCache: { at: number; items: Quake[] } = { at: 0, items: [] };
const flightCache = new Map<string, { at: number; items: Flight[] }>();

export const fetchQuakes = createServerFn({ method: "POST" }).handler(async () => {
  if (Date.now() - quakeCache.at < 60_000 && quakeCache.items.length) {
    return { ok: true as const, quakes: quakeCache.items };
  }
  const res = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson", {
    headers: { "User-Agent": UA, Accept: "application/json" },
  });
  if (!res.ok) return { ok: false as const, error: `USGS ${res.status}`, quakes: [] as Quake[] };
  const json = (await res.json()) as {
    features?: {
      id?: string;
      properties?: { mag?: number; place?: string; time?: number };
      geometry?: { coordinates?: number[] };
    }[];
  };
  const quakes: Quake[] = [];
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
      time: Number(f.properties?.time ?? 0),
    });
    if (quakes.length >= 60) break;
  }
  quakeCache.at = Date.now();
  quakeCache.items = quakes;
  return { ok: true as const, quakes };
});

export const fetchFlights = createServerFn({ method: "POST" })
  .validator((input: { lamin: number; lomin: number; lamax: number; lomax: number }) => ({
    lamin: z.number().parse(input.lamin),
    lomin: z.number().parse(input.lomin),
    lamax: z.number().parse(input.lamax),
    lomax: z.number().parse(input.lomax),
  }))
  .handler(async ({ data }) => {
    const key = [data.lamin, data.lomin, data.lamax, data.lomax].map((n) => n.toFixed(1)).join(":");
    const hit = flightCache.get(key);
    if (hit && Date.now() - hit.at < 12_000) return { ok: true as const, flights: hit.items };
    const url = new URL("https://opensky-network.org/api/states/all");
    url.searchParams.set("lamin", String(data.lamin));
    url.searchParams.set("lomin", String(data.lomin));
    url.searchParams.set("lamax", String(data.lamax));
    url.searchParams.set("lomax", String(data.lomax));
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (!res.ok) return { ok: true as const, flights: [] as Flight[], degraded: true };
      const json = (await res.json()) as { states?: unknown[][] };
      const flights: Flight[] = [];
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
          origin: s[2] ? String(s[2]) : null,
        });
        if (flights.length >= 90) break;
      }
      flightCache.set(key, { at: Date.now(), items: flights });
      return { ok: true as const, flights };
    } catch {
      return { ok: true as const, flights: [] as Flight[], degraded: true };
    }
  });
