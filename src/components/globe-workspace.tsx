import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { NEXRAD_SITES } from "@/lib/nexrad-sites";
import { usePropertyStore } from "@/lib/property-store";
import { fetchFlights, fetchQuakes, type Flight, type Quake } from "@/lib/server/osint";
import { currentRadarUrl, useWeatherStore } from "@/lib/weather-store";

const CESIUM_BASE = "https://cdn.jsdelivr.net/npm/cesium@1.124.0/Build/Cesium/";

type CesiumNS = {
  Viewer: new (el: HTMLElement, opts: Record<string, unknown>) => CesiumViewer;
  Cartesian3: { fromDegrees: (lng: number, lat: number, h?: number) => unknown };
  Cartesian2: new (x: number, y: number) => unknown;
  Color: {
    fromCssColorString: (c: string) => unknown;
  };
  UrlTemplateImageryProvider: new (opts: { url: string; credit?: string }) => unknown;
  ImageryLayer: { fromProviderAsync: (p: Promise<unknown>) => unknown };
  EllipsoidTerrainProvider: new () => unknown;
  Terrain: new (p: Promise<unknown>) => unknown;
  Math: { toRadians: (n: number) => number };
  Ion: { defaultAccessToken: string };
};

type CesiumViewer = {
  camera: { flyTo: (opts: Record<string, unknown>) => void };
  entities: {
    removeAll: () => void;
    add: (e: Record<string, unknown>) => void;
  };
  imageryLayers: { addImageryProvider: (p: unknown) => unknown; length: number; get: (i: number) => { alpha: number } };
  destroy: () => void;
  resize: () => void;
  scene: { globe: { enableLighting: boolean } };
};

