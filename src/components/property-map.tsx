import { useEffect, useRef } from "react";
import { AMENITY_COLORS } from "@/lib/knowledge";
import { usePropertyStore } from "@/lib/property-store";
import { currentRadarUrl, useWeatherStore } from "@/lib/weather-store";
import type { PropertyPin } from "@/lib/types";
import { formatMiles } from "@/lib/utils";

type Props = {
  onMapClick: (lat: number, lng: number) => void;
  onZoneSelect: (pin: PropertyPin) => void;
};

function amenityColor(kind: string) {
  return AMENITY_COLORS[kind] ?? "#9c9a92";
}

function alertColor(sev: string) {
  const s = sev.toLowerCase();
  if (s === "extreme") return "#c45c4a";
  if (s === "severe") return "#d4a574";
  return "#6e8ea3";
}

export function PropertyMap({ onMapClick, onZoneSelect }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const streetsRef = useRef<import("leaflet").TileLayer | null>(null);
  const satRef = useRef<import("leaflet").TileLayer | null>(null);
  const radarRef = useRef<import("leaflet").TileLayer | null>(null);
  const pinRef = useRef<import("leaflet").Marker | null>(null);
  const circleRef = useRef<import("leaflet").Circle | null>(null);
  const polyRef = useRef<import("leaflet").Polygon | null>(null);
  const vertsRef = useRef<import("leaflet").LayerGroup | null>(null);
  const zoneRef = useRef<import("leaflet").LayerGroup | null>(null);
  const amenityRef = useRef<import("leaflet").LayerGroup | null>(null);
  const tractRef = useRef<import("leaflet").Polygon | null>(null);
  const bldgRef = useRef<import("leaflet").Polygon | null>(null);
  const alertsRef = useRef<import("leaflet").LayerGroup | null>(null);
  const onClickRef = useRef(onMapClick);
  const onZoneRef = useRef(onZoneSelect);
  onClickRef.current = onMapClick;
  onZoneRef.current = onZoneSelect;

  const selected = usePropertyStore((s) => s.selected);
  const geofenceMode = usePropertyStore((s) => s.geofenceMode);
  const radius = usePropertyStore((s) => s.geofenceRadiusM);
  const zoneHits = usePropertyStore((s) => s.zoneHits);
  const amenities = usePropertyStore((s) => s.amenities);
  const mapCenter = usePropertyStore((s) => s.mapCenter);
  const mapLayer = usePropertyStore((s) => s.mapLayer);
  const tractRing = usePropertyStore((s) => s.tractRing);
  const buildingRing = usePropertyStore((s) => s.buildingRing);
  const shape = usePropertyStore((s) => s.geofenceShape);
  const vertices = usePropertyStore((s) => s.geofenceVertices);

  const overlayOn = useWeatherStore((s) => s.overlayOn);
  const opacity = useWeatherStore((s) => s.opacity);
  const frameIndex = useWeatherStore((s) => s.frameIndex);
  const product = useWeatherStore((s) => s.product);
  const frames = useWeatherStore((s) => s.frames);
  const alertsOn = useWeatherStore((s) => s.alertsOn);
  const alerts = useWeatherStore((s) => s.alerts);
  const selectedAlertId = useWeatherStore((s) => s.selectedAlertId);
  const selectAlert = useWeatherStore((s) => s.selectAlert);

  useEffect(() => {
    let cancelled = false;
    const el = host.current;
    if (!el) return;
    let ro: ResizeObserver | undefined;

    (async () => {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !host.current) return;

      const map = L.map(host.current, {
        zoomControl: true,
        attributionControl: true,
        minZoom: 3,
      }).setView([mapCenter.lat, mapCenter.lng], mapCenter.zoom);

      streetsRef.current = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; OpenStreetMap &copy; CARTO",
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(map);

      satRef.current = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Tiles &copy; Esri", maxZoom: 19 },
      );

      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        onClickRef.current(e.latlng.lat, e.latlng.lng);
      });

      zoneRef.current = L.layerGroup().addTo(map);
      amenityRef.current = L.layerGroup().addTo(map);
      vertsRef.current = L.layerGroup().addTo(map);
      alertsRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;

      const invalidate = () => map.invalidateSize();
      requestAnimationFrame(invalidate);
      window.setTimeout(invalidate, 120);
      window.setTimeout(invalidate, 480);
      ro = new ResizeObserver(invalidate);
      ro.observe(host.current);
    })();

    return () => {
      cancelled = true;
      ro?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !streetsRef.current || !satRef.current) return;
    if (mapLayer === "satellite") {
      map.removeLayer(streetsRef.current);
      satRef.current.addTo(map);
    } else {
      map.removeLayer(satRef.current);
      streetsRef.current.addTo(map);
    }
  }, [mapLayer]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo([mapCenter.lat, mapCenter.lng], mapCenter.zoom, { duration: 0.8 });
    window.setTimeout(() => map.invalidateSize(), 200);
  }, [mapCenter.lat, mapCenter.lng, mapCenter.zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    (async () => {
      const L = await import("leaflet");
      pinRef.current?.remove();
      pinRef.current = null;
      if (!selected) return;
      const icon = L.divIcon({
        className: "pi-pin",
        html: `<div style="width:22px;height:22px;border-radius:999px;background:#8aa07a;border:2px solid #eceae4;box-shadow:0 0 0 6px rgb(138 160 122 / 25%)"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
      pinRef.current = L.marker([selected.lat, selected.lng], { icon }).addTo(map);
    })();
  }, [selected]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    (async () => {
      const L = await import("leaflet");
      circleRef.current?.remove();
      circleRef.current = null;
      if (!geofenceMode || !selected || shape !== "circle") return;
      circleRef.current = L.circle([selected.lat, selected.lng], {
        radius,
        color: "#8aa07a",
        weight: 1.5,
        fillColor: "#8aa07a",
        fillOpacity: 0.12,
      }).addTo(map);
      circleRef.current.bindTooltip(`${formatMiles(radius)} radius`, { permanent: false });
      const b = circleRef.current.getBounds();
      map.fitBounds(b, { padding: [28, 28], maxZoom: 16, animate: true });
    })();
  }, [geofenceMode, radius, selected, shape]);

  useEffect(() => {
    const map = mapRef.current;
    const group = vertsRef.current;
    if (!map || !group) return;
    (async () => {
      const L = await import("leaflet");
      group.clearLayers();
      polyRef.current?.remove();
      polyRef.current = null;
      if (!geofenceMode || !vertices.length) return;
      if (vertices.length >= 3) {
        polyRef.current = L.polygon(vertices, {
          color: "#8aa07a",
          weight: 1.5,
          fillColor: "#8aa07a",
          fillOpacity: 0.12,
        }).addTo(map);
      } else if (vertices.length === 2) {
        L.polyline(vertices, { color: "#8aa07a", weight: 1.5, dashArray: "4 6" }).addTo(group);
      }
      for (const [lat, lng] of vertices) {
        const icon = L.divIcon({
          className: "pi-pin",
          html: `<div class="pi-vertex"></div>`,
          iconSize: [10, 10],
          iconAnchor: [5, 5],
        });
        L.marker([lat, lng], { icon }).addTo(group);
      }
    })();
  }, [geofenceMode, vertices]);

  useEffect(() => {
    const map = mapRef.current;
    const group = zoneRef.current;
    if (!map || !group) return;
    (async () => {
      const L = await import("leaflet");
      group.clearLayers();
      const icon = L.divIcon({
        className: "pi-pin",
        html: `<div class="pi-zone-dot"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });
      for (const h of zoneHits) {
        const m = L.marker([h.lat, h.lng], { icon }).bindTooltip(h.address);
        m.on("click", (e: { originalEvent?: Event }) => {
          e.originalEvent?.stopPropagation?.();
          onZoneRef.current(h);
        });
        m.addTo(group);
      }
    })();
  }, [zoneHits]);

  useEffect(() => {
    const map = mapRef.current;
    const group = amenityRef.current;
    if (!map || !group) return;
    (async () => {
      const L = await import("leaflet");
      group.clearLayers();
      for (const a of amenities.slice(0, 40)) {
        const color = amenityColor(a.kind);
        const icon = L.divIcon({
          className: "pi-pin",
          html: `<div style="width:8px;height:8px;border-radius:999px;background:${color};border:1px solid #eceae4;opacity:.9"></div>`,
          iconSize: [8, 8],
          iconAnchor: [4, 4],
        });
        L.marker([a.lat, a.lng], { icon }).bindTooltip(`${a.name} · ${a.kind}`).addTo(group);
      }
    })();
  }, [amenities]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    (async () => {
      const L = await import("leaflet");
      tractRef.current?.remove();
      tractRef.current = null;
      if (!tractRing || tractRing.length < 3) return;
      tractRef.current = L.polygon(tractRing, {
        color: "#c4b49a",
        weight: 1.25,
        fillColor: "#c4b49a",
        fillOpacity: 0.08,
        dashArray: "4 6",
      })
        .bindTooltip("ACS census tract")
        .addTo(map);
    })();
  }, [tractRing]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    (async () => {
      const L = await import("leaflet");
      bldgRef.current?.remove();
      bldgRef.current = null;
      if (!buildingRing || buildingRing.length < 3) return;
      bldgRef.current = L.polygon(buildingRing, {
        color: "#8aa07a",
        weight: 2,
        fillColor: "#8aa07a",
        fillOpacity: 0.18,
      })
        .bindTooltip("OSM building")
        .addTo(map);
    })();
  }, [buildingRing]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    (async () => {
      const L = await import("leaflet");
      radarRef.current?.remove();
      radarRef.current = null;
      if (!overlayOn) return;
      const url = currentRadarUrl();
      if (!url) return;
      radarRef.current = L.tileLayer(url, {
        opacity,
        zIndex: 350,
        className: "pi-radar-tiles",
      }).addTo(map);
    })();
  }, [overlayOn, opacity, frameIndex, product, frames.length]);

  useEffect(() => {
    const map = mapRef.current;
    const group = alertsRef.current;
    if (!map || !group) return;
    (async () => {
      const L = await import("leaflet");
      group.clearLayers();
      if (!alertsOn) return;
      for (const a of alerts) {
        if (!a.ring || a.ring.length < 3) continue;
        const selected = a.id === selectedAlertId;
        const poly = L.polygon(a.ring, {
          color: alertColor(a.severity),
          weight: selected ? 2.5 : 1.25,
          fillColor: alertColor(a.severity),
          fillOpacity: selected ? 0.28 : 0.14,
        }).bindTooltip(`${a.event} · ${a.severity}`);
        poly.on("click", (e: { originalEvent?: Event }) => {
          e.originalEvent?.stopPropagation?.();
          selectAlert(a.id);
        });
        poly.addTo(group);
      }
    })();
  }, [alerts, alertsOn, selectedAlertId, selectAlert]);

  return <div ref={host} className="absolute inset-0 h-full w-full" />;
}

