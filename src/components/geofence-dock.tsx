import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { overlayComps, scoreHarvest } from "@/lib/engine";
import { usePropertyStore } from "@/lib/property-store";
import { scanGeofence } from "@/lib/server/geo";
import { useWeatherStore } from "@/lib/weather-store";
import type { PropertyPin } from "@/lib/types";
import { compactUsd, formatMiles } from "@/lib/utils";

export function GeofenceDock({
  onZoneSelect,
}: {
  onZoneSelect: (pin: PropertyPin) => void;
}) {
  const selected = usePropertyStore((s) => s.selected);
  const radius = usePropertyStore((s) => s.geofenceRadiusM);
  const setRadius = usePropertyStore((s) => s.setGeofenceRadius);
  const scanning = usePropertyStore((s) => s.scanning);
  const setScanning = usePropertyStore((s) => s.setScanning);
  const setZoneHits = usePropertyStore((s) => s.setZoneHits);
  const setHarvest = usePropertyStore((s) => s.setHarvest);
  const harvest = usePropertyStore((s) => s.harvest);
  const zoneHits = usePropertyStore((s) => s.zoneHits);
  const shape = usePropertyStore((s) => s.geofenceShape);
  const setShape = usePropertyStore((s) => s.setGeofenceShape);
  const verts = usePropertyStore((s) => s.geofenceVertices);
  const undo = usePropertyStore((s) => s.undoGeofenceVertex);
  const clearVerts = usePropertyStore((s) => s.clearGeofenceVertices);
  const dossier = usePropertyStore((s) => s.dossier);
  const setDossier = usePropertyStore((s) => s.setDossier);
  const mapCenter = usePropertyStore((s) => s.mapCenter);
  const selectedAlertId = useWeatherStore((s) => s.selectedAlertId);
  const alerts = useWeatherStore((s) => s.alerts);
  const setVertices = usePropertyStore((s) => s.clearGeofenceVertices);
  const addVertex = usePropertyStore((s) => s.addGeofenceVertex);

  const scan = async () => {
    const origin = selected ?? {
      lat: mapCenter.lat,
      lng: mapCenter.lng,
    };
    const polygon = shape === "polygon" && verts.length >= 3 ? verts : undefined;
    if (shape === "polygon" && !polygon) {
      toast.error("Drop at least three vertices, or switch to radius");
      return;
    }
    setScanning(true);
    try {
      const res = await scanGeofence({
        data: { lat: origin.lat, lng: origin.lng, radiusM: radius, polygon },
      });
      if (!res.ok) toast.error(res.error);
      setZoneHits(res.hits);
      const scored = scoreHarvest(res.hits);
      setHarvest(scored);
      if (res.hits.length === 0) toast.message("No addressed buildings — widen the fence or redraw.");
      else {
        toast.message(`${res.hits.length} addressed buildings · ranked by DPS`);
        if (dossier && selected) {
          setDossier({ ...dossier, comps: overlayComps(selected, dossier.valuation.estimate, res.hits) }, "ready");
        }
      }
    } catch {
      toast.error("Geofence scan failed");
    } finally {
      setScanning(false);
    }
  };

  const useAlert = () => {
    const a = alerts.find((x) => x.id === selectedAlertId);
    if (!a?.ring || a.ring.length < 3) {
      toast.error("Select a warning that has a polygon");
      return;
    }
    setVertices();
    a.ring.slice(0, 22).forEach((v) => addVertex(v));
    setShape("polygon");
    toast.message(`Fence copied from ${a.event}`);
  };

  return (
    <div className="absolute left-3 right-3 top-3 z-[500] rounded-lg border border-border bg-background/88 p-3 backdrop-blur-sm lg:right-auto lg:w-[22rem]">
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>Geofence</span>
        <span className="tabular">{shape === "circle" ? formatMiles(radius) : `${verts.length} vertices`}</span>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-1">
        <button
          type="button"
          className={`rounded-md border px-2 py-1.5 text-[11px] uppercase tracking-wider ${shape === "circle" ? "border-primary text-foreground" : "border-border text-muted-foreground"}`}
          onClick={() => setShape("circle")}
        >
          Radius
        </button>
        <button
          type="button"
          className={`rounded-md border px-2 py-1.5 text-[11px] uppercase tracking-wider ${shape === "polygon" ? "border-primary text-foreground" : "border-border text-muted-foreground"}`}
          onClick={() => setShape("polygon")}
        >
          Draw poly
        </button>
      </div>
      {shape === "circle" ? (
        <Slider min={200} max={2400} step={50} value={[radius]} onValueChange={(v) => setRadius(v[0] ?? 800)} />
      ) : (
        <p className="text-xs text-muted-foreground">
          Click the map to drop vertices. Three or more closes a harvest polygon.
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button type="button" size="sm" onClick={() => void scan()} disabled={scanning}>
          {scanning ? "Scanning…" : "Scan zone"}
        </Button>
        {shape === "polygon" && (
          <>
            <Button type="button" size="sm" variant="outline" onClick={undo} disabled={!verts.length}>
              Undo
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={clearVerts} disabled={!verts.length}>
              Clear
            </Button>
          </>
        )}
        <Button type="button" size="sm" variant="outline" onClick={useAlert} disabled={!selectedAlertId}>
          Alert fence
        </Button>
        <span className="text-xs text-muted-foreground">{zoneHits.length} harvest</span>
      </div>
      {harvest.length > 0 && (
        <ul className="mt-3 max-h-40 overflow-y-auto border-t border-border pt-2">
          {harvest.slice(0, 10).map((h) => (
            <li key={h.pin.id}>
              <button
                type="button"
                className="flex w-full items-baseline justify-between gap-2 rounded-md px-1 py-1 text-left text-xs hover:bg-accent"
                onClick={() => onZoneSelect(h.pin)}
              >
                <span className="truncate">{h.pin.address}</span>
                <span className="shrink-0 tabular text-muted-foreground">
                  DPS {h.dps} · {compactUsd(h.estimate)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
