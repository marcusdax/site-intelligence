import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlterStudio } from "@/components/alter-studio";
import { AnalystPanel } from "@/components/analyst-panel";
import { CampaignPanel } from "@/components/campaign-panel";
import { BrandMark, CommandSearch, GeofenceToggle } from "@/components/command-search";
import { DossierPanel, NeighborhoodPanel } from "@/components/dossier-panel";
import { MapHost } from "@/components/property-map";
import { ScorecardPanel } from "@/components/scorecard-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GeofenceDock } from "@/components/geofence-dock";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnderwritePanel } from "@/components/underwrite-panel";
import { overlayComps, buildDossier, watchFromDossier } from "@/lib/engine";
import { usePropertyStore } from "@/lib/property-store";
import { analyzeNeighborhood, analyzeProperty } from "@/lib/server/analyze";
import { fetchGroundTruth } from "@/lib/server/census";
import { fetchAmenities, reverseGeocode } from "@/lib/server/geo";
import type { GeocodeHit, GroundTruth, PanelTab, PropertyPin } from "@/lib/types";
import { compactUsd } from "@/lib/utils";

const STAGES = [
  "Geocoding parcel",
  "Census + FEMA",
  "Overlaying amenities",
  "Scoring condition",
  "Modeling ROI",
  "Writing evidence",
];

function tractToRing(geom: number[][][] | null): [number, number][] | null {
  if (!geom?.[0]?.length) return null;
  return geom[0].map((pt) => [pt[1]!, pt[0]!] as [number, number]);
}