export function MapHost({
  onMapClick,
  onZoneSelect,
}: {
  onMapClick: (lat: number, lng: number) => void;
  onZoneSelect: (pin: PropertyPin) => void;
}) {
  const selected = usePropertyStore((s) => s.selected);
  const mapLayer = usePropertyStore((s) => s.mapLayer);
  const setMapLayer = usePropertyStore((s) => s.setMapLayer);
  const amenities = usePropertyStore((s) => s.amenities);
  const dossier = usePropertyStore((s) => s.dossier);
  const overlayOn = useWeatherStore((s) => s.overlayOn);
  const setOverlayOn = useWeatherStore((s) => s.setOverlayOn);
  const alertsOn = useWeatherStore((s) => s.alertsOn);
  const setAlertsOn = useWeatherStore((s) => s.setAlertsOn);
  const alerts = useWeatherStore((s) => s.alerts);
  const frames = useWeatherStore((s) => s.frames);
  const frameIndex = useWeatherStore((s) => s.frameIndex);

  const frame = frames[frameIndex];

  return (
    <div className="relative h-full min-h-[280px] w-full overflow-hidden bg-background">
      <PropertyMap onMapClick={onMapClick} onZoneSelect={onZoneSelect} />
      <div className="absolute right-3 top-3 z-[400] flex flex-col gap-1">
        <button
          type="button"
          className={`rounded-md border px-2.5 py-1.5 text-[11px] uppercase tracking-wider ${mapLayer === "streets" ? "border-primary bg-background text-foreground" : "border-border bg-background/80 text-muted-foreground"}`}
          onClick={() => setMapLayer("streets")}
        >
          Streets
        </button>
        <button
          type="button"
          className={`rounded-md border px-2.5 py-1.5 text-[11px] uppercase tracking-wider ${mapLayer === "satellite" ? "border-primary bg-background text-foreground" : "border-border bg-background/80 text-muted-foreground"}`}
          onClick={() => setMapLayer("satellite")}
        >
          Satellite
        </button>
        <button
          type="button"
          className={`rounded-md border px-2.5 py-1.5 text-[11px] uppercase tracking-wider ${overlayOn ? "border-primary bg-background text-foreground" : "border-border bg-background/80 text-muted-foreground"}`}
          onClick={() => setOverlayOn(!overlayOn)}
        >
          Radar
        </button>
        <button
          type="button"
          className={`rounded-md border px-2.5 py-1.5 text-[11px] uppercase tracking-wider ${alertsOn ? "border-primary bg-background text-foreground" : "border-border bg-background/80 text-muted-foreground"}`}
          onClick={() => setAlertsOn(!alertsOn)}
        >
          Warnings {alerts.length ? `(${alerts.length})` : ""}
        </button>
      </div>
      {overlayOn && frame && (
        <div className="absolute bottom-10 right-3 z-[400] rounded-md border border-border bg-background/85 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
          NEXRAD {new Date(frame.time * 1000).toISOString().slice(11, 16)}Z · {frame.kind}
        </div>
      )}
      {dossier?.flood && (
        <div className="absolute right-3 top-44 z-[400] rounded-md border border-border bg-background/85 px-2.5 py-1.5 text-[11px] uppercase tracking-wider backdrop-blur-sm">
          <span className={dossier.flood.sfha ? "text-destructive" : "text-muted-foreground"}>
            FEMA {dossier.flood.zone}
          </span>
        </div>
      )}
      {amenities.length > 0 && (
        <div className="pointer-events-none absolute bottom-10 left-3 z-[400] rounded-lg border border-border bg-background/80 px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
          <span className="mr-2 inline-block size-1.5 rounded-full bg-chart-2" /> Schools
          <span className="ml-3 mr-2 inline-block size-1.5 rounded-full bg-primary" /> Parks
          <span className="ml-3 mr-2 inline-block size-1.5 rounded-full bg-chart-3" /> Shops
          <span className="ml-3 mr-2 inline-block size-1.5 rounded-full bg-chart-5" /> Transit
        </div>
      )}
      {!selected && (
        <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center px-4">
          <p className="rounded-full border border-border bg-background/80 px-4 py-2 text-xs text-muted-foreground backdrop-blur-sm">
            Search an address, drop a pin, or scan a geofence
          </p>
        </div>
      )}
    </div>
  );
}
