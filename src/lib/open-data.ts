export type DataSource = {
  id: string;
  name: string;
  agency: string;
  layer: string;
  method: string;
  cadence: string;
  license: string;
  value: string;
  cost: "free" | "keyless" | "metered";
  endpoint: string;
};

export const OPEN_SOURCES: DataSource[] = [
  {
    id: "nominatim",
    name: "Nominatim geocoder",
    agency: "OpenStreetMap",
    layer: "Address → coordinate, reverse pin",
    method: "HTTPS JSON, 1 req/s courtesy throttle, US country filter",
    cadence: "Planet extract, minutes-to-hours",
    license: "ODbL",
    value: "Street-level parcel targeting without a Google bill. Every scout search and dropped pin.",
    cost: "free",
    endpoint: "nominatim.openstreetmap.org",
  },
  {
    id: "overpass",
    name: "Overpass buildings & amenities",
    agency: "OpenStreetMap",
    layer: "Geofence harvest, schools, parks, shops, transit",
    method: "Around/poly Overpass QL against two interpreters with failover",
    cadence: "Minutes",
    license: "ODbL",
    value: "Addressed building harvest inside a fence is the cheapest lead list a restoration crew can buy.",
    cost: "free",
    endpoint: "overpass-api.de / overpass.kumi.systems",
  },
  {
    id: "census",
    name: "ACS tract microdata",
    agency: "U.S. Census Bureau",
    layer: "Income, value, rent, tenure, year built, education",
    method: "Census API B19013/B25077/B25064 + TIGER tract polygon",
    cadence: "Annual ACS, TIGER yearly",
    license: "Public domain",
    value: "Demographic underwriting without CoStar. Tract medians reprice the AVM and scorecard.",
    cost: "free",
    endpoint: "api.census.gov / tigerweb.geo.census.gov",
  },
  {
    id: "fema",
    name: "NFHL flood zones",
    agency: "FEMA",
    layer: "SFHA, zone, BFE",
    method: "ArcGIS MapServer query at the pin",
    cadence: "Effective FIRM, months",
    license: "Public",
    value: "Insurance carry and go/no-go on coastal and Houston inventory.",
    cost: "free",
    endpoint: "hazards.fema.gov NFHL",
  },
  {
    id: "rainviewer",
    name: "RainViewer mosaic",
    agency: "RainViewer / NOAA NEXRAD",
    layer: "2-hour reflectivity loop, IR satellite",
    method: "Public weather-maps.json + XYZ tiles, no key",
    cadence: "2 minutes",
    license: "Public tiles, attribution",
    value: "Pre-storm positioning. Same picture OpenRadar paints, cheap enough to sit under every scout map.",
    cost: "keyless",
    endpoint: "api.rainviewer.com",
  },
  {
    id: "nws",
    name: "NWS watches & warnings",
    agency: "NOAA / NWS",
    layer: "Tornado, severe thunder, flash flood, tropical",
    method: "api.weather.gov GeoJSON, User-Agent required",
    cadence: "Seconds",
    license: "Public domain",
    value: "Storm-based polygons become RoofPro lead fences. Damage-threat tags drive DPS.",
    cost: "free",
    endpoint: "api.weather.gov/alerts",
  },
  {
    id: "iem",
    name: "IEM storm-based warnings",
    agency: "Iowa Environmental Mesonet",
    layer: "SBW polygons with product IDs",
    method: "GeoJSON dump, failover if NWS is slow",
    cadence: "Minutes",
    license: "Public",
    value: "Compact warning polygons when the full NWS feed is heavy.",
    cost: "free",
    endpoint: "mesonet.agron.iastate.edu/geojson/sbw.geojson",
  },
  {
    id: "nexrad",
    name: "WSR-88D site catalog",
    agency: "NOAA ROC",
    layer: "Single-site hold, beam geometry",
    method: "Curated CONUS list (PyART/OpenRadar site table)",
    cadence: "Static + status ping",
    license: "Public",
    value: "Past zoom 8 the nearest live radar is the truth source for hail MESH and velocity couplets.",
    cost: "free",
    endpoint: "NEXRAD Level II archive (S3 noaa-nexrad-level2)",
  },
  {
    id: "usgs",
    name: "USGS earthquakes",
    agency: "USGS",
    layer: "M3+ last 24h",
    method: "GeoJSON feed",
    cadence: "Minutes",
    license: "Public domain",
    value: "God's-eye environmental layer; secondary for California envelope risk.",
    cost: "free",
    endpoint: "earthquake.usgs.gov",
  },
  {
    id: "opensky",
    name: "OpenSky aircraft",
    agency: "OpenSky Network",
    layer: "Live flights in viewport",
    method: "REST states/all with bbox, 12s cache",
    cadence: "10 seconds",
    license: "OpenSky (non-commercial attribution)",
    value: "Situational globe — contractors flying storm, chase aircraft, restoration logistics.",
    cost: "keyless",
    endpoint: "opensky-network.org/api",
  },
  {
    id: "nhc",
    name: "NHC active storms",
    agency: "National Hurricane Center",
    layer: "Atlantic / East Pacific cyclones",
    method: "CurrentStorms.json proxy",
    cadence: "Advisory cycle",
    license: "Public domain",
    value: "Gulf/Atlantic restoration surge. Cone + wind radii pre-position crews 48h out.",
    cost: "free",
    endpoint: "nhc.noaa.gov/CurrentStorms.json",
  },
  {
    id: "mapillary",
    name: "Mapillary street imagery",
    agency: "Meta / Mapillary",
    layer: "Crowdsourced facades",
    method: "Public raster tiles as coverage proxy; Graph API when keyed",
    cadence: "Continuous",
    license: "CC-BY-SA (community)",
    value: "Street-level freshness beats 8-month Street View lag for peeling paint and roof color.",
    cost: "keyless",
    endpoint: "tiles.mapillary.com",
  },
  {
    id: "esri",
    name: "Esri World Imagery",
    agency: "Esri / Maxar",
    layer: "Satellite basemap",
    method: "XYZ tiles, attribution required",
    cadence: "Quarterly-to-annual",
    license: "Esri terms, display OK",
    value: "God's-eye and scout satellite without an Ion token.",
    cost: "keyless",
    endpoint: "server.arcgisonline.com",
  },
  {
    id: "carto",
    name: "CARTO dark streets",
    agency: "CARTO / OSM",
    layer: "Dark basemap",
    method: "XYZ",
    cadence: "Weekly",
    license: "OSM ODbL + CARTO",
    value: "Readable night operations map under radar.",
    cost: "keyless",
    endpoint: "basemaps.cartocdn.com",
  },
  {
    id: "cesium",
    name: "CesiumJS globe",
    agency: "CesiumGS",
    layer: "3D WGS84 globe, no Ion",
    method: "CDN Cesium + OSM/Esri providers, ellipsoid terrain",
    cadence: "Library release",
    license: "Apache-2.0",
    value: "God's-eye orbital HUD without a Google 3D-tiles bill.",
    cost: "free",
    endpoint: "cesium.com/downloads/cesiumjs",
  },
  {
    id: "homeharvest",
    name: "Listing delta (HomeHarvest pattern)",
    agency: "Public brokerage portals",
    layer: "Ask, DOM, photos, tax vs list",
    method: "Human-confirmed portal search. Do not scrape into the system of record.",
    cadence: "On demand",
    license: "Portal terms — read, don't store the HTML",
    value: "The spread between list price and the Census-anchored AVM is the bid. Confirm it in the portal, then lock the number in Underwrite.",
    cost: "free",
    endpoint: "realtor.com search by city",
  },
  {
    id: "surfsense",
    name: "SurfSense live-link reading room",
    agency: "Operator RAG",
    layer: "Cited brief over public URLs",
    method: "Packet of live links (NWS, Census geocoder, FEMA, OSM, Mapillary, CAD) pasted into a SurfSense space",
    cadence: "Per pin",
    license: "Your space, their pages",
    value: "Stops the model from inventing comps. PropertyInsight remains the system of record; SurfSense only reads what the packet names.",
    cost: "free",
    endpoint: "Live-link packet on this desk",
  },
  {
    id: "cad",
    name: "County appraisal district",
    agency: "Local CAD / assessor",
    layer: "Assessed value, owner, exemptions, land vs improvement",
    method: "Public search portal per county. TX: Johnson, Tarrant, Dallas, Harris.",
    cadence: "Annual roll + supplements",
    license: "Public record",
    value: "Assessed vs AVM is the first lie-detector. Homestead exemption flags owner-occupancy the ACS can only imply.",
    cost: "free",
    endpoint: "County CAD portals",
  },
  {
    id: "permits",
    name: "Municipal permits",
    agency: "City building department",
    layer: "Roof, electrical, mechanical pull history",
    method: "Open data portal or clerk search by address",
    cadence: "Daily where published",
    license: "Public",
    value: "A permit from year N is a roof age the seller's flyer will not admit. It reprices the envelope play.",
    cost: "free",
    endpoint: "City open-data / Accela / Tyler",
  },
  {
    id: "osint",
    name: "OSINT chain of title signals",
    agency: "Public records stack",
    layer: "Clerk filings, vacancies, environmental flags",
    method: "County clerk, HUD USPS vacancy, EPA ECHO, OpenAddresses — lookup, never bulk-hoard PII",
    cadence: "Varies",
    license: "Public record / ODbL",
    value: "Distress is a filing, not a vibe. A lis pendens or vacancy flag moves a lead from canvass to RoofPro with a reason.",
    cost: "free",
    endpoint: "Clerk + EPA ECHO + HUD",
  },
  {
    id: "stormevents",
    name: "NOAA Storm Events",
    agency: "NCEI",
    layer: "Historical hail, wind, tornado by county",
    method: "Bulk CSV / Storm Events API, county FIPS join",
    cadence: "Monthly, with a 60–90 day lag",
    license: "Public domain",
    value: "MESHcast is weather. Claim frequency is history. Five years of 1-inch hail in the county is why the insurance play exists.",
    cost: "free",
    endpoint: "ncdc.noaa.gov/stormevents",
  },
];

