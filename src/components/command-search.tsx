import { Compass, Loader2, LocateFixed, MapPin, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SAMPLE_PINS, usePropertyStore } from "@/lib/property-store";
import { reverseGeocode, searchAddress } from "@/lib/server/geo";
import type { GeocodeHit } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CommandSearch({ onSelect }: { onSelect: (hit: GeocodeHit) => void }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [hits, setHits] = useState<GeocodeHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const locateMe = async () => {
    if (!navigator.geolocation) {
      toast.error("Location is not available in this browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await reverseGeocode({
            data: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          });
          if (res.ok) {
            onSelect(res.hit);
            setQ(res.hit.address);
            setOpen(false);
          } else toast.error("Could not reverse-geocode this location");
        } catch {
          toast.error("Locate failed");
        } finally {
          setLocating(false);
        }
      },
      () => {
        toast.error("Location permission denied");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    const t = q.trim();
    if (t.length < 3) {
      setHits([]);
      return;
    }
    const handle = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchAddress({ data: { q: t } });
        if (res.ok) setHits(res.hits);
        else toast.error(res.error);
      } catch {
        toast.error("Address search failed");
      } finally {
        setLoading(false);
      }
    }, 380);
    return () => window.clearTimeout(handle);
  }, [q]);

  return (
    <div ref={box} className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search an address — street, city, ZIP"
        className="h-12 rounded-lg border-border bg-background/80 pl-10 pr-20 backdrop-blur-sm"
        aria-label="Search address"
      />
      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
        <button
          type="button"
          onClick={() => void locateMe()}
          disabled={locating}
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Use my location"
          title="Use my location"
        >
          {locating ? <Loader2 className="size-4 animate-spin" /> : <LocateFixed className="size-4" />}
        </button>
        {loading ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ) : (
          <kbd className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">
            /
          </kbd>
        )}
      </div>

      {open && (
        <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-border">
          {hits.length > 0 ? (
            <ul className="max-h-72 overflow-y-auto py-1">
              {hits.map((h) => (
                <li key={h.id}>
                  <button
                    type="button"
                    className="flex w-full items-start gap-3 px-3 py-2.5 text-left hover:bg-accent"
                    onClick={() => {
                      onSelect(h);
                      setQ(h.address);
                      setOpen(false);
                    }}
                  >
                    <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-foreground">{h.address}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {[h.city, h.state, h.postcode].filter(Boolean).join(", ")}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Sample parcels
              </p>
              <div className="flex flex-col gap-1">
                {SAMPLE_PINS.map((s) => (
                  <button
                    key={s.pin.id}
                    type="button"
                    className={cn(
                      "flex items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-accent",
                    )}
                    onClick={() => {
                      onSelect(s.pin);
                      setQ(s.pin.address);
                      setOpen(false);
                    }}
                  >
                    <span>
                      <span className="block text-sm">{s.label}</span>
                      <span className="block text-xs text-muted-foreground">{s.blurb}</span>
                    </span>
                    <Compass className="size-3.5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-8 items-center justify-center rounded-md border border-border bg-card">
        <Compass className="size-4 text-primary" strokeWidth={1.6} />
      </span>
      <div className="leading-tight">
        <p className="font-display text-[15px] tracking-tight">PropertyInsight</p>
        <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">VIVELLA · Alter</p>
      </div>
    </div>
  );
}

export function GeofenceToggle() {
  const on = usePropertyStore((s) => s.geofenceMode);
  const set = usePropertyStore((s) => s.setGeofenceMode);
  return (
    <Button
      type="button"
      variant={on ? "default" : "outline"}
      size="sm"
      onClick={() => set(!on)}
      className="shrink-0"
    >
      Geofence {on ? "on" : "off"}
    </Button>
  );
}
