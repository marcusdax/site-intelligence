import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { OPEN_SOURCES, researchPacket, type DataSource } from "@/lib/open-data";
import { usePropertyStore } from "@/lib/property-store";

const LANES = ["All", "Storm", "Parcel", "Imagery", "Reading"] as const;

function laneOf(s: DataSource): (typeof LANES)[number] {
  if (["rainviewer", "nws", "iem", "nexrad", "nhc", "stormevents"].includes(s.id)) return "Storm";
  if (["nominatim", "overpass", "census", "fema", "homeharvest", "cad", "permits", "osint"].includes(s.id)) return "Parcel";
  if (["mapillary", "esri", "carto"].includes(s.id)) return "Imagery";
  if (["surfsense", "usgs", "opensky", "cesium"].includes(s.id)) return "Reading";
  return "All";
}

export function SourcesWorkspace() {
  const pin = usePropertyStore((s) => s.selected);
  const [lane, setLane] = useState<(typeof LANES)[number]>("All");
  const [openId, setOpenId] = useState<string | null>("surfsense");
  const packet = useMemo(
    () =>
      researchPacket(
        pin ?? {
          address: "412 Willow Park Dr",
          city: "Burleson",
          state: "TX",
          lat: 32.542,
          lng: -97.3208,
        },
      ),
    [pin],
  );
  const rows = OPEN_SOURCES.filter((s) => lane === "All" || laneOf(s) === lane);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(packet.markdown);
      toast.message("Packet copied. Paste it into a SurfSense space as live links.");
    } catch {
      toast.error("Clipboard blocked — select the brief and copy it yourself.");
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="shrink-0 border-b border-border px-4 py-3">
        <h1 className="font-display text-2xl">Open sources</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Every layer here is public. The product question is not “can we fetch it” — it is which decision the number
          changes. Cheap layers that move a bid stay. Pretty layers that do not, do not.
        </p>
      </header>
      <section className="shrink-0 border-b border-border px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">SurfSense live-link packet</p>
            <p className="text-sm">{packet.title}</p>
          </div>
          <Button type="button" size="sm" onClick={() => void copy()}>
            Copy packet
          </Button>
        </div>
        <ul className="mt-3 grid gap-2 md:grid-cols-2">
          {packet.links.map((l) => (
            <li key={l.name} className="rounded-md border border-border px-3 py-2">
              <a href={l.url} target="_blank" rel="noreferrer" className="text-sm text-primary underline-offset-2 hover:underline">
                {l.name}
              </a>
              <p className="text-xs text-muted-foreground">{l.why}</p>
            </li>
          ))}
        </ul>
        {!pin && (
          <p className="mt-2 text-xs text-muted-foreground">
            No scout pin yet — packet is parked on a Burleson example. Search an address on Scout and come back.
          </p>
        )}
      </section>
      <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-border px-3 py-2">
        {LANES.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLane(l)}
            className={`h-9 shrink-0 rounded-md border px-3 text-xs uppercase tracking-wider ${lane === l ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}
          >
            {l}
          </button>
        ))}
      </div>
      <ul className="min-h-0 flex-1 overflow-y-auto">
        {rows.map((s) => {
          const open = openId === s.id;
          return (
            <li key={s.id} className="border-b border-border">
              <button
                type="button"
                className="flex w-full items-baseline justify-between gap-3 px-4 py-3 text-left hover:bg-accent"
                onClick={() => setOpenId(open ? null : s.id)}
              >
                <span>
                  <span className="text-sm">{s.name}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {s.agency} · {s.cost} · {s.cadence}
                  </span>
                </span>
                <span className="shrink-0 text-xs uppercase tracking-wider text-muted-foreground">{s.layer}</span>
              </button>
              {open && (
                <div className="space-y-2 px-4 pb-4 text-sm">
                  <p>{s.value}</p>
                  <p className="text-muted-foreground">Method: {s.method}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {s.endpoint} · {s.license}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
