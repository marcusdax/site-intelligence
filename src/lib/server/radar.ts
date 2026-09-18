import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { nearestNexrad } from "@/lib/nexrad-sites";

const UA = "PropertyInsight/1.0 (ODASI; property-intelligence; contact@odasi.local)";

export type RadarFrame = {
  time: number;
  path: string;
  kind: "past" | "nowcast";
};

export type WeatherAlert = {
  id: string;
  event: string;
  headline: string;
  severity: string;
  urgency: string;
  certainty: string;
  area: string;
  sent: string;
  expires: string | null;
  instruction: string;
  source: "nws" | "iem";
  centroid: { lat: number; lng: number } | null;
  ring: [number, number][] | null;
};

function ringFromGeom(geom: unknown): { ring: [number, number][] | null; centroid: { lat: number; lng: number } | null } {
  if (!geom || typeof geom !== "object") return { ring: null, centroid: null };
  const g = geom as { type?: string; coordinates?: unknown };
  let coords: number[][] | null = null;
  if (g.type === "Polygon" && Array.isArray(g.coordinates)) {
    coords = g.coordinates[0] as number[][];
  } else if (g.type === "MultiPolygon" && Array.isArray(g.coordinates)) {
    const first = g.coordinates[0] as number[][][];
    coords = first?.[0] ?? null;
  }
  if (!coords || coords.length < 3) return { ring: null, centroid: null };
  const ring: [number, number][] = [];
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
  if (ring.length < 3) return { ring: null, centroid: null };
  return { ring, centroid: { lat: slat / ring.length, lng: slng / ring.length } };
}

const STORM_EVENTS = /tornado|thunderstorm|flash flood|hurricane|tropical storm|severe weather/i;

export const fetchRadarCatalog = createServerFn({ method: "POST" }).handler(async () => {
  const res = await fetch("https://api.rainviewer.com/public/weather-maps.json", {
    headers: { Accept: "application/json", "User-Agent": UA },
  });
  if (!res.ok) return { ok: false as const, error: `Radar catalog ${res.status}` };
  const json = (await res.json()) as {
    host?: string;
    radar?: { past?: { time: number; path: string }[]; nowcast?: { time: number; path: string }[] };
    satellite?: { infrared?: { time: number; path: string }[] };
  };
  const host = json.host || "https://tilecache.rainviewer.com";
  const past = (json.radar?.past ?? []).map((f) => ({ ...f, kind: "past" as const }));
  const nowcast = (json.radar?.nowcast ?? []).map((f) => ({ ...f, kind: "nowcast" as const }));
  const infrared = (json.satellite?.infrared ?? []).map((f) => ({ time: f.time, path: f.path }));
  const frames: RadarFrame[] = [...past, ...nowcast];
  return { ok: true as const, host, frames, infrared };
});

function mapNwsFeature(f: {
  id?: string;
  properties?: Record<string, unknown>;
  geometry?: unknown;
}): WeatherAlert | null {
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
    ring,
  };
}

async function nwsAlerts(): Promise<WeatherAlert[]> {
  const url =
    "https://api.weather.gov/alerts/active?status=actual&message_type=alert&event=Tornado%20Warning,Severe%20Thunderstorm%20Warning,Tornado%20Watch,Severe%20Thunderstorm%20Watch,Flash%20Flood%20Warning,Hurricane%20Warning,Tropical%20Storm%20Warning";
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/geo+json" },
  });
  if (!res.ok) throw new Error(`NWS ${res.status}`);
  const json = (await res.json()) as { features?: { id?: string; properties?: Record<string, unknown>; geometry?: unknown }[] };
  const out: WeatherAlert[] = [];
  for (const f of json.features ?? []) {
    const a = mapNwsFeature(f);
    if (a) out.push(a);
    if (out.length >= 80) break;
  }
  return out;
}

async function iemAlerts(): Promise<WeatherAlert[]> {
  const res = await fetch("https://mesonet.agron.iastate.edu/geojson/sbw.geojson", {
    headers: { "User-Agent": UA, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`IEM ${res.status}`);
  const json = (await res.json()) as {
    features?: { id?: string | number; properties?: Record<string, unknown>; geometry?: unknown }[];
  };
  const out: WeatherAlert[] = [];
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
      ring,
    });
    if (out.length >= 80) break;
  }
  return out;
}

export const fetchStormAlerts = createServerFn({ method: "POST" }).handler(async () => {
  try {
    const alerts = await nwsAlerts();
    if (alerts.length) return { ok: true as const, alerts, source: "nws" as const };
  } catch {
    /* fall through */
  }
  try {
    const alerts = await iemAlerts();
    return { ok: true as const, alerts, source: "iem" as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Alerts failed", alerts: [] as WeatherAlert[] };
  }
});

export const fetchNhcStorms = createServerFn({ method: "POST" }).handler(async () => {
  try {
    const res = await fetch("https://www.nhc.noaa.gov/CurrentStorms.json", {
      headers: { "User-Agent": UA, Accept: "application/json" },
    });
    if (!res.ok) return { ok: true as const, storms: [] as { id: string; name: string; lat: number; lng: number; class: string }[] };
    const json = (await res.json()) as {
      activeStorms?: { id?: string; name?: string; latitude?: number; longitude?: number; classification?: string }[];
    };
    const storms = (json.activeStorms ?? [])
      .map((s) => ({
        id: String(s.id ?? s.name ?? ""),
        name: String(s.name ?? "Unnamed"),
        lat: Number(s.latitude),
        lng: Number(s.longitude),
        class: String(s.classification ?? ""),
      }))
      .filter((s) => Number.isFinite(s.lat) && Number.isFinite(s.lng));
    return { ok: true as const, storms };
  } catch {
    return { ok: true as const, storms: [] as { id: string; name: string; lat: number; lng: number; class: string }[] };
  }
});

export const nearestRadars = createServerFn({ method: "POST" })
  .validator((input: { lat: number; lng: number }) => ({
    lat: z.number().min(-90).max(90).parse(input.lat),
    lng: z.number().min(-180).max(180).parse(input.lng),
  }))
  .handler(async ({ data }) => {
    return { ok: true as const, sites: nearestNexrad(data.lat, data.lng, 6) };
  });