export type ResearchLink = {
  name: string;
  url: string;
  why: string;
};

export function researchPacket(pin: {
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
}): { title: string; links: ResearchLink[]; markdown: string } {
  const city = pin.city || "city";
  const state = pin.state || "";
  const q = encodeURIComponent(`${pin.address}, ${city}, ${state}`.replace(/\s+/g, " ").trim());
  const cad =
    state === "TX"
      ? "https://www.johnsoncad.com/search"
      : `https://www.google.com/search?q=${encodeURIComponent(`${city} ${state} appraisal district property search`)}`;
  const links: ResearchLink[] = [
    {
      name: "NWS point forecast",
      url: `https://forecast.weather.gov/MapClick.php?lat=${pin.lat.toFixed(4)}&lon=${pin.lng.toFixed(4)}`,
      why: "Same-day convective risk and the hail/wind narrative you put on the estimate.",
    },
    {
      name: "Census geographies",
      url: `https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${pin.lng}&y=${pin.lat}&benchmark=Public_AR_Current&vintage=Current_Current&format=json`,
      why: "Tract GEOID that ties this pin to ACS income, value, and tenure.",
    },
    {
      name: "FEMA MSC",
      url: `https://msc.fema.gov/portal/search?AddressQuery=${q}`,
      why: "Effective FIRM panel. SFHA changes insurance carry more than the rent bump does.",
    },
    {
      name: "OpenStreetMap",
      url: `https://www.openstreetmap.org/#map=18/${pin.lat}/${pin.lng}`,
      why: "Building footprint and amenity truth the harvest used.",
    },
    {
      name: "Mapillary",
      url: `https://www.mapillary.com/app/?lat=${pin.lat}&lng=${pin.lng}&z=17`,
      why: "Fresher facade than satellite. Check roof color, garage, and peeling paint before the truck rolls.",
    },
    {
      name: "Listing check",
      url: `https://www.realtor.com/realestateandhomes-search/${encodeURIComponent(city)}_${encodeURIComponent(state || "TX")}`,
      why: "HomeHarvest-style list-price delta. Confirm ask and days-on-market; do not ingest the page.",
    },
    {
      name: "County CAD",
      url: cad,
      why: "Assessed value, homestead, land vs improvement. The first check against the AVM.",
    },
    {
      name: "EPA ECHO",
      url: `https://echo.epa.gov/detailed-facility-report?redirect=page&fid_search=${q}`,
      why: "Nearby regulated facilities. A flag here belongs in the risk line, not the brochure.",
    },
  ];
  const markdown = [
    `# ${pin.address}`,
    `${city}, ${state} · ${pin.lat.toFixed(5)}, ${pin.lng.toFixed(5)}`,
    "",
    "Live-link packet for a SurfSense space. Cite these pages. Do not invent comps.",
    "",
    ...links.map((l) => `- [${l.name}](${l.url}) — ${l.why}`),
  ].join("\n");
  return { title: `Live-link packet · ${pin.address}`, links, markdown };
}