function loadCesium(): Promise<CesiumNS> {
  const w = window as Window & { Cesium?: CesiumNS; CESIUM_BASE_URL?: string };
  if (w.Cesium) return Promise.resolve(w.Cesium);
  w.CESIUM_BASE_URL = CESIUM_BASE;
  if (!document.querySelector("link[data-cesium]")) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${CESIUM_BASE}Widgets/widgets.css`;
    link.dataset.cesium = "1";
    document.head.appendChild(link);
  }
  return new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-cesium]") as HTMLScriptElement | null;
    const finish = () => (w.Cesium ? resolve(w.Cesium) : reject(new Error("Cesium missing")));
    if (existing) {
      existing.addEventListener("load", finish);
      if (w.Cesium) finish();
      return;
    }
    const script = document.createElement("script");
    script.src = `${CESIUM_BASE}Cesium.js`;
    script.async = true;
    script.dataset.cesium = "1";
    script.onload = finish;
    script.onerror = () => reject(new Error("Cesium CDN blocked"));
    document.body.appendChild(script);
  });
}

export function GlobeWorkspace() {
  const host = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<CesiumViewer | null>(null);
  const pin = usePropertyStore((s) => s.selected);
  const center = usePropertyStore((s) => s.mapCenter);
  const overlayOn = useWeatherStore((s) => s.overlayOn);
  const frameIndex = useWeatherStore((s) => s.frameIndex);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [note, setNote] = useState("Loading orbital view");
  const [quakes, setQuakes] = useState<Quake[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [showFlights, setShowFlights] = useState(true);
  const [showQuakes, setShowQuakes] = useState(true);
  const [showRadar, setShowRadar] = useState(false);

  useEffect(() => {
    const lat = pin?.lat ?? center.lat;
    const lng = pin?.lng ?? center.lng;
    const span = 4;
    let cancelled = false;
    void fetchQuakes().then((r) => {
      if (!cancelled && r.ok) setQuakes(r.quakes);
    });
    void fetchFlights({
      data: { lamin: lat - span, lamax: lat + span, lomin: lng - span, lomax: lng + span },
    }).then((r) => {
      if (!cancelled && r.ok) setFlights(r.flights.slice(0, 80));
    });
    return () => {
      cancelled = true;
    };
  }, [pin?.lat, pin?.lng, center.lat, center.lng]);

  useEffect(() => {
    let dead = false;
    const el = host.current;
    if (!el) return;
    (async () => {
      try {
        const Cesium = await loadCesium();
        if (dead || !host.current) return;
        Cesium.Ion.defaultAccessToken = "";
        const imagery = new Cesium.UrlTemplateImageryProvider({
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          credit: "Esri",
        });
        const viewer = new Cesium.Viewer(host.current, {
          animation: false,
          timeline: false,
          baseLayerPicker: false,
          geocoder: false,
          homeButton: false,
          sceneModePicker: false,
          navigationHelpButton: false,
          fullscreenButton: false,
          infoBox: false,
          selectionIndicator: false,
          baseLayer: Cesium.ImageryLayer.fromProviderAsync(Promise.resolve(imagery)),
          terrain: new Cesium.Terrain(Promise.resolve(new Cesium.EllipsoidTerrainProvider())),
        });
        viewer.scene.globe.enableLighting = false;
        viewerRef.current = viewer;
        const lat = pin?.lat ?? center.lat;
        const lng = pin?.lng ?? center.lng;
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(lng, lat, 1_800_000),
          duration: 0,
        });
        setStatus("ready");
        setNote("Ellipsoid globe · Esri imagery · no Ion token");
        window.setTimeout(() => viewer.resize(), 200);
      } catch (e) {
        if (!dead) {
          setStatus("error");
          setNote(e instanceof Error ? e.message : "Globe failed");
        }
      }
    })();
    return () => {
      dead = true;
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || status !== "ready") return;
    let cancelled = false;
    (async () => {
      const Cesium = await loadCesium();
      if (cancelled || !viewerRef.current) return;
      viewer.entities.removeAll();
      const lat = pin?.lat ?? center.lat;
      const lng = pin?.lng ?? center.lng;
      viewer.entities.add({
        name: pin?.address ?? "Map center",
        position: Cesium.Cartesian3.fromDegrees(lng, lat, 0),
        point: { pixelSize: 12, color: Cesium.Color.fromCssColorString("#8aa07a") },
        label: {
          text: pin?.address ?? "Scout center",
          font: "13px IBM Plex Sans",
          fillColor: Cesium.Color.fromCssColorString("#eceae4"),
          pixelOffset: new Cesium.Cartesian2(0, -16),
        },
      });
      for (const s of NEXRAD_SITES) {
        viewer.entities.add({
          name: s.id,
          position: Cesium.Cartesian3.fromDegrees(s.lng, s.lat, 0),
          point: { pixelSize: 6, color: Cesium.Color.fromCssColorString("#c4b49a") },
          label: {
            text: s.id,
            font: "11px IBM Plex Mono",
            fillColor: Cesium.Color.fromCssColorString("#c4b49a"),
            pixelOffset: new Cesium.Cartesian2(10, 0),
          },
        });
      }
      if (showQuakes) {
        for (const q of quakes.slice(0, 40)) {
          viewer.entities.add({
            name: `M${q.mag.toFixed(1)} ${q.place}`,
            position: Cesium.Cartesian3.fromDegrees(q.lng, q.lat, 0),
            point: {
              pixelSize: 4 + q.mag,
              color: Cesium.Color.fromCssColorString("#c45c4a"),
            },
          });
        }
      }
      if (showFlights) {
        for (const f of flights) {
          viewer.entities.add({
            name: f.callsign,
            position: Cesium.Cartesian3.fromDegrees(f.lng, f.lat, Math.max(500, f.alt ?? 8000)),
            point: { pixelSize: 4, color: Cesium.Color.fromCssColorString("#6e8ea3") },
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status, pin, center.lat, center.lng, quakes, flights, showFlights, showQuakes]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || status !== "ready" || !showRadar) return;
    const url = currentRadarUrl();
    if (!url || !overlayOn) return;
    let cancelled = false;
    (async () => {
      const Cesium = await loadCesium();
      if (cancelled) return;
      const provider = new Cesium.UrlTemplateImageryProvider({ url });
      const layer = viewer.imageryLayers.addImageryProvider(provider) as { alpha: number };
      layer.alpha = 0.55;
    })();
    return () => {
      cancelled = true;
    };
  }, [showRadar, overlayOn, frameIndex, status]);

  return (
    <div className="relative h-full min-h-0">
      <div ref={host} className="absolute inset-0 bg-background" />
      <div className="absolute left-3 top-3 z-10 max-w-sm rounded-lg border border-border bg-background/90 p-3 backdrop-blur-sm">
        <h1 className="font-display text-lg">God's eye</h1>
        <p className="mt-1 text-xs text-muted-foreground">{note}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="button" size="sm" variant={showFlights ? "default" : "outline"} onClick={() => setShowFlights((v) => !v)}>
            Flights {flights.length ? `(${flights.length})` : ""}
          </Button>
          <Button type="button" size="sm" variant={showQuakes ? "default" : "outline"} onClick={() => setShowQuakes((v) => !v)}>
            Quakes {quakes.length ? `(${quakes.length})` : ""}
          </Button>
          <Button type="button" size="sm" variant={showRadar ? "default" : "outline"} onClick={() => setShowRadar((v) => !v)}>
            Radar drape
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {pin ? pin.address : "No pin yet — globe is parked on the scout center."} NEXRAD sites stay labeled. OpenSky is a
          4° box around the pin; an empty box means the feed declined, not that the sky is empty.
        </p>
        {status === "error" && (
          <p className="mt-2 text-sm text-destructive">
            The 3D globe did not load. Scout and Radar still run on the flat map.
          </p>
        )}
      </div>
    </div>
  );
}
