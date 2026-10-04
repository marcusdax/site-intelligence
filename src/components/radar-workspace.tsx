import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { nearestNexrad } from "@/lib/nexrad-sites";
import { usePropertyStore } from "@/lib/property-store";
import { fetchNhcStorms } from "@/lib/server/radar";
import { currentRadarUrl, useWeatherStore } from "@/lib/weather-store";

function simplifyRing(ring: [number, number][], n: number) {
  if (ring.length <= n) return ring;
  const step = (ring.length - 1) / (n - 1);
  const out: [number, number][] = [];
  for (let i = 0; i < n; i++) out.push(ring[Math.round(i * step)]!);
  return out;
}

export function RadarWorkspace({ onOpenScout }: { onOpenScout: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const radarRef = useRef<import("leaflet").TileLayer | null>(null);
  const alertsRef = useRef<import("leaflet").LayerGroup | null>(null);

  const center = usePropertyStore((s) => s.mapCenter);
  const setCenter = usePropertyStore((s) => s.setMapCenter);
  const setMode = usePropertyStore((s) => s.setGeofenceMode);
  const setShape = usePropertyStore((s) => s.setGeofenceShape);
  const clearVerts = usePropertyStore((s) => s.clearGeofenceVertices);
  const addVertex = usePropertyStore((s) => s.addGeofenceVertex);

  const frames = useWeatherStore((s) => s.frames);
  const frameIndex = useWeatherStore((s) => s.frameIndex);
  const setFrameIndex = useWeatherStore((s) => s.setFrameIndex);
  const playing = useWeatherStore((s) => s.playing);
  const setPlaying = useWeatherStore((s) => s.setPlaying);
  const product = useWeatherStore((s) => s.product);
  const setProduct = useWeatherStore((s) => s.setProduct);
  const opacity = useWeatherStore((s) => s.opacity);
  const setOpacity = useWeatherStore((s) => s.setOpacity);
  const alerts = useWeatherStore((s) => s.alerts);
  const alertsSource = useWeatherStore((s) => s.alertsSource);
  const catalogStatus = useWeatherStore((s) => s.catalogStatus);
  const selectedAlertId = useWeatherStore((s) => s.selectedAlertId);
  const selectAlert = useWeatherStore((s) => s.selectAlert);
  const step = useWeatherStore((s) => s.step);

  const [storms, setStorms] = useState<{ id: string; name: string; class: string }[]>([]);
  const sites = nearestNexrad(center.lat, center.lng, 4);
  const frame = frames[frameIndex];

  useEffect(() => {
    let cancelled = false;
    void fetchNhcStorms().then((r) => {
      if (!cancelled && r.ok) setStorms(r.storms.map((s) => ({ id: s.id, name: s.name, class: s.class })));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const el = host.current;
    if (!el) return;
    (async () => {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !host.current || mapRef.current) return;
      const map = L.map(host.current, { zoomControl: true, attributionControl: true }).setView(
        [center.lat, center.lng],
        Math.max(6, center.zoom - 2),
      );
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; OSM &copy; CARTO",
        subdomains: "abcd",
        maxZoom: 18,
      }).addTo(map);
      alertsRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      window.setTimeout(() => map.invalidateSize(), 120);
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      radarRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    (async () => {
      const L = await import("leaflet");
      radarRef.current?.remove();
      radarRef.current = null;
      const url = currentRadarUrl();
      if (!url) return;
      radarRef.current = L.tileLayer(url, { opacity, zIndex: 300 }).addTo(map);
    })();
  }, [opacity, frameIndex, product, frames.length]);

  useEffect(() => {
    const map = mapRef.current;
    const group = alertsRef.current;
    if (!map || !group) return;
    const here = nearestNexrad(center.lat, center.lng, 4);
    let cancelled = false;
    (async () => {
      const L = await import("leaflet");
      if (cancelled || !alertsRef.current) return;
      alertsRef.current.clearLayers();
      for (const a of alerts) {
        if (!a.ring || a.ring.length < 3) continue;
        const on = a.id === selectedAlertId;
        const poly = L.polygon(a.ring, {
          color: a.severity.toLowerCase() === "extreme" ? "#c45c4a" : "#d4a574",
          weight: on ? 2.5 : 1,
          fillOpacity: on ? 0.28 : 0.12,
        }).bindTooltip(`${a.event}`);
        poly.on("click", () => {
          selectAlert(a.id);
          if (a.centroid) map.flyTo([a.centroid.lat, a.centroid.lng], 8);
        });
        poly.addTo(alertsRef.current!);
      }
      for (const s of here) {
        L.circleMarker([s.lat, s.lng], { radius: 5, color: "#8aa07a", weight: 1, fillOpacity: 0.9 })
          .bindTooltip(`${s.id} · ${s.name} · ${Math.round(s.km)} km`)
          .addTo(alertsRef.current!);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [alerts, selectedAlertId, selectAlert, center.lat, center.lng]);

  const fenceFromAlert = () => {
    const a = alerts.find((x) => x.id === selectedAlertId) ?? alerts.find((x) => x.ring && x.ring.length >= 3);
    if (!a?.ring) {
      toast.error("No warning polygon to fence");
      return;
    }
    clearVerts();
    simplifyRing(a.ring, 18).forEach((v) => addVertex(v));
    setShape("polygon");
    setMode(true);
    if (a.centroid) setCenter({ lat: a.centroid.lat, lng: a.centroid.lng, zoom: 11 });
    selectAlert(a.id);
    toast.message(`${a.event} is the fence. Scan it on Scout.`);
    onOpenScout();
  };

  return (
    <div className="flex h-full min-h-0 flex-col lg:flex-row">
      <div className="relative h-[46vh] min-h-64 w-full lg:h-full lg:w-[62%]">
        <div ref={host} className="absolute inset-0" />
        <div className="absolute bottom-3 left-3 z-[400] max-w-sm rounded-lg border border-border bg-background/90 p-3 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            RainViewer mosaic · {catalogStatus}
            {frame ? ` · ${new Date(frame.time * 1000).toISOString().slice(11, 16)}Z ${frame.kind}` : ""}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => setPlaying(!playing)}>
              {playing ? "Pause" : "Play"}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => step(-1)}>
              Prev
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => step(1)}>
              Next
            </Button>
            <Button
              type="button"
              size="sm"
              variant={product === "radar" ? "default" : "outline"}
              onClick={() => setProduct("radar")}
            >
              Reflectivity
            </Button>
            <Button
              type="button"
              size="sm"
              variant={product === "infrared" ? "default" : "outline"}
              onClick={() => setProduct("infrared")}
            >
              Infrared
            </Button>
          </div>
          <div className="mt-3">
            <Slider
              min={0}
              max={Math.max(0, frames.length - 1)}
              step={1}
              value={[frameIndex]}
              onValueChange={(v) => setFrameIndex(v[0] ?? 0)}
            />
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="w-16">Opacity</span>
            <Slider min={0.2} max={0.9} step={0.05} value={[opacity]} onValueChange={(v) => setOpacity(v[0] ?? 0.6)} />
          </div>
        </div>
      </div>
      <aside className="flex min-h-0 flex-1 flex-col border-t border-border lg:border-l lg:border-t-0">
        <div className="border-b border-border px-4 py-3">
          <h1 className="font-display text-xl">Storm desk</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            OpenRadar-style mosaic from RainViewer, NWS and IEM polygons, and the nearest WSR-88D. A warning becomes a
            harvest fence.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 border-b border-border px-4 py-3 text-sm">
          {sites.map((s) => (
            <button
              key={s.id}
              type="button"
              className="rounded-md border border-border px-2 py-2 text-left hover:bg-accent"
              onClick={() => {
                setCenter({ lat: s.lat, lng: s.lng, zoom: 8 });
                mapRef.current?.flyTo([s.lat, s.lng], 8);
              }}
            >
              <span className="font-mono text-xs text-primary">{s.id}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {s.name} · {Math.round(s.km)} km
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Warnings {alerts.length ? `· ${alerts.length}` : ""} {alertsSource ? `· ${alertsSource}` : ""}
          </p>
          <Button type="button" size="sm" onClick={fenceFromAlert}>
            Fence and scout
          </Button>
        </div>
        <ul className="min-h-0 flex-1 overflow-y-auto">
          {alerts.length === 0 && (
            <li className="px-4 py-6 text-sm text-muted-foreground">
              No active tornado, severe, flash-flood, or tropical polygons. The mosaic still loops. Quiet air is a real
              reading.
            </li>
          )}
          {alerts.map((a) => (
            <li key={a.id} className="border-b border-border">
              <button
                type="button"
                className={`flex w-full flex-col gap-0.5 px-4 py-3 text-left hover:bg-accent ${a.id === selectedAlertId ? "bg-secondary" : ""}`}
                onClick={() => {
                  selectAlert(a.id);
                  if (a.centroid) {
                    setCenter({ lat: a.centroid.lat, lng: a.centroid.lng, zoom: 8 });
                    mapRef.current?.flyTo([a.centroid.lat, a.centroid.lng], 8);
                  }
                }}
              >
                <span className="text-sm">{a.event}</span>
                <span className="text-xs text-muted-foreground">
                  {a.severity} · {a.area || a.headline}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
          {storms.length
            ? `NHC active: ${storms.map((s) => `${s.name} (${s.class || "cyclone"})`).join(", ")}`
            : "NHC basin is quiet. Gulf crews stay on the hail belt until an advisory posts."}
        </div>
      </aside>
    </div>
  );
}