export function ScoutWorkspace() {
  const selected = usePropertyStore((s) => s.selected);
  const selectPin = usePropertyStore((s) => s.selectPin);
  const dossier = usePropertyStore((s) => s.dossier);
  const dossierStatus = usePropertyStore((s) => s.dossierStatus);
  const setDossier = usePropertyStore((s) => s.setDossier);
  const neighborhood = usePropertyStore((s) => s.neighborhood);
  const neighborhoodStatus = usePropertyStore((s) => s.neighborhoodStatus);
  const setNeighborhood = usePropertyStore((s) => s.setNeighborhood);
  const setAmenities = usePropertyStore((s) => s.setAmenities);
  const panelTab = usePropertyStore((s) => s.panelTab);
  const setPanelTab = usePropertyStore((s) => s.setPanelTab);
  const geofenceMode = usePropertyStore((s) => s.geofenceMode);
  const history = usePropertyStore((s) => s.history);
  const zoneHits = usePropertyStore((s) => s.zoneHits);
  const setTractRing = usePropertyStore((s) => s.setTractRing);
  const toggleWatch = usePropertyStore((s) => s.toggleWatch);
  const setBuildingRing = usePropertyStore((s) => s.setBuildingRing);
  const watchlist = usePropertyStore((s) => s.watchlist);

  const [stage, setStage] = useState(0);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  const runIntel = async (pin: PropertyPin, nearby: PropertyPin[] = []) => {
    setDossier(buildDossier(pin, nearby), "loading");
    setNeighborhood(null, "loading");
    setStage(0);
    try {
      setStage(1);
      const [am, gt] = await Promise.all([
        fetchAmenities({ data: { lat: pin.lat, lng: pin.lng, radiusM: 1200 } }),
        fetchGroundTruth({ data: { lat: pin.lat, lng: pin.lng } }),
      ]);
      const amenities = am.ok ? am.amenities : [];
      const ground: GroundTruth | null = gt.ok ? gt.ground : null;
      setAmenities(amenities);
      setTractRing(tractToRing(ground?.census?.geometry ?? null));
      setBuildingRing(ground?.building?.footprint ?? null);
      setStage(2);
      const seed = buildDossier(pin, nearby, ground);
      setDossier(seed, "loading");
      setStage(3);
      const [prop, hood] = await Promise.all([
        analyzeProperty({ data: { pin, amenities, nearby, ground } }),
        analyzeNeighborhood({ data: { pin, amenities, ground } }),
      ]);
      setStage(5);
      if (prop.ok) {
        const d = nearby.length
          ? { ...prop.dossier, comps: overlayComps(pin, prop.dossier.valuation.estimate, nearby) }
          : prop.dossier;
        setDossier(d, "ready");
      } else setDossier(seed, "ready");
      if (hood.ok) setNeighborhood(hood.intel, "ready");
      else setNeighborhood(null, "idle");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Analysis failed";
      toast.error(msg);
      setDossier(buildDossier(pin, nearby), "ready", msg);
      setNeighborhood(null, "idle");
    }
  };

  const onHit = (hit: GeocodeHit, source: PropertyPin["source"] = "search") => {
    const pin: PropertyPin = {
      ...hit,
      source: hit.id.startsWith("sample_") ? "sample" : source,
    };
    selectPin(pin);
    void runIntel(pin, zoneHits);
  };

  const onMapClick = async (lat: number, lng: number) => {
    try {
      const res = await reverseGeocode({ data: { lat, lng } });
      const hit = res.ok
        ? res.hit
        : {
            id: `pin_${lat}`,
            label: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
            address: "Dropped pin",
            city: "",
            state: "",
            postcode: "",
            lat,
            lng,
          };
      const pin: PropertyPin = { ...hit, lat, lng, source: "map" };
      selectPin(pin);
      void runIntel(pin, zoneHits);
    } catch {
      toast.error("Reverse geocode failed");
    }
  };

  const onZoneSelect = (pin: PropertyPin) => {
    selectPin(pin);
    void runIntel(pin, zoneHits);
  };

  const watched = dossier ? watchlist.some((w) => w.pin.id === dossier.pin.id) : false;

  return (
    <div className="flex h-full min-h-0 flex-col bg-background text-foreground">
      <header className="z-20 flex shrink-0 flex-col gap-3 border-b border-border px-4 py-3 md:flex-row md:items-center">
        <BrandMark />
        <div className="min-w-0 flex-1">
          <CommandSearch onSelect={(h) => onHit(h)} />
        </div>
        <div className="flex items-center gap-2">
          <GeofenceToggle />
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <section className="relative h-[42vh] min-h-[240px] w-full shrink-0 lg:h-auto lg:w-[46%]">
          {mapReady ? (
            <MapHost onMapClick={onMapClick} onZoneSelect={onZoneSelect} />
          ) : (
            <div className="h-full bg-muted" />
          )}
          {geofenceMode && <GeofenceDock onZoneSelect={onZoneSelect} />}
          {dossierStatus === "loading" && (
            <div className="absolute bottom-3 left-3 right-3 z-[500] rounded-lg border border-border bg-background/85 px-3 py-2 text-xs backdrop-blur-sm">
              <p className="text-primary">{STAGES[Math.min(stage, STAGES.length - 1)]}</p>
              <div className="mt-2 flex gap-1">
                {STAGES.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 flex-1 rounded-full ${i <= stage ? "bg-primary" : "bg-muted"}`}
                  />
                ))}
              </div>
            </div>
          )}
        </section>

        <aside className="flex min-h-0 flex-1 flex-col border-t border-border lg:border-l lg:border-t-0">
          {dossier && (
            <div className="hidden shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-2 sm:flex">
              <div className="min-w-0">
                <p className="truncate text-sm">{dossier.pin.address}</p>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {compactUsd(dossier.valuation.estimate)} · DPS {dossier.dps.score} · score {dossier.scorecard.overall}
                  {dossier.census ? ` · tract ${dossier.census.geoid}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {dossier.flood?.sfha && <Badge variant="danger">SFHA {dossier.flood.zone}</Badge>}
                <Badge variant="outline">{dossier.metro.name}</Badge>
                <Button
                  type="button"
                  size="sm"
                  variant={watched ? "default" : "outline"}
                  onClick={() => toggleWatch(watchFromDossier(dossier))}
                >
                  {watched ? "Watched" : "Watch"}
                </Button>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
            <Tabs value={panelTab} onValueChange={(v) => setPanelTab(v as PanelTab)} className="w-full">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="dossier">Dossier</TabsTrigger>
                <TabsTrigger value="underwrite">Underwrite</TabsTrigger>
                <TabsTrigger value="neighborhood">Neighborhood</TabsTrigger>
                <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
                <TabsTrigger value="alter">Alter</TabsTrigger>
                <TabsTrigger value="campaign">Campaign</TabsTrigger>
                <TabsTrigger value="analyst">Analyst</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <ScrollArea className="min-h-0 flex-1">
            <div className="p-4">
              {panelTab === "dossier" && (
                <DossierPanel
                  dossier={dossier}
                  loading={dossierStatus === "loading"}
                  neighborhood={neighborhood}
                  onSample={(p) => onHit(p)}
                />
              )}
              {panelTab === "underwrite" && (
                <UnderwritePanel dossier={dossier} loading={dossierStatus === "loading"} />
              )}
              {panelTab === "neighborhood" && (
                <NeighborhoodPanel intel={neighborhood} loading={neighborhoodStatus === "loading"} />
              )}
              {panelTab === "scorecard" && <ScorecardPanel />}
              {panelTab === "alter" && <AlterStudio />}
              {panelTab === "campaign" && <CampaignPanel onZoneSelect={onZoneSelect} />}
              {panelTab === "analyst" && <AnalystPanel />}
            </div>
          </ScrollArea>
        </aside>
      </div>

      {history.length > 0 && (
        <footer className="hidden shrink-0 items-center gap-2 overflow-x-auto border-t border-border px-4 py-2 md:flex">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Recent</span>
          {history.slice(0, 6).map((h) => (
            <Button
              key={h.id}
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 shrink-0"
              onClick={() => {
                selectPin(h);
                void runIntel(h, zoneHits);
              }}
            >
              {h.address}
            </Button>
          ))}
          {watchlist.length > 0 && (
            <>
              <span className="ml-2 text-[11px] uppercase tracking-wider text-muted-foreground">Watch</span>
              {watchlist.map((w) => (
                <Button
                  key={w.pin.id}
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 shrink-0"
                  onClick={() => {
                    selectPin(w.pin);
                    void runIntel(w.pin, zoneHits);
                  }}
                >
                  {w.pin.address} · DPS {w.dps}
                </Button>
              ))}
            </>
          )}
        </footer>
      )}
    </div>
  );
}
