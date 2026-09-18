import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { FEATURES } from "@/lib/knowledge";
import { scoreHarvest } from "@/lib/engine";
import { usePropertyStore } from "@/lib/property-store";
import { generateCampaign } from "@/lib/server/analyze";
import { scanGeofence } from "@/lib/server/geo";
import type { PropertyPin } from "@/lib/types";
import { compactUsd, formatMiles, pct } from "@/lib/utils";

export function CampaignPanel({ onZoneSelect }: { onZoneSelect?: (pin: PropertyPin) => void }) {
  const selected = usePropertyStore((s) => s.selected);
  const radius = usePropertyStore((s) => s.geofenceRadiusM);
  const setRadius = usePropertyStore((s) => s.setGeofenceRadius);
  const geofenceMode = usePropertyStore((s) => s.geofenceMode);
  const setGeofenceMode = usePropertyStore((s) => s.setGeofenceMode);
  const zoneHits = usePropertyStore((s) => s.zoneHits);
  const setZoneHits = usePropertyStore((s) => s.setZoneHits);
  const harvest = usePropertyStore((s) => s.harvest);
  const setHarvest = usePropertyStore((s) => s.setHarvest);
  const campaign = usePropertyStore((s) => s.campaign);
  const setCampaign = usePropertyStore((s) => s.setCampaign);
  const campaignStatus = usePropertyStore((s) => s.campaignStatus);
  const dossier = usePropertyStore((s) => s.dossier);
  const [industry, setIndustry] = useState("Garage Doors");
  const [scanning, setScanning] = useState(false);

  const scan = async () => {
    if (!selected) {
      toast.error("Drop a pin first");
      return;
    }
    setGeofenceMode(true);
    setScanning(true);
    setCampaign([], "loading");
    try {
      const res = await scanGeofence({
        data: { lat: selected.lat, lng: selected.lng, radiusM: radius },
      });
      if (!res.ok) toast.error(res.error);
      setZoneHits(res.hits);
      setHarvest(scoreHarvest(res.hits));
      if (res.hits.length === 0) toast.message("No addressed buildings in this radius — widen the fence.");
    } catch {
      toast.error("Geofence scan failed");
    } finally {
      setScanning(false);
    }
  };

  const generate = async () => {
    const pins = harvest.length
      ? harvest.slice(0, 10).map((h) => h.pin)
      : zoneHits.length
        ? zoneHits.slice(0, 10)
        : selected
          ? [selected]
          : [];
    if (pins.length === 0) {
      toast.error("Scan a geofence or select a parcel");
      return;
    }
    setCampaign([], "loading");
    try {
      const res = await generateCampaign({
        data: {
          pins,
          industry,
          neighborhood: selected?.neighborhood || selected?.city || "the zone",
        },
      });
      if (res.ok) {
        const pages = res.pages.map((p, i) => ({
          ...p,
          dps: harvest[i]?.dps ?? dossier?.dps.score,
          estimate: harvest[i]?.estimate ?? dossier?.valuation.estimate,
          topPlay: harvest[i]?.topPlay,
          id: p.id || pins[i]?.id || `pg_${i}`,
        }));
        setCampaign(pages, "ready");
      }
    } catch {
      toast.error("Campaign generation failed");
      setCampaign([], "idle");
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-8">
      <header>
        <h2 className="font-display text-2xl tracking-tight">Campaign geofence</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Draw a radius around the pin, harvest addressed buildings from OpenStreetMap, and mint one-pagers for the vertical.
        </p>
      </header>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <Label>Radius · {formatMiles(radius)}</Label>
          <span className="text-xs text-muted-foreground">{geofenceMode ? "visible on map" : "hidden"}</span>
        </div>
        <Slider
          min={200}
          max={2400}
          step={50}
          value={[radius]}
          onValueChange={(v) => setRadius(v[0] ?? 800)}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => setGeofenceMode(!geofenceMode)}>
            {geofenceMode ? "Hide fence" : "Show fence"}
          </Button>
          <Button type="button" onClick={() => void scan()} disabled={scanning || !selected}>
            {scanning ? "Scanning…" : "Scan zone"}
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {zoneHits.length} addressed buildings in the current result set.
        </p>
      </div>

      {harvest.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Harvest ranked by DPS</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="max-h-64 space-y-1 overflow-y-auto text-sm">
              {harvest.map((h) => (
                <li key={h.pin.id}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 rounded-md px-1 py-1.5 text-left hover:bg-accent"
                    onClick={() => onZoneSelect?.(h.pin)}
                  >
                    <span className="min-w-0 truncate">
                      {h.pin.address}
                      <span className="text-muted-foreground">
                        {" "}
                        · {h.yearBuilt} · {h.topPlay}
                      </span>
                    </span>
                    <span className="shrink-0 tabular text-xs text-muted-foreground">
                      {compactUsd(h.estimate)} · DPS {h.dps} · {pct(h.roiPct, 0)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {zoneHits.length > 0 && harvest.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Harvest</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="max-h-48 space-y-1 overflow-y-auto text-sm">
              {zoneHits.map((h) => (
                <li key={h.id} className="truncate text-muted-foreground">
                  {h.address}
                  {h.city ? ` · ${h.city}` : ""}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="space-y-1.5">
        <Label>Vertical</Label>
        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FEATURES.map((f) => (
              <SelectItem key={f.key} value={f.label}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="button" onClick={() => void generate()} disabled={campaignStatus === "loading"}>
        {campaignStatus === "loading" ? "Writing one-pagers…" : "Generate one-pagers"}
      </Button>

      <div className="grid gap-3">
        {campaign.map((p) => (
          <article key={p.id} className="rounded-xl border border-border bg-card p-4">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{p.address}</p>
            <h3 className="mt-1 font-display text-lg tracking-tight">{p.headline}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>
            <p className="mt-3 text-sm text-primary">{p.cta}</p>
            {(p.dps != null || p.estimate != null) && (
              <p className="mt-2 text-xs tabular text-muted-foreground">
                {p.estimate != null ? compactUsd(p.estimate) : ""} {p.dps != null ? `· DPS ${p.dps}` : ""}{" "}
                {p.topPlay ? `· ${p.topPlay}` : ""}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
