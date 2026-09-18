import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { BuildingIntel, CensusTract, FloodIntel, GroundTruth } from "@/lib/types";

const UA = "PropertyInsight/1.0 (ODASI; property-intelligence; contact@odasi.local)";

function acsNum(v: unknown): number | null {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= -1e5) return null;
  return n;
}

async function fetchJson(url: string, ms = 10000): Promise<unknown | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      signal: AbortSignal.timeout(ms),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

type GeoRow = Record<string, unknown>;

function pickGeo(block: unknown): GeoRow | null {
  if (!Array.isArray(block) || !block[0] || typeof block[0] !== "object") return null;
  return block[0] as GeoRow;
}

async function geocodeTract(lat: number, lng: number): Promise<{
  geoid: string;
  name: string;
  stateFips: string;
  countyFips: string;
  tract: string;
} | null> {
  const url = new URL("https://geocoding.geo.census.gov/geocoder/geographies/coordinates");
  url.searchParams.set("x", String(lng));
  url.searchParams.set("y", String(lat));
  url.searchParams.set("benchmark", "Public_AR_Current");
  url.searchParams.set("vintage", "Current_Current");
  url.searchParams.set("format", "json");
  const json = (await fetchJson(url.toString(), 12000)) as {
    result?: { geographies?: Record<string, unknown> };
  } | null;
  const geos = json?.result?.geographies ?? {};
  const tract =
    pickGeo(geos["Census Tracts"]) ||
    pickGeo(geos["Census Tracts (2020)"]) ||
    pickGeo(geos["2020 Census Tracts"]);
  if (!tract) return null;
  const geoid = String(tract.GEOID ?? tract.GEOID20 ?? "");
  const stateFips = String(tract.STATE ?? tract.STATEFP ?? geoid.slice(0, 2));
  const countyFips = String(tract.COUNTY ?? tract.COUNTYFP ?? geoid.slice(2, 5));
  const tractCode = String(tract.TRACT ?? tract.TRACTCE ?? geoid.slice(5));
  if (!stateFips || !countyFips || !tractCode) return null;
  return {
    geoid: geoid || `${stateFips}${countyFips}${tractCode}`,
    name: String(tract.NAME ?? tract.BASENAME ?? `Tract ${tractCode}`),
    stateFips,
    countyFips,
    tract: tractCode.padStart(6, "0"),
  };
}

async function fetchAcs(stateFips: string, countyFips: string, tract: string): Promise<Partial<CensusTract>> {
  const vars = [
    "NAME",
    "B01003_001E",
    "B19013_001E",
    "B25077_001E",
    "B25003_001E",
    "B25003_002E",
    "B25003_003E",
    "B01002_001E",
    "B25064_001E",
    "B25035_001E",
    "B15003_001E",
    "B15003_022E",
    "B15003_023E",
    "B15003_024E",
    "B15003_025E",
    "B08301_001E",
    "B08301_010E",
    "B25002_001E",
    "B25002_003E",
    "B17001_001E",
    "B17001_002E",
    "B11001_001E",
  ];
  const url = `https://api.census.gov/data/2023/acs/acs5?get=${vars.join(",")}&for=tract:${tract}&in=state:${stateFips}+county:${countyFips}`;
  const json = (await fetchJson(url, 12000)) as unknown[][] | null;
  if (!Array.isArray(json) || json.length < 2) return {};
  const header = json[0]!.map((h) => String(h));
  const row = json[1]!;
  const get = (k: string) => {
    const i = header.indexOf(k);
    return i >= 0 ? row[i] : null;
  };
  const pop = acsNum(get("B01003_001E"));
  const tenure = acsNum(get("B25003_001E"));
  const owner = acsNum(get("B25003_002E"));
  const renter = acsNum(get("B25003_003E"));
  const eduBase = acsNum(get("B15003_001E"));
  const bach =
    (acsNum(get("B15003_022E")) ?? 0) +
    (acsNum(get("B15003_023E")) ?? 0) +
    (acsNum(get("B15003_024E")) ?? 0) +
    (acsNum(get("B15003_025E")) ?? 0);
  const commute = acsNum(get("B08301_001E"));
  const transit = acsNum(get("B08301_010E"));
  const units = acsNum(get("B25002_001E"));
  const vacant = acsNum(get("B25002_003E"));
  const povBase = acsNum(get("B17001_001E"));
  const pov = acsNum(get("B17001_002E"));
  const pct = (n: number | null, d: number | null) =>
    n != null && d && d > 0 ? (n / d) * 100 : null;
  return {
    name: String(get("NAME") ?? ""),
    population: pop,
    medianIncome: acsNum(get("B19013_001E")),
    medianHomeValue: acsNum(get("B25077_001E")),
    medianRent: acsNum(get("B25064_001E")),
    medianAge: acsNum(get("B01002_001E")),
    ownerOccPct: pct(owner, tenure),
    renterOccPct: pct(renter, tenure),
    vacancyPct: pct(vacant, units),
    bachelorPlusPct: pct(bach, eduBase),
    povertyPct: pct(pov, povBase),
    transitCommutePct: pct(transit, commute),
    medianYearBuilt: acsNum(get("B25035_001E")),
    households: acsNum(get("B11001_001E")),
  };
}

