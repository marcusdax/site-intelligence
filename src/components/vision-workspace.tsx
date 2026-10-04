import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePropertyStore } from "@/lib/property-store";
import { readDocument } from "@/lib/server/ocr";
import { useRoofproStore } from "@/lib/roofpro-store";
import { useWeatherStore } from "@/lib/weather-store";

type Damage = { feature?: string; severity?: string; note?: string };

type Read = {
  kind: string;
  docType: string;
  address: string | null;
  summary: string;
  text: string;
  damage: Damage[];
  conditionScore: number | null;
  suggestedPlay: string;
};

async function shrink(file: File): Promise<string> {
  const bmp = await createImageBitmap(file);
  const max = 1280;
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bmp.width * scale));
  canvas.height = Math.max(1, Math.round(bmp.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.72);
}

export function VisionWorkspace({ onOpenJobs }: { onOpenJobs: () => void }) {
  const pin = usePropertyStore((s) => s.selected);
  const dossier = usePropertyStore((s) => s.dossier);
  const addLead = useRoofproStore((s) => s.addLead);
  const alert = useWeatherStore((s) => s.alerts.find((a) => a.id === s.selectedAlertId));
  const [hint, setHint] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [read, setRead] = useState<Read | null>(null);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setRead(null);
    setBusy(true);
    try {
      const dataUrl = await shrink(file);
      setPreview(dataUrl);
      const res = await readDocument({ data: { imageDataUrl: dataUrl, hint: hint || undefined } });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setRead({
        kind: res.kind,
        docType: res.docType,
        address: res.address,
        summary: res.summary,
        text: res.text,
        damage: (res.damage as Damage[]) ?? [],
        conditionScore: res.conditionScore,
        suggestedPlay: res.suggestedPlay,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that image");
    } finally {
      setBusy(false);
    }
  };

  const pushLead = () => {
    const address = read?.address || pin?.address || "Field photo";
    const dps = dossier?.dps.score ?? (read?.conditionScore != null ? Math.max(0, 100 - read.conditionScore) : 0);
    addLead({
      name: address,
      address,
      city: pin?.city ?? "",
      state: pin?.state ?? "",
      source: "Vision",
      status: "inspection",
      dps,
      storm: alert?.event ?? null,
      notes: [read?.summary, read?.suggestedPlay, hint].filter(Boolean).join(" "),
    });
    toast.message("Lead opened on the jobs desk");
    onOpenJobs();
  };

  return (
    <div className="grid h-full min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="flex min-h-0 flex-col gap-3 overflow-y-auto border-b border-border p-4 lg:border-b-0 lg:border-r">
        <div>
          <h1 className="font-display text-2xl">Vision</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload a facade, roof, or estimate. The reader extracts damage and a suggested play. If vision is offline, the
            photo still becomes a RoofPro lead with your note.
          </p>
        </div>
        <Textarea
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          placeholder="Operator hint — hail date, carrier, what to look for"
          rows={3}
        />
        <label className="flex h-12 cursor-pointer items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground hover:bg-accent">
          {busy ? "Reading…" : "Choose a photo or PDF page image"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={busy}
            onChange={(e) => void onFile(e.target.files?.[0])}
          />
        </label>
        {preview && (
          <img src={preview} alt="Upload preview" className="max-h-80 w-full rounded-lg border border-border object-contain" />
        )}
        {pin && (
          <p className="text-xs text-muted-foreground">
            Tied to scout pin {pin.address}
            {dossier ? ` · DPS ${dossier.dps.score}` : ""}
          </p>
        )}
      </section>
      <section className="min-h-0 overflow-y-auto p-4">
        {!read && !error && (
          <p className="text-sm text-muted-foreground">
            Nothing read yet. A useful upload is the front elevation, a close roof slope, or the first page of an insurance
            estimate.
          </p>
        )}
        {error && (
          <div className="rounded-lg border border-border p-3">
            <p className="text-sm text-destructive">{error}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              You can still open a lead. Put the damage in the hint so the crew is not guessing.
            </p>
            <Button type="button" className="mt-3" onClick={pushLead} disabled={!preview && !pin}>
              Open lead anyway
            </Button>
          </div>
        )}
        {read && (
          <div className="space-y-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {read.kind} · {read.docType}
                {read.conditionScore != null ? ` · condition ${Math.round(read.conditionScore)}` : ""}
              </p>
              <h2 className="mt-1 font-display text-xl">{read.address || "No address on the image"}</h2>
              <p className="mt-2 text-sm">{read.summary}</p>
              {read.suggestedPlay && <p className="mt-2 text-sm text-primary">{read.suggestedPlay}</p>}
            </div>
            {read.damage.length > 0 && (
              <ul className="space-y-2">
                {read.damage.map((d, i) => (
                  <li key={i} className="rounded-md border border-border px-3 py-2 text-sm">
                    <span className="uppercase tracking-wider text-muted-foreground">{d.severity || "note"}</span>
                    <p>
                      {d.feature || "Feature"} — {d.note || ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            {read.text && (
              <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-md border border-border p-3 font-mono text-xs text-muted-foreground">
                {read.text}
              </pre>
            )}
            <Button type="button" onClick={pushLead}>
              Open RoofPro lead
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