async function fetchTractGeometry(geoid: string): Promise<number[][][] | null> {
  const endpoints = [
    `https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Tracts_Blocks/MapServer/8/query?where=GEOID%3D%27${geoid}%27&outFields=GEOID&returnGeometry=true&outSR=4326&f=geojson`,
    `https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_ACS2023/MapServer/8/query?where=GEOID%3D%27${geoid}%27&outFields=GEOID&returnGeometry=true&outSR=4326&f=geojson`,
  ];
  for (const url of endpoints) {
    const json = (await fetchJson(url, 10000)) as {
      features?: { geometry?: { type?: string; coordinates?: unknown } }[];
    } | null;
    const geom = json?.features?.[0]?.geometry;
    if (!geom?.coordinates) continue;
    if (geom.type === "Polygon") return geom.coordinates as number[][][];
    if (geom.type === "MultiPolygon") {
      const mp = geom.coordinates as number[][][][];
      return mp[0] ?? null;
    }
  }
  return null;
}

async function fetchFlood(lat: number, lng: number): Promise<FloodIntel | null> {
  const url =
    `https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28/query` +
    `?geometry=${lng},${lat}&geometryType=esriGeometryPoint&inSR=4326` +
    `&spatialRel=esriSpatialRelIntersects&outFields=FLD_ZONE,ZONE_SUBTY,SFHA_TF,STATIC_BFE` +
    `&returnGeometry=false&f=json`;
  const json = (await fetchJson(url, 10000)) as {
    features?: { attributes?: Record<string, unknown> }[];
  } | null;
  const a = json?.features?.[0]?.attributes;
  if (!a) {
    return {
      zone: "X",
      subtype: "unmapped or moderate",
      sfha: false,
      bfe: null,
      note: "No NFHL polygon returned at this point. Treat as Zone X pending a surveyor elevation certificate.",
    };
  }
  const zone = String(a.FLD_ZONE ?? "X");
  const subtype = String(a.ZONE_SUBTY ?? "");
  const sfha = String(a.SFHA_TF ?? "").toUpperCase() === "T" || /^A|^V/.test(zone);
  const bfe = a.STATIC_BFE != null && Number(a.STATIC_BFE) > 0 ? String(a.STATIC_BFE) : null;
  return {
    zone,
    subtype,
    sfha,
    bfe,
    note: sfha
      ? `Special Flood Hazard Area, zone ${zone}. Flood insurance is a bid condition.`
      : `FEMA zone ${zone}${subtype ? ` — ${subtype}` : ""}. Not mapped as SFHA at this point.`,
  };
}

async function fetchBuilding(lat: number, lng: number): Promise<BuildingIntel | null> {
  const q = `[out:json][timeout:12];
way["building"](around:45,${lat},${lng});
out geom 1;`;
  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": UA },
      body: `data=${encodeURIComponent(q)}`,
      signal: AbortSignal.timeout(14000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      elements?: {
        tags?: Record<string, string>;
        geometry?: { lat: number; lon: number }[];
      }[];
    };
    const el = json.elements?.[0];
    if (!el) return null;
    const tags = el.tags ?? {};
    const levels = tags["building:levels"] ? Number(tags["building:levels"]) : null;
    const footprint: [number, number][] | null = el.geometry
      ? el.geometry.map((g) => [g.lat, g.lon] as [number, number])
      : null;
    return {
      use: tags.building && tags.building !== "yes" ? tags.building : "residential",
      levels: Number.isFinite(levels) ? levels : null,
      year: tags.start_date || tags["building:year"] || null,
      roof: tags["roof:material"] || tags["roof:shape"] || null,
      footprint,
    };
  } catch {
    return null;
  }
}

export const fetchGroundTruth = createServerFn({ method: "POST" })
  .validator((input: { lat: number; lng: number }) => ({
    lat: z.number().min(-90).max(90).parse(input.lat),
    lng: z.number().min(-180).max(180).parse(input.lng),
  }))
  .handler(async ({ data }) => {
    const [geo, flood, building] = await Promise.all([
      geocodeTract(data.lat, data.lng),
      fetchFlood(data.lat, data.lng),
      fetchBuilding(data.lat, data.lng),
    ]);

    let census: CensusTract | null = null;
    if (geo) {
      const [acs, geometry] = await Promise.all([
        fetchAcs(geo.stateFips, geo.countyFips, geo.tract),
        fetchTractGeometry(geo.geoid),
      ]);
      census = {
        geoid: geo.geoid,
        name: acs.name || geo.name,
        stateFips: geo.stateFips,
        countyFips: geo.countyFips,
        tract: geo.tract,
        population: acs.population ?? null,
        medianIncome: acs.medianIncome ?? null,
        medianHomeValue: acs.medianHomeValue ?? null,
        medianRent: acs.medianRent ?? null,
        medianAge: acs.medianAge ?? null,
        ownerOccPct: acs.ownerOccPct ?? null,
        renterOccPct: acs.renterOccPct ?? null,
        vacancyPct: acs.vacancyPct ?? null,
        bachelorPlusPct: acs.bachelorPlusPct ?? null,
        povertyPct: acs.povertyPct ?? null,
        transitCommutePct: acs.transitCommutePct ?? null,
        medianYearBuilt: acs.medianYearBuilt ?? null,
        households: acs.households ?? null,
        geometry,
      };
    }

    const ground: GroundTruth = { census, flood, building };
    return { ok: true as const, ground };
  });
